import { Bike } from "@prisma/client";
import { BikeRepo } from "../../ports/bike-repo";
import { BikeNotFoundError } from "../../errors/bike-not-found-error";
import prisma from "./db";

export class PrismaBikeRepo implements BikeRepo{

    async find(id: string): Promise<Bike> {
        const foundBike = await prisma.bike.findUnique({
            where: {
                id: id
            }
        })

        if(!foundBike) throw new BikeNotFoundError()

        return foundBike;
    }
    
    async add(bike: Bike): Promise<string> {
        const addedBike = await prisma.bike.create({
            data: { ...bike }
        })
        return addedBike.id
    }
    
    async remove(id: string): Promise<void>{
        await prisma.bike.delete({
            where: { id }
        })
    }

    async update(id: string, bike: Bike): Promise<void>{
        await prisma.bike.update({
            where: {
                id: id
            },
            data: {
                available: bike.available
            }
        })
    }

    async list(): Promise<Bike[]>{
        return await prisma.user.findMany({})
    }
}