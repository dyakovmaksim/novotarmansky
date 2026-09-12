<template>
  <section class="stay-benefits">
    <h2>Просто договориться. Приятно приехать.</h2>
    <div>
      <article>
        <IconKey />
        <h3>Напрямую с хозяином</h3>
        <p>Оставьте заявку и обсудите детали поездки без посредников.</p>
      </article>
      <article>
        <IconWallet />
        <h3>Понятная стоимость</h3>
        <p>
          Сначала даты и расчёт, затем ваши контакты. Платить на сайте не нужно.
        </p>
      </article>
      <article>
        <IconShield />
        <h3>Весь дом для вас</h3>
        <p>
          До 8 гостей, собственная кухня и участок для отдыха вашей компанией.
        </p>
      </article>
    </div>
  </section>
</template>
<style scoped>
.stay-benefits {
  padding: 48px 24px;
}
.stay-benefits h2 {
  font-size: clamp(28px, 3vw, 40px);
  margin-bottom: 28px;
  max-width: 24ch;
}
.stay-benefits > div {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
.stay-benefits article {
  border-top: 1px solid var(--line);
  padding-top: 24px;
}
.stay-benefits svg {
  width: 28px;
  height: 28px;
  color: var(--accent);
  margin-bottom: 16px;
}
.stay-benefits h3 {
  font-size: 21px;
  margin-bottom: 12px;
}
.stay-benefits p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--muted);
}
@media (max-width: 700px) {
  .stay-benefits {
    padding: 32px 20px;
  }
  .stay-benefits > div {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .stay-benefits article {
    padding-top: 20px;
  }
}
</style>
