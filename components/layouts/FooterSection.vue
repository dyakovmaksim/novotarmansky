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

<script setup>
// В Vue 3 с <script setup>, здесь нет необходимости в дополнительном JavaScript для этого компонента.
// Все логика адаптивности находится в CSS.
</script>

<style scoped>
/* Убедитесь, что переменная --primary определена где-то в вашем глобальном CSS,
   например, в файле main.css или App.vue, иначе используйте запасное значение. */
:root {
  --primary: #5e4e3b; /* Пример запасного цвета, если не определен глобально */
}

.footer {
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
  background-color: transparent;
}

.footer-container {
  max-width: 1200px; /* Default max-width for larger screens */
  margin: 0 auto;
  padding: 16px 40px; /* Default padding for larger screens */
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
  gap: 48px; /* Default gap for larger screens */
  box-sizing: border-box;
}

.footer-logo {
  font-size: 24px; /* Default font size */
  color: var(--primary);
  text-decoration: none; /* Ensure link underline is removed */
}

.footer-nav {
  display: flex;
  gap: 24px; /* Default gap for navigation links */
  flex-wrap: wrap; /* Allow links to wrap to the next line if needed */
  justify-content: flex-end; /* Align links to the end (right) */
}

.footer-nav > a {
  font-size: 16px; /* Default font size */
  color: var(--primary);
  text-decoration: none;
  position: relative;
  transition: opacity 0.2s ease; /* Changed from color to opacity for consistency */
}

.footer-nav > a:hover {
  opacity: 0.7; /* Hover effect remains */
}

/* Стиль для активной ссылки (как "О нас" на изображении) */
/* Для NuxtLink, класс router-link-exact-active будет добавлен автоматически */
.footer-nav > a.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ---
Media Queries for Responsiveness
--- */

/* For screens 1280px and below */
@media (max-width: 1280px) {
  .footer-container {
    max-width: 90%; /* Adjust width to leave some padding on the sides */
    padding: 16px 20px; /* Adjust horizontal padding */
    gap: 32px; /* Slightly reduce gap */
  }
}

/* For screens 720px and below (tablets in portrait mode, some smaller laptops) */
@media (max-width: 720px) {
  .footer-container {
    flex-direction: column; /* Stack logo and nav vertically */
    align-items: center; /* Center items when stacked */
    padding: 20px; /* Adjust padding for more breathing room */
    border-top-left-radius: 20px; /* Reduce border-radius */
    border-top-right-radius: 20px; /* Reduce border-radius */
    gap: 20px; /* Smaller gap between stacked logo and nav */
  }

  .footer-logo {
    font-size: 22px; /* Slightly reduce font size for logo */
    margin-bottom: 10px; /* Add space below logo */
  }

  .footer-nav {
    flex-direction: column; /* Stack navigation links vertically */
    gap: 12px; /* Smaller gap between vertical links */
    align-items: center; /* Center links when stacked */
    width: 100%; /* Make links take full width */
  }

  .footer-nav > a {
    font-size: 15px; /* Slightly reduce font size for links */
    padding: 5px 0; /* Add vertical padding for clickable area */
  }
}

/* For screens 375px and below (mobile phones) */
@media (max-width: 375px) {
  .footer-container {
    padding: 15px; /* Further reduce padding for very small screens */
    border-top-left-radius: 15px; /* Further reduce border-radius */
    border-top-right-radius: 15px; /* Further reduce border-radius */
    gap: 15px; /* Smaller gap */
  }

  .footer-logo {
    font-size: 18px; /* Further reduce logo font size */
  }

  .footer-nav {
    gap: 10px; /* Further reduce gap between links */
  }

  .footer-nav > a {
    font-size: 14px; /* Further reduce link font size */
  }
}
</style>
