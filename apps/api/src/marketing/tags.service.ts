import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.tag.findMany();
    }

    async create(name: string, color?: string) {
        return this.prisma.tag.create({
            data: { name, color },
        });
    }

    async delete(id: number) {
        return this.prisma.tag.delete({
            where: { id },
        });
    }

    async assignTag(clientId: number, tagId: number) {
        return this.prisma.client.update({
            where: { id: clientId },
            data: {
                tags: {
                    connect: { id: tagId },
                },
            },
            include: { tags: true },
        });
    }

    async removeTag(clientId: number, tagId: number) {
        return this.prisma.client.update({
            where: { id: clientId },
            data: {
                tags: {
                    disconnect: { id: tagId },
                },
            },
            include: { tags: true },
        });
    }
}
