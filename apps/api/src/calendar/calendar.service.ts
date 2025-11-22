import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalendarService {
    constructor(private prisma: PrismaService) { }

    async createService(data: Prisma.ServiceCreateInput) {
        return this.prisma.service.create({ data });
    }

    async findAllServices() {
        return this.prisma.service.findMany();
    }

    async createAppointment(data: { clientId: number; serviceId: number; startTime: Date }) {
        const service = await this.prisma.service.findUnique({ where: { id: data.serviceId } });
        if (!service) throw new Error('Service not found');

        const endTime = new Date(data.startTime.getTime() + service.duration * 60000);

        // Check for conflicts (simplified)
        const conflict = await this.prisma.appointment.findFirst({
            where: {
                startTime: { lt: endTime },
                endTime: { gt: data.startTime },
                status: { not: 'cancelled' }
            }
        });

        if (conflict) throw new Error('Time slot is already booked');

        return this.prisma.appointment.create({
            data: {
                clientId: data.clientId,
                serviceId: data.serviceId,
                startTime: data.startTime,
                endTime: endTime,
            }
        });
    }

    async findAllAppointments() {
        return this.prisma.appointment.findMany({
            include: {
                client: true,
                service: true,
            },
            orderBy: {
                startTime: 'asc',
            }
        });
    }
}
