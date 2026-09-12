<template>
  <footer class="house-footer">
    <div class="site-container">
      <div class="footer-layout">
        <div>
          <NuxtLink to="/" class="footer-brand"
            >novotarmanskiy<span>house</span></NuxtLink
          >
          <p>Дом для отдыха в Новотарманском.<br >В 20 минутах от Тюмени.</p>
          <div class="footer-socials">
            <a
              v-for="s in CONTACT.socials"
              :key="s.id"
              :href="s.href"
              target="_blank"
              rel="noopener"
              >{{ s.label }}</a
            >
          </div>
        </div>
        <nav aria-label="Навигация в подвале">
          <NuxtLink to="/aboutus">О доме</NuxtLink
          ><NuxtLink to="/photos">Фотографии</NuxtLink
          ><NuxtLink to="/booking">Выбрать даты</NuxtLink
          ><NuxtLink to="/promotion">Акции</NuxtLink>
        </nav>
        <div>
          <a class="footer-phone" :href="CONTACT.phone.href">{{
            CONTACT.phone.display
          }}</a>
          <p>{{ CONTACT.address.short }}</p>
          <p>Звонки {{ CONTACT.workHours.value }}</p>
          <NuxtLink to="/contacts" class="text-button">Как добраться</NuxtLink>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} Novotarmanskiy house</span
        ><NuxtLink to="/privacy">Конфиденциальность</NuxtLink
        ><NuxtLink to="/personal-data">Персональные данные</NuxtLink>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.house-footer {
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 48px 0 24px;
}
.footer-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.7fr 1fr;
  gap: 40px;
}
.footer-brand {
  font-size: 22px;
  font-weight: 700;
}
.footer-brand span {
  font-weight: 400;
}
.house-footer p {
  color: var(--muted);
  font-size: 14px;
  margin-top: 12px;
}
.footer-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  font-size: 14px;
}
.footer-socials a {
  padding: 8px 0;
}
.footer-layout nav {
  display: grid;
  align-content: start;
  gap: 8px;
}
.footer-layout nav a {
  padding: 6px 0;
  font-size: 15px;
}
.footer-phone {
  font-size: 20px;
  font-weight: 600;
}
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  border-top: 1px solid var(--line);
  margin-top: 32px;
  padding-top: 20px;
  font-size: 13px;
  color: var(--muted);
}
.footer-bottom a {
  text-decoration: underline;
}
@media (max-width: 700px) {
  .footer-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .footer-layout nav {
    grid-template-columns: 1fr 1fr;
  }
  .house-footer {
    padding-top: 32px;
  }
  .footer-bottom {
    gap: 12px;
  }
}
</style>
