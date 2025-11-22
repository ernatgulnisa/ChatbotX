import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Get('services')
    getServices() {
        return this.calendarService.findAllServices();
    }

    @Post('services')
    createService(@Body() data: { name: string; duration: number; price: number }) {
        return this.calendarService.createService(data);
    }

    @Get('appointments')
    getAppointments() {
        return this.calendarService.findAllAppointments();
    }

    @Post('appointments')
    createAppointment(@Body() data: { clientId: number; serviceId: number; startTime: string }) {
        return this.calendarService.createAppointment({
            ...data,
            startTime: new Date(data.startTime),
        });
    }
}
