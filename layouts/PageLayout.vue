<template>
  <NavBar />
  <HeroSection />
  <main>
    <slot></slot>
  </main>
  <Footer />
</template>

<script setup>
import NavBar from "@/components/layouts/NavBar.vue";
import HeroSection from "@/components/layouts/HeroSection.vue";
import Footer from "~/components/layouts/Footer.vue";
</script>

<style scoped lang="scss">
main {
  width: 1200px;
  margin: 0 auto;
  margin-top: 200px;
}
</style>
