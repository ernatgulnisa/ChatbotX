import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { Message } from '@prisma/client';
export declare class MessagesService {
    private prisma;
    private whatsappService;
    constructor(prisma: PrismaService, whatsappService: WhatsappService);
    create(data: {
        content: string;
        sender: string;
        clientId: number;
        botId: number;
    }, sendToWhatsapp?: boolean): Promise<Message>;
    findAll(clientId: number): Promise<Message[]>;
}
