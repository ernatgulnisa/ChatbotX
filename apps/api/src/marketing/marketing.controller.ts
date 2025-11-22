import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('marketing')
@UseGuards(JwtAuthGuard)
export class MarketingController {
    constructor(private readonly marketingService: MarketingService) { }

    @Post('broadcast')
    async sendBroadcast(@Body() body: { message: string; type: 'text' | 'image'; mediaUrl?: string; filter?: { tags?: string[] } }) {
        return this.marketingService.broadcast(body);
    }
}
