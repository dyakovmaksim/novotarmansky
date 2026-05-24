import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TelegramModule } from '../telegram/telegram.module';

// PrismaService is provided by the global PrismaModule (see AppModule).
@Module({
  imports: [TelegramModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
