import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
export declare class BotEngineService {
    private prisma;
    private whatsappService;
    constructor(prisma: PrismaService, whatsappService: WhatsappService);
    processMessage(clientId: number, incomingText: string): Promise<void>;
}
