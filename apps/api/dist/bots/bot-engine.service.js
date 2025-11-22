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
exports.BotEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let BotEngineService = class BotEngineService {
    prisma;
    whatsappService;
    constructor(prisma, whatsappService) {
        this.prisma = prisma;
        this.whatsappService = whatsappService;
    }
    async processMessage(clientId, incomingText) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            include: { bot: true },
        });
        if (!client || !client.bot)
            return;
        const scenario = JSON.parse(client.bot.scenario);
        const nodes = scenario.nodes || [];
        const edges = scenario.edges || [];
        let currentNodeId = client.currentStepId;
        if (!currentNodeId) {
            const startNode = nodes.find((n) => n.data.label === 'Start');
            if (startNode) {
                currentNodeId = startNode.id;
            }
            else if (nodes.length > 0) {
                currentNodeId = nodes[0].id;
            }
        }
        if (currentNodeId) {
            const currentNode = nodes.find((n) => n.id === currentNodeId);
            if (currentNode && currentNode.type === 'question') {
                const variableName = currentNode.data.variable;
                if (variableName) {
                    const variables = JSON.parse(client.variables || '{}');
                    variables[variableName] = incomingText;
                    await this.prisma.client.update({
                        where: { id: clientId },
                        data: { variables: JSON.stringify(variables) },
                    });
                }
                const edge = edges.find((e) => e.source === currentNodeId);
                if (edge) {
                    currentNodeId = edge.target;
                }
                else {
                    currentNodeId = null;
                }
            }
        }
        while (currentNodeId) {
            const currentNode = nodes.find((n) => n.id === currentNodeId);
            if (!currentNode)
                break;
            if (currentNode.type === 'message') {
                let message = currentNode.data.label;
                const variables = JSON.parse(client.variables || '{}');
                for (const [key, value] of Object.entries(variables)) {
                    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
                }
                await this.whatsappService.sendMessage(client.phone, message);
                const edge = edges.find((e) => e.source === currentNodeId);
                currentNodeId = edge ? edge.target : null;
            }
            else if (currentNode.type === 'media') {
                const mediaType = currentNode.data.mediaType || 'image';
                const mediaUrl = currentNode.data.mediaUrl;
                const caption = currentNode.data.caption || '';
                if (mediaUrl) {
                    await this.whatsappService.sendMessage(client.phone, caption, mediaType, mediaUrl);
                }
                const edge = edges.find((e) => e.source === currentNodeId);
                currentNodeId = edge ? edge.target : null;
            }
            else if (currentNode.type === 'question') {
                await this.whatsappService.sendMessage(client.phone, currentNode.data.question);
                await this.prisma.client.update({
                    where: { id: clientId },
                    data: { currentStepId: currentNodeId },
                });
                return;
            }
            else if (currentNode.type === 'button') {
                const buttons = currentNode.data.buttons || [];
                const optionsText = buttons.map((b) => `- ${b.label}`).join('\n');
                await this.whatsappService.sendMessage(client.phone, `${currentNode.data.message}\n${optionsText}`);
                await this.prisma.client.update({
                    where: { id: clientId },
                    data: { currentStepId: currentNodeId },
                });
                return;
            }
            else {
                const edge = edges.find((e) => e.source === currentNodeId);
                currentNodeId = edge ? edge.target : null;
            }
        }
        await this.prisma.client.update({
            where: { id: clientId },
            data: { currentStepId: currentNodeId },
        });
    }
};
exports.BotEngineService = BotEngineService;
exports.BotEngineService = BotEngineService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => whatsapp_service_1.WhatsappService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        whatsapp_service_1.WhatsappService])
], BotEngineService);
//# sourceMappingURL=bot-engine.service.js.map