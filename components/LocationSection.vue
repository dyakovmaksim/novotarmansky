<template>
  <div class="location-container">
    <h2 class="location-title">Расположение</h2>
    <div class="location-text">
      <p>Домик находится в посёлке Новотарманский</p>
      <p>Горячий источник Советский в 10 минутах</p>
      <p>База отдыха Верхний Бор (источник, озеро) в 15 минутах</p>
    </div>

    <div ref="mapContainer" class="map-wrapper"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const mapContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!mapContainer.value) return;

  const ymapsScript = document.createElement("script");
  ymapsScript.type = "text/javascript";
  ymapsScript.charset = "utf-8";
  ymapsScript.async = true;
  ymapsScript.src =
    "https://api-maps.yandex.ru/services/constructor/1.0/js/?" +
    "um=constructor%3A6b6abf998c508a3928ec2bde98c8011f402be7e5a6b1f8cdfeede9111f737bc6" +
    "&width=100%25" +
    "&height=284" +
    "&lang=ru_RU" +
    "&scroll=true";

  mapContainer.value.appendChild(ymapsScript);
});
</script>

<style scoped>
.location-container {
  max-width: 1200px;
  padding: 24px;
  margin: 40px auto;
  border: 5px solid var(--primary);
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.location-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: black;
}

.location-text {
  font-size: 20px;
  color: black;
  line-height: 1.4;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.location-text p {
  margin: 0px 0;
}

.map-wrapper {
  margin-top: 16px;
  width: 100%;
  height: 284px;
  position: relative;
}

.map-wrapper iframe {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}
</style>
