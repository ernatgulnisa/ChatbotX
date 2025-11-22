import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Bot, Prisma } from '@prisma/client';

@Injectable()
export class BotsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.BotCreateInput): Promise<Bot> {
        return this.prisma.bot.create({
            data,
        });
    }

    async findAll(userId: number): Promise<Bot[]> {
        return this.prisma.bot.findMany({
            where: { userId },
        });
    }

    async findOne(id: number): Promise<Bot | null> {
        return this.prisma.bot.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: Prisma.BotUpdateInput): Promise<Bot> {
        return this.prisma.bot.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<Bot> {
        return this.prisma.bot.delete({
            where: { id },
        });
    }
}
