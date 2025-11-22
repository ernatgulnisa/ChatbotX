import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(body: {
        content: string;
        sender: string;
        clientId: number;
        botId: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        content: string | null;
        type: string;
        mediaUrl: string | null;
        direction: string;
        sender: string;
        clientId: number;
        botId: number;
    }>;
    findAll(clientId: string): Promise<{
        id: number;
        createdAt: Date;
        content: string | null;
        type: string;
        mediaUrl: string | null;
        direction: string;
        sender: string;
        clientId: number;
        botId: number;
    }[]>;
}
