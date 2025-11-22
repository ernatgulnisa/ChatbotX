import { ClientsService } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(body: {
        name?: string;
        phone: string;
        botId: number;
    }): Promise<{
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        botId: number;
        phone: string;
        currentStepId: string | null;
        variables: string;
    }>;
    findAll(req: any): Promise<{
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        botId: number;
        phone: string;
        currentStepId: string | null;
        variables: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        botId: number;
        phone: string;
        currentStepId: string | null;
        variables: string;
    } | null>;
    update(id: string, body: {
        name?: string;
        phone?: string;
    }): Promise<{
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        botId: number;
        phone: string;
        currentStepId: string | null;
        variables: string;
    }>;
    remove(id: string): Promise<{
        name: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        botId: number;
        phone: string;
        currentStepId: string | null;
        variables: string;
    }>;
}
