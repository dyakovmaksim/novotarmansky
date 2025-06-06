<template>
  <div class="about-container">
    <div class="about-content">
      <!-- Секция «О нас» -->
      <h2 class="about-title">О нас</h2>
      <div class="about-body">
        <div class="about-text">
          <p>
            Мы предлагаем комфортабельный дом для отдыха, где каждая деталь
            продумана для вашего удобства и расслабления.
          </p>
          <p>
            Наша миссия — сделать ваш отпуск или временное проживание
            незабываемым, окружив вас теплом, уютом и природной красотой.
          </p>
        </div>
        <div class="about-image-wrapper">
          <img
            src="/images/AboutUsPic.png"
            alt="Дом для отдыха"
            class="about-image"
          />
        </div>
      </div>

      <!-- Разделительная линия -->
      <div class="advantages-divider"></div>

      <!-- Секция «Наши преимущества» -->
      <div class="advantages-container">
        <h2 class="advantages-title">Наши преимущества</h2>
        <ul class="advantages-list">
          <li class="advantage-item">
            <svg
              class="advantage-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
            <span
              >Удобное расположение — наши дома находятся в близости к природе,
              городу, достопримечательностям.</span
            >
          </li>
          <li class="advantage-item">
            <svg
              class="advantage-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
            <span
              >Комфорт и качество — мы тщательно следим за чистотой и оснащением
              домов всем необходимым.</span
            >
          </li>
          <li class="advantage-item">
            <svg
              class="advantage-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
            <span
              >Гостеприимство — для нас важно, чтобы вы чувствовали себя как
              дома.</span
            >
          </li>
          <li class="advantage-item">
            <svg
              class="advantage-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="currentColor"
              />
            </svg>
            <span
              >Гибкие условия аренды — подходящие варианты для короткого и
              длительного проживания.</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
// В этом компоненте нет реактивной логики — лишь статический контент
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 24px;
  border: 5px solid var(--primary);
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

/* Секция «О нас» */
.about-content {
  display: flex;
  flex-direction: column;
}

.about-title {
  font-size: 24px;
  color: black;
}

.about-body {
  display: flex;
  align-items: center;
  gap: 24px;
}

.about-text {
  flex: 1;
  font-size: 20px;
  color: black;
  line-height: 1.6;
}

.about-text p {
  margin: 0 0 12px 0;
}

.about-image-wrapper {
  flex: 0 0 430px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

/* Разделительная линия перед «Наши преимущества» */
.advantages-divider {
  margin: 32px 0 24px 0;
  border-top: 3px solid var(--primary);
  border-radius: 100px;
  width: 100%;
}

/* Секция «Наши преимущества» */
.advantages-container {
  display: flex;
  flex-direction: column;
}

.advantages-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: black;
}

.advantages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advantage-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 20px;
  color: black;
  line-height: 1.5;
}

.advantage-item:last-child {
  margin-bottom: 0;
}

/* Иконка галочки */
.advantage-icon {
  flex-shrink: 0;
  margin-top: 4px; /* чуть опустим иконку, чтобы выровнять текст по высоте */
  color: var(--primary);
}

/* Адаптивность */
@media (max-width: 768px) {
  .about-body {
    flex-direction: column;
    align-items: center;
  }

  .about-image-wrapper {
    width: 100%;
    flex: none;
    margin-top: 16px;
  }

  .advantage-item {
    font-size: 16px;
  }
}
</style>
