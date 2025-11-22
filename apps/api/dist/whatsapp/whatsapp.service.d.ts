import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from '../messages/messages.service';
import { BotEngineService } from '../bots/bot-engine.service';
import { PrismaService } from '../prisma.service';
export declare class WhatsappService {
    private messagesService;
    private botEngineService;
    private prisma;
    private httpService;
    private configService;
    private apiToken;
    private phoneNumberId;
    private isMockMode;
    constructor(messagesService: MessagesService, botEngineService: BotEngineService, prisma: PrismaService, httpService: HttpService, configService: ConfigService);
    sendMessage(to: string, content: string, type?: string, mediaUrl?: string, saveToDb?: boolean): Promise<any>;
    handleIncomingMessage(body: any): Promise<{
        success: boolean;
    }>;
}
