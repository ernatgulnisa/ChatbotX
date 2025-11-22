import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    async findAll() {
        return this.tagsService.findAll();
    }

    @Post()
    async create(@Body() body: { name: string; color?: string }) {
        return this.tagsService.create(body.name, body.color);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.tagsService.delete(Number(id));
    }

    @Post('assign')
    async assignTag(@Body() body: { clientId: number; tagId: number }) {
        return this.tagsService.assignTag(body.clientId, body.tagId);
    }

    @Post('remove')
    async removeTag(@Body() body: { clientId: number; tagId: number }) {
        return this.tagsService.removeTag(body.clientId, body.tagId);
    }
}
