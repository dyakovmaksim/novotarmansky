<template>
  <section class="house-amenities">
    <header>
      <h2>Всё нужное для загородного отдыха</h2>
      <p>Можно готовить дома, собираться на участке и провести вечер в бане.</p>
    </header>
    <div class="amenity-facts">
      <div><strong>До 8</strong><span>гостей, включая детей</span></div>
      <div><strong>Дом целиком</strong><span>для вашей компании</span></div>
      <div>
        <strong>Круглый год</strong><span>для коротких и долгих поездок</span>
      </div>
    </div>
    <div class="amenity-list">
      <article>
        <IconUtensils />
        <h3>Кухня-гостиная</h3>
        <p>Плита, холодильник, посуда и стол для совместных завтраков.</p>
      </article>
      <article>
        <IconWifi />
        <h3>Wi-Fi</h3>
        <p>Оставайтесь на связи и планируйте поездки по окрестностям.</p>
      </article>
      <article>
        <IconFlame />
        <h3>Русская баня</h3>
        <p>На участке. Добавьте подготовку бани к заявке на бронирование.</p>
      </article>
    </div>
  </section>
</template>
<style scoped>
.house-amenities {
  padding: 40px 24px;
}
.house-amenities header {
  max-width: 650px;
  margin-bottom: 28px;
}
.house-amenities h2 {
  font-size: clamp(28px, 3vw, 40px);
}
.house-amenities header p {
  margin-top: 16px;
  color: var(--muted);
  font-size: 17px;
}
.amenity-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  background: var(--surface);
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 32px;
}
.amenity-facts strong {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}
.amenity-facts span {
  font-size: 14px;
  color: var(--muted);
}
.amenity-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.amenity-list svg {
  width: 26px;
  height: 26px;
  color: var(--accent);
  margin-bottom: 16px;
}
.amenity-list h3 {
  font-size: 20px;
  margin-bottom: 10px;
}
.amenity-list p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--muted);
}
@media (max-width: 600px) {
  .house-amenities {
    padding: 32px 20px;
  }
  .amenity-facts {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 16px;
  }
  .amenity-facts > div {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
  }
  .amenity-facts strong {
    font-size: 18px;
    margin: 0;
    flex-shrink: 0;
  }
  .amenity-facts span {
    text-align: right;
    max-width: 160px;
  }
  .amenity-list {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .amenity-list article {
    border-bottom: 1px solid var(--line);
    padding-bottom: 24px;
  }
  .amenity-list svg {
    margin-bottom: 12px;
  }
}
</style>
