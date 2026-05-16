<template>
  <section class="gallery">
    <div class="gallery__container">
      <div class="gallery__layout">
        <div
          class="gallery__main"
          @mouseenter="stopTimer"
          @mouseleave="startTimer"
        >
          <div class="gallery__slider-viewport">
            <transition :name="slideDirection">
              <div :key="activeIndex" class="gallery__slide">
                <img
                  :src="images[activeIndex]"
                  alt="Интерьер"
                  class="gallery__img"
                />
                <div class="gallery__overlay"></div>
                <div class="gallery__info">
                  <span class="gallery__tag">Интерьер</span>
                  <h3 class="gallery__caption">Уют и премиальный комфорт</h3>
                </div>
              </div>
            </transition>
          </div>

          <div class="gallery__nav-overlay">
            <button
              class="gallery__arrow gallery__arrow--prev"
              @click="prev"
              aria-label="Назад"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              class="gallery__arrow gallery__arrow--next"
              @click="next"
              aria-label="Вперед"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div class="gallery__pagination">
            <div
              v-for="(img, i) in images"
              :key="i"
              class="gallery__bar-bg"
              @click="goTo(i)"
            >
              <div
                class="gallery__bar-fill"
                :class="{ 'is-active': i === activeIndex }"
              ></div>
            </div>
          </div>
        </div>

        <div class="gallery__side">
          <div class="gallery__side-top">
            <span class="gallery__counter">
              <span class="gallery__current">{{ activeIndex + 1 }}</span>
              <span class="gallery__total">/ {{ images.length }}</span>
            </span>
          </div>
          <div class="gallery__side-preview" @click="next">
            <div class="gallery__side-label">Далее</div>
            <img :src="images[(activeIndex + 1) % images.length]" alt="Next" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const images = [
  "/images/carousel/carousel1.jpg",
  "/images/carousel/carousel2.jpg",
  "/images/carousel/carousel3.jpg",
  "/images/carousel/carousel4.jpg",
  "/images/carousel/carousel5.jpg",
];

const activeIndex = ref(0);
const slideDirection = ref("slide-left");
let timer = null;

const startTimer = () => {
  stopTimer();
  timer = setInterval(next, 5000);
};

const stopTimer = () => clearInterval(timer);

const next = () => {
  slideDirection.value = "slide-left";
  activeIndex.value = (activeIndex.value + 1) % images.length;
};

const prev = () => {
  slideDirection.value = "slide-right";
  activeIndex.value = (activeIndex.value - 1 + images.length) % images.length;
};

const goTo = (i) => {
  slideDirection.value = i > activeIndex.value ? "slide-left" : "slide-right";
  activeIndex.value = i;
};

onMounted(startTimer);
onUnmounted(stopTimer);
</script>

<style lang="scss" scoped>
.gallery {
  padding: 60px 0;
  background: #fff;

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  &__main {
    position: relative;
    border-radius: 30px;
    background: #000;
    overflow: hidden;
    aspect-ratio: 16 / 9;
  }

  &__slider-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  }

  &__nav-overlay {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    pointer-events: none;
    z-index: 10;
  }

  &__arrow {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    cursor: pointer;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      background: #fff;
      color: #000;
    }
  }

  &__pagination {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    gap: 4px;
    padding: 0 4px 4px;
    z-index: 15;
  }

  &__bar-bg {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    border-radius: 2px;
  }

  &__bar-fill {
    height: 100%;
    width: 0;
    background: #fff;
    border-radius: 2px;
    &.is-active {
      width: 100%;
      transition: width 5s linear;
    }
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: 15px;
    @media (max-width: 992px) {
      display: none;
    }
  }

  &__counter {
    font-size: 32px;
    font-weight: 200;
    color: #ccc;
    .gallery__current {
      color: #5e4e3b;
      font-weight: 700;
    }
  }

  &__side-preview {
    position: relative;
    flex: 1;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    background: #000;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.6;
      transition: 0.4s;
    }
    &:hover img {
      opacity: 0.9;
      transform: scale(1.05);
    }
  }

  &__side-label {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 2;
    color: #fff;
    font-size: 12px;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0.3);
    padding: 4px 10px;
    border-radius: 10px;
  }
}

@media (max-width: 850px) {
  .gallery {
    padding: 30px 0;

    &__main {
      aspect-ratio: 4 / 5;
      border-radius: 20px;
    }

    &__layout {
      gap: 15px;
    }

    &__side {
      display: none;
    }
  }
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
