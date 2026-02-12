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
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  /* Убираем гигантский margin-top, оставляем минимальный 
     зазор под вылетающей карточкой Hero */
  margin-top: 100px; 
  display: flex;
  flex-direction: column;
  /* Устанавливаем ОДИНАКОВОЕ расстояние между всеми секциями */
  gap: 40px; 
  padding: 0 20px;
  box-sizing: border-box;
}

/* Для средних экранов (Планшеты) */
@media (max-width: 1024px) {
  main {
    margin-top: 90px;
    gap: 60px;
  }
}

/* Экраны 720px и меньше */
@media (max-width: 768px) {
  main {
    margin-top: 90px;
    gap: 30px; /* Чуть плотнее на мобилках */
    padding: 0 16px;
  }
}

/* Мобильные телефоны: экраны 480px и меньше */
@media (max-width: 480px) {
  main {
    margin-top: 90px;
    padding: 0 12px;
    gap: 40px;
  }
}

/* Кнопка "Наверх" — добавляем прозрачность, чтобы не перекрывала контент намертво */
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    background-color: #bd9e7e;
    transform: translateY(-5px);
  }
}

@media (max-width: 480px) {
  .scroll-to-top-button {
    width: 45px;
    height: 45px;
    bottom: 20px;
    right: 20px;
  }
}

/* Плавная анимация fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
