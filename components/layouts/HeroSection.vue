<template>
  <section class="hero">
    <img src="/images/house.jpg" alt="Дом" class="hero__bg" />
    <div class="hero__content">
      <div class="hero__card">
        <div class="hero__text">
          Добро пожаловать в Novotarmanskiy house <br />
          – ваш идеальный выбор для аренды уютного дома в живописном уголке
          Тюмени!
        </div>
        <div class="hero__buttons">
          <NuxtLink to="/#photos" class="hero__btn hero__btn--white"
            >Смотреть фото</NuxtLink
          >
          <NuxtLink to="/#booking" class="hero__btn hero__btn--beige"
            >Бронировать</NuxtLink
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  width: 100%;
  height: 360px; // Default height for larger screens
  background: #fff;
  border-bottom-right-radius: 48px;
  display: flex;
  align-items: flex-end;

  &__bg {
    position: absolute;
    top: 0;
    left: -2px; // Adjusted for minor visual offset
    width: auto;
    height: 100%;
    min-width: 100%;
    object-fit: cover;
    object-position: center 55%;
    border-radius: 0 0 161px 161px; // Default large border-radius
    z-index: 0;
  }

  &__content {
    position: relative; // Essential for z-index
    width: 100%;
    max-width: 1200px; // Aligns with your navbar max-width
    margin: 0 auto;
    display: flex;
    z-index: 1;
    padding: 0 16px; // Padding for sides on all resolutions, adjusted in media queries
    justify-content: flex-start; // Align content to the left
  }

  &__card {
    position: absolute;
    // We'll adjust left/right for responsiveness in media queries
    bottom: -140px; // Default positioning
    z-index: 2;
    background: var(--primary);
    border-radius: 30px;
    padding: 24px; // Default padding
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: fit-content; // Allows card to shrink if text/buttons are small
    max-width: 830px; // Retain max width
    min-width: 320px; // Retain min width
    left: 16px; // Default for larger screens, adjusted in media queries
    right: auto; // Reset right positioning for consistent left alignment
  }

  &__text {
    color: #fff;
    font-size: 32px; // Default font size
    font-weight: 400;
    margin-bottom: 20px;
  }

  &__buttons {
    display: flex;
    gap: 16px; // Default gap
    flex-wrap: wrap; // Allow buttons to wrap on smaller screens
  }

  &__btn {
    padding: 10px 16px;
    border-radius: 16px;
    font-size: 20px; // Default font size
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: 0.3s;
    white-space: nowrap; // Prevent button text from wrapping

    &--white {
      background: var(--primary);
      color: white;
      border: 2px solid white;
      &:hover {
        transform: scale(1.05); // Use transform for better performance
      }
    }
    &--beige {
      background: white;
      color: var(--primary);
      border: 2px solid var(--primary);
      &:hover {
        transform: scale(1.05); // Use transform for better performance
      }
    }
  }
}

// ---
// Media Queries for Responsiveness

// For screens 1280px and below (e.g., typical desktop widths, smaller laptops)
@media (max-width: 1280px) {
  .hero {
    height: 400px; // Slightly increase height to give more room
  }

  .hero__content {
    max-width: 90%; // Adjust content width to leave some padding
    padding: 0 20px;
  }

  .hero__card {
    left: 20px; // Maintain consistent left padding
    right: 20px; // Allow card to fill space up to right padding
    width: auto; // Let width be determined by left/right
    max-width: calc(100% - 40px); // Ensure card doesn't exceed content width
    min-width: unset; // Allow card to shrink below 320px if necessary
  }
}

// For screens 720px and below (e.g., tablets in portrait mode, some smaller laptops)
@media (max-width: 720px) {
  .hero {
    height: 300px; // Reduce hero section height for smaller screens
    border-bottom-right-radius: 30px; // Reduce border-radius for consistency
  }

  .hero__bg {
    border-radius: 0 0 80px 80px; // Adjust background image border-radius
    object-position: center 65%; // Adjust object position for better focus on mobile
  }

  .hero__content {
    padding: 0 15px; // Adjust padding
  }

  .hero__card {
    bottom: -100px; // Adjust card position higher
    padding: 20px; // Reduce card padding
    left: 15px; // Adjust left padding
    right: 15px; // Adjust right padding
    max-width: calc(100% - 30px); // Ensure card fits within new padding
  }

  .hero__text {
    font-size: 24px; // Reduce font size for main text
    margin-bottom: 15px;
  }

  .hero__buttons {
    flex-direction: column; // Stack buttons vertically
    gap: 10px; // Reduce gap between stacked buttons
    width: 100%; // Make buttons take full width when stacked
  }

  .hero__btn {
    width: 100%; // Full width for stacked buttons
    text-align: center; // Center text in full-width buttons
    font-size: 18px; // Reduce button font size
    padding: 12px; // Increase padding for easier tapping
  }
}

// For screens 375px and below (e.g., mobile phones)
@media (max-width: 375px) {
  .hero {
    height: 250px; // Further reduce hero section height
    border-bottom-right-radius: 20px; // Even smaller border-radius
  }

  .hero__bg {
    border-radius: 0 0 50px 50px; // Smallest border-radius for background
    object-position: center 70%; // Fine-tune background position
  }

  .hero__content {
    padding: 0 10px; // Smallest padding
  }

  .hero__card {
    bottom: -80px; // Move card even higher
    padding: 15px; // Smallest card padding
    left: 10px; // Smallest left padding
    right: 10px; // Smallest right padding
    max-width: calc(100% - 20px); // Fit within new padding
  }

  .hero__text {
    font-size: 18px; // Smallest font size for main text
    margin-bottom: 10px;
  }

  .hero__buttons {
    gap: 8px; // Smallest gap for stacked buttons
  }

  .hero__btn {
    font-size: 16px; // Smallest font size for buttons
    padding: 10px; // Smallest padding for buttons
  }
}
</style>
