export interface Photo {
  src: string;
  category: string;
  alt: string;
}
export const PHOTO_CATEGORIES = [
  { id: "all", name: "Все фотографии" },
  { id: "house", name: "Дом и участок" },
  { id: "kitchen", name: "Кухня-гостиная" },
  { id: "sauna", name: "Баня" },
];
export const PHOTOS: Photo[] = [
  {
    src: "/images/carousel/carousel2.jpg",
    category: "house",
    alt: "Дом, терраса и крытая мангальная зона",
  },
  {
    src: "/images/carousel/carousel1.jpg",
    category: "kitchen",
    alt: "Кухня-гостиная с обеденным столом",
  },
  {
    src: "/images/sauna.png",
    category: "sauna",
    alt: "Русская баня на участке",
  },
  {
    src: "/images/carousel/carousel4.jpg",
    category: "sauna",
    alt: "Комната отдыха с видом на участок",
  },
  {
    src: "/images/house.jpg",
    category: "house",
    alt: "Вид на дом со стороны улицы",
  },
];
