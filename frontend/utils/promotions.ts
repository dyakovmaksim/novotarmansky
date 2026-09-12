// Контент для страницы /promotion. Сюда добавляются акционные предложения.
// Чтобы убрать акцию — закомментируйте/удалите запись.

export interface Promotion {
  title: string;
  description: string;
  image: string;
  badge?: string;
  date: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    title: "Будни дешевле",
    description:
      "При бронировании дома с понедельника по четверг — скидка 20% на вторые сутки. Проведите время в тишине без суеты.",
    image: "/images/house.jpg",
    badge: "-20%",
    date: "до 01.06.2026",
  },
  {
    title: "Баня в подарок",
    description:
      "Забронируйте дом на двое суток в выходные и получите 2 часа настоящей русской бани совершенно бесплатно.",
    image: "/images/sauna.jpg",
    badge: "Подарок",
    date: "бессрочно",
  },
  {
    title: "Для именинников",
    description:
      "Дарим праздничную скидку 10% в день рождения и неделю после него. Отметьте важную дату на природе!",
    image: "/images/interior-wide.jpg",
    badge: "Скидка",
    date: "круглый год",
  },
];
