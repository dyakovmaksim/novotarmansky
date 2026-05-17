import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
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
export class BookingsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  private readonly botToken = '8213887319:AAGbzdWmj8hjXGepybyjJeqJBp09vsLDZjM';
  private readonly adminChatId = '392220382';
  private lastUpdateId = 0;

  onModuleInit() {
    this.startTelegramListener();
  }

  // --- ЭНДПОИНТЫ ДЛЯ САЙТА (REST API) ---

  // Создание бронирования на сайте NUXT (POST /bookings)
  async create(createBookingDto: any) {
    const houseId = createBookingDto.houseId;
    const startDate = new Date(createBookingDto.startDate);
    const endDate = new Date(createBookingDto.endDate);

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        houseId: houseId,
        OR: [
          { startDate: { lte: startDate }, endDate: { gte: startDate } },
          { startDate: { lte: endDate }, endDate: { gte: endDate } },
          { startDate: { gte: startDate }, endDate: { lte: endDate } },
        ],
      },
    });

    if (conflictingBooking) {
      throw new ConflictException(
        'Этот дом уже забронирован на выбранные даты.',
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        houseId,
        customerName: createBookingDto.customerName,
        phone: createBookingDto.phone,
        startDate,
        endDate,
      },
      include: { house: true },
    });

    this.sendTelegramNotification(booking).catch((err) =>
      console.error('Ошибка отправки в TG:', err),
    );

    return booking;
  }

  // Получить все бронирования (GET /bookings)
  async findAll() {
    return this.prisma.booking.findMany({ include: { house: true } });
  }

  // Получить одну бронь по ID (GET /bookings/:id)
  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { house: true },
    });
  }

  // Получить бронирования конкретного дома (GET /bookings/house/:houseId)
  async findByHouseId(houseId: string) {
    return this.prisma.booking.findMany({ where: { houseId } });
  }

  // Удалить бронь через API (DELETE /bookings/:id)
  async remove(id: string) {
    return this.prisma.booking.delete({ where: { id } });
  }

  // Обновить бронь через API (PATCH /bookings/:id)
  async update(id: string, updateBookingDto: any) {
    const updateData: any = { ...updateBookingDto };
    if (updateBookingDto.startDate)
      updateData.startDate = new Date(updateBookingDto.startDate);
    if (updateBookingDto.endDate)
      updateData.endDate = new Date(updateBookingDto.endDate);
    return this.prisma.booking.update({ where: { id }, data: updateData });
  }

  // --- ЛОГИКА TELEGRAM БОТА ---

  // Уведомление в ТГ при оформлении на фронтенде
  private async sendTelegramNotification(booking: any) {
    const startStr = new Date(booking.startDate).toLocaleDateString('ru-RU');
    const endStr = new Date(booking.endDate).toLocaleDateString('ru-RU');

    const text = `
🔔 *НОВОЕ БРОНИРОВАНИЕ!*

🏠 *Дом:* ${booking.house.title}
👤 *Гость:* ${booking.customerName}
📞 *Телефон:* \`${booking.phone}\`
📅 *Период:* ${startStr} — ${endStr}
💰 *Сумма:* ${booking.house.pricePerNight} ₽
    `;

    await this.sendTg('sendMessage', {
      chat_id: this.adminChatId,
      text: text,
      parse_mode: 'Markdown',
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

  // Слушатель лонг-поллинга Telegram
  private async startTelegramListener() {
    console.log('🤖 Telegram Бот-слушатель успешно запущен...');

    while (true) {
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
        console.error('Ошибка в цикле опроса Telegram:', error);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Текстовые команды
  private async handleTextMessage(message: any) {
    const text: string = message.text;
    const chatId: number = message.chat.id;

    if (String(chatId) !== this.adminChatId) return;

    if (text === '/admin' || text === '🎛 Меню') {
      await this.sendTg('sendMessage', {
        chat_id: chatId,
        text: '⚙️ *Панель управления бронированиями*\n\nВыберите интересующий раздел:',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '📅 Актуальные брони', callback_data: 'page_0' }],
            [{ text: '📊 Статистика базы', callback_data: 'view_stats' }],
          ],
        },
      });
    }
  }

  // Интерактивные inline-кнопки
  private async handleCallbackQuery(callbackQuery: any) {
    const data: string = callbackQuery.data;
    const chatId: number = callbackQuery.message.chat.id;
    const messageId: number = callbackQuery.message.message_id;

    console.log(`[TG BOT] Нажата кнопка с data: "${data}"`);

    const answer = async (msg?: string) => {
      await this.sendTg('answerCallbackQuery', {
        callback_query_id: callbackQuery.id,
        text: msg || undefined,
      });
    };

    try {
      switch (true) {
        // 1. Просмотр статистики системы
        case data === 'view_stats': {
          await answer('Загружаю статистику...');
          const count = await this.prisma.booking.count();
          await this.sendTg('sendMessage', {
            chat_id: chatId,
            text: `📊 *Статистика системы:*\n\nВсего бронирований в системе: *${count}*`,
            parse_mode: 'Markdown',
          });
          return;
        }

        // 2. Назад в главное меню админки
        case data === 'back_to_menu': {
          await answer();
          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: '⚙️ *Панель управления бронированиями*\n\nВыберите интересующий раздел:',
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '📅 Актуальные брони', callback_data: 'page_0' }],
                [{ text: '📊 Статистика базы', callback_data: 'view_stats' }],
              ],
            },
          });
          return;
        }

        // 3. Листалка бронирований (Пагинация страниц)
        case data.startsWith('page_'): {
          await answer();
          const page = parseInt(data.split('_')[1], 10);

          const allBookings = await this.prisma.booking.findMany({
            include: { house: true },
            orderBy: { startDate: 'asc' },
          });

          if (allBookings.length === 0) {
            await this.sendTg('editMessageText', {
              chat_id: chatId,
              message_id: messageId,
              text: '📭 Актуальных бронирований пока нет.',
            });
            return;
          }

          const total = allBookings.length;
          const currentPage = page >= total ? total - 1 : page < 0 ? 0 : page;
          const b = allBookings[currentPage];

          const start = new Date(b.startDate).toLocaleDateString('ru-RU');
          const end = new Date(b.endDate).toLocaleDateString('ru-RU');

          const cardText = `📅 *Бронирование ${currentPage + 1} из ${total}*\n\n🏠 *Дом:* ${b.house.title}\n👤 *Гость:* ${b.customerName}\n📅 *Даты:* ${start} — ${end}`;

          const navRow: any[] = [];
          if (currentPage > 0) {
            navRow.push({
              text: '◀️ Назад',
              callback_data: `page_${currentPage - 1}`,
            });
          }
          if (currentPage < total - 1) {
            navRow.push({
              text: 'Вперед ▶️',
              callback_data: `page_${currentPage + 1}`,
            });
          }

          const inlineKeyboard: any[][] = [];
          if (navRow.length > 0) {
            inlineKeyboard.push(navRow);
          }
          inlineKeyboard.push([
            {
              text: '⚙️ Управление этой бронью',
              callback_data: `manage_${b.id}_${currentPage}`,
            },
          ]);
          inlineKeyboard.push([
            { text: '🎛 Назад в главное меню', callback_data: 'back_to_menu' },
          ]);

          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: cardText,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: inlineKeyboard },
          });
          return;
        }

        // 4. Карточка управления конкретной бронью (Вход внутрь)
        case data.startsWith('manage_'): {
          await answer();

          const parts = data.split('_');
          const bId = parts[1];
          const pageIndex = parts[2] || '0';

          const b = await this.prisma.booking.findUnique({
            where: { id: bId },
            include: { house: true },
          });

          if (!b) {
            await this.sendTg('sendMessage', {
              chat_id: chatId,
              text: '❌ Бронирование уже удалено или не найдено в базе данных.',
            });
            return;
          }

          const start = new Date(b.startDate).toLocaleDateString('ru-RU');
          const end = new Date(b.endDate).toLocaleDateString('ru-RU');

          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: `🗂 *Управление бронированием*\n\n🏠 *Дом:* ${b.house.title}\n👤 *Клиент:* ${b.customerName}\n📞 *Тел:* \`${b.phone}\`\n📅 *Сроки:* ${start} — ${end}`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '📞 Позвонить гостю', url: `tel:${b.phone}` }],
                [
                  {
                    text: '🗑 Удалить бронь (Освободить даты)',
                    callback_data: `forcedel_${b.id}_${pageIndex}`,
                  },
                ],
                [
                  {
                    text: '⬅️ Вернуться к списку',
                    callback_data: `page_${pageIndex}`,
                  },
                ],
              ],
            },
          });
          return;
        }

        // 5. Полное удаление брони из подменю управления
        case data.startsWith('forcedel_'): {
          const parts = data.split('_');
          const bookingId = parts[1];
          const pageIndex = parseInt(parts[2], 10);

          await this.prisma.booking.delete({ where: { id: bookingId } });
          await answer('Бронь успешно удалена!');

          const allBookings = await this.prisma.booking.findMany({
            include: { house: true },
            orderBy: { startDate: 'asc' },
          });

          if (allBookings.length === 0) {
            await this.sendTg('editMessageText', {
              chat_id: chatId,
              message_id: messageId,
              text: '📭 Актуальных бронирований больше нет.',
            });
            return;
          }

          const targetPage =
            pageIndex >= allBookings.length
              ? allBookings.length - 1
              : pageIndex;
          const targetBooking = allBookings[targetPage];
          const start = new Date(targetBooking.startDate).toLocaleDateString(
            'ru-RU',
          );
          const end = new Date(targetBooking.endDate).toLocaleDateString(
            'ru-RU',
          );

          const navRow: any[] = [];
          if (targetPage > 0)
            navRow.push({
              text: '◀️ Назад',
              callback_data: `page_${targetPage - 1}`,
            });
          if (targetPage < allBookings.length - 1)
            navRow.push({
              text: 'Вперед ▶️',
              callback_data: `page_${targetPage + 1}`,
            });

          const inlineKeyboard: any[][] = [];
          if (navRow.length > 0) inlineKeyboard.push(navRow);
          inlineKeyboard.push([
            {
              text: '⚙️ Управление этой бронью',
              callback_data: `manage_${targetBooking.id}_${targetPage}`,
            },
          ]);
          inlineKeyboard.push([
            { text: '🎛 Назад в главное меню', callback_data: 'back_to_menu' },
          ]);

          await this.sendTg('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: `📅 *Бронирование ${targetPage + 1} из ${allBookings.length}*\n\n🏠 *Дом:* ${targetBooking.house.title}\n👤 *Гость:* ${targetBooking.customerName}\n📅 *Даты:* ${start} — ${end}`,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: inlineKeyboard },
          });
          return;
        }

        // 6. Кнопки быстрого ответа "Подтвердить" / "Отменить" из автоматических уведомлений в чате
        case data.startsWith('approve_') || data.startsWith('cancel_'): {
          const parts = data.split('_');
          const action = parts[0];
          const bookingId = parts[1];
          let responseText = '';

          if (action === 'approve') {
            responseText = '🟢 Бронирование успешно подтверждено менеджером!';
            await answer('Подтверждено!');
          } else if (action === 'cancel') {
            await this.prisma.booking.delete({ where: { id: bookingId } });
            responseText = '🔴 Бронирование отменено. Даты освобождены!';
            await answer('Отменено!');
          }

          if (responseText) {
            const originalText = callbackQuery.message.text || '';
            await this.sendTg('editMessageText', {
              chat_id: chatId,
              message_id: messageId,
              text: `${originalText}\n\n⚠️ *СТАТУС:* ${responseText}`,
              parse_mode: 'Markdown',
            });
          }
          return;
        }
      }
    } catch (error) {
      console.error('❌ Ошибка обработки кнопки ТГ:', error);
      await answer('Произошла внутренняя ошибка!');
    }
  }

  private async sendTg(method: string, body: any) {
    const url = `https://api.telegram.org/bot${this.botToken}/${method}`;
    return global.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
