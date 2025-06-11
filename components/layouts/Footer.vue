<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-logo">novotarmanskiy house</div>
      <ul class="footer-links">
        <li><NuxtLink to="/#booking">Бронирование</NuxtLink></li>
        <li><NuxtLink to="/#aboutus">О нас</NuxtLink></li>
        <li><NuxtLink to="/#photos">Фото</NuxtLink></li>
        <li><NuxtLink to="/#promotion">Акции</NuxtLink></li>
        <li><NuxtLink to="/#contacts">Контакты</NuxtLink></li>
      </ul>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  width: 100%;
  background-color: white;
  padding: 20px 0;
  box-sizing: border-box;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 32px;
  border: 3px solid var(--primary);
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.footer-logo {
  font-size: 24px;
  color: var(--primary);
}

.footer-links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.footer-links li {
  margin: 0;
  padding: 0;
}

.footer-links a {
  font-size: 16px;
  color: var(--primary);
  text-decoration: none; /* Убираем подчеркивание */
  position: relative;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary);
}

/* Убираем подчеркивание для активной ссылки */
.footer-links a.router-link-exact-active::after {
  display: none;
}
</style>
