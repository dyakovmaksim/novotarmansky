<template>
  <NuxtLayout name="page-layout">
    <div class="about-page">
      <section class="reveal section-header">
        <h1 class="title-primary">О нашем <span>пространстве</span></h1>
        <p class="subtitle">
          Тишина лесов и уют домашнего очага в п. Новотарманский
        </p>
      </section>

      <div class="bento-grid">
        <div class="grid-item brand-card reveal" style="grid-area: brand">
          <h2 class="brand-name">Novotarmansky <span>house</span></h2>
          <div class="tag-list">
            <span class="tag">2 Комнаты</span>
            <span class="tag">Русская Баня</span>
            <span class="tag">BBQ Зона</span>
          </div>
        </div>

        <div class="grid-item image-card reveal" style="grid-area: house-img">
          <img src="/images/house.png" alt="Наш гостевой дом" />
        </div>

        <div
          class="grid-item image-card tall-img reveal"
          style="grid-area: interior-img"
        >
          <img src="/images/interior-wide.png" alt="Интерьер" />
          <div class="dark-overlay">
            <p>Уют и тишина в каждой детали вашего отдыха.</p>
          </div>
        </div>

        <div class="grid-item rest-card reveal" style="grid-area: rest">
          <div class="card-badge">Отдых</div>
          <h3>Перезагрузка души</h3>
          <p>
            Настоящая русская баня с ароматом хвои и мангальная зона для
            идеального вечера.
          </p>
        </div>

        <div class="grid-item info-card reveal" style="grid-area: info">
          <div class="info-container">
            <div class="info-title-group">
              <div class="card-badge dark">Удобства</div>
              <h3>Ваш комфорт — наш приоритет</h3>
            </div>
            <ul class="feature-list">
              <li>
                <strong>4 спальных места:</strong> Мастер-спальня и
                детская/гостевая.
              </li>
              <li>
                <strong>Кухня-гостиная:</strong> Всё для кулинарных шедевров.
              </li>
              <li>
                <strong>Забота:</strong> Свежие полотенца и гигиенические
                наборы.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.about-page {
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
}

.bento-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "brand house-img"
    "interior-img rest"
    "info info";

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "brand"
      "house-img"
      "interior-img"
      "rest"
      "info";
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
}

.brand-card {
  background: var(--primary, #d8b48b);
  color: white;
  padding: 40px;
  justify-content: center;
  min-height: 320px;
  .brand-name {
    font-family: "Unageo", sans-serif;
    font-size: 32px;
    span {
      display: block;
      font-family: "Unageo", sans-serif;
      font-size: 56px;
      font-weight: 800;
      line-height: 1;
    }
  }
}

.rest-card {
  background: #f4efe9;
  padding: 40px;
  justify-content: center;
  h3 {
    color: var(--primary);
    font-size: 26px;
    margin: 15px 0;
  }
  p {
    color: #666;
    line-height: 1.6;
  }
}

.info-card {
  background: #fff;
  padding: 40px 60px;
  @media (max-width: 768px) {
    padding: 30px;
  }

  .info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 40px;
    @media (max-width: 900px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  h3 {
    font-size: 28px;
    color: #333;
    margin-top: 15px;
  }
}

.image-card {
  height: 320px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.tall-img {
    height: 400px;
  }

  .dark-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
    display: flex;
    align-items: flex-end;
    padding: 30px;
    p {
      color: white;
      font-size: 16px;
      font-weight: 500;
    }
  }
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
    background: var(--primary);
    color: white;
  }
}

.tag-list {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  .tag {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 13px;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
  li {
    font-size: 15px;
    padding-left: 25px;
    position: relative;
    &::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }
  }
}
</style>
