<template>
  <section class="carousel-section">
    <div class="carousel">
      <div class="carousel__main">
        <Transition name="fade" mode="out-in">
          <img
            :key="images[activeIndex]"
            :src="images[activeIndex]"
            alt=""
            class="carousel__main-img"
          />
        </Transition>

        <button class="carousel__arrow carousel__arrow--prev" @click="prev">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button class="carousel__arrow carousel__arrow--next" @click="next">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="carousel__pagination">
          <span
            v-for="(img, i) in images"
            :key="i"
            :class="['carousel__dot', { active: i === activeIndex }]"
            @click="goTo(i)"
          ></span>
        </div>
      </div>

      <div class="carousel__side">
        <div
          v-for="n in 2"
          :key="n"
          class="carousel__side-img-wrap"
          :style="{ opacity: images[getSideImageIndex(n)] ? 1 : 0 }"
          @click="goTo(getSideImageIndex(n))"
        >
          <img
            v-if="images[getSideImageIndex(n)]"
            :key="images[getSideImageIndex(n)]"
            :src="images[getSideImageIndex(n)]"
            alt=""
            class="carousel__side-img"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const activeIndex = ref(0);
const images = [
  "/images/carousel/carousel1.jpg",
  "/images/carousel/carousel2.jpg",
  "/images/carousel/carousel3.jpg",
  "/images/carousel/carousel4.jpg",
  "/images/carousel/carousel5.jpg",
];

function goTo(idx) {
  activeIndex.value = idx;
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % images.length;
}

function prev() {
  activeIndex.value = (activeIndex.value - 1 + images.length) % images.length;
}

function getSideImageIndex(offset) {
  return (activeIndex.value + offset) % images.length;
}
</script>

<style lang="scss" scoped>
/* Убедитесь, что переменная --primary определена где-то в вашем глобальном CSS,
   например, в файле main.css или App.vue, иначе используйте запасное значение. */
:root {
  --primary: #5e4e3b; /* Пример запасного цвета, если не определен глобально */
}

.carousel-section {
  width: 100%;
  padding: 36px 0; /* Отступ по умолчанию */
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 40px; /* Отступ по умолчанию */
  width: 100%;
  max-width: 1200px; /* Ограничиваем максимальную ширину карусели */
  box-sizing: border-box; /* Важно для padding */
}

.carousel__main {
  position: relative;
  flex: 1 1 0; /* Занимает доступное пространство */
  min-width: 0; /* Позволяет элементу сжиматься */
  background: #f9f9f9;
  border-radius: 30px; /* Радиус по умолчанию */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  aspect-ratio: 16 / 10; /* Соотношение сторон по умолчанию */
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.05);
}

.carousel__main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 32px; /* Радиус по умолчанию */
  display: block;
}

.carousel__pagination {
  position: absolute;
  left: 50%;
  bottom: 18px; /* Отступ снизу по умолчанию */
  transform: translateX(-50%);
  display: flex;
  gap: 10px; /* Отступ между точками по умолчанию */
  z-index: 2;
}

.carousel__dot {
  width: 14px; /* Размер точки по умолчанию */
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--primary);
  opacity: 0.5;
  cursor: pointer;
  transition: 0.3s;

  &.active {
    background: var(--primary);
    border-color: var(--primary);
    opacity: 1;
  }
}

.carousel__side {
  display: flex; /* По умолчанию отображается */
  flex-direction: column;
  gap: 24px;
  width: 400px; /* Фиксированная ширина по умолчанию */
  justify-content: flex-start;
}

.carousel__side-img-wrap {
  border-radius: 24px;
  overflow: hidden;
  background: #919191;
  aspect-ratio: 1.6 / 1;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: opacity 0.3s;
  position: relative;
  cursor: pointer;

  &:hover {
    filter: brightness(0.85);
  }
}

.carousel__side-img {
  width: 100%;
  height: 100%;
  opacity: 0.5;
  object-fit: cover;
  border-radius: 24px;
  transition: filter 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Стили для стрелок навигации */
.carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 48px; /* Размер стрелки по умолчанию */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: 0.3s;
  outline: none;

  &:hover {
    background: var(--primary);

    svg {
      stroke: white;
    }
  }

  &--prev {
    left: 20px; /* Отступ по умолчанию */
  }

  &--next {
    right: 20px; /* Отступ по умолчанию */
  }

  svg {
    stroke: var(--primary);
    transition: stroke 0.3s;
  }
}

