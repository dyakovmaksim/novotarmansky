import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем локальное наполнение базы данных домиками...');

  // Очищаем старые записи
  await prisma.house.deleteMany({});

  // Добавляем новые дома
  const house1 = await prisma.house.create({
    data: {
      title: 'Малый Зеркальный Дом',
      description:
        'Уютный домик с панорамными зеркальными окнами в самом сердце леса. Идеально для пар.',
      pricePerNight: 5000.0,
    },
  });

  const house2 = await prisma.house.create({
    data: {
      title: 'Большой Семейный Шале',
      description:
        'Просторный двухэтажный дом с камином, большой верандой и зоной для барбекю. Вмещает всю семью.',
      pricePerNight: 12000.0,
    },
  });

  const house3 = await prisma.house.create({
    data: {
      title: 'A-Frame Loft',
      description:
        'Стильный треугольный дом-шалаш с дизайнерским интерьером и горячей купелью на улице.',
      pricePerNight: 8500.0,
    },
  });

  console.log('✅ База данных успешно заполнена тестовыми домами!');
  console.log({ house1, house2, house3 });
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при выполнении скрипта:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
