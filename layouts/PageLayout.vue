<template>
  <div>
    <NavBar />
    <HeroSection />
    <main>
      <slot></slot>
    </main>
    <FooterSection />

    <transition name="fade">
      <button
        v-if="isScrolled"
        @click="scrollToTop"
        class="scroll-to-top-button"
        aria-label="Scroll to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import NavBar from "@/components/layouts/NavBar.vue";
import HeroSection from "@/components/layouts/HeroSection.vue";
import FooterSection from "@/components/layouts/FooterSection.vue";

const isScrolled = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="scss">
/* Основные стили для main */
main {
  max-width: 1200px; /* Максимальная ширина для больших экранов */
  width: 90%; /* Процентная ширина для адаптивности */
  margin: 0 auto;
  margin-top: 180px; /* Отступ сверху для десктопа */
  box-sizing: border-box;
  padding: 0 16px;
}

/* Для экранов 1280px и меньше */
@media (max-width: 1280px) {
  main {
    width: 90%;
    padding: 0 20px;
  }
}

/* Планшеты: экраны 720px и меньше */
@media (max-width: 720px) {
  main {
    margin-top: 100px; /* Уменьшаем отступ сверху */
    width: 95%;
    padding: 0 15px;
  }
}

/* Мобильные телефоны: экраны 375px и меньше */
@media (max-width: 375px) {
  main {
    margin-top: 80px;
    width: 95%;
    padding: 0 10px;
  }
}

/* Кнопка "Наверх" */
.scroll-to-top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus {
    background-color: #bd9e7e;
    transform: translateY(-3px);
    outline: none;
  }
}

/* Адаптивность кнопки для планшетов */
@media (max-width: 720px) {
  .scroll-to-top-button {
    width: 45px;
    height: 45px;
    bottom: 20px;
    right: 20px;
  }
}

/* Адаптивность кнопки для мобильных */
@media (max-width: 375px) {
  .scroll-to-top-button {
    width: 40px;
    height: 40px;
    bottom: 15px;
    right: 15px;
  }
}

/* Плавное появление и скрытие кнопки */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
