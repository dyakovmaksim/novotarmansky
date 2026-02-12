<template>
  <section class="hero" role="region" aria-label="Главный баннер">
    <img src="/images/house.jpg" alt="Дом" class="hero__bg" />
    <div class="hero__content">
      <div class="hero__card">
        <div class="hero__text">
          Добро пожаловать в Novotarmanskiy house <br />
          – ваш идеальный выбор для аренды уютного дома в живописном уголке
          Тюмени!
        </div>
        <div class="hero__buttons">
          <NuxtLink to="/#photos" class="hero__btn hero__btn--white">
            Смотреть фото
          </NuxtLink>
          <NuxtLink to="/#booking" class="hero__btn hero__btn--beige">
            Бронировать
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  width: 100%;
  height: 300px;
  background: #fff;
  border-bottom-right-radius: 30px;
  display: flex;
  align-items: flex-end;
  overflow: visible;
  margin-bottom: 120px;

  /* Градиент */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 0 0 60px 60px;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 70%,
      rgba(0, 0, 0, 0) 100%
    );
    z-index: 1;
    pointer-events: none;
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 55%;
    border-radius: 0 0 60px 60px;
    z-index: 0;
    user-select: none;
  }

  &__content {
    position: relative;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    z-index: 2;
    padding: 0 20px;
    justify-content: flex-start;
    box-sizing: border-box;
  }

  &__card {
    position: absolute;
    bottom: -100px;
    left: 35%;
    transform: translateX(-50%);
    background: var(--primary);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    min-width: 280px;
    box-sizing: border-box;
  }

  &__text {
    color: #fff;
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 15px;
    line-height: 1.3;
    user-select: none;
  }

  &__buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
  }

  &__btn {
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    white-space: nowrap;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:focus-visible {
      outline: 3px solid #fff;
      outline-offset: 2px;
    }

    &--white {
      background: var(--primary);
      color: #fff;
      border: 2px solid #fff;

      &:hover,
      &:focus {
        transform: scale(1.05);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
      }
    }

    &--beige {
      background: #fff;
      color: var(--primary);
      border: 2px solid var(--primary);

      &:hover,
      &:focus {
        transform: scale(1.05);
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

 /* ========= АДАПТИВ (Исправленный) ========= */

@media (max-width: 1024px) {
  height: 320px; // Немного увеличим высоту фона для баланса

  &__card {
    max-width: 700px;
    left: 50%; // Центрируем для порядка
    transform: translateX(-50%);
  }

  &__text {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  height: 280px;
  margin-bottom: 120px;

  &::after, &__bg {
    border-radius: 0 0 40px 40px; // Смягчаем радиус
  }

  &__card {
    bottom: -80px;
    width: calc(100% - 40px); // Оставляем поля по бокам
    max-width: 600px;
    padding: 20px;
  }

  &__text {
    font-size: 18px;
    br { display: none; } // Убираем перенос строки из HTML на мобильных
  }

  &__btn {
    flex: 1; // Кнопки делят пространство поровну
    font-size: 15px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  height: 240px;
  margin-bottom: 120px;

  &::after, &__bg {
    border-radius: 0 0 30px 30px;
  }

  &__card {
    bottom: -70px;
    padding: 16px;
    border-radius: 16px;
  }

  &__text {
    font-size: 15px; // 12px было слишком мелко
    margin-bottom: 12px;
    text-align: center; // Центровка текста для красоты
  }

  &__buttons {
    gap: 8px;
    flex-direction: column; // На совсем узких экранах кнопки лучше ставить друг под друга
  }

  &__btn {
    width: 100%; // Кнопки на всю ширину карточки
    height: auto; // Убрал фиксированные 10px
    font-size: 14px;
    padding: 10px 0;
  }
}

/* Фикс для очень маленьких экранов (iPhone SE) */
@media (max-width: 350px) {
  &__text {
    font-size: 14px;
  }
  
  &__card {
    bottom: -85px; // Чуть ниже, так как текст может занять больше строк
  }
}
}
</style>
