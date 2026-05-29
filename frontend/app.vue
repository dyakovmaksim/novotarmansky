<template>
  <NuxtPage />
  <ClientOnly>
    <Toaster position="top-center" :duration="4000" rich-colors />
  </ClientOnly>
</template>

<script setup>
import { Toaster } from "vue-sonner";

const config = useRuntimeConfig();
// Absolute base for OG tags — social crawlers (Telegram/WhatsApp/VK) ignore
// relative image/url paths. Falls back to localhost in dev.
const siteUrl = (config.public.siteUrl || "http://localhost:3000").replace(
  /\/$/,
  "",
);

useHead({
  htmlAttrs: { lang: "ru" },
  link: [
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    // Canonical to the apex domain so duplicate hosts don't split SEO weight.
    { rel: "canonical", href: siteUrl },
  ],
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // Search engine ownership verification (Yandex.Webmaster / Google Search Console).
    { name: "yandex-verification", content: "56370e301f4cab79" },
    {
      name: "google-site-verification",
      content: "J9C6fGZJQKVYzNDV2bkzudukXKE8ukxCLcRJ0YVPXXA",
    },
  ],
});

// Site-wide SEO defaults. Each page can override with its own useSeoMeta().
useSeoMeta({
  title: "Novotarmanskiy house — аренда дома для отдыха в Тюменской области",
  description:
    "Уютный загородный дом в посёлке Новотарманский в 20 минутах от Тюмени. Баня, мангал, тишина. Бронируйте онлайн.",
  ogType: "website",
  ogSiteName: "Novotarmanskiy house",
  ogUrl: siteUrl,
  ogImage: `${siteUrl}/images/house.jpg`,
  ogLocale: "ru_RU",
  twitterCard: "summary_large_image",
});
</script>
