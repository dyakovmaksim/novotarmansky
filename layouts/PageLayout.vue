<template>
  <NavBar />
  <HeroSection />
  <main>
    <slot></slot>
  </main>
  <FooterSection />
</template>

<script setup>
import NavBar from "@/components/layouts/NavBar.vue";
import HeroSection from "@/components/layouts/HeroSection.vue";
import FooterSection from "@/components/layouts/FooterSection.vue";
</script>

<style scoped lang="scss">
main {
  width: 1200px;
  margin: 0 auto;
  margin-top: 200px;
}
</style>
