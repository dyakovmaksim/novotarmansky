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
    display: "+7 (932) 050-00-58",
    href: "tel:+79320500058",
  },

  email: {
    label: "Email",
    value: "", // Publish only a verified email address.
    href: "",
  },

  workHours: {
    label: "Приём звонков",
    value: "09:00 — 19:00",
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
      href: "https://t.me/NOVOTARMANSKIY_HOUSE",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      short: "WA",
      href: "https://wa.me/79320500058",
    },
    {
      id: "vk",
      label: "ВКонтакте",
      short: "VK",
      href: "https://vk.com/novo_house_arenda_doma_tmn",
    },
  ],

  legal: {
    company: "", // Await verified owner details.
    inn: "",
    ogrnip: "",
  },

  // ID карты из Яндекс.Конструктора карт (https://yandex.ru/map-constructor).
  // Это длинная строка после "constructor:" в коде вставки, которую даёт Яндекс.
  // Значение взято из готовой карты, уже встроенной на главной (LocationSection).
  yandexMapId:
    "6b6abf998c508a3928ec2bde98c8011f402be7e5a6b1f8cdfeede9111f737bc6",
};
