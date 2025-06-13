<template>
  <NuxtLayout name="page-layout">
    <AboutUs id="aboutus" />
    <CarouselSection id="photos" />
    <LocationSection id="location" />
    <BookingSection id="booking" />
  </NuxtLayout>
</template>

<script setup>
import LocationSection from "~/components/LocationSection.vue";
import AboutUs from "~/components/AboutUs.vue";
import CarouselSection from "~/components/sections/CarouselSection.vue";
import BookingSection from "~/components/sections/BookingSection.vue";
</script>

<style scoped lang="scss"></style>
