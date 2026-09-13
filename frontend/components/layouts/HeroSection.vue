<template>
  <section class="hero-block">
    <div class="hero-block__bg">
      <NuxtImg
        src="/images/house.jpg"
        alt="Загородный дом Novotarmanskiy house с баней в посёлке Новотарманский под Тюменью"
        class="hero-block__img"
        width="2000"
        format="webp"
        quality="78"
        loading="eager"
        fetchpriority="high"
        preload
      />
      <div class="hero-block__overlay"></div>
    </div>

    <div class="hero-block__container">
      <div class="hero-block__card">
        <h1 class="hero-block__title">
          Добро пожаловать в <br>
          <span class="hero-block__brand">Novotarmanskiy house</span>
        </h1>
        <p class="hero-block__subtitle">
          Снять уютный загородный дом с баней посуточно — в 20 минутах от Тюмени, посёлок Новотарманский
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
    min-height: min(760px, 88svh);
    display: flex;
    align-items: center;
    padding: 112px 0 80px;
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
      max-width: var(--content-width);
      margin: 0 auto;
      padding: 0 var(--gutter);
    }

    &__card {
      max-width: 580px;
      // ВАЖНО: Принудительная прозрачность даже на мобильных
      background: rgba(255, 255, 255, 0.15) !important;
      backdrop-filter: blur(15px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(15px) saturate(150%) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      padding: clamp(28px, 4vw, 44px);
      border-radius: 30px;
      color: #ffffff !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    &__title { font-size: clamp(30px, 3.2vw, 44px); line-height: 1.12; letter-spacing: -0.02em; margin-bottom: 16px; }
    &__brand { font-weight: 700; }
    &__subtitle { max-width: 49ch; font-size: 17px; line-height: 1.55; margin-bottom: 32px; opacity: 0.92; }

    &__actions {
      display: flex;
      gap: 12px;
    }

    &__btn {
      flex: 1;
      min-height: 52px;
      padding: 14px 20px;
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
      min-height: 680px;
      padding: 104px 0 48px;
      &__card {
        padding: 28px 24px;
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
