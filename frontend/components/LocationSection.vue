<template>
  <section class="location-section">
    <div>
      <h2>Недалеко от города.<br >Ближе к отдыху.</h2>
      <p>
        Посёлок Новотарманский, примерно 20 минут от Тюмени. На участке можно
        провести весь день, а по соседству — термальные источники для небольшой
        поездки.
      </p>
      <ul>
        <li>Источник «Советский» — около 10 минут на машине</li>
        <li>«Верхний Бор» — около 15 минут</li>
      </ul>
    </div>
    <HouseMap />
  </section>
</template>
<style scoped>
.location-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 48px 24px;
  align-items: center;
}
.location-section h2 {
  font-size: clamp(28px, 3vw, 40px);
  margin-bottom: 24px;
}
.location-section p,
.location-section li {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.65;
}
.location-section ul {
  padding-left: 20px;
  margin-top: 20px;
}
.location-section li {
  margin-top: 12px;
}
@media (max-width: 760px) {
  .location-section {
    grid-template-columns: 1fr;
    padding: 32px 20px;
    gap: 24px;
  }
}
</style>
