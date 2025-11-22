import { MarketingService } from './marketing.service';
export declare class MarketingController {
    private readonly marketingService;
    constructor(marketingService: MarketingService);
    sendBroadcast(body: {
        message: string;
        type: 'text' | 'image';
        mediaUrl?: string;
        filter?: {
            tags?: string[];
        };
    }): Promise<{
        success: boolean;
        sentCount: number;
        total: number;
    }>;
}
