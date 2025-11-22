import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [totalClients, activeDeals, messagesSent] = await Promise.all([
            this.prisma.client.count(),
            this.prisma.deal.count({
                where: {
                    status: {
                        in: ['new', 'in_progress'],
                    },
                },
            }),
            this.prisma.message.count({
                where: {
                    direction: 'outbound',
                },
            }),
        ]);

        return {
            totalClients,
            activeDeals,
            messagesSent,
        };
    }
}
