<template>
  <NuxtLayout name="page-layout">
    <article class="legal-page">
      <h1 class="legal-page__title">Политика конфиденциальности</h1>
      <p class="legal-page__lead">
        Настоящая Политика конфиденциальности описывает, какие данные мы
        собираем при бронировании дома «{{ CONTACT.brand.name }}
        {{ CONTACT.brand.nameAccent }}» и как мы их используем.
      </p>

      <section class="legal-page__section">
        <h2>1. Какие данные мы собираем</h2>
        <p>При оформлении заявки на бронирование мы запрашиваем:</p>
        <ul>
          <li>имя гостя;</li>
          <li>номер телефона для связи;</li>
          <li>выбранные даты заезда и выезда.</li>
        </ul>
      </section>

      <section class="legal-page__section">
        <h2>2. Зачем мы их используем</h2>
        <p>
          Данные используются исключительно для подтверждения брони и связи с
          гостем по поводу заезда. Мы не передаём их третьим лицам и не
          используем для рассылок.
        </p>
      </section>

      <section class="legal-page__section">
        <h2>3. Как долго хранятся данные</h2>
        <p>
          Данные хранятся в течение срока, необходимого для оказания услуг и
          выполнения требований законодательства РФ, после чего удаляются.
        </p>
      </section>

      <section class="legal-page__section">
        <h2>4. Связь с нами</h2>
        <p>
          По вопросам обработки персональных данных свяжитесь с нами по телефону
          <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a
          >.
        </p>
      </section>
    </article>
  </NuxtLayout>
</template>

<script setup>
useSeoMeta({
  title: "Политика конфиденциальности — Novotarmanskiy house",
  description:
    "Как мы обрабатываем персональные данные гостей при бронировании.",
  robots: "noindex",
});
</script>

<style lang="scss" scoped>
.legal-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  color: #333;
  line-height: 1.6;

  &__title {
    font-size: clamp(28px, 4vw, 40px);
    color: #5e4e3b;
    margin-bottom: 24px;
  }

  &__lead {
    font-size: 17px;
    color: #555;
    margin-bottom: 32px;
  }

  &__section {
    margin-bottom: 28px;
    h2 {
      font-size: 20px;
      color: #5e4e3b;
      margin-bottom: 12px;
    }
    ul {
      padding-left: 20px;
      li {
        margin-bottom: 6px;
      }
    }
    a {
      color: var(--primary, #b9946e);
    }
  }

  &__placeholder {
    margin-top: 40px;
    padding: 16px 20px;
    background: #fdf5e6;
    border: 1px dashed #d8b48b;
    border-radius: 12px;
    font-size: 14px;
    color: #8a6a3d;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__placeholder-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 1px;
  }
}
</style>
