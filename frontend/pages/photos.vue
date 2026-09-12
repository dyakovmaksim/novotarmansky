<template>
  <div>
    <LayoutsNavBar />
    <main id="main-content" class="gallery-page site-container">
      <header class="page-heading">
        <h1>Знакомьтесь с домом</h1>
        <p>
          Посмотрите участок, кухню-гостиную и баню. Нажмите на фотографию,
          чтобы рассмотреть детали.
        </p>
      </header>
      <div class="photo-filters" aria-label="Категории фотографий">
        <button
          v-for="cat in PHOTO_CATEGORIES"
          :key="cat.id"
          type="button"
          :aria-pressed="category === cat.id"
          @click="category = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>
      <div class="photo-grid">
        <button
          v-for="photo in filtered"
          :key="photo.src"
          type="button"
          class="photo-card"
          :aria-label="'Увеличить: ' + photo.alt"
          @click="openPhoto(photo)"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            width="900"
            format="webp"
            quality="80"
            loading="lazy"
          /><span>{{ photo.alt }}</span>
        </button>
      </div>
      <div class="photo-cta">
        <h2>Нашли место для своих выходных?</h2>
        <NuxtLink to="/booking" class="button"
          >Посмотреть свободные даты</NuxtLink
        >
      </div>
      <dialog
        ref="dialog"
        class="photo-dialog"
        aria-label="Просмотр фотографий"
        @click="closeBackdrop"
        @keydown.left.prevent="step(-1)"
        @keydown.right.prevent="step(1)"
      >
        <template v-if="active"
          ><button
            type="button"
            class="photo-close"
            aria-label="Закрыть фотографию"
            @click="dialog.close()"
          >
            ×</button
          ><img :src="active.src" :alt="active.alt" >
          <div class="photo-controls">
            <button
              type="button"
              aria-label="Предыдущая фотография"
              @click="step(-1)"
            >
              ‹
            </button>
            <p aria-live="polite">
              {{ active.alt }} · {{ PHOTOS.indexOf(active) + 1 }} /
              {{ PHOTOS.length }}
            </p>
            <button
              type="button"
              aria-label="Следующая фотография"
              @click="step(1)"
            >
              ›
            </button>
          </div></template
        >
      </dialog>
    </main>
    <LayoutsFooterSection />
  </div>
</template>
<script setup>
import { ref, computed, nextTick } from "vue";
useSeoMeta({
  title: "Фотографии дома и бани — Novotarmanskiy house",
  description:
    "Посмотрите фотографии дома, участка, кухни-гостиной и русской бани в Новотарманском.",
});
const category = ref("all"),
  active = ref(null),
  dialog = ref(null);
const filtered = computed(() =>
  category.value === "all"
    ? PHOTOS
    : PHOTOS.filter((p) => p.category === category.value),
);
async function openPhoto(photo) {
  active.value = photo;
  await nextTick();
  dialog.value.showModal();
}
function step(n) {
  active.value =
    PHOTOS[(PHOTOS.indexOf(active.value) + n + PHOTOS.length) % PHOTOS.length];
}
function closeBackdrop(e) {
  if (e.target === dialog.value) dialog.value.close();
}
</script>
<style scoped>
.gallery-page {
  padding-top: 128px;
  padding-bottom: 64px;
}
.photo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}
.photo-filters button {
  min-height: 44px;
  padding: 10px 18px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
}
.photo-filters button[aria-pressed="true"] {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 20px;
}
.photo-card {
  background: white;
  text-align: left;
  color: var(--ink);
}
.photo-card img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 14px;
}
.photo-card span {
  display: block;
  margin-top: 12px;
  font-size: 15px;
}
.photo-cta {
  margin-top: 48px;
  background: var(--surface);
  padding: 28px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.photo-cta h2 {
  font-size: 26px;
}
.photo-dialog {
  margin: auto;
  max-width: min(94vw, 1100px);
  max-height: 94dvh;
  background: #191815;
  color: white;
  border: 0;
  border-radius: 14px;
  padding: 16px;
}
.photo-dialog::backdrop {
  background: #000b;
}
.photo-dialog img {
  max-height: 76dvh;
  max-width: 100%;
  object-fit: contain;
  margin: auto;
}
.photo-close {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  color: var(--ink);
  font-size: 28px;
}
.photo-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  padding-top: 12px;
}
.photo-controls button {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  font-size: 26px;
  border-radius: 8px;
}
.photo-controls p {
  font-size: 14px;
}
@media (max-width: 600px) {
  .gallery-page {
    padding-top: 104px;
    padding-bottom: 48px;
  }
  .photo-grid {
    grid-template-columns: 1fr;
  }
  .photo-cta {
    display: block;
    padding: 24px;
  }
  .photo-cta .button {
    margin-top: 20px;
  }
  .photo-dialog {
    padding: 8px;
  }
}
</style>
