import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stats')
@UseGuards(AuthGuard('jwt'))
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get()
    async getStats() {
        return this.statsService.getDashboardStats();
    }
}
