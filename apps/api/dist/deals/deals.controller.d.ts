import { DealsService } from './deals.service';
export declare class DealsController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    create(data: {
        clientId: number;
        status: string;
        value: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientId: number;
        value: number;
        status: string;
    }>;
    findAll(): Promise<({
        client: {
            name: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            botId: number;
            phone: string;
            currentStepId: string | null;
            variables: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientId: number;
        value: number;
        status: string;
    })[]>;
    update(id: string, data: {
        status?: string;
        value?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        clientId: number;
        value: number;
        status: string;
    }>;
}
