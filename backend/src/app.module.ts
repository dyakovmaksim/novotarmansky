import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BookingsModule } from './bookings/bookings.module';
import { TelegramModule } from './telegram/telegram.module';
import { PromotionsModule } from './promotions/promotions.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    // Default throttling: 60 requests / minute per IP. Endpoints can tighten
    // this with @Throttle({ default: { limit, ttl } }) — see bookings.controller.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    TelegramModule,
    BookingsModule,
    PromotionsModule,
    GalleryModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
