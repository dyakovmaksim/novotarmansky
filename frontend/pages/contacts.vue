<script setup>
useSeoMeta({
  title: "Контакты — Novotarmanskiy house",
  description:
    "Адрес, телефон, мессенджеры и режим работы. Как нас найти и связаться.",
});
</script>

<template>
  <div>
    <LayoutsNavBar />

    <main class="contacts-page">
      <div class="container">
        <h1 class="page-title">Контакты</h1>

        <div class="contacts-grid">
          <div class="info-section">
            <div class="contact-card accent-box">
              <h2>Как нас найти</h2>
              <div class="contact-item">
                <IconPin class="icon" />
                <div>
                  <strong>{{ CONTACT.address.label }}:</strong>
                  <p>{{ CONTACT.address.value }}</p>
                </div>
              </div>

              <div class="contact-item">
                <IconPhone class="icon" />
                <div>
                  <strong>{{ CONTACT.phone.label }}:</strong>
                  <p>
                    <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a>
                  </p>
                </div>
              </div>

              <div class="contact-item">
                <IconMail class="icon" />
                <div>
                  <strong>{{ CONTACT.email.label }}:</strong>
                  <p>
                    <a :href="CONTACT.email.href">{{ CONTACT.email.value }}</a>
                  </p>
                </div>
              </div>

              <div class="social-links">
                <a
                  v-for="s in CONTACT.socials"
                  :key="s.id"
                  :href="s.href"
                  target="_blank"
                  rel="noopener"
                  class="social-btn"
                >
                  {{ s.label }}
                </a>
              </div>
            </div>

            <div class="contact-card work-hours">
              <h2>Режим работы</h2>
              <p>
                Мы принимаем гостей круглосуточно по предварительному
                бронированию.
              </p>
              <p>
                <strong>{{ CONTACT.checkIn.label }}:</strong>
                {{ CONTACT.checkIn.value }}
              </p>
              <p>
                <strong>{{ CONTACT.checkOut.label }}:</strong>
                {{ CONTACT.checkOut.value }}
              </p>
              <p>
                <strong>{{ CONTACT.workHours.label }}:</strong>
                {{ CONTACT.workHours.value }}
              </p>
            </div>
          </div>

          <div class="map-section">
            <div class="map-container">
              <iframe
                :src="`https://yandex.ru/map-widget/v1/?um=constructor%3A${CONTACT.yandexMapId}&amp;source=constructor`"
                width="100%"
                height="620"
                frameborder="0"
                allowfullscreen="true"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<style scoped>
.contacts-page {
  padding: var(--section-space-tight) 0 var(--section-space);
  background-color: #fdfaf7;
  min-height: 85vh;
}

.container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.page-title {
  text-align: center;
  color: #5e4e3b; /* */
  margin-bottom: 40px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.15;
}

.contacts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.contact-card {
  background: white;
  padding: var(--card-padding);
  border-radius: var(--radius-card);
  margin-bottom: 16px;
  box-shadow: 0 10px 30px rgba(94, 78, 59, 0.05);
}

.accent-box {
  background-color: #d8b48b; /* */
  color: white;
}

.accent-box h2 {
  color: white;
}
.accent-box a {
  color: white;
  text-decoration: underline;
}

h2 {
  color: #5e4e3b;
  margin-bottom: 20px;
  font-size: 24px;
  line-height: 1.25;
}

.contact-item {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
}

.icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: currentColor;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.social-btn {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 15px;
  text-decoration: none !important;
  font-size: 14px;
  transition: background 0.3s;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.map-section {
  height: 100%;
}

.map-container {
  height: 615px; /* Фиксированная высота для карты */
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

@media (max-width: 850px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }
  .map-container {
    height: 350px;
  }
}

@media (max-width: 520px) {
  .social-links {
    flex-wrap: wrap;
  }
}
</style>
