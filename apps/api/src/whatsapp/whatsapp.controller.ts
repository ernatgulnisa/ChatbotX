import { Controller, Get, Post, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import type { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) { }

    @Get('webhook')
    verifyWebhook(@Query('hub.mode') mode: string, @Query('hub.verify_token') token: string, @Query('hub.challenge') challenge: string, @Res() res: Response) {
        const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'my_verify_token';

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('WEBHOOK_VERIFIED');
                res.status(HttpStatus.OK).send(challenge);
            } else {
                res.sendStatus(HttpStatus.FORBIDDEN);
            }
        }
    }

    @Post('webhook')
    handleWebhook(@Body() body: any) {
        return this.whatsappService.handleIncomingMessage(body);
    }
}
