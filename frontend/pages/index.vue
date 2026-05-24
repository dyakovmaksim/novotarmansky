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

useSeoMeta({
  title: "Novotarmanskiy house — загородный дом в Тюменской области",
  description:
    "Аренда уютного дома с баней и мангалом в посёлке Новотарманский, 20 минут от Тюмени. Выбирайте даты и бронируйте онлайн.",
  ogTitle: "Novotarmanskiy house — отдых рядом с Тюменью",
  ogDescription:
    "Уютный загородный дом с баней. Выберите даты и забронируйте.",
});
</script>

<style scoped lang="scss"></style>
