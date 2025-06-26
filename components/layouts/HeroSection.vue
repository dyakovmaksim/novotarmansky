<template>
  <section class="hero">
    <img src="/images/house.jpg" alt="Дом" class="hero__bg" />
    <div class="hero__content">
      <div class="hero__card">
        <div class="hero__text">
          Добро пожаловать в Novotarmanskiy house<br />
          – ваш идеальный выбор для аренды уютного дома в живописном уголке
          Тюмени!
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
  min-height: 280px;
  background: #fff;
  border-bottom-right-radius: 48px;
  display: flex;
  align-items: flex-end;
}

.hero__bg {
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

.hero__content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  z-index: 1;
  display: flex;
}

.hero__card {
  position: absolute;
  left: 50%;
  bottom: -60px;
  transform: translateX(-50%);
  background: var(--primary);
  border-radius: 30px;
  padding: 12px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: calc(100% - 32px);
  max-width: 320px;
  z-index: 2;
}

.hero__text {
  color: #fff;
  font-size: 16px;
  margin-bottom: 12px;
}

.hero__buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.hero__btn {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transition: transform 0.3s;
}

.hero__btn:hover {
  transform: scale(1.05);
}

.hero__btn--white {
  background: var(--primary);
  color: #fff;
  border: 2px solid #fff;
}

.hero__btn--beige {
  background: #fff;
  color: var(--primary);
  border: 2px solid var(--primary);
}

@media (min-width: 576px) {
  .hero {
    min-height: 200px;
  }

  .hero__bg {
    border-radius: 0 0 60px 60px;
  }

  .hero__card {
    bottom: -80px;
    padding: 16px;
    max-width: 480px;
  }
  .hero__text {
    font-size: 18px;
    margin-bottom: 14px;
  }
  .hero__buttons {
    flex-direction: row;
    gap: 12px;
    width: auto;
  }
  .hero__btn {
    width: auto;
    font-size: 16px;
    padding: 8px 16px;
  }
}

@media (min-width: 768px) {
  .hero {
    min-height: 420px;
  }

  .hero__card {
    bottom: -100px;
    padding: 20px;
    max-width: 600px;
  }
  .hero__text {
    font-size: 24px;
  }
  .hero__btn {
    font-size: 18px;
    padding: 10px 20px;
  }
}

@media (min-width: 1024px) {
  .hero {
    min-height: 480px;
  }
  .hero__card {
    bottom: -140px;
    padding: 24px;
    max-width: 830px;
  }
  .hero__text {
    font-size: 32px;
  }
  .hero__btn {
    font-size: 20px;
    padding: 12px 24px;
  }
}
</style>
