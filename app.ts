import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import { Crypt } from "./crypt"
import * as bcrypt from 'bcrypt';

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []
	public crypt: Crypt

    findUser(email: string): User {
        return this.users.find(user => user.email === email);
    }

    async registerUser(user: User, password: string): Promise<string> {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.');
            }
        }

        const hashedPassword = await crypt.encrypt(password);
        user.password = hashedPassword;

        const newId = crypto.randomUUID();
        user.id = newId;
        this.users.push(user);
        return newId;
    }

    async authenticateUser(userId: string, password: string): Promise<boolean> {
        const user = this.users.find((u) => u.id === userId);
        if (!user) {
            return false;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        return passwordMatch;
    }

    listUsers(): User[] {
        return this.users;
    }

    listRents(): Rent[] {
        return this.rents;
    }

    listBikes(): Bike[] {
        return this.bikes;
    }

    registerBike(bike: Bike, availability: boolean = true): string {
        const newId = crypto.randomUUID();
        bike.id = newId;
        bike.available = availability;
        this.bikes.push(bike);
        return newId;
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            return;
        }
        throw new Error('User does not exist.');
    }

    returnBike(bikeId: string, userEmail: string, returnDate: Date): number {
        const rent = this.rents.find(rent => 
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            rent.dateReturned === undefined &&
            rent.dateFrom <= returnDate
        );
        if (rent) {
            rent.dateReturned = returnDate;
            const daysRented = Math.ceil((returnDate.getTime() - rent.dateFrom.getTime()) / (1000 * 60 * 60 * 24));
            const rentalCost = daysRented * rent.bike.dailyRate;
            return rentalCost;
        }
        throw new Error('Rent not found.');
    }
}
