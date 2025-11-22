import { BotsService } from './bots.service';
export declare class BotsController {
    private readonly botsService;
    constructor(botsService: BotsService);
    create(req: any, body: {
        name: string;
        scenario: string;
    }): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        scenario: string;
        userId: number;
    }>;
    findAll(req: any): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        scenario: string;
        userId: number;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        scenario: string;
        userId: number;
    } | null>;
    update(id: string, body: {
        name?: string;
        scenario?: string;
    }): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        scenario: string;
        userId: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        scenario: string;
        userId: number;
    }>;
}
