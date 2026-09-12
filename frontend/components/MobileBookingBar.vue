<template>
  <template v-if="eligible"
    ><div class="booking-bar-spacer" aria-hidden="true" />
    <aside
      v-if="!bookingVisible"
      class="mobile-booking-bar"
      aria-label="Быстрый переход к бронированию"
    >
      <p>
        <strong
          >От
          {{
            Number(config.public.house.pricePerNight).toLocaleString("ru-RU")
          }}
          ₽</strong
        ><span>за ночь · дом целиком</span>
      </p>
      <NuxtLink to="/booking" class="button">Выбрать даты</NuxtLink>
    </aside></template
  >
</template>
<script setup>
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from "vue";
const route = useRoute(),
  config = useRuntimeConfig();
const eligible = computed(() =>
  ["/", "/aboutus", "/photos", "/contacts", "/promotion"].includes(route.path),
);
const bookingVisible = ref(false);
let observer;
async function observe() {
  observer?.disconnect();
  bookingVisible.value = false;
  await nextTick();
  const target = document.querySelector(".booking-experience");
  if (target) {
    observer = new IntersectionObserver((entries) => {
      bookingVisible.value = entries[0].isIntersecting;
    });
    observer.observe(target);
  }
}
onMounted(observe);
watch(() => route.path, observe);
onUnmounted(() => observer?.disconnect());
</script>
<style scoped>
.mobile-booking-bar,
.booking-bar-spacer {
  display: none;
}
@media (max-width: 760px) {
  .booking-bar-spacer {
    display: block;
    height: calc(80px + env(safe-area-inset-bottom));
  }
  .mobile-booking-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 60;
    background: white;
    border-top: 1px solid var(--line);
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .mobile-booking-bar p {
    font-size: 16px;
  }
  .mobile-booking-bar span {
    display: block;
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }
  .mobile-booking-bar .button {
    min-height: 48px;
    padding: 12px 18px;
    font-size: 14px;
  }
}
@media (max-width: 350px) {
  .mobile-booking-bar {
    padding-left: 12px;
    padding-right: 12px;
  }
  .mobile-booking-bar .button {
    padding: 12px;
  }
  .mobile-booking-bar p {
    font-size: 14px;
  }
}
</style>
