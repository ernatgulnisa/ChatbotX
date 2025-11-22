import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { BotsModule } from '../bots/bots.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [HttpModule, forwardRef(() => BotsModule), forwardRef(() => MessagesModule)],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule { }
