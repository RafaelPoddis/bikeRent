import { PrismaClient } from "@prisma/client";
import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'
import { UserRepo } from "./ports/user-repo";
import { FakeUserRepo } from "./tests/double/fake-user-repo";
import { BikeRepo } from "./ports/bike-repo";
import { RentRepo } from "./ports/rent-repo";
import { FakeBikeRepo } from "./tests/double/fake-bike-repo";
import { FakeRentRepo } from "./tests/double/fake-rent-repo";
const { v4: uuidv4 } = require('uuid');

let userRepo: UserRepo
let bikeRepo: BikeRepo
let rentRepo: RentRepo

// DateTime format = 2020-02-20T22:15:15-00:00
async function main() {    
    const prisma = new PrismaClient()
    const app = new App(userRepo, bikeRepo, rentRepo)
    const user1 = new User('Jose', 'jose@mail.com', '1234')
    await app.registerUser(user1)
    const bike1 = await prisma.bike.create({
        data: {
            id: uuidv4(),
            name: "Caloi Mountain",
            type: "Caloi",
            bodySize: 1234,
            description: "My Bike",
            maxLoad: 1234,
            rate: 100,
            ratings: 5,
            imageUrls: {
                create: []
            },
            location: {
                create: [
                    {
                        latitude: 0.0,
                        longitude: 0.0
                    }
                ]
            }
        }
    })
    const rent1 = await prisma.rent.create({
        data: {
            id: uuidv4(),
            start: "2020-02-20T22:15:15-00:00",
            bike: {
                connect: {
                    id: bike1.id
                }
            },
            user: {
                connect: {
                    id: user1.id
                }
            }
        }
    })
    const usersCount = await prisma.user.count()
    console.log(usersCount)
    console.log(user1)
    console.log(bike1)
    console.log(rent1)
}

main()







