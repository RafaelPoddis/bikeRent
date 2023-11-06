import { UserNotFoundError } from "../../errors/user-not-found-error";
import { UserRepo } from "../../ports/user-repo";
import { User } from "../../user";
import prisma from "./db"

export class PrismaUserRepo implements UserRepo {

    async find(email: string): Promise<User> {
        const foundUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(!foundUser) throw new UserNotFoundError()

        return foundUser;
    }

    async add(user: User): Promise<string> {
        const addedUser = await prisma.user.create({
            data: { ...user }
        })
        return addedUser.id
    }

    async remove(email: string): Promise<void> {
        await prisma.user.delete({
            where: { email }
        })
    }

    async list(): Promise<User[]> {
        return await prisma.user.findMany({})
    }
}