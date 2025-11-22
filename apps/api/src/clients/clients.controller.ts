import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    // Note: Client creation usually happens via webhook, but manual creation is fine for CRM
    @Post()
    create(@Body() body: { name?: string, phone: string, botId: number }) {
        return this.clientsService.create({
            name: body.name,
            phone: body.phone,
            bot: { connect: { id: body.botId } },
        });
    }

    @Get()
    findAll(@Request() req) {
        return this.clientsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: { name?: string, phone?: string }) {
        return this.clientsService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientsService.remove(+id);
    }
}
