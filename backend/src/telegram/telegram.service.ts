import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    data: string;
    message: {
      chat: { id: number };
      message_id: number;
      text: string;
    };
  };
}

@Injectable()
export class TelegramService implements OnModuleInit, OnApplicationShutdown {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN ?? '';
  // Comma-separated list of chat IDs that get booking notifications and can
  // use /admin. One ID is fine; multiple are supported for shared management.
  private readonly adminChatIds = (process.env.TELEGRAM_ADMIN_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  private readonly houseTitle = process.env.HOUSE_TITLE ?? 'Дом';
  private readonly housePrice = Number(
    process.env.HOUSE_PRICE_PER_NIGHT ?? '5000',
  );
  private readonly saunaPrice = Number(process.env.SAUNA_PRICE ?? '3000');
  private lastUpdateId = 0;
  private stopped = false;

  // ─────────────────────────── LIFECYCLE ───────────────────────────

  onModuleInit() {
    if (!this.botToken || this.adminChatIds.length === 0) {
      this.logger.warn(
        'Telegram bot disabled: set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID in .env to enable it.',
      );
      return;
    }
    // Register the popup command menu Telegram shows next to the input box.
    this.setMyCommands().catch((err) =>
      this.logger.warn(`setMyCommands failed: ${(err as Error).message}`),
    );
    this.startTelegramListener();
  }

  onApplicationShutdown(signal?: string) {
    if (this.stopped) return;
    this.stopped = true;
    this.logger.log(`Telegram listener stopping (signal: ${signal ?? 'n/a'})`);
  }

  // ─────────────────────────── PUBLIC API ───────────────────────────

  async notifyNewBooking(booking: Booking): Promise<void> {
    if (this.adminChatIds.length === 0) return;

    const text = this.formatNewBookingMessage(booking);
    for (const chatId of this.adminChatIds) {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Подтвердить', callback_data: `approve_${booking.id}` },
              { text: '❌ Отменить', callback_data: `cancel_${booking.id}` },
            ],
          ],
        },
      });
    }
  }

  // ─────────────────────────── FORMATTING ───────────────────────────

  private statusEmoji(status: string): string {
    if (status === 'CONFIRMED') return '✅';
    if (status === 'CANCELLED') return '❌';
    return '⏳';
  }

  private statusLabel(status: string): string {
    if (status === 'CONFIRMED') return 'Подтверждено';
    if (status === 'CANCELLED') return 'Отменено';
    return 'Ожидает';
  }

  /** Number of nights between two dates, minimum 1. */
  private calcNights(startDate: Date, endDate: Date): number {
    const ms = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  /** Russian plural for "ночь". */
  private nightsWord(n: number): string {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'ночь';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'ночи';
    return 'ночей';
  }

  private guestsLine(adults: number, children: number): string {
    const parts = [`${adults} взр.`];
    if (children > 0) parts.push(`${children} дет.`);
    return parts.join(', ');
  }

  private formatMoney(rub: number): string {
    return `${rub.toLocaleString('ru-RU')} ₽`;
  }

  /** ru-RU date like "10.07.2026". */
  private fmtDate(d: Date): string {
    return new Date(d).toLocaleDateString('ru-RU');
  }

  /**
   * Returns { nights, total, totalLine } where totalLine breaks down the sum
   * as "5 000 ₽ × 3 ноч. + 3 000 ₽ баня = 18 000 ₽" so the admin sees the math.
   */
  private priceBreakdown(booking: Booking) {
    const nights = this.calcNights(booking.startDate, booking.endDate);
    const base = nights * this.housePrice;
    const sauna = booking.hasSauna ? this.saunaPrice : 0;
    const total = base + sauna;
    const parts = [`${this.formatMoney(this.housePrice)} × ${nights} ноч.`];
    if (sauna > 0) parts.push(`${this.formatMoney(sauna)} баня`);
    return {
      nights,
      total,
      totalLine: `${parts.join(' + ')} = <b>${this.formatMoney(total)}</b>`,
    };
  }

  private formatNewBookingMessage(booking: Booking): string {
    const { nights, totalLine } = this.priceBreakdown(booking);
    const start = this.fmtDate(booking.startDate);
    const end = this.fmtDate(booking.endDate);
    const guests = this.guestsLine(booking.adults, booking.children);
    const saunaLine = booking.hasSauna ? '\n🧖 <b>Баня:</b> заказана' : '';

    return (
      `🔔 <b>НОВАЯ ЗАЯВКА</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `🏠 <b>${this.houseTitle}</b>\n\n` +
      `👤 ${booking.customerName}\n` +
      `📞 <code>${booking.phone}</code>\n\n` +
      `📅 <b>Период:</b> ${start} — ${end}\n` +
      `🌙 <b>Ночей:</b> ${nights} ${this.nightsWord(nights)}\n` +
      `👥 <b>Гости:</b> ${guests}` +
      saunaLine +
      `\n\n💰 <b>Итого:</b>\n${totalLine}`
    );
  }

  private formatBookingCard(
    booking: Booking,
    options: { withPhone?: boolean; title?: string } = {},
  ): string {
    const { nights, totalLine } = this.priceBreakdown(booking);
    const start = this.fmtDate(booking.startDate);
    const end = this.fmtDate(booking.endDate);
    const guests = this.guestsLine(booking.adults, booking.children);
    const saunaLine = booking.hasSauna ? '\n🧖 <b>Баня:</b> заказана' : '';
    const phoneLine = options.withPhone
      ? `\n📞 <code>${booking.phone}</code>`
      : '';
    const head = options.title
      ? `<b>${options.title}</b>\n━━━━━━━━━━━━━━━━━━\n\n`
      : '';

    return (
      head +
      `${this.statusEmoji(booking.status)} <b>Статус:</b> ${this.statusLabel(booking.status)}\n\n` +
      `👤 ${booking.customerName}${phoneLine}\n\n` +
      `📅 ${start} — ${end} (${nights} ${this.nightsWord(nights)})\n` +
      `👥 ${guests}` +
      saunaLine +
      `\n\n💰 ${totalLine}`
    );
  }

  // ─────────────────────────── BOT COMMANDS / MENU ───────────────────────────

  private async setMyCommands() {
    await this.sendTg('setMyCommands', {
      commands: [
        { command: 'admin', description: 'Панель управления бронированиями' },
        { command: 'stats', description: 'Статистика по статусам' },
        { command: 'help', description: 'Справка по командам' },
      ],
      scope: { type: 'all_private_chats' },
    });
  }

  private adminMenuKeyboard() {
    return {
      inline_keyboard: [
        [{ text: '📅 Актуальные брони', callback_data: 'page_0' }],
        [{ text: '📊 Статистика', callback_data: 'view_stats' }],
      ],
    };
  }

  private async startTelegramListener() {
    this.logger.log('🤖 Telegram бот-слушатель запущен');

    while (!this.stopped) {
      try {
        const url = `https://api.telegram.org/bot${this.botToken}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=30`;
        const response = await global.fetch(url);
        const data = await response.json();

        if (data.ok && data.result && Array.isArray(data.result)) {
          for (const update of data.result as TelegramUpdate[]) {
            this.lastUpdateId = update.update_id;

            if (update.message && update.message.text) {
              await this.handleTextMessage(update.message);
            }

            if (update.callback_query) {
              await this.handleCallbackQuery(update.callback_query);
            }
          }
        }
      } catch (error) {
        this.logger.error('Ошибка в цикле опроса Telegram', error as Error);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private async handleTextMessage(message: {
    chat: { id: number };
    text?: string;
  }) {
    const text = message.text ?? '';
    const chatId = message.chat.id;

    if (!this.adminChatIds.includes(String(chatId))) {
      // Polite refusal for non-admins so the bot doesn't look broken.
      if (text === '/start' || text === '/help' || text.startsWith('/')) {
        await this.sendTg('sendMessage', {
          chat_id: chatId,
          text: '⛔ Доступ ограничен. Этот бот предназначен только для администраторов.',
        });
      }
      return;
    }

    if (text === '/start') {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text:
          `👋 <b>Добро пожаловать в админ-бот ${this.houseTitle}</b>\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `Сюда приходят уведомления о новых заявках на бронирование и здесь же ими можно управлять.\n\n` +
          `Доступные команды:\n` +
          `• /admin — открыть панель управления\n` +
          `• /stats — статистика по статусам\n` +
          `• /help — эта справка`,
        parse_mode: 'HTML',
      });
      return;
    }

    if (text === '/help') {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text:
          `<b>Справка</b>\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `📅 <b>Актуальные брони</b> — листалка по всем заявкам с подробностями.\n\n` +
          `📊 <b>Статистика</b> — счётчики по статусам PENDING/CONFIRMED/CANCELLED.\n\n` +
          `<b>Статусы:</b>\n` +
          `⏳ Ожидает — новая заявка, требует подтверждения\n` +
          `✅ Подтверждено — даты заблокированы в календаре\n` +
          `❌ Отменено — даты снова свободны`,
        parse_mode: 'HTML',
      });
      return;
    }

    if (text === '/stats') {
      await this.sendStatsMessage(chatId);
      return;
    }

    if (text === '/admin' || text === '🎛 Меню') {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text: `⚙️ <b>Панель управления</b>\nВыберите раздел:`,
        parse_mode: 'HTML',
        reply_markup: this.adminMenuKeyboard(),
      });
    }
  }

  private async sendStatsMessage(chatId: number) {
    const grouped = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const counts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
    };
    for (const g of grouped) counts[g.status] = g._count._all;
    const total = counts.PENDING + counts.CONFIRMED + counts.CANCELLED;

    await this.sendTg('sendMessage', {
      chat_id: chatId,
      text:
        `📊 <b>Статистика</b>\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `🏠 <b>${this.houseTitle}</b>\n\n` +
        `Всего записей: <b>${total}</b>\n\n` +
        `⏳ Ожидают: <b>${counts.PENDING}</b>\n` +
        `✅ Подтверждены: <b>${counts.CONFIRMED}</b>\n` +
        `❌ Отменены: <b>${counts.CANCELLED}</b>`,
      parse_mode: 'HTML',
    });
  }

  // ─────────────────────────── CALLBACKS ───────────────────────────

  private async handleCallbackQuery(callbackQuery: {
    id: string;
    data: string;
    message: { chat: { id: number }; message_id: number; text: string };
  }) {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;

    const answer = async (msg?: string) => {
      await this.sendTg('answerCallbackQuery', {
        callback_query_id: callbackQuery.id,
        text: msg || undefined,
      });
    };

    if (!this.adminChatIds.includes(String(chatId))) {
      await answer('Доступ ограничен');
      return;
    }

    try {
      switch (true) {
        case data === 'view_stats': {
          await answer('Загружаю...');
          await this.sendStatsMessage(chatId);
          return;
        }

        case data === 'back_to_menu': {
          await answer();
          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: `⚙️ <b>Панель управления</b>\nВыберите раздел:`,
            parse_mode: 'HTML',
            reply_markup: this.adminMenuKeyboard(),
          });
          return;
        }

        case data.startsWith('page_'): {
          await answer();
          const page = parseInt(data.split('_')[1], 10);

          const allBookings = await this.prisma.booking.findMany({
            orderBy: { startDate: 'asc' },
          });

          if (allBookings.length === 0) {
            await this.sendTg('editMessageText', {
              chat_id: chatId,
              message_id: messageId,
              text: '📭 Актуальных бронирований пока нет.',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '🎛 В главное меню',
                      callback_data: 'back_to_menu',
                    },
                  ],
                ],
              },
            });
            return;
          }

          const total = allBookings.length;
          const currentPage = page >= total ? total - 1 : page < 0 ? 0 : page;
          const b = allBookings[currentPage];

          const cardText = this.formatBookingCard(b, {
            title: `Бронь ${currentPage + 1} из ${total}`,
          });

          const navRow: { text: string; callback_data: string }[] = [];
          if (currentPage > 0) {
            navRow.push({
              text: '◀️ Назад',
              callback_data: `page_${currentPage - 1}`,
            });
          }
          if (currentPage < total - 1) {
            navRow.push({
              text: 'Вперёд ▶️',
              callback_data: `page_${currentPage + 1}`,
            });
          }

          const inlineKeyboard: any[][] = [];
          if (navRow.length > 0) inlineKeyboard.push(navRow);
          inlineKeyboard.push([
            {
              text: '⚙️ Управление',
              callback_data: `manage_${b.id}_${currentPage}`,
            },
          ]);
          inlineKeyboard.push([
            { text: '🎛 В главное меню', callback_data: 'back_to_menu' },
          ]);

          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: cardText,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: inlineKeyboard },
          });
          return;
        }

        case data.startsWith('manage_'): {
          await answer();
          const parts = data.split('_');
          const bId = parts[1];
          const pageIndex = parts[2] || '0';

          const b = await this.prisma.booking.findUnique({
            where: { id: bId },
          });

          if (!b) {
            await this.sendTg('sendMessage', {
              chat_id: chatId,
              text: '❌ Бронирование уже удалено или не найдено.',
            });
            return;
          }

          const cardText = this.formatBookingCard(b, {
            title: 'Управление бронью',
            withPhone: true,
          });

          const manageButtons: any[][] = [
            [{ text: '📞 Позвонить гостю', url: `tel:${b.phone}` }],
          ];
          if (b.status === 'PENDING') {
            manageButtons.push([
              { text: '✅ Подтвердить', callback_data: `approve_${b.id}` },
              { text: '❌ Отменить', callback_data: `cancel_${b.id}` },
            ]);
          } else if (b.status === 'CONFIRMED') {
            manageButtons.push([
              { text: '❌ Отменить', callback_data: `cancel_${b.id}` },
            ]);
          }
          manageButtons.push([
            {
              text: '🗑 Удалить из базы',
              callback_data: `forcedel_${b.id}_${pageIndex}`,
            },
          ]);
          manageButtons.push([
            {
              text: '⬅️ К списку',
              callback_data: `page_${pageIndex}`,
            },
          ]);

          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: cardText,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: manageButtons },
          });
          return;
        }

        case data.startsWith('forcedel_'): {
          const parts = data.split('_');
          const bookingId = parts[1];
          const pageIndex = parseInt(parts[2], 10);

          await this.prisma.booking.delete({ where: { id: bookingId } });
          await answer('Бронь удалена');

          const allBookings = await this.prisma.booking.findMany({
            orderBy: { startDate: 'asc' },
          });

          if (allBookings.length === 0) {
            await this.sendTg('editMessageText', {
              chat_id: chatId,
              message_id: messageId,
              text: '📭 Актуальных бронирований больше нет.',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '🎛 В главное меню',
                      callback_data: 'back_to_menu',
                    },
                  ],
                ],
              },
            });
            return;
          }

          const targetPage =
            pageIndex >= allBookings.length
              ? allBookings.length - 1
              : pageIndex;
          const targetBooking = allBookings[targetPage];

          const navRow: { text: string; callback_data: string }[] = [];
          if (targetPage > 0)
            navRow.push({
              text: '◀️ Назад',
              callback_data: `page_${targetPage - 1}`,
            });
          if (targetPage < allBookings.length - 1)
            navRow.push({
              text: 'Вперёд ▶️',
              callback_data: `page_${targetPage + 1}`,
            });

          const inlineKeyboard: any[][] = [];
          if (navRow.length > 0) inlineKeyboard.push(navRow);
          inlineKeyboard.push([
            {
              text: '⚙️ Управление',
              callback_data: `manage_${targetBooking.id}_${targetPage}`,
            },
          ]);
          inlineKeyboard.push([
            { text: '🎛 В главное меню', callback_data: 'back_to_menu' },
          ]);

          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: this.formatBookingCard(targetBooking, {
              title: `Бронь ${targetPage + 1} из ${allBookings.length}`,
            }),
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: inlineKeyboard },
          });
          return;
        }

        case data.startsWith('approve_') || data.startsWith('cancel_'): {
          const parts = data.split('_');
          const action = parts[0];
          const bookingId = parts[1];
          let statusLine = '';

          if (action === 'approve') {
            await this.prisma.booking.update({
              where: { id: bookingId },
              data: { status: 'CONFIRMED' },
            });
            statusLine = '🟢 Бронирование подтверждено!';
            await answer('Подтверждено');
          } else {
            await this.prisma.booking.update({
              where: { id: bookingId },
              data: { status: 'CANCELLED' },
            });
            statusLine = '🔴 Бронирование отменено. Даты освобождены.';
            await answer('Отменено');
          }

          const originalText = callbackQuery.message.text || '';
          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: `${originalText}\n\n━━━━━━━━━━━━━━━━━━\n${statusLine}`,
            parse_mode: 'HTML',
          });
          return;
        }
      }
    } catch (error) {
      this.logger.error('❌ Ошибка обработки кнопки ТГ', error as Error);
      await answer('Произошла ошибка');
    }
  }

  // ─────────────────────────── HTTP ───────────────────────────

  private async sendTg(method: string, body: any) {
    const url = `https://api.telegram.org/bot${this.botToken}/${method}`;
    return global.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
