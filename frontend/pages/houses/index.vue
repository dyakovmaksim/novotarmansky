<template>
  <NuxtLayout name="page-layout">
    <div class="houses-page">
      <section class="reveal section-header">
        <h1 class="title-primary">Наши <span>пространства</span></h1>
        <p class="subtitle">
          Выберите идеальный дом для отдыха и перезагрузки в п. Новотарманский
        </p>
      </section>

      <div v-if="pending" class="loading-state">
        <p>Ищем лучшие домики для вас...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h3>Ой, не удалось загрузить домики</h3>
        <p>{{ error.message }}</p>
      </div>

      <div v-else-if="houses && houses.length" class="houses-bento-grid">
        <div
          v-for="(house, index) in houses"
          :key="house.id"
          class="grid-item house-card reveal"
          :class="{
            'tall-card': index % 3 === 0,
            'wide-card': index % 3 === 2,
          }"
        >
          <div class="image-wrapper">
            <img
              :src="
                index % 2 === 0
                  ? '/images/house.png'
                  : '/images/interior-wide.png'
              "
              :alt="house.title"
            />
            <div class="card-badge price-badge">
              {{ house.pricePerNight }} ₽ / ночь
            </div>
          </div>

          <div class="card-content">
            <div class="card-header-group">
              <div class="card-badge dark">Доступно</div>
              <h2 class="house-title">{{ house.title }}</h2>
            </div>

            <p class="house-description">{{ house.description }}</p>

            <div class="card-footer">
              <div class="tag-list">
                <span class="tag">Wi-Fi</span>
                <span class="tag">Мангал</span>
                <span class="tag">Комфорт</span>
              </div>

              <NuxtLink :to="`/houses/${house.id}`" class="btn-arrow">
                →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// Запрашиваем данные с нашего запущенного NestJS бэкенда
const {
  data: houses,
  pending,
  error,
} = await useFetch("http://localhost:3001/houses");
</script>

<style lang="scss" scoped>
.houses-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  .title-primary {
    font-size: clamp(32px, 5vw, 48px);
    color: #333;
    span {
      color: var(--primary);
      font-weight: 700;
    }
  }
  .subtitle {
    color: #666;
    margin-top: 10px;
  }
}

// Адаптивная бэнто-сетка для каталога
.houses-bento-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
}

.grid-item {
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
  }
}

// Стилизация Bento-эффекта: чередование размеров карточек
.tall-card {
  grid-row: span 2;
  .image-wrapper {
    height: 400px;
  }
}

.wide-card {
  @media (min-width: 856px) {
    grid-column: span 2;
    flex-direction: row;
    height: 350px;

    .image-wrapper {
      width: 50%;
      height: 100%;
    }
    .card-content {
      width: 50%;
      justify-content: center;
    }
  }
}

.image-wrapper {
  height: 260px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .price-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    color: #333;
    font-weight: 700;
  }
}

.card-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 30px;
  }
}

.card-header-group {
  margin-bottom: 15px;

  .house-title {
    font-size: 26px;
    color: #333;
    margin-top: 10px;
  }
}

.house-description {
  color: #666;
  line-height: 1.6;
  font-size: 15px;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 15px;
}

.card-badge {
  background: #e6ded3;
  color: var(--primary);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  width: fit-content;

  &.dark {
    background: var(--primary, #d8b48b);
    color: white;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .tag {
    background: #f4efe9;
    color: #666;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 13px;
  }
}

.btn-arrow {
  background: var(--primary, #d8b48b);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  text-decoration: none;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #c5a17a;
    transform: scale(1.05);
  }
}

// Вспомогательные стили состояний
.loading-state,
.error-state {
  text-align: center;
  padding: 80px 24px;
  color: #666;
}
</style>
