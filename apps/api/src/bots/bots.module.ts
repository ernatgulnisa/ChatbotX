import { Module, forwardRef } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { BotEngineService } from './bot-engine.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [forwardRef(() => WhatsappModule)],
  controllers: [BotsController],
  providers: [BotsService, BotEngineService],
  exports: [BotEngineService],
})
export class BotsModule { }
