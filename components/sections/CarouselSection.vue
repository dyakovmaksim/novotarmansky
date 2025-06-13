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

        <button
          v-if="activeIndex > 0"
          class="carousel__arrow carousel__arrow--prev"
          @click="prev"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <button
          v-if="activeIndex < images.length - 1"
          class="carousel__arrow carousel__arrow--next"
          @click="next"
        >
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
          :style="{ opacity: images[activeIndex + n] ? 1 : 0 }"
          @click="goTo(activeIndex + n)"
        >
          <img
            v-if="images[activeIndex + n]"
            :key="images[activeIndex + n]"
            :src="images[activeIndex + n]"
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
  if (idx >= 0 && idx < images.length) activeIndex.value = idx;
}

function next() {
  if (activeIndex.value < images.length - 1) activeIndex.value++;
}

function prev() {
  if (activeIndex.value > 0) activeIndex.value--;
}
</script>

<style lang="scss" scoped>
.carousel-section {
  width: 100%;
  padding: 36px 0;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 40px;
  width: 100%;
  max-width: none; // Убрано ограничение по ширине
}

.carousel__main {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  background: #f9f9f9;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  aspect-ratio: 16 / 10;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.05);
}

.carousel__main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 32px;
  display: block;
}

.carousel__pagination {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.carousel__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--primary, #d2b28a);
  opacity: 0.5;
  cursor: pointer;
  transition: 0.3s;

  &.active {
    background: var(--primary, #d2b28a);
    border-color: var(--primary, #d2b28a);
    opacity: 1;
  }
}

.carousel__side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 400px;
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
  cursor: pointer; /* Добавлен pointer для превью */

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
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--primary);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  transition: 0.3s;

  &:hover {
    background: var(--primary);

    svg {
      stroke: white;
    }
  }

  &--prev {
    left: 20px;
  }

  &--next {
    right: 20px;
  }

  svg {
    stroke: var(--primary);
    transition: stroke 0.3s;
  }
}
</style>
