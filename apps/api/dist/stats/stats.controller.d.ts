import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getStats(): Promise<{
        totalClients: number;
        activeDeals: number;
        messagesSent: number;
    }>;
}
