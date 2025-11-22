import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class MarketingService {
    constructor(
        private prisma: PrismaService,
        private whatsappService: WhatsappService,
    ) { }

    async broadcast(data: { message: string, type: 'text' | 'image', mediaUrl?: string, filter?: { tags?: string[] } }) {
        let clients;

        if (data.filter && data.filter.tags && data.filter.tags.length > 0) {
            // Filter clients by tags
            clients = await this.prisma.client.findMany({
                where: {
                    tags: {
                        some: {
                            id: { in: data.filter.tags.map(id => Number(id)) }
                        }
                    }
                }
            });
        } else {
            // No filter, fetch all clients
            clients = await this.prisma.client.findMany();
        }

        let sentCount = 0;

        for (const client of clients) {
            try {
                await this.whatsappService.sendMessage(
                    client.phone,
                    data.message,
                    data.type,
                    data.mediaUrl,
                    true // saveToDb
                );
                sentCount++;
            } catch (error) {
                console.error(`Failed to send broadcast to ${client.phone}`, error);
            }
        }

        return { success: true, sentCount, total: clients.length };
    }
}
