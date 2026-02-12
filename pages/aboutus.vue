<template>
  <div>
    <LayoutsNavBar />

    <main class="promo-page">
      <div class="container">
        <div class="promo-grid">
          <div class="grid-item image-box">
            <img src="/images/house.png" alt="House" />
          </div>

          <div class="grid-item accent-box title-box">
            <h1 class="brand-name">Novotarmansky <span>house</span></h1>
            <div class="tags">
              <span>2 Комнаты</span>
              <span>Баня</span>
              <span>Мангальная зона</span>
            </div>
          </div>

          <div class="grid-item wide-image">
            <img src="/images/interior-wide.png" alt="Interior" />
            <div class="overlay-text">
              Добро пожаловать в наш тихий уголок за городом, где вас ждет
              атмосфера полного расслабления и уединения. Идеально подходит для
              семейных выходных или отдыха компанией друзей.
            </div>
          </div>

          <div class="grid-item accent-box info-box">
            <span class="badge">О доме и инфраструктуре</span>
            <ul>
              <li>
                Две комфортные комнаты. Просторная спальня с двуспальной
                кроватью и отдельная комната с двумя односпальными — всего 4
                спальных места.
              </li>
              <li>
                Гостиная–кухня. Совмещённое пространство с диваном, обеденным
                столом и всем необходимым для приготовления: плита, холодильник,
                микроволновка и полный набор посуды.
              </li>
              <li>
                Современный санузел. Душевая кабина, горячая вода 24/7,
                качественные полотенца и средства гигиены.
              </li>
            </ul>
          </div>

          <div class="grid-item image-box">
            <img src="/images/window-view.png" alt="View" />
          </div>

          <div class="grid-item image-box">
            <img src="/images/sauna.png" alt="Sauna" />
          </div>

          <div class="grid-item accent-box info-box">
            <span class="badge">Отдых и развлечения</span>
            <ul>
              <li>
                Русская баня. Тёплая и просторная, оборудована душем и комнатой
                отдыха — идеальное место для очищения и общения в дымке аромата
                хвои.
              </li>
              <li>
                Мангал и зона барбекю. Качественный гриль, выкладки дров и
                беседка на свежем воздухе — все готово для сочного шашлыка,
                овощей-гриль и дружеских посиделок до поздней ночи.
              </li>
              <li>
                Прогулки на природе. Дом окружён лесом и лугами; здесь можно
                собирать ягоды, грибы или просто наслаждаться тишиной и пением
                птиц.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup></script>

<style scoped>
.promo-page {
  padding: 40px 0;
  background-color: #fdfdfd;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.promo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.grid-item {
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  min-height: 250px;
}

.accent-box {
  background-color: #d8b48b;
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.wide-image {
  grid-column: span 2;
  height: 350px;
}

.wide-image img,
.image-box img {
  width: 100%;
  height: 620px;
  object-fit: cover;
  display: block;
}

.overlay-text {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 20px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.brand-name {
  font-size: 55px;
  font-weight: 300;
}
.brand-name span {
  display: block;
  line-height: 0.6;
  font-size: 140px;
  font-weight: 700;
  margin-top: -5px;
}

.tags {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.tags span {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 16px;
}

.badge {
  border: 1px solid white;
  padding: 6px 15px;
  border-radius: 20px;
  width: fit-content;
  margin-bottom: 20px;
  font-size: 24px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  font-size: 20px;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .promo-grid {
    grid-template-columns: 1fr;
  }
  .wide-image {
    grid-column: span 1;
  }
}
</style>
