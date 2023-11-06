import { Bike } from "../../../bike"
import prisma from "../../../external/database/db"
import { PrismaBikeRepo } from "../../../external/database/prisma-bike-repo"
import { User } from "../../../user"

describe(PrismaBikeRepo, () => {
    beforeEach(async () => {
        await prisma.bike.deleteMany({})
    })

    afterAll(async () => {
        await prisma.bike.deleteMany({})
    })

    it('adds a bike in the database', async () => {
        const bikeToBePersisted = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        const repo = new PrismaBikeRepo()
        const bikeId = await repo.add(bikeToBePersisted)
        expect(bikeId).toBeDefined()
        const persistedBike = await repo.find(bikeToBePersisted.id)
        expect(persistedBike.name).toEqual(
            bikeToBePersisted.name
        )
    })

    it('removes a bike from the database', async () => {
        const bikeToBePersisted = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        const repo = new PrismaBikeRepo()
        await repo.add(bikeToBePersisted)
        await repo.remove('testId5423')
        const removedBike = await repo.find('testId5423')
        expect(removedBike).toBeNull()
    })

    it('lists bikes in the database', async () => {
        const bike1 = new Bike('caloi mountainbike1', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        const bike2 = new Bike('caloi mountainbike2', 'mountain bike',
            1234, 1234, 100.0, 'His bike', 5, [])
        const repo = new PrismaBikeRepo()
        await repo.add(bike1)
        await repo.add(bike2)
        const userList = await repo.list()
        expect(userList.length).toEqual(2)
    })

    it('update the bike status in the database', async () => {
        const bike = new Bike('caloi mountainbike', 'mountain bike',
            1234, 1234, 100.0, 'My bike', 5, [])
        const repo = new PrismaBikeRepo()
        await repo.add(bike)
        bike.available = false
        await repo.update(bike.id, bike)
        expect(bike.available).toEqual(bike.available)
    })
})