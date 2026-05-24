import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private telegram: TelegramService,
  ) {}

  private readonly logger = new Logger(BookingsService.name);

  async create(dto: CreateBookingDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new ConflictException('endDate должна быть позже startDate.');
    }

    // Cancelled bookings free their dates up again — don't count them.
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        status: { not: 'CANCELLED' },
        OR: [
          { startDate: { lte: startDate }, endDate: { gte: startDate } },
          { startDate: { lte: endDate }, endDate: { gte: endDate } },
          { startDate: { gte: startDate }, endDate: { lte: endDate } },
        ],
      },
    });

    if (conflictingBooking) {
      throw new ConflictException('Дом уже забронирован на выбранные даты.');
    }

    const booking = await this.prisma.booking.create({
      data: {
        customerName: dto.customerName,
        phone: dto.phone,
        startDate,
        endDate,
        adults: dto.adults ?? 1,
        children: dto.children ?? 0,
        hasSauna: dto.hasSauna ?? false,
      },
    });

    this.telegram
      .notifyNewBooking(booking)
      .catch((err) => this.logger.error('Ошибка отправки в TG', err));

    return booking;
  }

  findAll() {
    return this.prisma.booking.findMany({ orderBy: { startDate: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.booking.delete({ where: { id } });
  }

  update(id: string, dto: UpdateBookingDto) {
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.booking.update({ where: { id }, data });
  }

  // Returns an array of YYYY-MM-DD strings the calendar should disable.
  // CANCELLED bookings are excluded so their dates become free again.
  async getOccupiedDates(): Promise<string[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { status: { not: 'CANCELLED' } },
      select: { startDate: true, endDate: true },
    });

    const set = new Set<string>();
    for (const b of bookings) {
      const cur = new Date(b.startDate);
      const end = new Date(b.endDate);
      while (cur <= end) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        set.add(`${y}-${m}-${d}`);
        cur.setDate(cur.getDate() + 1);
      }
    }
    return Array.from(set);
  }
}
