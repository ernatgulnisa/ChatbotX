import { PrismaService } from '../prisma.service';
export declare class DealsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    update(id: number, data: {
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
