<template>
  <div class="house-map">
    <div class="map-address">
      <IconPin />
      <div>
        <h3>Как добраться</h3>
        <p>{{ CONTACT.address.value }}</p>
      </div>
    </div>
    <p>
      Проложите маршрут от вашего местоположения или откройте интерактивную
      карту.
    </p>
    <div class="map-actions">
      <a :href="routeUrl" target="_blank" rel="noopener" class="button"
        >Построить маршрут</a
      ><button
        v-if="!show"
        type="button"
        class="button button--secondary"
        @click="show = true"
      >
        Показать карту
      </button>
    </div>
    <iframe
      v-if="show"
      :src="mapUrl"
      title="Расположение дома на Яндекс Картах"
      loading="lazy"
      width="600"
      height="320"
    />
    <p class="map-help">
      Если карта не открывается, используйте адрес или позвоните:
      <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a
      >.
    </p>
  </div>
</template>
<script setup>
import { ref } from "vue";
const show = ref(false);
const routeUrl =
  "https://yandex.ru/maps/?rtext=~" +
  encodeURIComponent(CONTACT.address.value) +
  "&rtt=auto";
const mapUrl =
  "https://yandex.ru/map-widget/v1/?text=" +
  encodeURIComponent(CONTACT.address.value) +
  "&z=16";
</script>
<style scoped>
.house-map {
  background: var(--surface);
  padding: 28px;
  border-radius: 16px;
  border: 1px solid var(--line);
  min-width: 0;
}
.map-address {
  display: flex;
  gap: 14px;
  align-items: start;
}
.map-address svg {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
.map-address h3 {
  font-size: 24px;
  margin-bottom: 12px;
}
.house-map p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 20px;
}
.map-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.house-map iframe {
  width: 100%;
  height: 320px;
  border: 0;
  margin-top: 20px;
  border-radius: 10px;
}
.house-map .map-help {
  font-size: 13px;
  margin: 20px 0 0;
}
.map-help a {
  text-decoration: underline;
}
@media (max-width: 600px) {
  .house-map {
    padding: 22px;
  }
  .map-actions .button {
    width: 100%;
  }
}
</style>
