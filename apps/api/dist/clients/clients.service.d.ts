import { PrismaService } from '../prisma.service';
import { Client, Prisma } from '@prisma/client';
export declare class ClientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ClientCreateInput): Promise<Client>;
    findAll(userId: number): Promise<Client[]>;
    findOne(id: number): Promise<Client | null>;
    update(id: number, data: Prisma.ClientUpdateInput): Promise<Client>;
    remove(id: number): Promise<Client>;
}
