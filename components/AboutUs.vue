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
    min-height: 250px; /* Исправил с 18px на адекватную высоту */
    border-radius: 20px;
  }

  .gradient-overlay {
    /* Делаем градиент темнее и плотнее, чтобы текст читался на фоне фото */
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
  }

  .text-container {
    padding: 20px;
    max-width: 100%; /* На мобильных используем всю ширину */
  }

  .text-container h2 {
    font-size: 24px; /* Читабельный размер */
    margin-bottom: 8px;
  }

  .text-container p {
    font-size: 14px; /* Минимально рекомендуемый размер */
    margin: 8px 0;
  }
}

@media (max-width: 480px) {
  .about-component {
    min-height: 280px; /* Увеличиваем высоту, так как текст займет больше строк */
    background-position: 25% center; /* Сдвигаем фото, чтобы лицо/дом на фоне не перекрывались текстом */
  }

  .text-container {
    padding: 16px;
  }

  .text-container h2 {
    font-size: 20px;
  }

  .text-container p {
    font-size: 14px; 
    line-height: 1.4;
  }
}
</style>
