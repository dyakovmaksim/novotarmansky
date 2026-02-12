<template>
  <div>
    <LayoutsNavBar />

    <main class="gallery-page">
      <div class="container">
        <h1 class="page-title">Галерея</h1>

        <div class="filter-menu">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="['filter-btn', { active: currentCategory === cat.id }]"
            @click="currentCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>

        <div class="gallery-grid">
          <div
            v-for="(photo, index) in filteredPhotos"
            :key="index"
            class="gallery-item"
          >
            <img :src="photo.src" :alt="photo.category" loading="lazy" />
          </div>
        </div>

        <div v-if="filteredPhotos.length === 0" class="empty-msg">
          Фотографии в этой категории скоро появятся.
        </div>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Список категорий
const categories = [
  { id: "all", name: "Все" },
  { id: "house", name: "Дом" },
  { id: "yard", name: "Двор" },
  { id: "kitchen", name: "Кухня" },
  { id: "bedroom", name: "Спальни" },
  { id: "hall", name: "Зал" },
  { id: "bbq", name: "Мангал" },
];

const currentCategory = ref("all");

// Массив данных (добавьте сюда свои пути к фото)
const photos = ref([
  { src: "/images/house.jpg", category: "house" },
  { src: "/images/yard-1.jpg", category: "yard" },
  { src: "/images/kitchen-1.jpg", category: "kitchen" },
  { src: "/images/bedroom-1.jpg", category: "bedroom" },
  { src: "/images/hall-1.jpg", category: "hall" },
  { src: "/images/bbq-1.jpg", category: "bbq" },
  // Добавляйте новые фото здесь
]);

// Логика фильтрации
const filteredPhotos = computed(() => {
  if (currentCategory.value === "all") return photos.value;
  return photos.value.filter((p) => p.category === currentCategory.value);
});
</script>

<style scoped>
.gallery-page {
  padding: 60px 0;
  min-height: 80vh;
  background-color: #fcfcfc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
  color: #5e4e3b; /* Ваш основной цвет из :root */
}

/* Меню фильтров */
.filter-menu {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}

.filter-btn {
  padding: 10px 25px;
  border: 1px solid #d8b48b;
  background: transparent;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #5e4e3b;
}

.filter-btn:hover {
  background-color: #f5ece2;
}

.filter-btn.active {
  background-color: #d8b48b;
  color: white;
}

/* Сетка галереи */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.gallery-item {
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.empty-msg {
  text-align: center;
  color: #999;
  margin-top: 50px;
}

@media (max-width: 600px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
