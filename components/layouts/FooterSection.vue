<template>
  <footer class="footer">
    <div class="footer-container">
      <NuxtLink to="/">
        <div class="footer-logo">novotarmanskiy house</div>
      </NuxtLink>
      <div class="footer-nav">
        <NuxtLink to="/booking">Бронирование</NuxtLink>
        <NuxtLink to="/aboutus">О нас</NuxtLink>
        <NuxtLink to="/photos">Фото</NuxtLink>
        <NuxtLink to="/promotion">Акции</NuxtLink>
        <NuxtLink to="/contacts">Контакты</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
  background-color: transparent;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px;
  background-color: white;
  border-top: 4px solid var(--primary);
  border-left: 4px solid var(--primary);
  border-right: 4px solid var(--primary);
  border-bottom: none;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  box-sizing: border-box;
}

.footer-logo {
  font-size: 24px;
  color: var(--primary);
}

.footer-nav {
  gap: 24px;
  display: flex;
}

.footer-nav > a {
  font-size: 16px;
  color: var(--primary);
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease;
  justify-content: end;
}

.footer-nav > a:hover {
  color: var(--primary);
}

.footer-nav > a.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
