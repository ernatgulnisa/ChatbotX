import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('deals')
@UseGuards(AuthGuard('jwt'))
export class DealsController {
    constructor(private readonly dealsService: DealsService) { }

    @Post()
    async create(@Body() data: { clientId: number; status: string; value: number }) {
        return this.dealsService.create(data);
    }

    @Get()
    async findAll() {
        return this.dealsService.findAll();
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: { status?: string; value?: number }) {
        return this.dealsService.update(+id, data);
    }
}
