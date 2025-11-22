import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    create(@Body() body: { content: string; sender: string; clientId: number; botId: number }) {
        return this.messagesService.create(body);
    }

    @Get(':clientId')
    findAll(@Param('clientId') clientId: string) {
        return this.messagesService.findAll(+clientId);
    }
}
