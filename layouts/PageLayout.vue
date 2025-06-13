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
main {
  max-width: 1200px; /* Устанавливаем максимальную ширину */
  width: 90%; /* Используем процентную ширину для адаптивности */
  margin: 0 auto;
  margin-top: 180px; /* Отступ сверху по умолчанию */
  box-sizing: border-box; /* Важно для padding */
  padding: 0 16px; /* Базовый padding для всех разрешений */
}

/* Media Queries для main в layout */

/* Для экранов 1280px и меньше */
@media (max-width: 1280px) {
  main {
    width: 90%; /* Отступы по бокам */
    padding: 0 20px; /* Немного больший отступ */
  }
}

/* Для экранов 720px и меньше (планшеты) */
@media (max-width: 720px) {
  main {
    margin-top: 100px; /* Уменьшаем отступ сверху, учитывая изменения в HeroSection */
    width: 95%; /* Чуть больше ширина, меньше отступы */
    padding: 0 15px; /* Уменьшаем отступ */
  }
}

/* Для экранов 375px и меньше (мобильные телефоны) */
@media (max-width: 375px) {
  main {
    margin-top: 80px; /* Еще уменьшаем отступ */
    width: 95%; /* Сохраняем ширину */
    padding: 0 10px; /* Еще уменьшаем отступ */
  }
}

.scroll-to-top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
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
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #bd9e7e;
    transform: translateY(-3px);
  }

  /* Адаптивность для кнопки "Наверх" */
  @media (max-width: 720px) {
    width: 45px;
    height: 45px;
    bottom: 20px;
    right: 20px;
  }

  @media (max-width: 375px) {
    width: 40px;
    height: 40px;
    bottom: 15px;
    right: 15px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
