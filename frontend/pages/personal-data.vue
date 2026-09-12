<template>
  <NuxtLayout name="page-layout">
    <article class="legal-page">
      <h1 class="legal-page__title">
        Согласие на обработку персональных данных
      </h1>
      <p class="legal-page__lead">
        Отправляя заявку на бронирование, вы подтверждаете согласие на обработку
        указанных вами персональных данных в соответствии с Федеральным законом
        № 152-ФЗ «О персональных данных».
      </p>

      <section v-if="CONTACT.legal.company" class="legal-page__section">
        <h2>1. Оператор</h2>
        <p>
          <template v-if="CONTACT.legal.company"
            >{{ CONTACT.legal.company }}, ИНН {{ CONTACT.legal.inn }}, ОГРНИП
            {{ CONTACT.legal.ogrnip }}.</template
          ><template v-else
            >Сведения о владельце дома можно уточнить по телефону
            <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a
            >.</template
          >
        </p>
      </section>

      <section class="legal-page__section">
        <h2>2. Состав обрабатываемых данных</h2>
        <ul>
          <li>имя;</li>
          <li>номер телефона;</li>
          <li>даты планируемого проживания.</li>
        </ul>
      </section>

      <section class="legal-page__section">
        <h2>3. Цели обработки</h2>
        <p>
          Подтверждение брони, связь с гостем для согласования заезда, ведение
          внутреннего учёта бронирований.
        </p>
      </section>

      <section class="legal-page__section">
        <h2>4. Срок действия согласия</h2>
        <p>
          Согласие действует с момента отправки заявки и до его отзыва. Для
          уточнения порядка отзыва свяжитесь с нами по телефону
          <a :href="CONTACT.phone.href">{{ CONTACT.phone.display }}</a
          >.
        </p>
      </section>
    </article>
  </NuxtLayout>
</template>

<script setup>
useSeoMeta({
  title: "Обработка персональных данных — Novotarmanskiy house",
  description:
    "Согласие на обработку персональных данных при бронировании дома.",
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
