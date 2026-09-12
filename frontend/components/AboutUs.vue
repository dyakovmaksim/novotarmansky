<template>
  <section class="house-about">
    <div>
      <h2>Место, где можно побыть вместе</h2>
      <p>
        Готовьте завтрак в кухне-гостиной, проводите вечера на террасе и
        собирайтесь у мангала. Здесь есть пространство для общения и отдельные
        спальни для отдыха.
      </p>
      <NuxtLink to="/aboutus" class="text-button">Подробнее о доме</NuxtLink>
    </div>
    <NuxtImg
      src="/images/carousel/carousel1.jpg"
      alt="Кухня-гостиная с большим обеденным столом"
      width="900"
      format="webp"
      quality="80"
      loading="lazy"
    />
  </section>
</template>
<style scoped>
.house-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
  padding: 72px 24px 32px;
}
.house-about h2 {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 600;
  max-width: 18ch;
}
.house-about p {
  font-size: 17px;
  color: var(--muted);
  line-height: 1.7;
  margin: 24px 0;
}
.house-about img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 16px;
}
@media (max-width: 700px) {
  .house-about {
    grid-template-columns: 1fr;
    padding: 40px 20px 24px;
    gap: 24px;
  }
  .house-about p {
    margin: 16px 0;
  }
}
</style>
