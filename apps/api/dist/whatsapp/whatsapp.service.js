"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const messages_service_1 = require("../messages/messages.service");
const bot_engine_service_1 = require("../bots/bot-engine.service");
const prisma_service_1 = require("../prisma.service");
const rxjs_1 = require("rxjs");
let WhatsappService = class WhatsappService {
    messagesService;
    botEngineService;
    prisma;
    httpService;
    configService;
    apiToken;
    phoneNumberId;
    isMockMode = true;
    constructor(messagesService, botEngineService, prisma, httpService, configService) {
        this.messagesService = messagesService;
        this.botEngineService = botEngineService;
        this.prisma = prisma;
        this.httpService = httpService;
        this.configService = configService;
        this.apiToken = this.configService.get('WHATSAPP_API_TOKEN') || '';
        this.phoneNumberId = this.configService.get('WHATSAPP_PHONE_NUMBER_ID') || '';
    }
    async sendMessage(to, content, type = 'text', mediaUrl, saveToDb = true) {
        const url = `https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`;
        const token = this.apiToken;
        let data = {
            messaging_product: 'whatsapp',
            to: to,
        };
        if (type === 'text') {
            data.text = { body: content };
        }
        else if (type === 'image') {
            data.type = 'image';
            data.image = { link: mediaUrl, caption: content };
        }
        else if (type === 'document') {
            data.type = 'document';
            data.document = { link: mediaUrl, caption: content };
        }
        try {
            if (saveToDb) {
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
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }));
            return response.data;
        }
        catch (error) {
            console.error('Error sending WhatsApp message:', error.response?.data || error.message);
            return { success: false, error: error.message };
        }
    }
    async handleIncomingMessage(body) {
        console.log('[WhatsApp] Received webhook:', JSON.stringify(body, null, 2));
        try {
            if (body.object === 'whatsapp_business_account') {
                for (const entry of body.entry) {
                    for (const change of entry.changes) {
                        if (change.value.messages) {
                            for (const message of change.value.messages) {
                                const from = message.from;
                                const text = message.text?.body || '[Media Message]';
                                if (from) {
                                    const botId = 1;
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
                                    await this.messagesService.create({
                                        content: text,
                                        sender: 'user',
                                        clientId: client.id,
                                        botId: botId
                                    });
                                    await this.botEngineService.processMessage(client.id, text);
                                }
                            }
                        }
                    }
                }
            }
            return { success: true };
        }
        catch (error) {
            console.error('[WhatsApp] Error handling webhook:', error);
            return { success: false };
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => messages_service_1.MessagesService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => bot_engine_service_1.BotEngineService))),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        bot_engine_service_1.BotEngineService,
        prisma_service_1.PrismaService,
        axios_1.HttpService,
        config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map