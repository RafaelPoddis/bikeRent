import { Bike } from "./bike";
import { Crypt } from "./crypt";
import { Rent } from "./rent";
import { User } from "./user";
import { Location } from "./location";
import { BikeNotFoundError } from "./errors/bike-not-found-error";
import { UnavailableBikeError } from "./errors/unavailable-bike-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { DuplicateUserError } from "./errors/duplicate-user-error";
import { RentRepo } from "./ports/rent-repo";
import { UserRepo } from "./ports/user-repo";
import { BikeRepo } from "./ports/bike-repo";
import { RentNotFoundError } from "./errors/rent-not-found-error";
import { OpenRentError } from "./errors/open-rent-error";
import { Prisma, PrismaClient } from "@prisma/client";

const { v4: uuidv4 } = require('uuid');

export class App {
    crypt: Crypt = new Crypt()
    prisma: PrismaClient = new PrismaClient()

    constructor(
        readonly userRepo: UserRepo,
        readonly bikeRepo: BikeRepo,
        readonly rentRepo: RentRepo
    ) { }

    async findUser(userEmail: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })
        if (!user) throw new UserNotFoundError()
        return user
    }

    async registerUser(user: User): Promise<User | null> {
        if (await this.prisma.user.findUnique({
            where: {
                email: user.email
            }
        })) {
            throw new DuplicateUserError()
        }
        const encryptedPassword = await this.crypt.encrypt(user.password)
        user.password = encryptedPassword
        return await this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                id: uuidv4()
            }
        })
    }

    async authenticate(userEmail: string, password: string): Promise<boolean> {
        const user = await this.findUser(userEmail);
        if (!user) return false;
        return await this.crypt.compare(password, user.password);
    }

    async registerBike(bike: Bike): Promise<Bike | null> {
        return await this.prisma.bike.create({
            data: {
                id: uuidv4(),
                name: bike.name,
                type: bike.type,
                bodySize: bike.bodySize,
                maxLoad: bike.maxLoad,
                rate: bike.rate,
                ratings: bike.ratings,
                description: bike.description,
                available: bike.available,
                imageUrls: { create: [] },
                location: {
                    create: [
                        {
                            id: uuidv4(),
                            latitude: 0.0,
                            longitude: 0.0
                        }
                    ]
                }
            }
        })
    }

    async removeUser(email: string): Promise<void> {
        const user = await this.findUser(email);
        if (!user) throw new UserNotFoundError();
      
        const openRent = await this.prisma.rent.findMany({
          where: { userEmail: user.email, end: null },
        });
      
        if (openRent.length > 0) {
          throw new OpenRentError();
        } else {
          await this.prisma.user.delete({ where: { email: email } });
        }
    }   

    async rentBike(bikeId: string, userEmail: string): Promise<Rent> {
        const bike = await this.prisma.bike.findUnique({
          where: { id: bikeId },
        });
      
        if (!bike) throw new BikeNotFoundError();
      
        if (!bike.available) {
          throw new UnavailableBikeError();
        }
      
        const user = await this.findUser(userEmail);
      
        const newRent = await this.prisma.rent.create({
          data: {
            id: uuidv4(),
            start: new Date(),
            bike: { connect: { id: bikeId } },
            user: { connect: { id: user!.id } },
          },
        });
      
        await this.prisma.bike.update({
          where: { id: bikeId },
          data: { available: false },
        });
      
        return newRent;
    }      

    async returnBike(bikeId: string, userEmail: string): Promise<number> {
        const now = new Date();
        const rent = await this.prisma.rent.findFirst({
          where: { bikeId: bikeId, userEmail: userEmail, end: null },
          include: {
            bike: true
          }
        });
      
        if (!rent) throw new RentNotFoundError();
      
        rent.end = now;
      
        await this.prisma.rent.update({
          where: { id: rent.id },
          data: { end: now },
        });
      
        await this.prisma.bike.update({
          where: { id: bikeId },
          data: { available: true },
        });
      
        const hours = diffHours(rent.end, rent.start);
        return hours * rent.bike.rate;
    }      

    async listUsers(): Promise<User[]> {
        return await this.prisma.user.findMany()
    }      

    async listBikes(): Promise<Bike[]> {
        const bikesFromPrisma = await this.prisma.bike.findMany();
        const bikes: Bike[] = bikesFromPrisma.map(prismaBike => {
            return {
                id: prismaBike.id,
                name: prismaBike.name,
                type: prismaBike.type,
                bodySize: prismaBike.bodySize,
                available: prismaBike.available,
                description: prismaBike.description,
                maxLoad: prismaBike.maxLoad,
                ratings: prismaBike.ratings,
                rate: prismaBike.rate
            };
        });
    
        return bikes;
    }
         

    async moveBikeTo(bikeId: string, location: Location) {
        const bike = await this.findBike(bikeId)
        bike.location.latitude = location.latitude
        bike.location.longitude = location.longitude
        await this.bikeRepo.update(bikeId, bike)
    }

    async findBike(bikeId: string): Promise<Bike> {
        const bike = await this.prisma.bike.findUnique({
            where: {
                id: bikeId
            }
        })
        if (!bike) throw new BikeNotFoundError()
        return bike
    }
}

function diffHours(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(diff);
}