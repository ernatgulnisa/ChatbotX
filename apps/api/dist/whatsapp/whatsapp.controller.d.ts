import { WhatsappService } from './whatsapp.service';
import type { Response } from 'express';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    verifyWebhook(mode: string, token: string, challenge: string, res: Response): void;
    handleWebhook(body: any): Promise<{
        success: boolean;
    }>;
}
