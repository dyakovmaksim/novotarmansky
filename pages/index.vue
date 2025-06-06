<template>
  <NuxtLayout name="page-layout">
    <LocationSection />
    <BookingSection />
    <AboutUs />
    <CarouselSection />
  </NuxtLayout>
</template>

<script setup>
import LocationSection from "~/components/LocationSection.vue";
import AboutUs from "~/components/AboutUs.vue";
import CarouselSection from "~/components/sections/CarouselSection.vue";
import BookingSection from "~/components/sections/BookingSection.vue";
</script>

<style scoped lang="scss"></style>
