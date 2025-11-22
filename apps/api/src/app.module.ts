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
import { MessagesModule } from './messages/messages.module';
import { DealsModule } from './deals/deals.module';
import { StatsModule } from './stats/stats.module';
import { SettingsModule } from './settings/settings.module';
import { MarketingModule } from './marketing/marketing.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        UsersModule,
        BotsModule,
        ClientsModule,
        WhatsappModule,
        MessagesModule,
        DealsModule,
        StatsModule,
        SettingsModule,
        MarketingModule,
        CalendarModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
