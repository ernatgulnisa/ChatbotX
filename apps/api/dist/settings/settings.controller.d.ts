import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{}>;
    saveSettings(settings: Record<string, string>): Promise<{
        success: boolean;
    }>;
}
