import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Post()
    async saveSettings(@Body() settings: Record<string, string>) {
        return this.settingsService.saveSettings(settings);
    }
}
