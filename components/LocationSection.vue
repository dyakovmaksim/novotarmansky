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
    script.src =
      "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6b6abf998c508a3928ec2bde98c8011f402be7e5a6b1f8cdfeede9111f737bc6&width=900&height=250&lang=ru_RU&scroll=true";
    script.async = true;
    this.$refs.mapContainer.appendChild(script);
  },
};
</script>

<style scoped>
.location-component {
  display: flex;
  align-items: center;
  background-color: var(--primary);
  border-radius: 30px;
  padding: 16px 16px 16px 24px;
  margin-bottom: 40px;
}

.location-text {
  flex: 1;
  color: #fff;
  max-width: 520px;
}

.location-text h2 {
  font-size: 36px;
  font-weight: 400;
  margin-bottom: 4px;
}

.location-text p {
  margin: 0;
  line-height: 1.5;
  font-size: 16px;
}

.map-container {
  flex: 1;
  max-width: 900px;
  width: 100%;
  height: 250px;
  border-radius: 30px;
  overflow: hidden;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
