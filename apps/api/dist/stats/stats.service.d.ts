import { PrismaService } from '../prisma.service';
export declare class StatsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalClients: number;
        activeDeals: number;
        messagesSent: number;
    }>;
}
