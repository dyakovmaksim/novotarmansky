<template>
  <footer class="footer">
    <div class="footer-container">
      <NuxtLink to="/" class="logo-link">
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

<style scoped>
.footer {
  --primary-color: var(--primary, #5e4e3b);
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
  background-color: transparent;
  padding: 0 10px;
}

.footer-container {
  max-width: 1200px; 
  margin: 0 auto;
  padding: 24px 40px; 
  background-color: white;
  border: 4px solid var(--primary-color);
  border-bottom: none;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px; 
  box-sizing: border-box;
}

.logo-link {
  text-decoration: none;
}

.footer-logo {
  font-size: 24px; 
  color: var(--primary-color);
  font-weight: 600;
  white-space: nowrap;
}

.footer-nav {
  display: flex;
  gap: 24px; 
  flex-wrap: wrap; 
  justify-content: flex-end;
}

.footer-nav > a {
  font-size: 16px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease; 
}

.footer-nav > a:hover {
  opacity: 0.7; 
}

.footer-nav > a.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 1024px) {
  .footer-container {
    padding: 20px 30px;
    gap: 24px;
  }
  
  .footer-nav {
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
    border-width: 3px;
    gap: 24px;
  }

  .footer-nav {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .footer-logo {
    font-size: 20px;
  }
}

@media (max-width: 375px) {
  .footer-container {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 25px 15px;
  }

  .footer-logo {
    font-size: 18px;
  }

  .footer-nav > a {
    font-size: 15px;
  }
}
</style>