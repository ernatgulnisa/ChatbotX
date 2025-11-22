import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => WhatsappService))
        private whatsappService: WhatsappService,
    ) { }

    async create(data: { content: string; sender: string; clientId: number; botId: number }, sendToWhatsapp = true): Promise<Message> {
        const message = await this.prisma.message.create({
            data: {
                content: data.content,
                sender: data.sender,
                client: { connect: { id: data.clientId } },
                bot: { connect: { id: data.botId } },
            },
        });

        if (data.sender === 'bot' && sendToWhatsapp) {
            // Fetch client to get phone number
            const client = await this.prisma.client.findUnique({ where: { id: data.clientId } });
            if (client) {
                // Pass false to prevent saving again
                await this.whatsappService.sendMessage(client.phone, data.content, 'text', undefined, false);
            }
        }

        return message;
    }

    async findAll(clientId: number): Promise<Message[]> {
        return this.prisma.message.findMany({
            where: { clientId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
