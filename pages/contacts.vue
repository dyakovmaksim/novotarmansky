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
                <span class="icon">📍</span>
                <div>
                  <strong>Адрес:</strong>
                  <p>Тюменская область, пос. Новотарманский, ул. Лесная, 15</p>
                </div>
              </div>

              <div class="contact-item">
                <span class="icon">📞</span>
                <div>
                  <strong>Телефон:</strong>
                  <p><a href="tel:+71234567890">+7 (123) 456-78-90</a></p>
                </div>
              </div>

              <div class="contact-item">
                <span class="icon">✉️</span>
                <div>
                  <strong>Email:</strong>
                  <p>hello@novotarmansky.ru</p>
                </div>
              </div>

              <div class="social-links">
                <a href="#" class="social-btn">WhatsApp</a>
                <a href="#" class="social-btn">Telegram</a>
                <a href="#" class="social-btn">VK</a>
              </div>
            </div>

            <div class="contact-card work-hours">
              <h2>Режим работы</h2>
              <p>
                Мы принимаем гостей круглосуточно по предварительному
                бронированию.
              </p>
              <p><strong>Заезд:</strong> после 14:00</p>
              <p><strong>Выезд:</strong> до 12:00</p>
            </div>
          </div>

          <div class="map-section">
            <div class="map-container">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3AВАШ_УНИКАЛЬНЫЙ_ID&amp;source=constructor"
                width="100%"
                height="550"
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
  padding: 60px 0;
  background-color: #fdfaf7;
  min-height: 85vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  text-align: center;
  color: #5e4e3b; /* */
  margin-bottom: 50px;
  font-size: 36px;
}

.contacts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.contact-card {
  background: white;
  padding: 40px;
  border-radius: 30px; /* */
  margin-bottom: 20px;
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
  margin-bottom: 25px;
  font-size: 24px;
}

.contact-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.icon {
  font-size: 24px;
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 30px;
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
  height: 550px; /* Фиксированная высота для карты */
  border-radius: 30px;
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
</style>
