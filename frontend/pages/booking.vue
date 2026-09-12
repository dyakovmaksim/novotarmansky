<template>
  <div>
    <LayoutsNavBar />
    <main id="main-content" class="booking-page site-container">
      <header class="page-heading">
        <NuxtLink to="/">Дом и фотографии</NuxtLink>
        <h1>Выберите даты отдыха</h1>
        <p>Весь дом для вашей компании. Заявка напрямую хозяину.</p>
      </header>
      <BookingExperience standalone />
      <p class="booking-help">
        Нужна помощь с выбором?
        <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a>
      </p>
    </main>
    <LayoutsFooterSection />
  </div>
</template>
<script setup>
useSeoMeta({
  title: "Выбрать даты — Novotarmanskiy house",
  description:
    "Свободные даты, гости и русская баня. Рассчитайте стоимость отдыха и отправьте заявку хозяину.",
});
</script>
<style scoped>
.booking-page {
  padding-top: 128px;
  padding-bottom: 72px;
}
.booking-help {
  margin-top: 28px;
  text-align: center;
  color: var(--muted);
}
.booking-help a {
  color: var(--ink);
  text-decoration: underline;
}
@media (max-width: 600px) {
  .booking-page {
    padding-top: 104px;
  }
}
</style>
