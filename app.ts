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
		if(index !== -1) {
			this.users.splice(index, 1);
		}else{
			throw new Error('User not found.');
		}
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
			this.rents.splice(existingRentIndex, 1);
		}else{
			throw new Error('This bike is not rented by the user.');
		}
    	}
	
	userListing(): void {
		const bcrypt = require('bcrypt')
		const saltRounds = 12
		for (const lUser of this.users) {
			const hash = bcrypt.hashSync(lUser.password, saltRounds)
			lUser.password = hash
			console.log(lUser)
		}
	}
	
	rentListing(): void {
		for (const lRent of this.rents) {
			console.log(lRent)
		}
	}
	
	bikeListing(): void {
		for (const lBike of this.bikes) {
			console.log(lBike)
		}
	}
	/*
	authenticateUser(id: string, password: string): void{
		const bcrypt = require('bcrypt')
		const userIndex = this.users.findIndex(user => user.id === id)
		if(userIndex === -1){
			const user = this.users[userIndex];
			const correct = bcrypt.compareSync(password, user.password)
			if(correct){
				console.log('User successfully authenticated.')
			}else{
				throw new Error('Incorrect ID or password.')
			}
		}else{
			throw new Error("User not registered.")
		}
	}
 	*/
}  
