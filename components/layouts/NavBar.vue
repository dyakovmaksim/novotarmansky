<template>
  <nav class="navbar">
    <div class="nav-container">
      <NuxtLink to="/" class="nav-container__logo"
        >novotarmanskiy house</NuxtLink
      >
      <button
        class="nav-container__burger"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen"
        aria-label="Toggle menu"
      >
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>
      <ul class="nav-container__links" :class="{ open: isOpen }">
        <li>
          <NuxtLink to="/booking" @click="isOpen = false"
            >Бронирование</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/aboutus" @click="isOpen = false">О нас</NuxtLink>
        </li>
        <li><NuxtLink to="/photos" @click="isOpen = false">Фото</NuxtLink></li>
        <li>
          <NuxtLink to="/promotion" @click="isOpen = false">Акции</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contacts" @click="isOpen = false">Контакты</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
</script>

<style lang="scss" scoped>
.navbar {
  background: var(--primary);
  width: 100%;
}

.nav-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-container__logo {
  color: #fff;
  font-weight: 600;
  font-size: 20px;
}

.nav-container__burger {
  background: none;
  border: none;
  width: 24px;
  height: 18px;
  padding: 0;
  position: relative;
  z-index: 10;
  cursor: pointer;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: #fff;
    margin-bottom: 5px;
    transition: transform 0.3s, opacity 0.3s;
  }
  span:last-child {
    margin-bottom: 0;
  }
  span.open:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  span.open:nth-child(2) {
    opacity: 0;
  }
  span.open:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

.nav-container__links {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--primary);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.4s ease, opacity 0.4s ease;
  z-index: 9;

  &.open {
    max-height: 500px;
    opacity: 1;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  li {
    margin: 8px 0;
    width: 100%;
    text-align: center;

    a {
      color: #fff;
      font-size: 16px;
      text-decoration: none;
      font-weight: 500;
      display: block;
      width: 100%;
      transition: opacity 0.2s;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}

@media (min-width: 576px) {
  .nav-container {
    padding: 18px 20px;
  }
  .nav-container__logo {
    font-size: 22px;
  }
}

@media (min-width: 768px) {
  .nav-container {
    padding: 18px 30px;
  }
  .nav-container__burger {
    display: none;
  }
  .nav-container__links {
    position: static;
    max-height: none;
    opacity: 1;
    overflow: visible;
    display: flex;
    flex-direction: row;
    gap: 24px;
    background: transparent;
    padding: 0;
    margin: 0;

    li {
      margin: 0;
      a {
        font-size: 15px;
      }
    }
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 18px 0;
    max-width: 1200px;
  }
  .nav-container__links {
    gap: 48px;
    li a {
      font-size: 16px;
    }
  }
}
</style>
