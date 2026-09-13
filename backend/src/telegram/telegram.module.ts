import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { PromotionsModule } from '../promotions/promotions.module';
import { GalleryModule } from '../gallery/gallery.module';

@Module({
  imports: [PromotionsModule, GalleryModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
