<template>
  <nav class="navbar">
    <div class="nav-container">
      <NuxtLink to="/">
        <div class="nav-container__logo">novotarmanskiy house</div>
      </NuxtLink>

      <ul class="nav-container__links">
        <li><NuxtLink to="/booking">Бронирование</NuxtLink></li>
        <li><NuxtLink to="/aboutus">О нас</NuxtLink></li>
        <li><NuxtLink to="/photos">Фото</NuxtLink></li>
        <li><NuxtLink to="/promotion">Акции</NuxtLink></li>
        <li><NuxtLink to="/contacts">Контакты</NuxtLink></li>
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
    padding: 18px 0px 18px 0px;
    width: 1200px; // Default for larger screens (e.g., 1280px and above)
    margin: 0 auto;

    &__logo {
      color: #fff;
      font-weight: 600;
      font-size: 24px;
      letter-spacing: 0.5px;
    }

    &__links {
      display: flex;
      gap: 48px;
      list-style: none;

      li a {
        color: #fff;
        font-size: 16px;
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

// ---
// Media Queries for Responsiveness

// For screens 1280px and below (e.g., typical desktop widths, smaller laptops)
@media (max-width: 1280px) {
  .navbar .nav-container {
    width: 90%; /* Adjust width to leave some padding on the sides */
    padding: 18px 20px; /* Add horizontal padding for consistency */
  }
}

// For screens 720px and below (e.g., tablets in portrait mode, some smaller laptops)
@media (max-width: 720px) {
  .navbar .nav-container {
    flex-direction: column; /* Stack logo and links vertically */
    gap: 15px; /* Add some space between stacked items */
    padding: 15px 20px; /* Adjust padding for smaller screens */
    align-items: flex-start; /* Align items to the start when stacked */
  }

  .navbar .nav-container__logo {
    font-size: 20px; /* Slightly reduce font size for logo */
  }

  .navbar .nav-container__links {
    flex-direction: column; /* Stack navigation links vertically */
    gap: 10px; /* Reduce gap between vertical links */
    width: 100%; /* Make links take full width */
    align-items: flex-start; /* Align links to the start */
  }

  .navbar .nav-container__links li a {
    font-size: 15px; /* Slightly reduce font size for links */
    padding: 5px 0; /* Add some vertical padding for clickable area */
  }
}

// For screens 375px and below (e.g., mobile phones)
@media (max-width: 375px) {
  .navbar .nav-container {
    padding: 10px 15px; /* Further reduce padding for very small screens */
    gap: 10px;
  }

  .navbar .nav-container__logo {
    font-size: 18px; /* Further reduce logo font size */
  }

  .navbar .nav-container__links {
    gap: 8px; /* Further reduce gap between links */
  }

  .navbar .nav-container__links li a {
    font-size: 14px; /* Further reduce link font size */
  }
}
</style>
