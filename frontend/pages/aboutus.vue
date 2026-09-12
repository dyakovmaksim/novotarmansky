<template>
  <NuxtLayout name="page-layout"
    ><article class="about-page site-container">
      <header class="page-heading">
        <h1>Дом для времени вместе</h1>
        <p>
          Novotarmanskiy house — загородный дом с баней в посёлке
          Новотарманский, рядом с Тюменью.
        </p>
      </header>
      <NuxtImg
        class="about-cover"
        src="/images/carousel/carousel2.jpg"
        alt="Дом с террасой и мангальной зоной"
        width="1400"
        format="webp"
        quality="82"
        loading="eager"
      />
      <div class="about-details">
        <section>
          <h2>Собраться за одним столом</h2>
          <p>
            Кухня-гостиная с обеденным столом, отдельные спальни и собственный
            участок. Готовьте вместе, общайтесь на террасе и отдыхайте в удобном
            для вас ритме.
          </p>
          <NuxtImg
            src="/images/carousel/carousel1.jpg"
            alt="Кухня-гостиная"
            width="800"
            format="webp"
            loading="lazy"
          />
        </section>
        <section>
          <h2>Добавить баню к заезду</h2>
          <p>
            Русскую баню можно выбрать при оформлении заявки. Её стоимость сразу
            появится в расчёте поездки.
          </p>
          <NuxtImg
            src="/images/sauna.png"
            alt="Баня на участке"
            width="800"
            format="webp"
            loading="lazy"
          />
        </section>
      </div>
      <section class="house-rules">
        <h2>Перед поездкой</h2>
        <dl>
          <div>
            <dt>Заезд и выезд</dt>
            <dd>Заезд после 15:00, выезд до 12:00.</dd>
          </div>
          <div>
            <dt>Размещение</dt>
            <dd>
              До 8 гостей, включая детей. В доме 2 спальни; нужные спальные
              места согласуем перед заездом.
            </dd>
          </div>
          <div>
            <dt>Подтверждение</dt>
            <dd>
              После заявки хозяин свяжется с вами по телефону и согласует
              детали.
            </dd>
          </div>
        </dl>
        <NuxtLink to="/booking" class="button">Выбрать даты отдыха</NuxtLink>
      </section>
    </article></NuxtLayout
  >
</template>
<script setup>
useSeoMeta({
  title: "О доме — Novotarmanskiy house",
  description:
    "Загородный дом с кухней-гостиной, спальнями, террасой и русской баней. Узнайте больше перед поездкой.",
});
</script>
<style scoped>
.about-page {
  padding-bottom: 64px;
}
.about-cover {
  width: 100%;
  max-height: 560px;
  object-fit: cover;
  border-radius: 16px;
}
.about-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 48px;
}
.about-details h2,
.house-rules h2 {
  font-size: 30px;
  margin-bottom: 16px;
}
.about-details p {
  color: var(--muted);
  margin-bottom: 24px;
  font-size: 17px;
  line-height: 1.65;
}
.about-details img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 14px;
}
.house-rules {
  padding: 32px;
  background: var(--surface);
  border-radius: 16px;
  margin-top: 48px;
}
.house-rules dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin: 24px 0;
}
.house-rules dt {
  font-weight: 600;
  margin-bottom: 8px;
}
.house-rules dd {
  color: var(--muted);
}
@media (max-width: 700px) {
  .about-details {
    grid-template-columns: 1fr;
  }
  .house-rules dl {
    grid-template-columns: 1fr;
  }
  .house-rules {
    padding: 24px;
  }
  .about-details h2,
  .house-rules h2 {
    font-size: 26px;
  }
}
</style>
