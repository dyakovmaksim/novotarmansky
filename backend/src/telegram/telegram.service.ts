import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Booking, BookingStatus } from '@prisma/client';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PromotionsService } from '../promotions/promotions.service';
import { GalleryService } from '../gallery/gallery.service';

type Photo = {
  file_id: string;
  file_size?: number;
  width: number;
  height: number;
};
type TelegramMessage = { chat: { id: number }; text?: string; photo?: Photo[] };
type TelegramCallback = {
  id: string;
  data: string;
  message: { chat: { id: number }; message_id: number; text?: string };
};
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallback;
}
type TelegramApiResponse<T> = { ok: boolean; result?: T };
type TelegramFileResult = { file_path?: string };
type PromotionDraft = {
  step: 'title' | 'description' | 'badge' | 'validUntil' | 'image';
  title?: string;
  description?: string;
  badge?: string;
  validUntil?: string;
};
type GalleryDraft = { category: GalleryCategory };
type GalleryCategory = 'house' | 'interior' | 'territory' | 'sauna';

@Injectable()
export class TelegramService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotions: PromotionsService,
    private readonly gallery: GalleryService,
  ) {}

  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN ?? '';
  private readonly adminChatIds = (process.env.TELEGRAM_ADMIN_CHAT_ID ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  private readonly houseTitle = process.env.HOUSE_TITLE ?? 'Дом';
  private readonly housePrice = Number(
    process.env.HOUSE_PRICE_PER_NIGHT ?? '5000',
  );
  private readonly saunaPrice = Number(process.env.SAUNA_PRICE ?? '3000');
  private readonly uploadsDir =
    process.env.PROMOTIONS_UPLOAD_DIR ?? join(process.cwd(), 'uploads');
  private readonly promotionDrafts = new Map<number, PromotionDraft>();
  private readonly galleryDrafts = new Map<number, GalleryDraft>();
  private archiveTimer?: NodeJS.Timeout;
  private lastUpdateId = 0;
  private stopped = false;

  onModuleInit() {
    if (!this.botToken || this.adminChatIds.length === 0) {
      this.logger.warn(
        'Telegram bot disabled: set TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID.',
      );
      return;
    }
    this.setMyCommands().catch((err) =>
      this.logger.warn(`setMyCommands failed: ${(err as Error).message}`),
    );
    this.archiveFinishedBookings().catch((err) =>
      this.logger.error('Could not archive finished bookings', err as Error),
    );
    this.archiveTimer = setInterval(
      () => {
        void this.archiveFinishedBookings().catch((err) =>
          this.logger.error(
            'Could not archive finished bookings',
            err as Error,
          ),
        );
      },
      6 * 60 * 60 * 1000,
    );
    void this.startTelegramListener();
  }

  onApplicationShutdown(signal?: string) {
    this.stopped = true;
    if (this.archiveTimer) clearInterval(this.archiveTimer);
    this.logger.log(`Telegram listener stopping (signal: ${signal ?? 'n/a'})`);
  }

  async notifyNewBooking(booking: Booking): Promise<void> {
    for (const chatId of this.adminChatIds) {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text: this.formatBookingCard(booking, {
          title: '🔔 Новая заявка',
          withPhone: true,
        }),
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Подтвердить',
                callback_data: `approve_${booking.id}`,
              },
              { text: 'Отменить', callback_data: `cancelask_${booking.id}` },
            ],
          ],
        },
      });
    }
  }

  private escapeHtml(value: string) {
    return value.replace(
      /[&<>]/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char] as string,
    );
  }

  private isJpeg(bytes: Buffer) {
    return (
      bytes.length >= 4 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  private async readTelegramResponse<T>(response: Response) {
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== 'object' ||
      !('ok' in data) ||
      typeof data.ok !== 'boolean'
    )
      throw new Error('Telegram returned an invalid response');
    return data as TelegramApiResponse<T>;
  }

  private statusEmoji(status: BookingStatus) {
    return status === 'CONFIRMED' ? '✅' : status === 'CANCELLED' ? '❌' : '⏳';
  }

  private statusLabel(status: BookingStatus) {
    return status === 'CONFIRMED'
      ? 'Подтверждено'
      : status === 'CANCELLED'
        ? 'Отменено'
        : 'Ожидает решения';
  }

  private calcNights(startDate: Date, endDate: Date) {
    return Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / 86_400_000),
    );
  }

  private nightsWord(value: number) {
    const mod10 = value % 10;
    const mod100 = value % 100;
    return mod10 === 1 && mod100 !== 11
      ? 'ночь'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)
        ? 'ночи'
        : 'ночей';
  }

  private formatMoney(value: number) {
    return `${value.toLocaleString('ru-RU')} ₽`;
  }

  private fmtDate(date: Date) {
    return new Date(date).toLocaleDateString('ru-RU');
  }

  private formatBookingCard(
    booking: Booking,
    options: { title?: string; withPhone?: boolean } = {},
  ) {
    const nights = this.calcNights(booking.startDate, booking.endDate);
    const sauna = booking.hasSauna ? this.saunaPrice : 0;
    const total = nights * this.housePrice + sauna;
    const header = options.title ? `<b>${options.title}</b>\n\n` : '';
    const guests = `${booking.adults} взр.${booking.children ? `, ${booking.children} дет.` : ''}`;
    const phone = options.withPhone
      ? `\n📞 <code>${this.escapeHtml(booking.phone)}</code>`
      : '';
    const saunaLine = booking.hasSauna ? '\n🧖 Баня включена' : '';
    return (
      `${header}${this.statusEmoji(booking.status)} <b>${this.statusLabel(booking.status)}</b>\n\n` +
      `👤 ${this.escapeHtml(booking.customerName)}${phone}\n\n` +
      `📅 ${this.fmtDate(booking.startDate)} — ${this.fmtDate(booking.endDate)}\n` +
      `🌙 ${nights} ${this.nightsWord(nights)} · 👥 ${guests}${saunaLine}\n\n` +
      `💰 ${this.formatMoney(this.housePrice)} × ${nights}${sauna ? ` + ${this.formatMoney(sauna)} баня` : ''}\n` +
      `<b>Итого: ${this.formatMoney(total)}</b>`
    );
  }

  private async setMyCommands() {
    await this.sendTg('setMyCommands', {
      commands: [
        { command: 'admin', description: 'Открыть панель управления' },
        { command: 'stats', description: 'Посмотреть сводку' },
        { command: 'promotions', description: 'Управлять акциями' },
        { command: 'history', description: 'История завершённых заявок' },
        { command: 'photos', description: 'Загрузить фото в галерею' },
        { command: 'cancel', description: 'Отменить текущее действие' },
        { command: 'help', description: 'Справка' },
      ],
      scope: { type: 'all_private_chats' },
    });
  }

  private async adminMenuKeyboard() {
    const pending = await this.prisma.booking.count({
      where: { archivedAt: null, status: 'PENDING' },
    });
    return {
      inline_keyboard: [
        [
          {
            text: pending ? `🔔 Новые заявки · ${pending}` : '🔔 Новые заявки',
            callback_data: 'pending_0',
          },
        ],
        [
          { text: '📅 Ближайшие заезды', callback_data: 'upcoming_0' },
          { text: '🗓 Занятые даты', callback_data: 'calendar' },
        ],
        [
          { text: '🏷 Акции', callback_data: 'promos_0' },
          { text: '🖼 Фото сайта', callback_data: 'gallery_menu' },
        ],
        [
          { text: '🧾 История', callback_data: 'history_0' },
          { text: '📊 Сводка', callback_data: 'view_stats' },
        ],
      ],
    };
  }

  private replyKeyboard() {
    return {
      keyboard: [
        [{ text: '📋 Админка' }, { text: '🔔 Заявки' }],
        [{ text: '🧾 История' }, { text: '🏷 Акции' }, { text: '🖼 Фото' }],
      ],
      resize_keyboard: true,
      is_persistent: true,
    };
  }

  private async showAdminMenu(chatId: number, messageId?: number) {
    const payload: any = {
      chat_id: chatId,
      text: `🏠 <b>${this.escapeHtml(this.houseTitle)}</b>\nПанель управления\n\nВыберите, что нужно сделать:`,
      parse_mode: 'HTML',
      reply_markup: await this.adminMenuKeyboard(),
    };
    if (!messageId) {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text: 'Быстрые действия доступны в кнопках под строкой ввода.',
        reply_markup: this.replyKeyboard(),
      });
    }
    return messageId
      ? this.sendTg('editMessageText', { ...payload, message_id: messageId })
      : this.sendTg('sendMessage', payload);
  }

  private async startTelegramListener() {
    this.logger.log('Telegram admin bot started');
    while (!this.stopped) {
      try {
        const response = await global.fetch(
          `https://api.telegram.org/bot${this.botToken}/getUpdates?offset=${this.lastUpdateId + 1}&timeout=30`,
        );
        const data =
          await this.readTelegramResponse<TelegramUpdate[]>(response);
        if (data.ok && Array.isArray(data.result))
          for (const update of data.result) {
            this.lastUpdateId = update.update_id;
            if (update.message) await this.handleMessage(update.message);
            if (update.callback_query)
              await this.handleCallbackQuery(update.callback_query);
          }
      } catch (error) {
        this.logger.error('Telegram polling error', error as Error);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private async handleMessage(message: TelegramMessage) {
    const chatId = message.chat.id;
    const text = message.text?.trim();
    if (!this.adminChatIds.includes(String(chatId))) {
      if (text?.startsWith('/'))
        await this.sendTg('sendMessage', {
          chat_id: chatId,
          text: '⛔ Доступ ограничен.',
        });
      return;
    }
    if (text === '/cancel') {
      this.promotionDrafts.delete(chatId);
      this.galleryDrafts.delete(chatId);
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text: 'Действие отменено. Откройте /admin, когда будете готовы.',
      });
      return;
    }
    if (this.promotionDrafts.has(chatId)) {
      if (message.photo?.length)
        await this.handlePromotionPhoto(chatId, message.photo);
      else if (text) await this.handlePromotionText(chatId, text);
      else
        await this.sendTg('sendMessage', {
          chat_id: chatId,
          text: 'Нужен текст или фотография. Для отмены используйте /cancel.',
        });
      return;
    }
    if (this.galleryDrafts.has(chatId)) {
      if (message.photo?.length)
        await this.handleGalleryPhoto(chatId, message.photo);
      else
        await this.sendTg('sendMessage', {
          chat_id: chatId,
          text: 'Сейчас нужна фотография. Для отмены используйте /cancel.',
        });
      return;
    }
    if (
      text === '/start' ||
      text === '/admin' ||
      text === '🎛 Меню' ||
      text === '📋 Админка'
    )
      return this.showAdminMenu(chatId);
    if (text === '🔔 Заявки')
      return this.showBookingListMessage(chatId, 'pending');
    if (text === '🧾 История' || text === '/history')
      return this.showHistory(chatId);
    if (text === '/stats') return this.sendStatsMessage(chatId);
    if (text === '/promotions' || text === '🏷 Акции')
      return this.showPromotions(chatId);
    if (text === '/photos' || text === '🖼 Фото')
      return this.showGalleryMenu(chatId);
    if (text === '/help')
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: '<b>Как пользоваться ботом</b>\n\n🔔 Новые заявки — подтвердить или отменить запрос.\n📅 Ближайшие заезды — все актуальные гости.\n🗓 Занятые даты — быстрый обзор календаря.\n🏷 Акции — добавить акцию с фото или удалить неактуальную.\n\nВ любой момент /cancel отменяет незавершённое добавление акции.',
      });
  }

  private async handlePromotionText(chatId: number, text: string) {
    const draft = this.promotionDrafts.get(chatId);
    if (!draft) return;
    if (draft.step === 'title') {
      if (text.length < 3 || text.length > 80)
        return this.prompt(chatId, 'Название — от 3 до 80 символов.');
      draft.title = text;
      draft.step = 'description';
      return this.prompt(
        chatId,
        'Опишите условия акции одним понятным сообщением.',
      );
    }
    if (draft.step === 'description') {
      if (text.length < 10 || text.length > 700)
        return this.prompt(chatId, 'Описание — от 10 до 700 символов.');
      draft.description = text;
      draft.step = 'badge';
      return this.prompt(
        chatId,
        'Короткий бейдж, например «−20%» или «Подарок». Если не нужен — отправьте «-».',
      );
    }
    if (draft.step === 'badge') {
      if (text !== '-' && text.length > 24)
        return this.prompt(chatId, 'Бейдж — до 24 символов, либо «-».');
      draft.badge = text === '-' ? undefined : text;
      draft.step = 'validUntil';
      return this.prompt(
        chatId,
        'Срок действия, например «до 30.11.2026». Если бессрочно — отправьте «-».',
      );
    }
    if (draft.step === 'validUntil') {
      if (text.length > 40)
        return this.prompt(chatId, 'Срок — до 40 символов, либо «-».');
      draft.validUntil = text === '-' ? 'бессрочно' : text;
      draft.step = 'image';
      return this.prompt(
        chatId,
        'Отправьте одну фотографию для акции как обычное фото. Максимум 5 МБ.',
      );
    }
    return this.prompt(
      chatId,
      'Сейчас нужна фотография. Пришлите её как фото или используйте /cancel.',
    );
  }

  private async handlePromotionPhoto(chatId: number, photos: Photo[]) {
    const draft = this.promotionDrafts.get(chatId);
    if (
      !draft ||
      draft.step !== 'image' ||
      !draft.title ||
      !draft.description ||
      !draft.validUntil
    )
      return;
    const photo = photos[photos.length - 1];
    if (photo.file_size && photo.file_size > 5 * 1024 * 1024)
      return this.prompt(chatId, 'Файл больше 5 МБ. Отправьте фото поменьше.');
    try {
      const fileResponse = await this.sendTg('getFile', {
        file_id: photo.file_id,
      });
      const fileData =
        await this.readTelegramResponse<TelegramFileResult>(fileResponse);
      const filePath = fileData.result?.file_path;
      if (!fileData.ok || !filePath)
        throw new Error('Telegram did not return a file path');
      const image = await global.fetch(
        `https://api.telegram.org/file/bot${this.botToken}/${filePath}`,
      );
      const bytes = Buffer.from(await image.arrayBuffer());
      if (!image.ok || bytes.length > 5 * 1024 * 1024 || !this.isJpeg(bytes))
        throw new Error('Image is unavailable or too large');
      const filename = `${randomUUID()}.jpg`;
      await mkdir(join(this.uploadsDir, 'promotions'), { recursive: true });
      await writeFile(join(this.uploadsDir, 'promotions', filename), bytes);
      await this.promotions.create({
        title: draft.title,
        description: draft.description,
        badge: draft.badge,
        validUntil: draft.validUntil,
        imagePath: `/api/uploads/promotions/${filename}`,
      });
      this.promotionDrafts.delete(chatId);
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `✅ <b>Акция опубликована</b>\n\n«${this.escapeHtml(draft.title)}» уже видна на странице акций сайта.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: '🏷 Открыть список акций', callback_data: 'promos_0' }],
            [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
          ],
        },
      });
    } catch (error) {
      this.logger.error('Promotion image upload failed', error as Error);
      await this.prompt(
        chatId,
        'Не удалось сохранить фото. Отправьте его ещё раз или используйте /cancel.',
      );
    }
  }

  private async prompt(chatId: number, text: string) {
    return this.sendTg('sendMessage', {
      chat_id: chatId,
      text: `${text}\n\n/cancel — отменить`,
    });
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
    for (const group of grouped) counts[group.status] = group._count._all;
    const upcoming = await this.prisma.booking.count({
      where: {
        archivedAt: null,
        status: { not: 'CANCELLED' },
        endDate: { gte: new Date() },
      },
    });
    await this.sendTg('sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: `📊 <b>Сводка</b>\n\n🔔 Новые заявки: <b>${counts.PENDING}</b>\n📅 Будущие заезды: <b>${upcoming}</b>\n✅ Подтверждено: <b>${counts.CONFIRMED}</b>\n❌ Отменено: <b>${counts.CANCELLED}</b>`,
    });
  }

  private async archiveFinishedBookings() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const result = await this.prisma.booking.updateMany({
      where: { archivedAt: null, endDate: { lt: today } },
      data: { archivedAt: new Date() },
    });
    if (result.count)
      this.logger.log(`Archived ${result.count} finished booking(s)`);
  }

  private async showBookingListMessage(
    chatId: number,
    kind: 'pending' | 'upcoming',
  ) {
    const where =
      kind === 'pending'
        ? { archivedAt: null, status: 'PENDING' as BookingStatus }
        : {
            archivedAt: null,
            status: { not: 'CANCELLED' as BookingStatus },
            endDate: { gte: new Date() },
          };
    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy:
        kind === 'pending' ? { createdAt: 'desc' } : { startDate: 'asc' },
      take: 8,
    });
    const heading = kind === 'pending' ? 'Новые заявки' : 'Ближайшие заезды';
    const rows = bookings.length
      ? bookings.map(
          (booking) =>
            `${this.statusEmoji(booking.status)} ${this.fmtDate(booking.startDate)}–${this.fmtDate(booking.endDate)} · ${this.escapeHtml(booking.customerName)}`,
        )
      : ['Нет записей.'];
    await this.sendTg('sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: `<b>${heading}</b>\n\n${rows.join('\n')}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть список', callback_data: `${kind}_0` }],
        ],
      },
    });
  }

  private async showHistory(
    chatId: number,
    messageId?: number,
    requestedPage = 0,
  ) {
    await this.archiveFinishedBookings();
    const bookings = await this.prisma.booking.findMany({
      where: { OR: [{ archivedAt: { not: null } }, { status: 'CANCELLED' }] },
      orderBy: [{ archivedAt: 'desc' }, { endDate: 'desc' }],
    });
    if (!bookings.length) {
      const payload = {
        chat_id: chatId,
        text: '🧾 <b>История</b>\n\nЗавершённых и отменённых заявок пока нет.',
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
          ],
        },
      };
      return messageId
        ? this.sendTg('editMessageText', { ...payload, message_id: messageId })
        : this.sendTg('sendMessage', payload);
    }
    const page = Math.max(0, Math.min(requestedPage, bookings.length - 1));
    const booking = bookings[page];
    const nav: { text: string; callback_data: string }[] = [];
    if (page) nav.push({ text: '◀️', callback_data: `history_${page - 1}` });
    if (page < bookings.length - 1)
      nav.push({ text: '▶️', callback_data: `history_${page + 1}` });
    const keyboard: any[][] = nav.length ? [nav] : [];
    keyboard.push(
      [
        {
          text: '🗑 Удалить навсегда',
          callback_data: `bookdelask_${booking.id}_${page}`,
        },
      ],
      [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
    );
    const payload = {
      chat_id: chatId,
      text: this.formatBookingCard(booking, {
        title: `🧾 История · ${page + 1} из ${bookings.length}`,
        withPhone: true,
      }),
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard },
    };
    return messageId
      ? this.sendTg('editMessageText', { ...payload, message_id: messageId })
      : this.sendTg('sendMessage', payload);
  }

  private async showBookingPage(
    chatId: number,
    messageId: number,
    kind: 'pending' | 'upcoming',
    requestedPage: number,
  ) {
    const where =
      kind === 'pending'
        ? { archivedAt: null, status: 'PENDING' as BookingStatus }
        : {
            archivedAt: null,
            status: { not: 'CANCELLED' as BookingStatus },
            endDate: { gte: new Date() },
          };
    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy:
        kind === 'pending' ? { createdAt: 'desc' } : { startDate: 'asc' },
    });
    const title = kind === 'pending' ? 'Новые заявки' : 'Ближайшие заезды';
    if (!bookings.length)
      return this.sendTg('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: `${kind === 'pending' ? '✨' : '📭'} <b>${title}</b>\n\n${kind === 'pending' ? 'Новых заявок нет.' : 'Предстоящих заездов нет.'}`,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
          ],
        },
      });
    const page = Math.max(0, Math.min(requestedPage, bookings.length - 1));
    const booking = bookings[page];
    const nav: { text: string; callback_data: string }[] = [];
    if (page) nav.push({ text: '◀️', callback_data: `${kind}_${page - 1}` });
    if (page < bookings.length - 1)
      nav.push({ text: '▶️', callback_data: `${kind}_${page + 1}` });
    const keyboard: any[][] = nav.length ? [nav] : [];
    keyboard.push(
      [
        {
          text: 'Открыть заявку',
          callback_data: `manage_${booking.id}_${kind}_${page}`,
        },
      ],
      [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
    );
    return this.sendTg('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      text: this.formatBookingCard(booking, {
        title: `${title} · ${page + 1} из ${bookings.length}`,
      }),
      reply_markup: { inline_keyboard: keyboard },
    });
  }

  private async showCalendar(chatId: number, messageId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        archivedAt: null,
        status: { not: 'CANCELLED' },
        endDate: { gte: new Date() },
      },
      orderBy: { startDate: 'asc' },
      take: 12,
    });
    const lines = bookings.length
      ? bookings.map(
          (booking) =>
            `${this.statusEmoji(booking.status)} ${this.fmtDate(booking.startDate)}–${this.fmtDate(booking.endDate)} · ${this.escapeHtml(booking.customerName)}`,
        )
      : ['Свободных бронирований пока нет.'];
    return this.sendTg('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      text: `🗓 <b>Занятые даты</b>\n\n${lines.join('\n')}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: '📅 Ближайшие заезды', callback_data: 'upcoming_0' }],
          [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
        ],
      },
    });
  }

  private async showPromotions(
    chatId: number,
    messageId?: number,
    requestedPage = 0,
  ) {
    const promos = await this.promotions.findAll();
    if (!promos.length) {
      const payload = {
        chat_id: chatId,
        text: '🏷 <b>Акции</b>\n\nСейчас на сайте нет акций. Добавьте первую — она сразу появится на странице «Акции».',
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '➕ Добавить акцию', callback_data: 'promo_new' }],
            [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
          ],
        },
      };
      return messageId
        ? this.sendTg('editMessageText', { ...payload, message_id: messageId })
        : this.sendTg('sendMessage', payload);
    }
    const page = Math.max(0, Math.min(requestedPage, promos.length - 1));
    const promo = promos[page];
    const nav: { text: string; callback_data: string }[] = [];
    if (page) nav.push({ text: '◀️', callback_data: `promos_${page - 1}` });
    if (page < promos.length - 1)
      nav.push({ text: '▶️', callback_data: `promos_${page + 1}` });
    const keyboard: any[][] = nav.length ? [nav] : [];
    keyboard.push(
      [{ text: '➕ Добавить акцию', callback_data: 'promo_new' }],
      [
        {
          text: '🗑 Удалить акцию',
          callback_data: `promodelask_${promo.id}_${page}`,
        },
      ],
      [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
    );
    const text = `🏷 <b>Акция ${page + 1} из ${promos.length}</b>\n\n<b>${this.escapeHtml(promo.title)}</b>${promo.badge ? ` · ${this.escapeHtml(promo.badge)}` : ''}\n${this.escapeHtml(promo.description)}\n\nСрок: ${this.escapeHtml(promo.validUntil)}`;
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard },
    };
    return messageId
      ? this.sendTg('editMessageText', { ...payload, message_id: messageId })
      : this.sendTg('sendMessage', payload);
  }

  private galleryCategoryLabel(category: GalleryCategory) {
    return {
      house: 'Дом снаружи',
      interior: 'Интерьер',
      territory: 'Территория',
      sauna: 'Баня',
    }[category];
  }

  private async showGalleryMenu(chatId: number, messageId?: number) {
    const grouped = await this.prisma.galleryImage.groupBy({
      by: ['category'],
      _count: { _all: true },
    });
    const counts = new Map(
      grouped.map((item) => [item.category, item._count._all]),
    );
    const categories: GalleryCategory[] = [
      'house',
      'interior',
      'territory',
      'sauna',
    ];
    const buttons = categories.map((category) => [
      {
        text: `${this.galleryCategoryLabel(category)} · ${counts.get(category) ?? 0}`,
        callback_data: `galcat_${category}`,
      },
    ]);
    const payload = {
      chat_id: chatId,
      parse_mode: 'HTML',
      text: '🖼 <b>Фотогалерея сайта</b>\n\nВыберите раздел, затем отправьте фотографию. Она сразу появится на сайте.\n\nДля удаления откройте нужный раздел.',
      reply_markup: {
        inline_keyboard: [
          ...buttons,
          [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
        ],
      },
    };
    return messageId
      ? this.sendTg('editMessageText', { ...payload, message_id: messageId })
      : this.sendTg('sendMessage', payload);
  }

  private async showGalleryCategory(
    chatId: number,
    messageId: number,
    category: GalleryCategory,
    requestedPage = 0,
  ) {
    const images = await this.prisma.galleryImage.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
    });
    const label = this.galleryCategoryLabel(category);
    if (!images.length) {
      return this.sendTg('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        text: `🖼 <b>${label}</b>\n\nВ этой категории пока нет загруженных фотографий.`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '➕ Загрузить фото',
                callback_data: `galnew_${category}`,
              },
            ],
            [{ text: '⬅️ К категориям', callback_data: 'gallery_menu' }],
          ],
        },
      });
    }
    const page = Math.max(0, Math.min(requestedPage, images.length - 1));
    const image = images[page];
    const nav: { text: string; callback_data: string }[] = [];
    if (page)
      nav.push({
        text: '◀️',
        callback_data: `galpage_${category}_${page - 1}`,
      });
    if (page < images.length - 1)
      nav.push({
        text: '▶️',
        callback_data: `galpage_${category}_${page + 1}`,
      });
    const keyboard: any[][] = nav.length ? [nav] : [];
    keyboard.push(
      [{ text: '➕ Загрузить фото', callback_data: `galnew_${category}` }],
      [
        {
          text: '🗑 Удалить это фото',
          callback_data: `galdelask_${image.id}_${category}_${page}`,
        },
      ],
      [{ text: '⬅️ К категориям', callback_data: 'gallery_menu' }],
    );
    return this.sendTg('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      text: `🖼 <b>${label}</b> · ${page + 1} из ${images.length}\n\nФото добавлено ${this.fmtDate(image.createdAt)}.`,
      reply_markup: { inline_keyboard: keyboard },
    });
  }

  private async handleGalleryPhoto(chatId: number, photos: Photo[]) {
    const draft = this.galleryDrafts.get(chatId);
    if (!draft) return;
    const photo = photos[photos.length - 1];
    if (photo.file_size && photo.file_size > 5 * 1024 * 1024)
      return this.prompt(chatId, 'Файл больше 5 МБ. Отправьте фото поменьше.');
    try {
      const fileResponse = await this.sendTg('getFile', {
        file_id: photo.file_id,
      });
      const fileData =
        await this.readTelegramResponse<TelegramFileResult>(fileResponse);
      const filePath = fileData.result?.file_path;
      if (!fileData.ok || !filePath)
        throw new Error('Telegram did not return a file path');
      const image = await global.fetch(
        `https://api.telegram.org/file/bot${this.botToken}/${filePath}`,
      );
      const bytes = Buffer.from(await image.arrayBuffer());
      if (!image.ok || bytes.length > 5 * 1024 * 1024 || !this.isJpeg(bytes))
        throw new Error('Image is unavailable or too large');
      const filename = `${randomUUID()}.jpg`;
      await mkdir(join(this.uploadsDir, 'gallery'), { recursive: true });
      await writeFile(join(this.uploadsDir, 'gallery', filename), bytes);
      await this.gallery.create(
        draft.category,
        `/api/uploads/gallery/${filename}`,
      );
      this.galleryDrafts.delete(chatId);
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `✅ Фото добавлено в раздел «${this.galleryCategoryLabel(draft.category)}» и уже видно в галерее сайта.`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🖼 Управлять фото',
                callback_data: `galcat_${draft.category}`,
              },
            ],
          ],
        },
      });
    } catch (error) {
      this.logger.error('Gallery image upload failed', error as Error);
      await this.prompt(
        chatId,
        'Не удалось сохранить фото. Отправьте его ещё раз или используйте /cancel.',
      );
    }
  }

  private async handleCallbackQuery(callback: TelegramCallback) {
    const { data } = callback;
    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const answer = (text?: string) =>
      this.sendTg('answerCallbackQuery', {
        callback_query_id: callback.id,
        text,
      });
    if (!this.adminChatIds.includes(String(chatId)))
      return answer('Доступ ограничен');
    try {
      if (data === 'back_to_menu') {
        await answer();
        return this.showAdminMenu(chatId, messageId);
      }
      if (data === 'view_stats') {
        await answer();
        return this.sendStatsMessage(chatId);
      }
      if (data === 'calendar') {
        await answer();
        return this.showCalendar(chatId, messageId);
      }
      if (data === 'gallery_menu') {
        await answer();
        return this.showGalleryMenu(chatId, messageId);
      }
      if (data.startsWith('history_')) {
        await answer();
        return this.showHistory(chatId, messageId, Number(data.split('_')[1]));
      }
      if (data.startsWith('galcat_')) {
        await answer();
        return this.showGalleryCategory(
          chatId,
          messageId,
          data.split('_')[1] as GalleryCategory,
        );
      }
      if (data.startsWith('galpage_')) {
        const [, category, page] = data.split('_');
        await answer();
        return this.showGalleryCategory(
          chatId,
          messageId,
          category as GalleryCategory,
          Number(page),
        );
      }
      if (data.startsWith('galnew_')) {
        const category = data.split('_')[1] as GalleryCategory;
        this.galleryDrafts.set(chatId, { category });
        await answer();
        return this.prompt(
          chatId,
          `Отправьте фото для раздела «${this.galleryCategoryLabel(category)}». Максимум 5 МБ.`,
        );
      }
      if (data.startsWith('galdelask_')) {
        const [, id, category, page] = data.split('_');
        await answer();
        return this.sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: 'Удалить это фото из галереи сайта? Это действие нельзя отменить.',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Да, удалить',
                  callback_data: `galdel_${id}_${category}_${page}`,
                },
                {
                  text: 'Не удалять',
                  callback_data: `galpage_${category}_${page}`,
                },
              ],
            ],
          },
        });
      }
      if (data.startsWith('galdel_')) {
        const [, id, category, page] = data.split('_');
        const image = await this.gallery.findOne(id);
        if (!image) {
          await answer('Фото уже удалено');
          return this.showGalleryCategory(
            chatId,
            messageId,
            category as GalleryCategory,
            0,
          );
        }
        await this.gallery.remove(id);
        const filename = image.imagePath.split('/').pop();
        if (filename)
          await unlink(join(this.uploadsDir, 'gallery', filename)).catch(
            () => undefined,
          );
        await answer('Фото удалено');
        return this.showGalleryCategory(
          chatId,
          messageId,
          category as GalleryCategory,
          Number(page),
        );
      }
      if (data.startsWith('pending_')) {
        await answer();
        return this.showBookingPage(
          chatId,
          messageId,
          'pending',
          Number(data.split('_')[1]),
        );
      }
      if (data.startsWith('upcoming_')) {
        await answer();
        return this.showBookingPage(
          chatId,
          messageId,
          'upcoming',
          Number(data.split('_')[1]),
        );
      }
      if (data.startsWith('promos_')) {
        await answer();
        return this.showPromotions(
          chatId,
          messageId,
          Number(data.split('_')[1]),
        );
      }
      if (data.startsWith('bookdelask_')) {
        const [, id, page] = data.split('_');
        await answer();
        return this.sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: 'Удалить эту запись из истории навсегда? Вернуть её будет нельзя.',
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Да, удалить', callback_data: `bookdel_${id}_${page}` },
                { text: 'Не удалять', callback_data: `history_${page}` },
              ],
            ],
          },
        });
      }
      if (data.startsWith('bookdel_')) {
        const [, id, page] = data.split('_');
        await this.prisma.booking.delete({ where: { id } });
        await answer('Запись удалена');
        return this.showHistory(chatId, messageId, Number(page));
      }
      if (data === 'promo_new') {
        this.promotionDrafts.set(chatId, { step: 'title' });
        await answer();
        return this.prompt(
          chatId,
          'Новая акция. Отправьте её короткое название.',
        );
      }
      if (data.startsWith('promodelask_')) {
        const [, id, page] = data.split('_');
        await answer();
        return this.sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: 'Удалить эту акцию с сайта? Это действие нельзя отменить.',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Да, удалить',
                  callback_data: `promodel_${id}_${page}`,
                },
                { text: 'Не удалять', callback_data: `promos_${page}` },
              ],
            ],
          },
        });
      }
      if (data.startsWith('promodel_')) {
        const [, id, page] = data.split('_');
        const promo = await this.promotions.findOne(id);
        if (!promo) {
          await answer('Акция уже удалена');
          return this.showPromotions(chatId, messageId, 0);
        }
        await this.promotions.remove(id);
        const filename = promo.imagePath.split('/').pop();
        if (filename)
          await unlink(join(this.uploadsDir, 'promotions', filename)).catch(
            () => undefined,
          );
        await answer('Акция удалена');
        return this.showPromotions(chatId, messageId, Number(page));
      }
      if (data.startsWith('manage_')) {
        const [, id, source, page] = data.split('_');
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking) {
          await answer('Заявка не найдена');
          return this.showBookingPage(
            chatId,
            messageId,
            source === 'pending' ? 'pending' : 'upcoming',
            Number(page),
          );
        }
        const buttons: any[][] = [
          [
            { text: '📞 Позвонить', url: `tel:${booking.phone}` },
            {
              text: '💬 WhatsApp',
              url: `https://wa.me/${booking.phone.replace(/\D/g, '')}`,
            },
          ],
        ];
        if (booking.status === 'PENDING')
          buttons.push([
            { text: '✅ Подтвердить', callback_data: `approve_${id}` },
            { text: 'Отменить', callback_data: `cancelask_${id}` },
          ]);
        else if (booking.status === 'CONFIRMED')
          buttons.push([
            { text: 'Отменить бронь', callback_data: `cancelask_${id}` },
          ]);
        buttons.push([
          { text: '⬅️ К списку', callback_data: `${source}_${page}` },
        ]);
        await answer();
        return this.sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'HTML',
          text: this.formatBookingCard(booking, {
            title: 'Заявка',
            withPhone: true,
          }),
          reply_markup: { inline_keyboard: buttons },
        });
      }
      if (data.startsWith('cancelask_')) {
        const id = data.split('_')[1];
        await answer();
        return this.sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          text: 'Отменить бронирование? Даты снова станут доступны на сайте.',
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Да, отменить', callback_data: `cancel_${id}` },
                {
                  text: 'Не отменять',
                  callback_data: `manage_${id}_upcoming_0`,
                },
              ],
            ],
          },
        });
      }
      if (data.startsWith('approve_') || data.startsWith('cancel_')) {
        const [action, id] = data.split('_');
        const status: BookingStatus =
          action === 'approve' ? 'CONFIRMED' : 'CANCELLED';
        const booking = await this.prisma.booking.update({
          where: { id },
          data: { status },
        });
        await answer(status === 'CONFIRMED' ? 'Подтверждено' : 'Отменено');
        return this.sendTg('editMessageText', {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'HTML',
          text: this.formatBookingCard(booking, {
            title:
              status === 'CONFIRMED'
                ? '✅ Бронирование подтверждено'
                : '❌ Бронирование отменено',
            withPhone: true,
          }),
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎛 В меню', callback_data: 'back_to_menu' }],
            ],
          },
        });
      }
    } catch (error) {
      this.logger.error('Telegram callback error', error as Error);
      await answer('Не удалось выполнить действие');
    }
  }

  private async sendTg(method: string, body: unknown) {
    const response = await global.fetch(
      `https://api.telegram.org/bot${this.botToken}/${method}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok)
      throw new Error(`Telegram ${method} returned ${response.status}`);
    return response;
  }
}
