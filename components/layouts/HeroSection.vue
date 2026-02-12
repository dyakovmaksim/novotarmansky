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

  /* ========= АДАПТИВ ========= */

  @media (max-width: 1024px) {
    height: 260px;

    &__text {
      font-size: 20px;
    }

    &__btn {
      font-size: 15px;
      padding: 10px 18px;
    }
  }

  @media (max-width: 768px) {
    height: 220px;

    &__text {
      font-size: 18px;
    }

    &__btn {
      font-size: 14px;
      padding: 10px 16px;
    }

    /* Уменьшаем bottom на мобильных */
    &__card {
      bottom: -60px; /* Поднимем карточку */
      left: auto;
      transform: none;
      inset-inline: 20px; /* одинаковые поля слева/справа */
      max-width: none;
    }
  }

  @media (max-width: 480px) {
    height: 200px;

    &__text {
      font-size: 12px;
      margin-bottom: 8px;
    }

    &__card {
      max-width: 300px;
      padding: 12px;
      border-radius: 16px;
      bottom: -40px; /* Поднимаем карточку еще выше */
      left: 5%;
    }

    &__bg {
      border-radius: 0px 0px 50px 50px;
    }

    &__btn {
      width: 100px;
      height: 10px;
      border-radius: 8px;
      font-size: 10px;
      padding: 10px 0;
      text-align: center;
      white-space: normal;
    }

    .hero__buttons {
      display: flex;
      gap: 6px;
    }
  }
}
</style>
