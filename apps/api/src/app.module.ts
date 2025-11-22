import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BotsModule } from './bots/bots.module';
import { ClientsModule } from './clients/clients.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
providers: [AppService],
})
export class AppModule { }
