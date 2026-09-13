<template>
  <div>
    <LayoutsNavBar />

    <main class="gallery-page">
      <div class="container">
        <header class="gallery-heading">
          <h1>Фотогалерея дома</h1>
          <p>
            Выберите, что хотите посмотреть: сам дом, интерьер, участок или
            баню.
          </p>
        </header>

        <div class="filter-menu" aria-label="Категории фотографий">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['filter-btn', { active: currentCategory === category.id }]"
            type="button"
            @click="currentCategory = category.id"
          >
            {{ category.name }}
            <span>{{ countByCategory(category.id) }}</span>
          </button>
        </div>

        <div v-if="filteredPhotos.length" class="gallery-grid">
          <figure
            v-for="photo in filteredPhotos"
            :key="photo.id"
            class="gallery-item"
          >
            <img :src="photo.imagePath" :alt="photo.alt" loading="lazy" />
          </figure>
        </div>

        <p v-else-if="!pending" class="empty-msg">
          Фотографии в этой категории скоро появятся.
        </p>
        <p v-if="error" class="empty-msg">
          Не удалось загрузить новые фотографии. Попробуйте обновить страницу.
        </p>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Фотогалерея — Novotarmanskiy house",
  description:
    "Фото дома, интерьера, бани и придомовой территории. Посмотрите, как выглядит ваш отдых.",
});

type Category = "all" | "house" | "interior" | "territory" | "sauna";
interface GalleryImage {
  id: string;
  category: Exclude<Category, "all">;
  imagePath: string;
}
interface DisplayImage extends GalleryImage {
  alt: string;
}

const categories: { id: Category; name: string }[] = [
  { id: "all", name: "Все фото" },
  { id: "house", name: "Дом" },
  { id: "interior", name: "Интерьер" },
  { id: "territory", name: "Территория" },
  { id: "sauna", name: "Баня" },
];

const basePhotos: DisplayImage[] = [
  {
    id: "base-house",
    category: "house",
    imagePath: "/images/house.jpg",
    alt: "Загородный дом",
  },
  {
    id: "base-interior-1",
    category: "interior",
    imagePath: "/images/carousel/carousel1.jpg",
    alt: "Кухня и обеденная зона",
  },
  {
    id: "base-interior-2",
    category: "interior",
    imagePath: "/images/carousel/carousel4.jpg",
    alt: "Комната отдыха",
  },
  {
    id: "base-territory",
    category: "territory",
    imagePath: "/images/carousel/carousel2.jpg",
    alt: "Территория дома",
  },
  {
    id: "base-sauna",
    category: "sauna",
    imagePath: "/images/sauna.png",
    alt: "Баня",
  },
];

const currentCategory = ref<Category>("all");
const config = useRuntimeConfig();
const { data, pending, error } = await useFetch<GalleryImage[]>(
  `${config.public.apiBase}/gallery-images`,
  { default: () => [], server: false },
);

const allPhotos = computed<DisplayImage[]>(() => [
  ...basePhotos,
  ...(data.value ?? []).map((photo) => ({
    ...photo,
    alt:
      categories.find((category) => category.id === photo.category)?.name ??
      "Фотография дома",
  })),
]);
const filteredPhotos = computed(() =>
  currentCategory.value === "all"
    ? allPhotos.value
    : allPhotos.value.filter(
        (photo) => photo.category === currentCategory.value,
      ),
);
const countByCategory = (category: Category) =>
  category === "all"
    ? allPhotos.value.length
    : allPhotos.value.filter((photo) => photo.category === category).length;
</script>

<style scoped>
.gallery-page {
  min-height: 80vh;
  padding: 64px 0 88px;
  background: #fcfcfc;
}

.container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 20px;
}

.gallery-heading {
  max-width: 640px;
  margin: 0 auto 34px;
  text-align: center;
}

.gallery-heading h1 {
  margin: 0 0 12px;
  color: #5e4e3b;
  font-size: clamp(30px, 4vw, 42px);
}

.gallery-heading p {
  margin: 0;
  color: #746b61;
  line-height: 1.55;
}

.filter-menu {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 8px 15px;
  border: 1px solid #d8b48b;
  border-radius: 22px;
  background: transparent;
  color: #5e4e3b;
  cursor: pointer;
  font: inherit;
}

.filter-btn span {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 11px;
  background: #f2e8db;
  font-size: 12px;
}

.filter-btn:hover,
.filter-btn:focus-visible {
  background: #f5ece2;
  outline: none;
}

.filter-btn.active {
  border-color: #5e4e3b;
  background: #5e4e3b;
  color: #fff;
}

.filter-btn.active span {
  background: rgba(255, 255, 255, 0.2);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.gallery-item {
  aspect-ratio: 4 / 3;
  margin: 0;
  overflow: hidden;
  border-radius: 18px;
  background: #eee7de;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 260ms ease;
}

.gallery-item:hover img {
  transform: scale(1.025);
}

.empty-msg {
  margin: 44px 0;
  text-align: center;
  color: #746b61;
}

@media (max-width: 760px) {
  .gallery-page {
    padding: 42px 0 64px;
  }
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .filter-menu {
    justify-content: flex-start;
  }
}
</style>
