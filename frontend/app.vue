<template>
  <NuxtPage />
  <MobileBookingBar />
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
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
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

// Yandex.Metrica #109497247 — site analytics, click map, Webvisor.
// Inline snippet self-loads tag.js asynchronously, so it doesn't block render.
useHead({
  script: [
    {
      key: "yandex-metrica",
      innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(109497247,"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
    },
  ],
  noscript: [
    {
      key: "yandex-metrica-noscript",
      innerHTML: `<div><img src="https://mc.yandex.ru/watch/109497247" style="position:absolute; left:-9999px;" alt="" /></div>`,
    },
  ],
});
</script>
