<template>
  <nav class="nav" :class="{ 'nav--scrolled': isScrolled }" role="navigation">
    <div class="nav__container">
      <NuxtLink to="/" class="nav__logo">
        novotarmanskiy<span>house</span>
      </NuxtLink>

      <ul class="nav__menu">
        <li v-for="link in links" :key="link.path">
          <NuxtLink :to="link.path" class="nav__link">{{ link.name }}</NuxtLink>
        </li>
      </ul>

      <div class="nav__actions">
        <NuxtLink to="/booking" class="nav__cta-btn">Бронировать</NuxtLink>
        
        <button 
          class="nav__burger" 
          @click="toggleMenu" 
          :class="{ 'is-active': isOpen }"
          aria-label="Открыть меню"
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <transition name="menu-fade">
      <div v-if="isOpen" class="nav__mobile-overlay" @click.self="toggleMenu">
        <div class="nav__mobile-content">
          <ul class="nav__mobile-links">
            <li v-for="link in links" :key="link.path" @click="isOpen = false">
              <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const isScrolled = ref(false);

const links = [
  { name: "О нас", path: "/aboutus" },
  { name: "Фото", path: "/photos" },
  { name: "Акции", path: "/promotion" },
  { name: "Контакты", path: "/contacts" },
];

const toggleMenu = () => (isOpen.value = !isOpen.value);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 24px 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  // Состояние при скролле
  &--scrolled {
    padding: 12px 0;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    .nav__logo, .nav__link { color: #3d2c17; }
    .nav__burger span { background: #3d2c17; }
  }

  &__container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    font-size: 22px;
    font-weight: 700;
    text-decoration: none;
    color: #fff;
    letter-spacing: -0.5px;
    transition: color 0.3s;

    span { font-weight: 300; opacity: 0.8; }
  }

  &__menu {
    display: flex;
    gap: 32px;
    list-style: none;

    @media (max-width: 850px) { display: none; }
  }

  &__link {
    color: #fff;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    position: relative;
    padding: 8px 0;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary, #5e4e3b);
      transition: width 0.3s ease;
    }

    &:hover::after { width: 100%; }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &__cta-btn {
    background: var(--primary, #5e4e3b);
    color: #fff;
    padding: 10px 24px;
    border-radius: 100px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: transform 0.3s ease;

    &:hover { transform: scale(1.05); }

    @media (max-width: 480px) { display: none; }
  }

  &__burger {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;

    span {
      width: 28px;
      height: 2px;
      background: #fff;
      transition: all 0.3s ease;
    }

    &.is-active {
      span:nth-child(1) { transform: translateY(4px) rotate(45deg); }
      span:nth-child(2) { transform: translateY(-4px) rotate(-45deg); }
    }

    @media (max-width: 850px) { display: flex; }
  }

  /* Мобильное меню */
  &__mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    z-index: 999;
    display: flex;
    justify-content: flex-end;
  }

  &__mobile-content {
    width: 80%;
    max-width: 300px;
    background: #fff;
    height: 100%;
    padding: 80px 40px;
    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
  }

  &__mobile-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 30px;

    a {
      text-decoration: none;
      color: #3d2c17;
      font-size: 20px;
      font-weight: 600;
    }
  }
}

// Анимации
.menu-fade-enter-active, .menu-fade-leave-active {
  transition: opacity 0.3s ease;
  .nav__mobile-content { transition: transform 0.3s ease; }
}

.menu-fade-enter-from, .menu-fade-leave-to {
  opacity: 0;
  .nav__mobile-content { transform: translateX(100%); }
}
</style>