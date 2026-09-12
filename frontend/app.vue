<template>
  <NuxtPage />
  <ClientOnly>
    <Toaster position="top-center" :duration="4000" rich-colors />
  </ClientOnly>
</template>

<script setup>
import { Toaster } from "vue-sonner";

useHead({
  htmlAttrs: { lang: "ru" },
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
});

// Site-wide SEO defaults. Each page can override with its own useSeoMeta().
useSeoMeta({
  title: "Novotarmanskiy house — аренда дома для отдыха в Тюменской области",
  description:
    "Уютный загородный дом в посёлке Новотарманский в 20 минутах от Тюмени. Баня, мангал, тишина. Бронируйте онлайн.",
  ogType: "website",
  ogSiteName: "Novotarmanskiy house",
  ogImage: "/images/house.jpg",
  twitterCard: "summary_large_image",
});
</script>
