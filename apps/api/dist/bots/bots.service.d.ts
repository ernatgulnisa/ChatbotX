import { PrismaService } from '../prisma.service';
import { Bot, Prisma } from '@prisma/client';
export declare class BotsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.BotCreateInput): Promise<Bot>;
    findAll(userId: number): Promise<Bot[]>;
    findOne(id: number): Promise<Bot | null>;
    update(id: number, data: Prisma.BotUpdateInput): Promise<Bot>;
    remove(id: number): Promise<Bot>;
}
