import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateBookingDto } from './dto/create-booking.dto';

const MAX_GUESTS = 8;
const MAX_STAY_NIGHTS = 31;

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
    const guests = (dto.adults ?? 1) + (dto.children ?? 0);
    if (guests > MAX_GUESTS) {
      throw new BadRequestException(`Максимум гостей — ${MAX_GUESTS}.`);
    }
    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / 86_400_000,
    );
    if (nights > MAX_STAY_NIGHTS) {
      throw new BadRequestException(
        `Максимальная длительность бронирования — ${MAX_STAY_NIGHTS} ночь.`,
      );
    }

    // Cancelled bookings free their dates up again — don't count them.
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        archivedAt: null,
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

    // The browser only needs a confirmation that its request was accepted.
    // Never echo personal data (phone/name) back into a public API response.
    return { id: booking.id, status: booking.status };
  }

  // Returns an array of YYYY-MM-DD strings the calendar should disable.
  // CANCELLED bookings are excluded so their dates become free again.
  async getOccupiedDates(): Promise<string[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { archivedAt: null, status: { not: 'CANCELLED' } },
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
