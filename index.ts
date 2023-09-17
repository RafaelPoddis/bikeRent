import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'

async function main() {
    const clock = sinon.useFakeTimers();
    const app = new App()
    const user1 = new User('Jose', 'jose@mail.com', '1234')
    await app.registerUser(user1)
    const bike = new Bike('caloi mountainbike', 'mountain bike',
        1234, 1234, 100.0, 'My bike', 5, [], undefined)
    app.registerBike(bike)
	console.log(app.bikes)
}

main()







