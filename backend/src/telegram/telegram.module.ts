import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  imports: [PromotionsModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
