<template>
  <div class="location-component">
    <div class="location-text">
      <h2>Расположение</h2>
      <p>
        Домик находится в посёлке Новотарманский<br />
        Горячий источник Советский в 10 минутах<br />
        База отдыха Верхний Бор (источник, озеро) в 15 минутах
      </p>
    </div>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
export default {
  name: "LocationMap",
  mounted() {
    const script = document.createElement("script");
    // ВАЖНО: API конструктора Яндекса часто игнорирует внешние стили. 
    // Если карта все равно будет широкой, лучше использовать тип "iframe" вместо "script"
    script.src =
      "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6b6abf998c508a3928ec2bde98c8011f402be7e5a6b1f8cdfeede9111f737bc6&width=100%25&height=250&lang=ru_RU&scroll=true";
    script.async = true;
    this.$refs.mapContainer.appendChild(script);
  },
};
</script>

<style scoped>
.location-component {
  display: flex;
  align-items: center;
  background-color: var(--primary, #5e4e3b);
  border-radius: 30px;
  padding: 32px; /* Увеличил паддинг для солидности */
  gap: 30px;
}

.location-text {
  flex: 1;
  color: #fff;
}

.location-text h2 {
  font-size: 36px;
  font-weight: 400;
  margin-bottom: 12px;
}

.location-text p {
  margin: 0;
  line-height: 1.6;
  font-size: 16px;
}

.map-container {
  flex: 1;
  width: 100%;
  height: 250px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  background: #eee; /* Цвет заглушки до загрузки */
}

.map-container :deep(ymaps) {
  height: 100% !important;
  width: 100% !important;
}

/* Глубокий селектор для того, чтобы заставить Яндекс.Карту быть резиновой */
.map-container :deep(id^="ymaps") {
  width: 100% !important;
}

/* ========= АДАПТИВ ========= */

@media (max-width: 1024px) {
  .location-component {
    padding: 24px;
    gap: 20px;
  }

  .location-text h2 { font-size: 28px; }
  .map-container { height: 250px; }
}

@media (max-width: 850px) {
  .location-component {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .location-text {
    max-width: 100%;
  }

  .location-text br {
    display: none; /* Текст в одну строку на средних экранах */
  }

  .map-container {
    height: 250px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .location-component {
    flex-direction: column;
    padding: 20px;
  }

  .map-container {
    height: 200px; /* Фиксированная высота для мобилок */
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .location-component {
    padding: 20px 16px;
    border-radius: 20px;
    gap: 16px;
  }

  .location-text h2 {
    font-size: 24px;
  }

  .location-text p {
    font-size: 14px;
    line-height: 1.5;
  }

  .map-container {
    height: 200px; /* Оптимальная высота для мобильного */
    border-radius: 15px;
  }
}
</style>