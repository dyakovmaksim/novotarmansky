// Контент для страницы /photos. Чтобы добавить новые фото — добавьте файл
// в frontend/public/images/ и пропишите путь + категорию здесь.

export interface PhotoCategory {
  id: string;
  name: string;
}

export interface Photo {
  src: string;
  category: string; // id одной из PHOTO_CATEGORIES (кроме "all")
}

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  { id: "all", name: "Все" },
  { id: "house", name: "Дом" },
  { id: "yard", name: "Двор" },
  { id: "kitchen", name: "Кухня" },
  { id: "bedroom", name: "Спальни" },
  { id: "hall", name: "Зал" },
  { id: "bbq", name: "Мангал" },
];

export const PHOTOS: Photo[] = [
  { src: "/images/house.jpg", category: "house" },
  { src: "/images/yard-1.jpg", category: "yard" },
  { src: "/images/kitchen-1.jpg", category: "kitchen" },
  { src: "/images/bedroom-1.jpg", category: "bedroom" },
  { src: "/images/hall-1.jpg", category: "hall" },
  { src: "/images/bbq-1.jpg", category: "bbq" },
];
