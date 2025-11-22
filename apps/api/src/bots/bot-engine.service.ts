import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BotEngineService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => WhatsappService))
        private whatsappService: WhatsappService,
    ) { }

    async processMessage(clientId: number, incomingText: string) {
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            include: { bot: true },
        });

        if (!client || !client.bot) return;

        const scenario = JSON.parse(client.bot.scenario);
        const nodes = scenario.nodes || [];
        const edges = scenario.edges || [];

        let currentNodeId = client.currentStepId;

        // If no current step, find start node
        if (!currentNodeId) {
            const startNode = nodes.find((n: any) => n.data.label === 'Start');
            if (startNode) {
                currentNodeId = startNode.id;
            } else if (nodes.length > 0) {
                currentNodeId = nodes[0].id;
            }
        }

        // Check if we are currently at a Question Node or Booking Node and waiting for an answer
        if (currentNodeId) {
            const currentNode = nodes.find((n: any) => n.id === currentNodeId);
            if (currentNode) {
                if (currentNode.type === 'question') {
                    // Save the answer
                    const variableName = currentNode.data.variable;
                    if (variableName) {
                        const variables = JSON.parse(client.variables || '{}');
                        variables[variableName] = incomingText;
                        await this.prisma.client.update({
                            where: { id: clientId },
                            data: { variables: JSON.stringify(variables) },
                        });
                    }
                    // Move to next node
                    const edge = edges.find((e: any) => e.source === currentNodeId);
                    if (edge) {
                        currentNodeId = edge.target;
                    } else {
                        currentNodeId = null; // End of flow
                    }
                } else if (currentNode.type === 'booking') {
                    // Handle Booking Response
                    const serviceId = Number(currentNode.data.serviceId);
                    if (serviceId) {
                        let startTime = new Date();
                        startTime.setDate(startTime.getDate() + 1); // Default tomorrow
                        startTime.setHours(10, 0, 0, 0);

                        if (incomingText.includes("2") || incomingText.includes("14:00")) {
                            startTime.setHours(14, 0, 0, 0);
                        } else if (incomingText.includes("3") || incomingText.includes("Day After")) {
                            startTime.setDate(startTime.getDate() + 1); // Day after
                            startTime.setHours(11, 0, 0, 0);
                        }

                        const endTime = new Date(startTime);
                        endTime.setHours(endTime.getHours() + 1); // Default 1 hour duration

                        await this.prisma.appointment.create({
                            data: {
                                clientId: client.id,
                                serviceId: serviceId,
                                startTime: startTime,
                                endTime: endTime,
                                status: 'CONFIRMED'
                            }
                        });
                    }

                    // Move to next node
                    const edge = edges.find((e: any) => e.source === currentNodeId);
                    if (edge) {
                        currentNodeId = edge.target;
                    } else {
                        currentNodeId = null; // End of flow
                    }
                }
            }
        }

        // Execute nodes until we hit a stop (like a question)
        while (currentNodeId) {
            const currentNode = nodes.find((n: any) => n.id === currentNodeId);
            if (!currentNode) break;

            // Execute Node Logic
            if (currentNode.type === 'message') {
                let message = currentNode.data.label;
                // Replace variables
                const variables = JSON.parse(client.variables || '{}');
                for (const [key, value] of Object.entries(variables)) {
                    message = message.replace(new RegExp(`{${key}}`, 'g'), value as string);
                }

                await this.whatsappService.sendMessage(client.phone, message);

                // Move to next
                const edge = edges.find((e: any) => e.source === currentNodeId);
                currentNodeId = edge ? edge.target : null;

            } else if (currentNode.type === 'media') {
                const mediaType = currentNode.data.mediaType || 'image';
                const mediaUrl = currentNode.data.mediaUrl;
                const caption = currentNode.data.caption || '';

                if (mediaUrl) {
                    await this.whatsappService.sendMessage(client.phone, caption, mediaType, mediaUrl);
                }

                // Move to next
                const edge = edges.find((e: any) => e.source === currentNodeId);
                currentNodeId = edge ? edge.target : null;

            } else if (currentNode.type === 'question') {
                // Send Question
                await this.whatsappService.sendMessage(client.phone, currentNode.data.question);
                // Stop here and wait for user input
                await this.prisma.client.update({
                    where: { id: clientId },
                    data: { currentStepId: currentNodeId },
                });
                return;

            } else if (currentNode.type === 'button') {
                // Send Buttons
                const buttons = currentNode.data.buttons || [];
                const optionsText = buttons.map((b: any) => `- ${b.label}`).join('\n');
                await this.whatsappService.sendMessage(client.phone, `${currentNode.data.message}\n${optionsText}`);

                // Stop here and wait for input
                await this.prisma.client.update({
                    where: { id: clientId },
                    data: { currentStepId: currentNodeId },
                });
                return;
            } else if (currentNode.type === 'booking') {
                const serviceId = currentNode.data.serviceId;
                const service = await this.prisma.service.findUnique({ where: { id: Number(serviceId) } });

                if (service) {
                    const slots = [
                        "Tomorrow 10:00 AM",
                        "Tomorrow 2:00 PM",
                        "Day After 11:00 AM"
                    ];
                    const message = `Please choose a time for ${service.name}:\n1. ${slots[0]}\n2. ${slots[1]}\n3. ${slots[2]}`;
                    await this.whatsappService.sendMessage(client.phone, message);

                    // Stop here and wait for input
                    await this.prisma.client.update({
                        where: { id: clientId },
                        data: { currentStepId: currentNodeId },
                    });
                    return;
                } else {
                    // Service not found, skip
                    const edge = edges.find((e: any) => e.source === currentNodeId);
                    currentNodeId = edge ? edge.target : null;
                }
            } else {
                // Unknown node, skip
                const edge = edges.find((e: any) => e.source === currentNodeId);
                currentNodeId = edge ? edge.target : null;
            }
        }

        // Update client state (if we finished the flow or hit a non-stopping node)
        await this.prisma.client.update({
            where: { id: clientId },
            data: { currentStepId: currentNodeId },
        });
    }
}
