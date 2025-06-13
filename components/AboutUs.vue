<template>
  <div class="about-component">
    <!-- Градиентный оверлей поверх фонового изображения -->
    <div class="gradient-overlay"></div>

    <!-- Текст поверх градиента -->
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
/* Убедитесь, что переменная --primary определена где-то в вашем глобальном CSS,
   например, в файле main.css или App.vue, иначе используйте запасное значение. */
:root {
  --primary: #5e4e3b; /* Пример запасного цвета, если не определен глобально */
}

.about-component {
  position: relative;
  width: 100%;
  min-height: 215px; /* Изменено на min-height для гибкости */
  border-radius: 30px;
  overflow: hidden; /* Обрезка содержимого, если оно выходит за границы */

  /* Фоновое изображение из public/images/AboutUsPic.png */
  background-image: url("/images/AboutUsPic.png"); /* Путь для NuxtJS */
  background-size: cover;
  background-position: center;
  display: flex; /* Используем flex для центрирования содержимого */
  align-items: center; /* Центрирование по вертикали */
}

.gradient-overlay {
  position: absolute;
  inset: 0; /* top/right/bottom/left = 0 */
  /* Градиент от var(--primary) (85% opacity) к прозрачному вправо */
  background: linear-gradient(
    to right,
    var(--primary) 2%,
    rgba(190, 164, 122, 0) 75%
  );
}

.text-container {
  position: relative;
  z-index: 1; /* Поверх градиента */
  padding: 24px; /* Отступы по умолчанию */
  color: #fff;
  max-width: 70%; /* Ограничиваем ширину контейнера для текста */
  box-sizing: border-box; /* Учитываем padding в ширине */
}

.text-container h2 {
  margin: 0 0 10px;
  font-size: 36px; /* Размер шрифта по умолчанию */
  font-weight: 400;
}

.text-container p {
  margin: 8px 0;
  line-height: 1.5;
  font-size: 16px; /* Размер шрифта по умолчанию */
}

/* ---
Media Queries для AboutUs компонента
--- */

/* Для экранов 1280px и меньше */
@media (max-width: 1280px) {
  .about-component {
    min-height: 200px; /* Чуть меньше минимальная высота */
    border-radius: 25px; /* Немного уменьшаем радиус */
  }

  .text-container {
    padding: 20px; /* Уменьшаем отступы */
    max-width: 75%; /* Увеличиваем доступную ширину для текста */
  }

  .text-container h2 {
    font-size: 32px; /* Чуть меньше заголовок */
  }
}

/* Для экранов 720px и меньше (планшеты) */
@media (max-width: 720px) {
  .about-component {
    min-height: 180px; /* Еще меньше минимальная высота */
    border-radius: 20px; /* Еще уменьшаем радиус */
    /* Убираем align-items: center; если нужно, чтобы текст начинался сверху */
    /* align-items: flex-start; */
  }

  .gradient-overlay {
    background: linear-gradient(
      to right,
      var(--primary) 5%,
      /* Больше основного цвета */ rgba(190, 164, 122, 0) 85%
        /* Раньше прозрачность */
    );
  }

  .text-container {
    padding: 16px; /* Еще уменьшаем отступы */
    max-width: 90%; /* Почти полная ширина */
  }

  .text-container h2 {
    font-size: 28px; /* Значительно уменьшаем заголовок */
    margin-bottom: 8px; /* Уменьшаем отступ под заголовком */
  }

  .text-container p {
    font-size: 14px; /* Уменьшаем размер текста */
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
      var(--primary) 10%,
      /* Еще больше основного цвета */ rgba(190, 164, 122, 0) 90%
        /* Еще раньше прозрачность */
    );
  }

  .text-container {
    padding: 12px; /* Максимально уменьшаем отступы */
    max-width: 95%; /* Почти полная ширина */
  }

  .text-container h2 {
    font-size: 24px; /* Минимальный размер заголовка */
    margin-bottom: 6px;
  }

  .text-container p {
    font-size: 13px; /* Минимальный размер текста */
    margin: 4px 0;
  }
}
</style>
