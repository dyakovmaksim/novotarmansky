<template>
  <div>
    <LayoutsNavBar />
    <main id="main-content" class="offers-page site-container">
      <header class="page-heading">
        <h1>Ещё один повод выбраться за город</h1>
        <p>Предложения для отдыха с баней и встреч с близкими.</p>
      </header>
      <p class="offer-note">
        В календаре показана базовая стоимость. Сообщите хозяину о выбранной
        акции при подтверждении: он уточнит условия и итоговую сумму.
      </p>
      <div class="offers-grid">
        <article
          v-for="promo in PROMOTIONS"
          :key="promo.title"
          class="offer-card"
        >
          <NuxtImg
            :src="promo.image"
            :alt="promo.title"
            width="900"
            format="webp"
            quality="80"
            loading="lazy"
          />
          <div class="offer-copy">
            <h2>{{ promo.title }}</h2>
            <p>{{ promo.description }}</p>
            <small>Срок действия: {{ promo.date }}</small
            ><NuxtLink to="/booking" class="button">Выбрать даты</NuxtLink>
          </div>
        </article>
      </div>
    </main>
    <LayoutsFooterSection />
  </div>
</template>
<script setup>
useSeoMeta({
  title: "Предложения для отдыха — Novotarmanskiy house",
  description:
    "Отдых с баней и предложение на день рождения. Уточните условия акции при подтверждении заявки.",
});
</script>
<style scoped>
.offers-page {
  padding-top: 128px;
  padding-bottom: 64px;
}
.offer-note {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 20px;
  border-radius: 12px;
  color: var(--muted);
  margin-bottom: 32px;
  max-width: 80ch;
}
.offers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.offer-card {
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.offer-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.offer-copy {
  padding: 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.offer-copy h2 {
  font-size: 28px;
  margin-bottom: 16px;
}
.offer-copy p {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.65;
  margin-bottom: 20px;
}
.offer-copy small {
  font-size: 14px;
  color: var(--muted);
  margin-top: auto;
  margin-bottom: 20px;
}
.offer-copy .button {
  align-self: start;
}
@media (max-width: 700px) {
  .offers-page {
    padding-top: 104px;
    padding-bottom: 48px;
  }
  .offers-grid {
    grid-template-columns: 1fr;
  }
  .offer-copy {
    padding: 24px;
  }
}
</style>
