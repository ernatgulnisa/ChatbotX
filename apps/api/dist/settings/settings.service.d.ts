import { PrismaService } from '../prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{}>;
    saveSettings(settings: Record<string, string>): Promise<{
        success: boolean;
    }>;
    private updateEnvFile;
}
