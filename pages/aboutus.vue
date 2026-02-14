<template>
  <NuxtLayout name="page-layout">
    <div class="about-page">
      <section class="reveal section-header">
        <h1 class="title-primary">О нашем <span>пространстве</span></h1>
        <p class="subtitle">Тишина лесов и уют домашнего очага в п. Новотарманский</p>
      </section>

      <div class="bento-grid">
        
        <div class="grid-item accent-card brand-card reveal">
          <div class="card-content">
            <h2 class="brand-name">Novotarmansky <span>house</span></h2>
            <div class="tag-list">
              <span class="tag">2 Комнаты</span>
              <span class="tag">Русская Баня</span>
              <span class="tag">BBQ Зона</span>
            </div>
          </div>
        </div>

        <div class="grid-item image-card reveal">
          <img src="/images/house.png" alt="Наш гостевой дом" />
        </div>

        <div class="grid-item wide-card reveal">
          <img src="/images/interior-wide.png" alt="Интерьер гостиной" />
          <div class="glass-overlay">
            <p>Добро пожаловать в тихий уголок, где время замедляется. Мы создали это место для тех, кто ценит уединение, запах дерева и шум леса за окном.</p>
          </div>
        </div>

        <div class="grid-item info-card reveal">
          <div class="card-badge">Удобства</div>
          <h3>Ваш комфорт — наш приоритет</h3>
          <ul class="feature-list">
            <li><strong>4 спальных места:</strong> Мастер-спальня и уютная детская/гостевая.</li>
            <li><strong>Кухня-гостиная:</strong> Всё для кулинарных шедевров и душевных ужинов.</li>
            <li><strong>Забота о мелочах:</strong> Свежие полотенца, гигиенические наборы и горячая вода 24/7.</li>
          </ul>
        </div>

        <div class="grid-item image-card mini reveal">
          <img src="/images/window-view.png" alt="Вид из окна" />
        </div>

        <div class="grid-item accent-card rest-card reveal">
          <div class="card-badge">Отдых</div>
          <h3>Перезагрузка тела и души</h3>
          <p>Настоящая русская баня с ароматом хвои и благоустроенная мангальная зона для идеального шашлыка под звездным небом.</p>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.about-page {
  padding-bottom: 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  
  .title-primary {
    font-size: clamp(32px, 5vw, 48px);
    color: #333;
    font-weight: 300;
    span { font-weight: 700; color: var(--primary, #5e4e3b); }
  }
  
  .subtitle {
    font-size: 18px;
    color: #777;
    margin-top: 10px;
  }
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 300px;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
}

.grid-item {
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  background: #f9f9f9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img { transform: scale(1.05); }
}

// Стили карточек
.accent-card {
  background-color: var(--primary, #5e4e3b);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-card {
  grid-column: span 1;
  .brand-name {
    font-size: 32px;
    line-height: 1;
    span { display: block; font-size: 56px; margin-top: 5px; }
  }
}

.wide-card {
  grid-column: span 2;
  @media (max-width: 768px) { grid-column: span 1; height: 400px; }
}

.info-card, .rest-card {
  padding: 40px;
  background: #fff;
  border: 1px solid #eee;
  h3 { margin: 20px 0; font-size: 24px; color: #333; }
}

.rest-card {
  background-color: #f4efe9; // Мягкий беж для разнообразия
  border: none;
}

.glass-overlay {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 24px;
  border-radius: 20px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-badge {
  background: var(--primary, #5e4e3b);
  color: white;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 14px;
  width: fit-content;
}

.tag-list {
  display: flex;
  gap: 8px;
  margin-top: 24px;
  flex-wrap: wrap;
  .tag {
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 14px;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  li {
    margin-bottom: 12px;
    padding-left: 24px;
    position: relative;
    color: #555;
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