<template>
  <section class="hero-block">
    <div class="hero-block__bg">
      <img src="/images/house.jpg" alt="House" class="hero-block__img" />
      <div class="hero-block__overlay"></div>
    </div>

    <div class="hero-block__container">
      <div class="hero-block__card">
        <h1 class="hero-block__title">
          Добро пожаловать в <br>
          <span class="hero-block__brand">Novotarmanskiy house</span>
        </h1>
        <p class="hero-block__subtitle">
          Ваш идеальный выбор для аренды уютного дома в живописном уголке Тюмени
        </p>
        <div class="hero-block__actions">
          <NuxtLink to="/#photos" class="hero-block__btn hero-block__btn--white">
            Смотреть фото
          </NuxtLink>
          <NuxtLink to="/#booking" class="hero-block__btn hero-block__btn--primary">
            Бронировать
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// Используем максимально специфичные селекторы через теги, чтобы перебить main.scss
html body {
  .hero-block {
    position: relative;
    min-height: 85vh;
    display: flex;
    align-items: center;
    padding: 100px 0 60px;
    overflow: hidden;

    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      img {
        width: 100%; height: 100%;
        object-fit: cover;
        border-radius: 0 0 40px 40px;
      }
    }

    &__overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 0 0 40px 40px;
    }

    &__container {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    &__card {
      max-width: 580px;
      // ВАЖНО: Принудительная прозрачность даже на мобильных
      background: rgba(255, 255, 255, 0.15) !important;
      backdrop-filter: blur(15px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(15px) saturate(150%) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      padding: 40px;
      border-radius: 30px;
      color: #ffffff !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    &__title { font-size: 32px; line-height: 1.2; margin-bottom: 15px; }
    &__brand { font-weight: 700; }
    &__subtitle { font-size: 17px; margin-bottom: 30px; opacity: 0.9; }

    &__actions {
      display: flex;
      gap: 15px;
    }

    &__btn {
      flex: 1;
      padding: 16px;
      border-radius: 100px !important; // Овальные кнопки
      text-align: center;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;

      &--white {
        background: #fff !important;
        color: #3d2c17 !important;
      }
      &--primary {
        background: #b9946e !important;
        color: #fff !important;
      }
    }
  }

  // Адаптив для маленьких экранов
  @media (max-width: 768px) {
    .hero-block {
      padding-top: 80px;
      &__card {
        padding: 30px 20px;
        margin: 0 10px;
        // Если хочешь оставить прозрачность и на мобилках:
        background: rgba(0, 0, 0, 0.4) !important; 
      }
      &__actions { flex-direction: column; }
      &__btn { width: 100%; }
    }
  }
}
</style>