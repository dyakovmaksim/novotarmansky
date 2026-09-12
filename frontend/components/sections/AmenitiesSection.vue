<template>
  <section class="amenities">
    <div class="amenities__container">
      <header class="amenities__head reveal">
        <span class="amenities__subtitle">Всё для комфортного отдыха</span>
        <h2 class="amenities__title">Что внутри</h2>
      </header>

      <div class="amenities__stats reveal">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <span class="stat__value">{{ stat.value }}</span>
          <span class="stat__label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="amenities__grid">
        <div
          v-for="(item, i) in amenities"
          :key="item.title"
          class="amenity reveal"
          :style="{ '--delay': `${i * 60}ms` }"
        >
          <div class="amenity__icon">
            <component :is="iconFor(item.icon)" />
          </div>
          <div class="amenity__text">
            <h3 class="amenity__title">{{ item.title }}</h3>
            <p class="amenity__desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconWifi from "~/components/IconWifi.vue";
import IconUtensils from "~/components/IconUtensils.vue";
import IconFlame from "~/components/IconFlame.vue";

// Data lives in utils/amenities.ts (auto-imported).
const stats = HOUSE_STATS;
const amenities = AMENITIES;

// Explicit name→component map. Resolving by string at render time
// (resolveComponent in a helper) renders an empty placeholder in dev —
// a static map is reliable.
const icons = { IconWifi, IconUtensils, IconFlame };
const iconFor = (name) => icons[name];
</script>

<style lang="scss" scoped>
.amenities {
  padding: 80px 0;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__head {
    text-align: center;
    margin-bottom: 48px;
  }

  &__subtitle {
    color: var(--primary, #b9946e);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 13px;
    font-weight: 700;
    display: block;
    margin-bottom: 12px;
  }

  &__title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 300;
    color: #3d2c17;
    line-height: 1.1;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 48px;
    margin-bottom: 64px;
    padding: 32px;
    background: #fdfbfa;
    border: 1px solid #eee4d8;
    border-radius: 24px;

    @media (max-width: 600px) {
      gap: 28px;
      padding: 28px 20px;
    }
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    &__value {
      font-size: clamp(24px, 3vw, 32px);
      font-weight: 600;
      color: var(--primary, #b9946e);
      line-height: 1;
    }
    &__label {
      margin-top: 8px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #a68b6a;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }

  .amenity {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 28px;
    background: #fff;
    border: 1px solid #eee4d8;
    border-radius: 20px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    transition-delay: var(--delay, 0ms);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px rgba(61, 44, 23, 0.08);
    }

    &__icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: #f8f5f2;
      color: var(--primary, #b9946e);
      svg {
        width: 24px;
        height: 24px;
      }
    }

    &__title {
      font-size: 17px;
      font-weight: 600;
      color: #3d2c17;
      margin-bottom: 6px;
    }

    &__desc {
      font-size: 14px;
      line-height: 1.5;
      color: #8c7d6d;
    }
  }
}
</style>
