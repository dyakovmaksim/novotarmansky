<template>
  <section class="location">
    <div class="location__card">
      <div class="location__content">
        
        <div class="location__info">
          <h2 class="location__title">Расположение</h2>
          
          <div class="location__list">
            <div class="location__item">
              <div class="location__icon">📍</div>
              <div class="location__item-text">
                <strong>Посёлок Новотарманский</strong>
                <p>Уютное место в окружении природы</p>
              </div>
            </div>

            <div class="location__item">
              <div class="location__icon">♨️</div>
              <div class="location__item-text">
                <strong>Источник «Советский»</strong>
                <p>10 минут на автомобиле</p>
              </div>
            </div>

            <div class="location__item">
              <div class="location__icon">🌲</div>
              <div class="location__item-text">
                <strong>База отдыха «Верхний Бор»</strong>
                <p>15 минут (источники, озеро, лес)</p>
              </div>
            </div>
          </div>
        </div>

        <div class="location__map-wrapper">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A6b6abf998c508a3928ec2bde98c8011f402be7e5a6b1f8cdfeede9111f737bc6&amp;source=constructor" 
            width="100%" 
            height="100%" 
            frameborder="0"
            class="location__map"
            title="Карта проезда"
          ></iframe>
          <div class="location__map-overlay"></div>
        </div>

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.location {
  padding: 20px 0;
  
  &__card {
    background-color: var(--primary, #5e4e3b);
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    min-height: 450px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  &__info {
    padding: 60px;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 1200px) { padding: 40px; }
  }

  &__title {
    font-size: 42px;
    font-weight: 600;
    margin-bottom: 40px;
    letter-spacing: -0.5px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__item {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  &__icon {
    font-size: 24px;
    background: rgba(255, 255, 255, 0.1);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;
  }

  &__item-text {
    strong {
      display: block;
      font-size: 18px;
      margin-bottom: 4px;
    }
    p {
      margin: 0;
      font-size: 15px;
      opacity: 0.8;
      line-height: 1.4;
    }
  }

  &__map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 350px;
    background: #f0f0f0;
  }

  &__map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: grayscale(0.2) contrast(1.1);
    transition: filter 0.3s ease;

    &:hover {
      filter: grayscale(0);
    }
  }

  @media (max-width: 992px) {
    &__info {
      order: 1;
      text-align: center;
      align-items: center;
    }
    &__item {
      text-align: left;
    }
    &__map-wrapper {
      order: 2;
      height: 350px;
    }
  }

  @media (max-width: 768px) {
    &__card { border-radius: 30px; }
    &__title { font-size: 32px; margin-bottom: 30px; }
    &__info { padding: 40px 24px; }
    &__map-wrapper { height: 300px; }
  }

  @media (max-width: 480px) {
    &__title { font-size: 28px; }
    &__icon { width: 40px; height: 40px; font-size: 20px; }
    &__item-text {
      strong { font-size: 16px; }
      p { font-size: 13px; }
    }
    &__map-wrapper { height: 250px; }
  }
}
</style>