import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BotsService } from './bots.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('bots')
@UseGuards(AuthGuard('jwt'))
export class BotsController {
    constructor(private readonly botsService: BotsService) { }

    @Post()
    create(@Request() req, @Body() body: { name: string, scenario: string }) {
        return this.botsService.create({
            name: body.name,
            scenario: body.scenario,
            user: { connect: { id: req.user.userId } },
        });
    }

    @Get()
    findAll(@Request() req) {
        return this.botsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.botsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: { name?: string, scenario?: string }) {
        return this.botsService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.botsService.remove(+id);
    }
}