/* ---
Media Queries для адаптивности
--- */

/* Для экранов 1280px и меньше */
@media (max-width: 1280px) {
  .carousel-section {
    padding: 30px 20px; /* Немного уменьшаем отступы */
  }

  .carousel {
    max-width: 90%; /* Занимаем больше ширины экрана */
    gap: 30px; /* Уменьшаем отступ между основной и боковой частью */
  }

  .carousel__main {
    border-radius: 25px; /* Немного уменьшаем радиус */
  }

  .carousel__main-img {
    border-radius: 28px; /* Соответствует основному */
  }

  .carousel__side {
    width: 300px; /* Уменьшаем ширину боковой панели */
    gap: 20px;
  }

  .carousel__side-img-wrap {
    border-radius: 20px;
  }

  .carousel__side-img {
    border-radius: 20px;
  }
}

/* Для экранов 720px и меньше (планшеты и мобильные) */
@media (max-width: 720px) {
  .carousel-section {
    padding: 20px 15px; /* Еще уменьшаем отступы */
  }

  .carousel {
    flex-direction: column; /* Элементы карусели располагаются вертикально */
    gap: 0; /* Убираем отступ между основной частью и боковой (которая будет скрыта) */
    max-width: 100%; /* Занимаем всю доступную ширину */
    padding: 0; /* Убираем внутренний padding на самом carousel, он будет на carousel-section */
  }

  .carousel__main {
    width: 100%; /* Основное изображение занимает всю ширину */
    aspect-ratio: 4 / 3; /* Более вертикальное соотношение сторон для мобильных */
    border-radius: 20px; /* Уменьшаем радиус */
    box-shadow: none; /* Убираем тень для более легкого вида */
  }

  .carousel__main-img {
    border-radius: 20px; /* Соответствует основному контейнеру */
  }

  .carousel__side {
    display: none; /* Скрываем боковую панель на мобильных устройствах */
  }

  .carousel__arrow {
    width: 40px; /* Уменьшаем размер стрелок */
    height: 40px;
    background: rgba(255, 255, 255, 0.7); /* Чуть более непрозрачный фон */

    svg {
      width: 28px; /* Уменьшаем размер иконок SVG */
      height: 28px;
    }

    &--prev {
      left: 10px; /* Уменьшаем отступ */
    }

    &--next {
      right: 10px; /* Уменьшаем отступ */
    }
  }

  .carousel__pagination {
    bottom: 10px; /* Перемещаем пагинацию выше */
    gap: 8px; /* Уменьшаем отступ между точками */
  }

  .carousel__dot {
    width: 10px; /* Уменьшаем размер точек */
    height: 10px;
    border-width: 1px; /* Уменьшаем толщину границы */
  }
}

/* Для экранов 375px и меньше (очень маленькие мобильные) */
@media (max-width: 375px) {
  .carousel-section {
    padding: 15px 10px; /* Минимальные отступы */
  }

  .carousel__main {
    aspect-ratio: 1 / 1; /* Квадратное соотношение сторон для очень маленьких экранов */
    border-radius: 15px; /* Еще уменьшаем радиус */
  }

  .carousel__main-img {
    border-radius: 15px;
  }

  .carousel__arrow {
    width: 35px; /* Еще уменьшаем размер стрелок */
    height: 35px;

    svg {
      width: 24px; /* Еще уменьшаем размер иконок SVG */
      height: 24px;
    }

    &--prev {
      left: 5px; /* Минимальный отступ */
    }

    &--next {
      right: 5px; /* Минимальный отступ */
    }
  }

  .carousel__pagination {
    bottom: 5px; /* Минимальный отступ снизу */
    gap: 6px; /* Минимальный отступ между точками */
  }

  .carousel__dot {
    width: 8px; /* Минимальный размер точек */
    height: 8px;
  }
}
</style>
