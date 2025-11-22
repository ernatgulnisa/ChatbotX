import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class MarketingService {
    private prisma;
    private whatsappService;
    constructor(prisma: PrismaService, whatsappService: WhatsappService);
    broadcast(data: {
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
