import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DealsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { clientId: number; status: string; value: number }) {
        return this.prisma.deal.create({
            data: {
                clientId: data.clientId,
                status: data.status,
                value: data.value,
            },
        });
    }

    async findAll() {
        return this.prisma.deal.findMany({
            include: {
                client: true,
            },
        });
    }

    async update(id: number, data: { status?: string; value?: number }) {
        return this.prisma.deal.update({
            where: { id },
            data,
        });
    }
}
