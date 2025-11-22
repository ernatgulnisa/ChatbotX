import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { PrismaModule } from '../prisma.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
    imports: [PrismaModule, WhatsappModule],
    controllers: [MarketingController, TagsController],
    providers: [MarketingService, TagsService],
})
export class MarketingModule { }
