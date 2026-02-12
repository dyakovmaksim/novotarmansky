<template>
  <nav class="navbar" role="navigation" aria-label="Главное меню">
    <div class="nav-container">
      <NuxtLink to="/" class="nav-logo">novotarmanskiy house</NuxtLink>

      <button class="burger" @click="toggleMenu" aria-label="Меню">
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <ul class="nav-links" :class="{ active: isOpen }">
        <li><NuxtLink to="/booking">Бронирование</NuxtLink></li>
        <li><NuxtLink to="/aboutus">О нас</NuxtLink></li>
        <li><NuxtLink to="/photos">Фото</NuxtLink></li>
        <li><NuxtLink to="/promotion">Акции</NuxtLink></li>
        <li><NuxtLink to="/contacts">Контакты</NuxtLink></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
const toggleMenu = () => (isOpen.value = !isOpen.value);
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  background: var(--primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.nav-logo {
  color: #fff;
  font-weight: 600;
  font-size: 24px;
  letter-spacing: 0.5px;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
}

.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;

  span {
    display: block;
    height: 3px;
    width: 100%;
    background: #fff;
    border-radius: 2px;
    transition: 0.3s;
  }

  span.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  span.open:nth-child(2) {
    opacity: 0;
  }
  span.open:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}

.nav-links {
  display: flex;
  gap: 48px;
  list-style: none;
  margin: 0;
  padding: 0;

  li a {
    color: #fff;
    font-size: 16px;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s ease;
    user-select: none;

    &:hover,
    &:focus {
      opacity: 0.7;
      outline: none;
    }
  }
}

@media (max-width: 1024px) {
  .nav-links {
    gap: 20px; 
  }
}

@media (max-width: 850px) {
  .burger {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%; 
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0; 
    padding: 0 20px;
    background: #b9946e; 
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s ease-in-out;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);

    &.active {
      max-height: 400px; 
      padding-bottom: 20px;
    }

    li {
      width: 100%;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      
      &:last-child { border: none; }

      a {
        display: block;
        padding: 15px 0;
        font-size: 18px; 
      }
    }
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 15px 20px; 
  }

  .nav-logo {
    font-size: 18px;
  }
}

@media (max-width: 320px) {
  .nav-logo {
    font-size: 16px;
  }
}
</style>