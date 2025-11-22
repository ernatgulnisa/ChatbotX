import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from '../messages/messages.service';
import { BotEngineService } from '../bots/bot-engine.service';
import { PrismaService } from '../prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
    private apiToken: string;
    private phoneNumberId: string;
    private isMockMode = true; // Set to false to use real Meta API

    constructor(
        @Inject(forwardRef(() => MessagesService))
        private messagesService: MessagesService,
        @Inject(forwardRef(() => BotEngineService))
        private botEngineService: BotEngineService,
        private prisma: PrismaService,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.apiToken = this.configService.get<string>('WHATSAPP_API_TOKEN') || '';
        this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') || '';
    }

    async sendMessage(to: string, content: string, type: string = 'text', mediaUrl?: string, saveToDb: boolean = true) {
        const url = `https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`;
        const token = this.apiToken;

        let data: any = {
            messaging_product: 'whatsapp',
            to: to,
        };

        if (type === 'text') {
            data.text = { body: content };
        } else if (type === 'image') {
            data.type = 'image';
            data.image = { link: mediaUrl, caption: content };
        } else if (type === 'document') {
            data.type = 'document';
            data.document = { link: mediaUrl, caption: content };
        }

        try {
            // Save outbound message if requested
            if (saveToDb) {
                // In a real app, we should find the client and bot context properly
                const client = await this.prisma.client.findFirst({ where: { phone: to } });
                if (client) {
                    await this.prisma.message.create({
                        data: {
                            content: content,
                            type: type,
                            mediaUrl: mediaUrl,
                            direction: 'outbound',
                            sender: 'bot',
                            clientId: client.id,
                            botId: client.botId,
                        },
                    });
                }
            }

            if (this.isMockMode) {
                console.log(`[MOCK] Sending WhatsApp ${type} to ${to}:`, content, mediaUrl);
                return { success: true, mock: true };
            }

            const response = await lastValueFrom(
                this.httpService.post(url, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            // Don't throw in mock mode or if it's just a demo
            return { success: false, error: error.message };
        }
    }

    async handleIncomingMessage(body: any) {
        console.log('[WhatsApp] Received webhook:', JSON.stringify(body, null, 2));

        try {
            if (body.object === 'whatsapp_business_account') {
                for (const entry of body.entry) {
                    for (const change of entry.changes) {
                        if (change.value.messages) {
                            for (const message of change.value.messages) {
                                const from = message.from;
                                const text = message.text?.body || '[Media Message]'; // Simplified handling for incoming media

                                if (from) {
                                    // Find or create client
                                    const botId = 1; // Default bot for now

                                    let client = await this.prisma.client.findFirst({
                                        where: { phone: from, botId: botId }
                                    });

                                    if (!client) {
                                        client = await this.prisma.client.create({
                                            data: {
                                                phone: from,
                                                botId: botId,
                                                name: 'New Client'
                                            }
                                        });
                                    }

                                    // Save incoming message
                                    await this.messagesService.create({
                                        content: text,
                                        sender: 'user',
                                        clientId: client.id,
                                        botId: botId
                                    });

                                    // Trigger Bot Engine
                                    await this.botEngineService.processMessage(client.id, text);
                                }
                            }
                        }
                    }
                }
            }
            return { success: true };
        } catch (error) {
            console.error('[WhatsApp] Error handling webhook:', error);
            return { success: false };
        }
    }
}
