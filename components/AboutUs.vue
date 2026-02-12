<template>
  <div class="about-component">
    <div class="gradient-overlay"></div>

    <div class="text-container">
      <h2>О нас</h2>
      <p>
        Мы предлагаем комфортабельный дом для отдыха, где каждая деталь
        продумана для вашего удобства и расслабления.
      </p>
      <p>
        Наша миссия – сделать ваш отпуск или временное проживание незабываемым,
        окружив вас теплом, уютом и природной красотой.
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
:root {
  --primary: #5e4e3b;
}

.about-component {
  position: relative;
  width: 100%;
  min-height: 215px;
  border-radius: 30px;
  overflow: hidden;

  background-image: url("/images/AboutUsPic.png");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 40%,
    rgba(0, 0, 0, 0) 100%
  );
}

.text-container {
  position: relative;
  z-index: 1;
  padding: 24px;
  color: #fff;
  max-width: 70%;
  box-sizing: border-box;
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

@media (max-width: 1280px) {
  .about-component {
    min-height: 200px;
    border-radius: 25px;
  }

  .text-container {
    padding: 20px;
    max-width: 75%;
  }

  .text-container h2 {
    font-size: 32px;
  }
}

@media (max-width: 720px) {
  .about-component {
    min-height: 18px;
    border-radius: 20px;
  }

  .gradient-overlay {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 40%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .text-container {
    padding: 16px; /* Еще уменьшаем отступы */
    max-width: 90%; /* Почти полная ширина */
  }

  .text-container h2 {
    font-size: 20px; /* Значительно уменьшаем заголовок */
    margin-bottom: 8px; /* Уменьшаем отступ под заголовком */
  }

  .text-container p {
    font-size: 10px; /* Уменьшаем размер текста */
    margin: 6px 0;
  }
}

/* Для экранов 375px и меньше (мобильные телефоны) */
@media (max-width: 375px) {
  .about-component {
    min-height: 160px; /* Минимальная высота для мобильных */
    border-radius: 15px; /* Еще меньше радиус */
  }

  .gradient-overlay {
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.5) 40%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .text-container {
    padding: 24px; /* Максимально уменьшаем отступы */
    max-width: 95%; /* Почти полная ширина */
  }

  .text-container h2 {
    font-size: 8px; /* Минимальный размер заголовка */
    margin-bottom: 6px;
  }

  .text-container p {
    font-size: 6px; /* Минимальный размер текста */
    margin: 4px 0;
  }
}
</style>
