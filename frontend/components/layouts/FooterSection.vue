<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__grid">
        <div class="footer__col footer__col--main">
          <NuxtLink to="/" class="footer__logo">
            {{ CONTACT.brand.name }}<span>{{ CONTACT.brand.nameAccent }}</span>
          </NuxtLink>
          <p class="footer__text">{{ CONTACT.brand.tagline }}</p>
          <div class="footer__socials">
            <a
              v-for="s in CONTACT.socials"
              :key="s.id"
              :href="s.href"
              target="_blank"
              rel="noopener"
              class="footer__social-link"
              :title="s.label"
            >
              {{ s.short }}
            </a>
          </div>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Навигация</h4>
          <ul class="footer__list">
            <li><NuxtLink to="/aboutus">О проекте</NuxtLink></li>
            <li><NuxtLink to="/photos">Галерея дома</NuxtLink></li>
            <li><NuxtLink to="/promotion">Текущие акции</NuxtLink></li>
            <li><NuxtLink to="/contacts">Как добраться</NuxtLink></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Для гостей</h4>
          <ul class="footer__list">
            <li><NuxtLink to="/booking">Забронировать</NuxtLink></li>
            <li><NuxtLink to="/aboutus">О доме</NuxtLink></li>
            <li><NuxtLink to="/promotion">Акции</NuxtLink></li>
            <li><NuxtLink to="/photos">Фотогалерея</NuxtLink></li>
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Связаться с нами</h4>
          <div class="footer__contacts">
            <a :href="CONTACT.phone.href" class="footer__phone">
              {{ CONTACT.phone.display }}
            </a>
            <p class="footer__address">{{ CONTACT.address.short }}</p>
            <p class="footer__worktime">
              {{ CONTACT.workHours.label }}: {{ CONTACT.workHours.value }}
            </p>
          </div>
        </div>
      </div>

      <div class="footer__divider"></div>

      <div class="footer__legal">
        <div class="footer__legal-left">
          <p>
            © {{ new Date().getFullYear() }} Novotarmanskiy House. Все права
            защищены.
          </p>
          <div class="footer__policy-links">
            <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
            <NuxtLink to="/personal-data"
              >Обработка персональных данных</NuxtLink
            >
          </div>
        </div>
        <div class="footer__legal-right">
          <p>{{ CONTACT.legal.company }}</p>
          <p>ИНН: {{ CONTACT.legal.inn }} | ОГРНИП: {{ CONTACT.legal.ogrnip }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: #fcfaf8; // Мягкий светлый фон, чтобы отделить от контента
  padding: 80px 0 30px;
  border-top: 1px solid #eee;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
    gap: 40px;
    margin-bottom: 50px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  &__logo {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary, #5e4e3b);
    text-decoration: none;
    display: block;
    margin-bottom: 20px;
    span {
      font-weight: 300;
    }
  }

  &__text {
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    margin-bottom: 25px;
  }

  &__socials {
    display: flex;
    gap: 10px;
    @media (max-width: 600px) {
      justify-content: center;
    }
  }

  &__social-link {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #5e4e3b;
    font-size: 11px;
    font-weight: 700;
    transition: all 0.3s ease;
    &:hover {
      background: #5e4e3b;
      color: #fff;
      border-color: #5e4e3b;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 25px;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 12px;
      a {
        text-decoration: none;
        color: #666;
        font-size: 15px;
        transition: color 0.2s;
        &:hover {
          color: #5e4e3b;
        }
      }
    }
  }

  &__phone {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #333;
    text-decoration: none;
    margin-bottom: 15px;
  }

  &__address,
  &__worktime {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 10px;
  }

  &__divider {
    height: 1px;
    background: #eee;
    margin-bottom: 30px;
  }

  &__legal {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 30px;
    font-size: 13px;
    color: #999;
    line-height: 1.6;

    @media (max-width: 850px) {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
  }

  &__policy-links {
    display: flex;
    gap: 20px;
    margin-top: 5px;
    a {
      color: #999;
      &:hover {
        color: #666;
      }
    }
  }
}
</style>
