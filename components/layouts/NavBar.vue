<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-container__logo">novotarmanskiy house</div>
      <ul class="nav-container__links">
        <li><NuxtLink to="/">О нас</NuxtLink></li>
        <li><NuxtLink to="/#advantages">Преимущества</NuxtLink></li>
        <li><NuxtLink to="/#photos">Фото</NuxtLink></li>
        <li><NuxtLink to="/#booking">Бронирование</NuxtLink></li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  background: var(--primary);

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 48px 18px 48px;
    width: 1200px;
    margin: 0 auto;

    &__logo {
      color: #fff;
      font-weight: 600;
      font-size: 36px;
      letter-spacing: 0.5px;
    }

    &__links {
      display: flex;
      gap: 48px;
      list-style: none;

      li a {
        color: #fff;
        font-size: 24px;
        text-decoration: none;
        font-weight: 500;
        transition: opacity 0.2s;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
