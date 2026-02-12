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
    padding: 30px 0;
  }

  .carousel {
    max-width: 95%;
    gap: 20px;
  }

  .carousel__side {
    width: 250px; /* Уменьшаем, чтобы дать больше места главному фото */
    gap: 15px;
  }
}

@media (max-width: 992px) {
  /* Переходный момент: когда боковые фото еще есть, но уже тесно */
  .carousel__side {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .carousel-section {
    padding: 10px 0; /* Минимальный отступ, чтобы не "съедать" экран */
  }

  .carousel {
    flex-direction: column;
    gap: 0;
    max-width: 100%;
    /* Убираем лишние отступы, чтобы фото было крупнее */
    padding: 0 10px; 
  }

  .carousel__main {
    flex: none; /* Отключаем flex-grow, чтобы не схлопнулась */
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 3; /* Фиксируем пропорции, чтобы не исчезала */
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .carousel__side {
    /* Вместо полного скрытия, можно превратить их в маленькие превью снизу 
       или скрыть совсем, но убедиться, что главный блок занимает всё место */
    display: none; 
  }

  /* Улучшаем навигацию для пальцев */
  .carousel__arrow {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.9); /* Делаем заметнее */
    
    &--prev { left: 5px; }
    &--next { right: 5px; }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .carousel__pagination {
    bottom: 12px;
    /* Делаем точки крупнее, чтобы по ним было легче попадать */
    gap: 12px;
  }

  .carousel__dot {
    width: 10px;
    height: 10px;
    border-width: 1.5px;
  }
}

@media (max-width: 480px) {
  .carousel__main {
    aspect-ratio: 1.1 / 1; /* Делаем чуть выше на узких экранах */
    border-radius: 15px;
  }
  
  /* Прячем стрелки на очень маленьких экранах, если они мешают фото,
     но только если есть пагинация (точки) */
  .carousel__arrow {
    background: rgba(255, 255, 255, 0.7);
    transform: translateY(-50%) scale(0.8);
  }

  .carousel__dot {
    width: 10px;
    height: 10px;
  }
}
</style>
