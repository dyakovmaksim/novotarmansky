<template>
  <section class="hero">
    <img src="/images/house.jpg" alt="Дом" class="hero__bg" />
    <div class="hero__content">
      <div class="hero__card">
        <div class="hero__text">
          Добро пожаловать в Novotarmanskiy house <br />
          – ваш идеальный выбор для аренды уютного дома в живописном
          уголке Тюмени!
        </div>
        <div class="hero__buttons">
          <NuxtLink to="/#photos" class="hero__btn hero__btn--white"
            >Смотреть фото</NuxtLink
          >
          <NuxtLink to="/#booking" class="hero__btn hero__btn--beige"
            >Бронировать</NuxtLink
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  width: 100%;
  height: 360px;
  background: #fff;
  border-bottom-right-radius: 48px;
  overflow: visible;
  display: flex;
  align-items: flex-end;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 55%;
    border-radius: 0 0 161px 161px;
    z-index: 0;
  }

  &__content {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    display: flex;
    z-index: 1;
  }

  &__card {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -140px;
    z-index: 2;
    background: var(--primary);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
    display: flex;
    width: fit-content;
    flex-direction: column;
    align-items: flex-start;

    max-width: 830px;
    min-width: 320px;
  }

  &__text {
    color: #fff;
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 20px;
  }

  &__buttons {
    display: flex;
    gap: 16px;
  }

  &__btn {
    padding: 10px 16px;
    border-radius: 16px;
    font-size: 20px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: 0.3s;

    &--white {
      background: var(--primary);
      color: white;
      border: 2px solid white;
      &:hover {
        scale: 1.05;
      }
    }
    &--beige {
      background: white;
      color: var(--primary);
      border: 2px solid var(--primary);
      &:hover {
        scale: 1.05;
      }
    }
  }
}
</style>
