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
    title: "Баня в подарок",
    description:
      "Забронируйте дом на двое суток в выходные и получите 2 часа настоящей русской бани совершенно бесплатно.",
    image: "/images/sauna.png",
    badge: "Подарок",
    date: "бессрочно",
  },
  {
    title: "Для именинников",
    description:
      "Дарим праздничную скидку 10% в день рождения и неделю после него. Отметьте важную дату на природе!",
    image: "/images/carousel/carousel1.jpg",
    badge: "Скидка",
    date: "круглый год",
  },
];
