import { PrismaClient } from "@prisma/client"; 

let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
}

if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
}

export default globalWithPrisma.prisma;