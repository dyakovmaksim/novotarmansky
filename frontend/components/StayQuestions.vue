<template>
  <section class="stay-questions">
    <h2>Перед тем как выбрать даты</h2>
    <div>
      <details v-for="item in questions" :key="item.title">
        <summary>{{ item.title }}</summary>
        <p>{{ item.text }}</p>
      </details>
    </div>
    <p class="questions-contact">
      Остались вопросы? <a :href="CONTACT.phone.href">Позвоните хозяину</a> или
      <a :href="CONTACT.socials[0].href" target="_blank" rel="noopener"
        >напишите в Telegram</a
      >.
    </p>
  </section>
</template>
<script setup>
const questions = [
  {
    title: "Как подтвердить бронирование?",
    text: "Выберите свободные даты, укажите гостей и отправьте имя и телефон. Хозяин свяжется с вами и подтвердит условия. До этого заявка не считается подтверждённой бронью.",
  },
  {
    title: "Сколько гостей можно пригласить?",
    text: "В доме может быть максимум 8 гостей, включая детей. Укажите всех участников поездки в форме бронирования.",
  },
  {
    title: "Во сколько заезд и выезд?",
    text: "Заезд после 15:00, выезд до 12:00. Если нужно другое время, заранее обсудите его с хозяином.",
  },
  {
    title: "Баня входит в стоимость?",
    text: "Баня добавляется отдельно в форме. Стоимость услуги сразу включается в расчёт. Условия акций хозяин уточнит при подтверждении.",
  },
  {
    title: "Что делать, если планы изменились?",
    text: "Свяжитесь с хозяином по телефону. Условия переноса, отмены и оплаты стоит согласовать до подтверждения поездки.",
  },
];
</script>
<style scoped>
.stay-questions {
  padding: 32px 24px 64px;
}
.stay-questions h2 {
  font-size: clamp(28px, 3vw, 36px);
  margin-bottom: 24px;
}
.stay-questions details {
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
}
.stay-questions summary {
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
}
.stay-questions details p {
  margin: 12px 0;
  max-width: 70ch;
  color: var(--muted);
  line-height: 1.65;
}
.questions-contact {
  margin-top: 24px;
  color: var(--muted);
}
.questions-contact a {
  text-decoration: underline;
  color: var(--ink);
}
@media (max-width: 600px) {
  .stay-questions {
    padding: 24px 20px 48px;
  }
  .stay-questions summary {
    font-size: 16px;
  }
}
</style>
