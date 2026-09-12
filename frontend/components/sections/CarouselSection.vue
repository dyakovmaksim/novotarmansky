<template>
  <section class="home-photos">
    <header>
      <h2>Представьте свои выходные здесь</h2>
      <NuxtLink to="/photos" class="text-button">Все фотографии</NuxtLink>
    </header>
    <div class="home-photo-grid">
      <NuxtLink v-for="photo in photos" :key="photo.src" to="/photos"
        ><NuxtImg
          :src="photo.src"
          :alt="photo.alt"
          width="900"
          format="webp"
          quality="80"
          loading="lazy"
        /><span>{{ photo.alt }}</span></NuxtLink
      >
    </div>
  </section>
</template>
<script setup>
const photos = PHOTOS.slice(0, 3);
</script>
<style scoped>
.home-photos {
  padding: 40px 24px;
}
.home-photos header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}
.home-photos h2 {
  font-size: clamp(28px, 3vw, 40px);
  max-width: 22ch;
}
.home-photo-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 16px;
}
.home-photo-grid img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 14px;
}
.home-photo-grid span {
  display: block;
  margin-top: 12px;
  color: var(--muted);
  font-size: 14px;
}
@media (max-width: 700px) {
  .home-photos {
    padding: 32px 20px;
  }
  .home-photos header {
    display: block;
  }
  .home-photos header a {
    display: inline-block;
    margin-top: 12px;
  }
  .home-photo-grid {
    grid-template-columns: 1fr 1fr;
  }
  .home-photo-grid a:first-child {
    grid-column: 1/-1;
  }
  .home-photo-grid img {
    height: 200px;
  }
  .home-photo-grid a:first-child img {
    height: 300px;
  }
}
</style>
