<template>
  <section class="house-hero">
    <div class="house-hero__layout site-container">
      <div class="house-hero__copy">
        <p class="hero-location">Новотарманский · 20 минут от Тюмени</p>
        <h1>Выходные за городом.<br >В своём ритме.</h1>
        <p class="hero-description">
          Дом целиком, русская баня и вечера у мангала. Соберите близких — и
          устройте себе маленький отпуск.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/#booking" class="button">Выбрать даты</NuxtLink
          ><NuxtLink to="/photos" class="button button--secondary"
            >Посмотреть дом</NuxtLink
          >
        </div>
        <p class="hero-price">
          <strong
            >От
            {{
              Number(config.public.house.pricePerNight).toLocaleString("ru-RU")
            }}
            ₽</strong
          >
          за ночь · заявка напрямую хозяину
        </p>
      </div>
      <div class="house-hero__photo">
        <NuxtImg
          src="/images/carousel/carousel2.jpg"
          alt="Дом с террасой и крытой мангальной зоной в Новотарманском"
          width="1200"
          height="1150"
          format="webp"
          quality="82"
          loading="eager"
          fetchpriority="high"
        />
        <span class="hero-photo-note"
          >Весь дом — только для вашей компании</span
        >
      </div>
    </div>
    <div class="hero-facts site-container">
      <span>2 спальни</span><span>Кухня-гостиная</span
      ><span>Баня на участке</span><span>Заезд с 15:00</span>
    </div>
  </section>
</template>
<script setup>
const config = useRuntimeConfig();
</script>
<style scoped>
.house-hero {
  padding-top: 112px;
  background: var(--surface);
}
.house-hero__layout {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 48px;
  align-items: center;
}
.house-hero__copy {
  padding: 32px 0;
}
.hero-location {
  color: var(--muted);
  font-size: 15px;
  margin-bottom: 24px;
}
h1 {
  font-size: clamp(38px, 4.3vw, 62px);
  font-weight: 600;
  line-height: 1.07;
  letter-spacing: -0.045em;
}
.hero-description {
  font-size: 18px;
  color: var(--muted);
  line-height: 1.65;
  margin: 28px 0;
  max-width: 43ch;
}
.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.hero-price {
  margin-top: 24px;
  font-size: 14px;
  color: var(--muted);
}
.hero-price strong {
  color: var(--ink);
  font-size: 18px;
}
.house-hero__photo {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 540px;
}
.house-hero__photo img {
  width: 100%;
  height: 540px;
  object-fit: cover;
}
.hero-photo-note {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink);
}
.hero-facts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-top: 32px;
  padding-bottom: 32px;
  margin-top: 24px;
}
.hero-facts span {
  border-top: 1px solid #d4cdc2;
  padding-top: 16px;
  font-size: 15px;
}
@media (max-width: 800px) {
  .house-hero {
    padding-top: 88px;
  }
  .house-hero__layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .house-hero__copy {
    padding: 16px 0 0;
  }
  h1 {
    font-size: 42px;
  }
  .hero-location {
    margin-bottom: 16px;
  }
  .hero-description {
    margin: 20px 0;
    font-size: 17px;
  }
  .house-hero__photo {
    min-height: 0;
  }
  .house-hero__photo img {
    height: 360px;
  }
  .hero-price {
    margin-top: 16px;
  }
  .hero-facts {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 0;
  }
  .hero-photo-note {
    font-size: 13px;
    left: 12px;
    right: 12px;
    bottom: 12px;
  }
  .hero-actions .button {
    flex: 1;
    padding: 14px;
  }
}
@media (max-width: 360px) {
  h1 {
    font-size: 36px;
  }
  .hero-actions {
    flex-direction: column;
  }
}
</style>
