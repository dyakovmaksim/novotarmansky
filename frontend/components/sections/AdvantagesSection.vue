<template>
  <section class="advantages">
    <div class="advantages__container">
      <header class="advantages__head reveal">
        <span class="advantages__subtitle">Спокойно и без сюрпризов</span>
        <h2 class="advantages__title">Почему выбирают нас</h2>
      </header>

      <div class="advantages__grid">
        <div
          v-for="(item, i) in advantages"
          :key="item.title"
          class="advantage reveal"
          :style="{ '--delay': `${i * 70}ms` }"
        >
          <div class="advantage__icon">
            <component :is="iconFor(item.icon)" />
          </div>
          <h3 class="advantage__title">{{ item.title }}</h3>
          <p class="advantage__desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconWallet from "~/components/IconWallet.vue";
import IconZap from "~/components/IconZap.vue";
import IconKey from "~/components/IconKey.vue";
import IconShield from "~/components/IconShield.vue";
import IconPin from "~/components/IconPin.vue";
import IconFlame from "~/components/IconFlame.vue";

// Data lives in utils/advantages.ts (auto-imported).
const advantages = ADVANTAGES;

// Explicit name→component map (resolveComponent by string renders blank in dev).
const icons = { IconWallet, IconZap, IconKey, IconShield, IconPin, IconFlame };
const iconFor = (name) => icons[name];
</script>

<style lang="scss" scoped>
.advantages {
  padding: var(--section-space) 0;
  background: #fdfbfa;

  &__container {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 0 var(--gutter);
  }

  &__head {
    text-align: center;
    margin-bottom: 40px;
  }

  &__subtitle {
    color: var(--primary, #b9946e);
    letter-spacing: 0.04em;
    font-size: 14px;
    font-weight: 700;
    display: block;
    margin-bottom: 10px;
  }

  &__title {
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 300;
    color: #3d2c17;
    line-height: 1.1;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }

  .advantage {
    padding: 30px;
    background: #fff;
    border: 1px solid #eee4d8;
    border-radius: 24px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    transition-delay: var(--delay, 0ms);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px rgba(61, 44, 23, 0.08);
    }

    &__icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: #f8f5f2;
      color: var(--primary, #b9946e);
      margin-bottom: 20px;
      svg {
        width: 26px;
        height: 26px;
      }
    }

    &__title {
      font-size: 18px;
      font-weight: 600;
      color: #3d2c17;
      margin-bottom: 10px;
    }

    &__desc {
      font-size: 14px;
      line-height: 1.6;
      color: #8c7d6d;
    }
  }
}
</style>
