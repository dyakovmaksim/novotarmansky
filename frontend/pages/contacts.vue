<template>
  <div>
    <LayoutsNavBar />
    <main id="main-content" class="contact-page site-container">
      <header class="page-heading">
        <h1>Приезжайте в Новотарманский</h1>
        <p>Расскажем о доме, поможем выбрать даты и подскажем дорогу.</p>
      </header>
      <div class="contact-layout">
        <div>
          <section class="contact-info">
            <h2>На связи с вами</h2>
            <a class="contact-phone" :href="CONTACT.phone.href">{{
              CONTACT.phone.display
            }}</a>
            <p>Приём звонков: {{ CONTACT.workHours.value }}</p>
            <div class="contact-socials">
              <a
                v-for="s in CONTACT.socials"
                :key="s.id"
                :href="s.href"
                target="_blank"
                rel="noopener"
                >{{ s.label }}</a
              >
            </div>
            <p class="contact-address">{{ CONTACT.address.value }}</p>
          </section>
          <section class="arrival-info">
            <h2>Планируйте приезд</h2>
            <dl>
              <div>
                <dt>Заезд</dt>
                <dd>После 15:00</dd>
              </div>
              <div>
                <dt>Выезд</dt>
                <dd>До 12:00</dd>
              </div>
            </dl>
            <p>Если нужно другое время, заранее согласуйте его с хозяином.</p>
            <NuxtLink to="/booking" class="button">Выбрать даты</NuxtLink>
          </section>
        </div>
        <HouseMap />
      </div>
    </main>
    <LayoutsFooterSection />
  </div>
</template>
<script setup>
useSeoMeta({
  title: "Контакты и маршрут — Novotarmanskiy house",
  description:
    "Загородный дом в Новотарманском: ул. Янтарная, 143. Телефон, мессенджеры и маршрут из Тюмени.",
});
</script>
<style scoped>
.contact-page {
  padding-top: 128px;
  padding-bottom: 64px;
}
.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}
.contact-layout > div {
  min-width: 0;
}
.contact-info {
  background: var(--sand);
  border-radius: 16px;
  padding: 28px;
}
.contact-info h2,
.arrival-info h2 {
  font-size: 26px;
  margin-bottom: 20px;
}
.contact-phone {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 600;
}
.contact-info p {
  margin-top: 16px;
  color: var(--muted);
}
.contact-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
.contact-socials a {
  min-height: 44px;
  display: flex;
  align-items: center;
  background: #fff9;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
}
.contact-address {
  padding-top: 16px;
  border-top: 1px solid #b5a995;
}
.arrival-info {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 16px;
  margin-top: 24px;
}
.arrival-info dl {
  display: flex;
  gap: 48px;
}
.arrival-info dt {
  color: var(--muted);
  font-size: 14px;
}
.arrival-info dd {
  font-size: 18px;
  font-weight: 600;
  margin-top: 6px;
}
.arrival-info p {
  color: var(--muted);
  margin: 20px 0;
}
.arrival-info .button {
  width: 100%;
}
@media (max-width: 760px) {
  .contact-page {
    padding-top: 104px;
    padding-bottom: 48px;
  }
  .contact-layout {
    grid-template-columns: 1fr;
  }
  .contact-info,
  .arrival-info {
    padding: 24px;
  }
}
</style>
