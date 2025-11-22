import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        const settings = await this.prisma.systemSetting.findMany();
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }

    async saveSettings(settings: Record<string, string>) {
        // Save to DB
        for (const [key, value] of Object.entries(settings)) {
            await this.prisma.systemSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
        }

        // Update .env file
        this.updateEnvFile(settings);

        return { success: true };
    }

    private updateEnvFile(settings: Record<string, string>) {
        const envPath = path.resolve(process.cwd(), '.env');
        let envContent = '';

        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        for (const [key, value] of Object.entries(settings)) {
            const regex = new RegExp(`^${key}=.*`, 'm');
            if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}="${value}"`);
            } else {
                envContent += `\n${key}="${value}"`;
            }
        }

        fs.writeFileSync(envPath, envContent);
    }
}
