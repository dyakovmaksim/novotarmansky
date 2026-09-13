import { Body, Controller, Get, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Stricter limit on booking creation: 5 attempts per minute per IP.
  // Otherwise a bot could spam PENDING bookings to fill the calendar.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  // The public calendar only needs occupied dates. Booking details (including
  // names and phone numbers) stay in the database and Telegram admin panel.
  @Get('occupied-dates')
  occupiedDates() {
    return this.bookingsService.getOccupiedDates();
  }
}
