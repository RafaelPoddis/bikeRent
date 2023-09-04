import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto';

export class App {
	public users: User[] = [];
	public bikes: Bike[] = [];
	public rents: Rent[] = [];

	findUser(email: string): User | undefined {
		return this.users.find(user => user.email === email);
	}

	registerUser(user: User): void {
		for (const rUser of this.users) {
			if (rUser.email === user.email) {
				throw new Error('Duplicate user.')
			}
		}
		user.id = crypto.randomUUID()
		this.users.push(user)
	}

	registerBike(bike: Bike): void {
		for (const rBike of this.bikes) {
			if (rBike.id === bike.id) {
				throw new Error('Duplicate bike.')
			}
		}
		bike.id = crypto.randomUUID();
		this.bikes.push(bike);
	}
	removeUser(user: User): void {
		const index = this.users.findIndex(rUser => rUser.id === user.id);
		if(index === -1) {
			throw new Error('User not found.');
		}
		this.users.splice(index, 1);
	}

	rentBike(user: User, bike: Bike, startDate: Date, endDate: Date): Rent {
		const rRent = this.rents.find(rent => rent.user.id === user.id && rent.bike.id === bike.id);
		if(rRent) {
			throw new Error('This bike is already rented by another user.');
		}
        return Rent.create([], bike, user, startDate, endDate)
	}

	returnBike(user: User, bike: Bike): void {
		const existingRentIndex = this.rents.findIndex(rent => rent.user.id === user.id && rent.bike.id === bike.id);

		if(existingRentIndex === -1) {
			throw new Error('This bike is not rented by the user.');
		}
		this.rents.splice(existingRentIndex, 1);
    }
}  