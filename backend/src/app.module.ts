import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HousesModule } from './houses/houses.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [HousesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
