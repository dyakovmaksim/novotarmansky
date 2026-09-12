<template>
  <a class="skip-link" href="#main-content">Перейти к содержимому</a>
  <header class="site-nav">
    <nav class="site-container nav-inner" aria-label="Основная навигация">
      <NuxtLink to="/" class="brand" @click="open = false"
        >novotarmanskiy<span>house</span></NuxtLink
      >
      <div class="desktop-links">
        <NuxtLink v-for="link in links" :key="link.path" :to="link.path">{{
          link.label
        }}</NuxtLink>
      </div>
      <NuxtLink to="/booking" class="nav-book">Выбрать даты</NuxtLink>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-navigation"
        :aria-label="open ? 'Закрыть меню' : 'Открыть меню'"
        @click="open = !open"
      >
        {{ open ? "×" : "☰" }}
      </button>
    </nav>
    <nav
      v-if="open"
      id="mobile-navigation"
      class="mobile-navigation"
      aria-label="Мобильная навигация"
      @keydown.esc="open = false"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        @click="open = false"
        >{{ link.label }}</NuxtLink
      >
      <NuxtLink to="/booking" class="button" @click="open = false"
        >Выбрать даты</NuxtLink
      >
      <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a>
    </nav>
  </header>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
const open = ref(false),
  route = useRoute();
const links = [
  { path: "/aboutus", label: "О доме" },
  { path: "/photos", label: "Фотографии" },
  { path: "/promotion", label: "Акции" },
  { path: "/contacts", label: "Как добраться" },
];
watch(
  () => route.fullPath,
  () => (open.value = false),
);
function escape(e) {
  if (e.key === "Escape") open.value = false;
}
onMounted(() => document.addEventListener("keydown", escape));
onUnmounted(() => document.removeEventListener("keydown", escape));
</script>
<style scoped>
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fffffffa;
  border-bottom: 1px solid var(--line);
  z-index: 100;
}
.nav-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 80px;
}
.brand {
  font-weight: 700;
  font-size: 21px;
  letter-spacing: -0.7px;
  white-space: nowrap;
}
.brand span {
  font-weight: 400;
}
.desktop-links {
  display: flex;
  gap: 24px;
  margin-left: auto;
  font-size: 14px;
}
.desktop-links a {
  padding: 12px 0;
}
.desktop-links .router-link-active {
  text-decoration: underline;
  text-underline-offset: 7px;
}
.nav-book {
  background: var(--accent);
  color: white;
  padding: 12px 18px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.menu-toggle {
  display: none;
  background: white;
  color: var(--ink);
  width: 44px;
  height: 44px;
  font-size: 25px;
  border: 1px solid var(--line);
  border-radius: 9px;
  flex-shrink: 0;
}
.mobile-navigation {
  padding: 20px;
  display: grid;
  gap: 8px;
  background: white;
  border-bottom: 1px solid var(--line);
  max-height: calc(100dvh - 72px);
  overflow: auto;
}
.mobile-navigation a {
  padding: 12px;
}
.skip-link {
  position: fixed;
  top: -100px;
  left: 20px;
  padding: 12px;
  background: white;
  z-index: 200;
}
.skip-link:focus {
  top: 10px;
}
@media (min-width: 961px) {
  .mobile-navigation {
    display: none;
  }
}
@media (max-width: 960px) {
  .desktop-links {
    display: none;
  }
  .nav-book {
    margin-left: auto;
  }
  .menu-toggle {
    display: block;
  }
  .nav-inner {
    min-height: 72px;
    gap: 12px;
  }
}
@media (max-width: 540px) {
  .nav-book {
    display: none;
  }
  .menu-toggle {
    margin-left: auto;
  }
  .brand {
    font-size: 20px;
  }
}
</style>
