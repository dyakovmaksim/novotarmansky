// Единый источник правды по контактам и реквизитам сайта.
// Импортируется через Nuxt auto-import — в любом .vue просто пиши CONTACT.
//
// ВАЖНО: значения с пометкой PLACEHOLDER нужно заменить на реальные.

export const CONTACT = {
  brand: {
    name: "novotarmanskiy",
    nameAccent: "house",
    tagline:
      "Сдаём не просто дом, а атмосферу спокойствия и уюта в 20 минутах от города. Ваш идеальный отдых начинается здесь.",
  },

  address: {
    label: "Адрес",
    value: "Тюменская область, пос. Новотарманский, ул. Янтарная, 143",
    short: "п. Новотарманский, ул. Янтарная, 143",
  },

  phone: {
    label: "Телефон",
    // PLACEHOLDER — замените на реальный номер. Формат для display и для href.
    display: "+7 (999) 000-00-00",
    href: "tel:+79990000000",
  },

  email: {
    label: "Email",
    value: "hello@novotarmansky.ru", // PLACEHOLDER
    href: "mailto:hello@novotarmansky.ru",
  },

  workHours: {
    label: "Приём звонков",
    value: "09:00 — 22:00",
  },

  checkIn: {
    label: "Заезд",
    value: "после 15:00",
  },

  checkOut: {
    label: "Выезд",
    value: "до 12:00",
  },

  // Соцсети и мессенджеры. id используется как key, short — для маленьких
  // кнопок в футере (2 буквы), label — для текстовых ссылок на странице контактов.
  socials: [
    {
      id: "telegram",
      label: "Telegram",
      short: "TG",
      href: "https://t.me/novotarmanskiy", // PLACEHOLDER
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      short: "WA",
      href: "https://wa.me/79990000000", // PLACEHOLDER
    },
    {
      id: "vk",
      label: "ВКонтакте",
      short: "VK",
      href: "https://vk.com/novotarmanskiy", // PLACEHOLDER
    },
  ],

  legal: {
    company: "ИП Иванов Иван Иванович", // PLACEHOLDER
    inn: "720000000000", // PLACEHOLDER
    ogrnip: "320000000000000", // PLACEHOLDER
  },

  // ID встроенной Яндекс-карты (constructor). Замените на свой.
  yandexMapId: "ВАШ_УНИКАЛЬНЫЙ_ID",
};
