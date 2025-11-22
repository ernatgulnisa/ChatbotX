import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class MarketingService {
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
