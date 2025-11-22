import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Client, Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ClientCreateInput): Promise<Client> {
        return this.prisma.client.create({
            data,
        });
    }

    async findAll(userId: number): Promise<Client[]> {
        // Assuming clients are linked to bots which are linked to users, 
        // or directly linked to users if the schema supports it.
        // Checking schema: Client has botId. Bot has userId.
        // So we find clients where bot.userId = userId
        return this.prisma.client.findMany({
            where: {
                bot: {
                    userId: userId,
                },
            },
            include: {
                bot: true,
                tags: true,
            },
        });
    }

    async findOne(id: number): Promise<Client | null> {
        return this.prisma.client.findUnique({
            where: { id },
            include: {
                bot: true,
                tags: true,
            },
        });
    }

    async update(id: number, data: Prisma.ClientUpdateInput): Promise<Client> {
        return this.prisma.client.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<Client> {
        return this.prisma.client.delete({
            where: { id },
        });
    }
}
