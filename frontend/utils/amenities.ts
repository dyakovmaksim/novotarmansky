// Контент для секции «Что внутри» на главной.
// ВАЖНО: значения с пометкой PLACEHOLDER замените на реальные данные дома.

// Ключевые цифры — выводятся крупно вверху секции.
export interface HighlightStat {
  value: string;
  label: string;
}

export const HOUSE_STATS: HighlightStat[] = [
  { value: "до 8", label: "гостей" }, // PLACEHOLDER — реальная вместимость
  { value: "2", label: "спальни" }, // PLACEHOLDER
  { value: "120 м²", label: "площадь" }, // PLACEHOLDER
  { value: "круглый год", label: "приём гостей" },
];

// Удобства. icon — имя авто-импортируемого Icon*-компонента (см. components/).
export interface Amenity {
  icon: string;
  title: string;
  desc: string;
}

export const AMENITIES: Amenity[] = [
  {
    icon: "IconWifi",
    title: "Wi-Fi",
    desc: "Быстрый интернет по всему дому", // PLACEHOLDER — уточните скорость/покрытие
  },
  {
    icon: "IconUtensils",
    title: "Кухня",
    desc: "Полностью оборудована: плита, холодильник, посуда",
  },
  {
    icon: "IconFlame",
    title: "Русская баня",
    desc: "Настоящая баня на дровах — заказывается при бронировании",
  },
];
