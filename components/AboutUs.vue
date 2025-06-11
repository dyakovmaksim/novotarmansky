<template>
  <div class="about-component">
    <!-- Градиентный оверлей поверх фонового изображения -->
    <div class="gradient-overlay"></div>

    <!-- Текст поверх градиента -->
    <div class="text-container">
      <h2>О нас</h2>
      <p>
        Мы предлагаем комфортабельный дом для отдыха, где каждая<br />
        деталь продумана для вашего удобства и расслабления.
      </p>
      <p>
        Наша миссия – сделать ваш отпуск или временное проживание<br />
        незабываемым, окружив вас теплом, уютом и природной красотой.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
};
</script>

<style scoped>
.about-component {
  position: relative;
  width: 100%;
  height: 215px; /* Подберите по макету */
  border-radius: 30px;
  overflow: hidden;

  /* Фоновое изображение из public/images/about-bg.jpg */
  background-image: url("/public/images/AboutUsPic.png");
  background-size: cover;
  background-position: center;
}

.gradient-overlay {
  position: absolute;
  inset: 0; /* top/right/bottom/left = 0 */
  /* Градиент от #bea47a (85% opacity) к прозрачному вправо */
  background: linear-gradient(
    to right,
    var(--primary) 2%,
    rgba(190, 164, 122, 0) 75%
  );
}

.text-container {
  position: relative;
  z-index: 1; /* Поверх градиента */
  padding: 24px;
  color: #fff;
}

.text-container h2 {
  margin: 0 0 10px;
  font-size: 36px;
  font-weight: 400;
}

.text-container p {
  margin: 8px 0;
  line-height: 1.5;
  font-size: 16px;
}
</style>
