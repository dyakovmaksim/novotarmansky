<template>
  <div class="layout-wrapper">
    <NavBar />

    <HeroSection v-if="route.path === '/'" />

    <main :class="['main-content', { 'pt-inner': route.path !== '/' }]">
      <slot />
    </main>

    <FooterSection />

    <transition name="fade">
      <button v-if="isScrolled" @click="scrollToTop" class="scroll-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import NavBar from "@/components/layouts/NavBar.vue";
import HeroSection from "@/components/layouts/HeroSection.vue";
import FooterSection from "@/components/layouts/FooterSection.vue";

const route = useRoute();
const isScrolled = ref(false);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
const handleScroll = () => { isScrolled.value = window.scrollY > 400; };

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  
  // Инициализация анимации для элементов с классом .reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style lang="scss" scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; // Растягиваем на всю высоту экрана
}

.main-content {
  flex-grow: 1; // Заставляет контент занимать всё свободное место, прижимая футер
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  &.pt-inner { padding-top: 140px; } // Увеличил отступ для страницы "О нас"

  @media (max-width: 768px) {

    &.pt-inner { padding-top: 100px; }
  }
}

.scroll-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #5e4e3b;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>