<template>
  <div>
    <LayoutsNavBar />

    <main class="promotions-page">
      <div class="container">
        <h1 class="page-title">Акции и спецпредложения</h1>

        <div class="promo-list">
          <div v-for="(promo, index) in promos" :key="index" class="promo-card">
            <div class="promo-image">
              <img :src="promo.image" :alt="promo.title" />
              <div class="promo-badge" v-if="promo.badge">
                {{ promo.badge }}
              </div>
            </div>

            <div class="promo-content">
              <h2 class="promo-title">{{ promo.title }}</h2>
              <p class="promo-description">{{ promo.description }}</p>

              <div class="promo-footer">
                <span class="promo-date">Срок действия: {{ promo.date }}</span>
                <button class="promo-btn">Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup>
const promos = [
  {
    title: "Будни дешевле",
    description:
      "При бронировании дома с понедельника по четверг — скидка 20% на вторые сутки. Проведите время в тишине без суеты.",
    image: "/images/house.jpg",
    badge: "-20%",
    date: "до 01.06.2024",
  },
  {
    title: "Баня в подарок",
    description:
      "Забронируйте дом на двое суток в выходные и получите 2 часа настоящей русской бани совершенно бесплатно.",
    image: "/images/sauna.jpg",
    badge: "Подарок",
    date: "бессрочно",
  },
  {
    title: "Для именинников",
    description:
      "Дарим праздничную скидку 10% в день рождения и неделю после него. Отметьте важную дату на природе!",
    image: "/images/interior-wide.jpg",
    badge: "Скидка",
    date: "круглый год",
  },
];
</script>

<style scoped>
.promotions-page {
  padding: 60px 0;
  background-color: #fdfaf7; /* Мягкий фон под стиль проекта */
  min-height: 80vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  text-align: center;
  color: #5e4e3b; /* Основной темный цвет из :root */
  font-size: 36px;
  margin-bottom: 50px;
}

.promo-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.promo-card {
  display: flex;
  background: white;
  border-radius: 30px; /* Закругление как в AboutUs */
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(94, 78, 59, 0.05);
  transition: transform 0.3s ease;
}

.promo-card:hover {
  transform: translateY(-5px);
}

.promo-image {
  flex: 0 0 40%;
  position: relative;
  min-height: 250px;
}

.promo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #d8b48b; /* Бежевый акцент */
  color: white;
  padding: 8px 18px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.promo-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.promo-title {
  color: #5e4e3b;
  font-size: 24px;
  margin-bottom: 15px;
}

.promo-description {
  color: #777;
  line-height: 1.6;
  margin-bottom: 20px;
}

.promo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.promo-date {
  font-size: 13px;
  color: #a09384;
}

.promo-btn {
  background-color: #5e4e3b;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s;
}

.promo-btn:hover {
  background-color: #d8b48b;
}

/* Адаптивность для мобилок */
@media (max-width: 768px) {
  .promo-card {
    flex-direction: column;
  }
  .promo-image {
    min-height: 200px;
  }
}
</style>
