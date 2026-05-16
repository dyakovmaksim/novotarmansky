<template>
  <section class="about">
    <div class="about__wrapper">
      <div class="about__bg">
        <img src="/images/AboutUsPic.png" alt="Вид на дом" class="about__img" />
        <div class="about__overlay"></div>
      </div>

      <div class="about__content">
        <div class="about__text-block">
          <span class="about__subtitle">Ваш идеальный побег из города</span>
          <h2 class="about__title">О нашем пространстве</h2>
          
          <div class="about__description">
            <p>
              Мы создали <strong>Novotarmanskiy house</strong> как место силы, где современный комфорт 
              встречается с нетронутой природой Тюменского края. Каждая деталь — от мягкого освещения 
              до текстуры дерева — подобрана для вашего расслабления.
            </p>
            <p>
              Наша миссия — предоставить вам не просто жилье, а полноценный опыт 
              загородной жизни, окружив теплом, уютом и безупречным сервисом.
            </p>
          </div>

          <div class="about__features">
            <div class="about__feature">
              <span class="about__feature-val">20</span>
              <span class="about__feature-label">мин от Тюмени</span>
            </div>
            <div class="about__feature">
              <span class="about__feature-val">100%</span>
              <span class="about__feature-label">приватность</span>
            </div>
            <div class="about__feature">
              <span class="about__feature-val">0+</span>
              <span class="about__feature-label">подходит детям</span>
            </div>
          </div>
        </div>

        <div class="about__side-card">
          <div class="about__glass-box">
            <p class="about__quote">
              «Место, где время замедляется, а мысли приходят в порядок»
            </p>
            <div class="about__badge">Premium Stay</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about {
  padding: 20px 0; // Внешние отступы регулируются в PageLayout через gap

  &__wrapper {
    position: relative;
    width: 100%;
    min-height: 500px;
    border-radius: 40px;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);

    @media (max-width: 992px) {
      min-height: auto;
      flex-direction: column;
    }
  }

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.85) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.2) 100%
    );

    @media (max-width: 992px) {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    padding: 60px;
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    width: 100%;
    align-items: center;

    @media (max-width: 1100px) {
      padding: 40px;
    }

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      padding: 40px 24px;
      text-align: center;
    }
  }

  &__subtitle {
    color: var(--primary, #b9946e);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 13px;
    font-weight: 700;
    display: block;
    margin-bottom: 12px;
  }

  &__title {
    color: #fff;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 300;
    margin-bottom: 24px;
    line-height: 1.1;
  }

  &__description {
    color: rgba(255, 255, 255, 0.85);
    font-size: 17px;
    line-height: 1.7;
    max-width: 550px;

    p { margin-bottom: 16px; }
    strong { color: #fff; font-weight: 600; }

    @media (max-width: 992px) {
      margin: 0 auto 30px;
    }
  }

  &__features {
    display: flex;
    gap: 30px;
    margin-top: 40px;

    @media (max-width: 992px) {
      justify-content: center;
      gap: 20px;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 15px;
    }
  }

  &__feature {
    display: flex;
    flex-direction: column;
    &-val {
      color: var(--primary, #b9946e);
      font-size: 24px;
      font-weight: 700;
    }
    &-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      text-transform: uppercase;
    }
  }

  &__glass-box {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 40px;
    border-radius: 30px;
    text-align: center;
    transform: rotate(2deg); // Легкий игривый наклон

    @media (max-width: 992px) {
      transform: none;
      max-width: 400px;
      margin: 0 auto;
    }
  }

  &__quote {
    color: #fff;
    font-style: italic;
    font-size: 18px;
    line-height: 1.5;
    margin-bottom: 20px;
    font-weight: 300;
  }

  &__badge {
    display: inline-block;
    padding: 8px 16px;
    background: var(--primary, #b9946e);
    color: #fff;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>