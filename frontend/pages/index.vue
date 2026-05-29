<template>
  <NuxtLayout name="page-layout">
    <AboutUs id="aboutus" />
    <AmenitiesSection id="amenities" />
    <CarouselSection id="photos" />
    <LocationSection id="location" />
    <AdvantagesSection id="advantages" />
    <BookingSection id="booking" />
  </NuxtLayout>
</template>

<script setup>
import LocationSection from "~/components/LocationSection.vue";
import AboutUs from "~/components/AboutUs.vue";
import AmenitiesSection from "~/components/sections/AmenitiesSection.vue";
import CarouselSection from "~/components/sections/CarouselSection.vue";
import AdvantagesSection from "~/components/sections/AdvantagesSection.vue";
import BookingSection from "~/components/sections/BookingSection.vue";

const config = useRuntimeConfig();
const siteUrl = (config.public.siteUrl || "http://localhost:3000").replace(
  /\/$/,
  "",
);

useSeoMeta({
  title: "Novotarmanskiy house — загородный дом в Тюменской области",
  description:
    "Аренда уютного дома с баней и мангалом в посёлке Новотарманский, 20 минут от Тюмени. Выбирайте даты и бронируйте онлайн.",
  ogTitle: "Novotarmanskiy house — отдых рядом с Тюменью",
  ogDescription:
    "Уютный загородный дом с баней. Выберите даты и забронируйте.",
});

// Structured data for a rich search snippet (rating/price/geo can be added later).
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        name: config.public.house.title,
        description:
          "Уютный загородный дом с баней в посёлке Новотарманский, 20 минут от Тюмени.",
        url: siteUrl,
        image: `${siteUrl}/images/house.jpg`,
        telephone: CONTACT.phone.href.replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          addressLocality: "пос. Новотарманский",
          addressRegion: "Тюменская область",
          streetAddress: CONTACT.address.value,
          addressCountry: "RU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 57.282703,
          longitude: 65.210162,
        },
        priceRange: `от ${config.public.house.pricePerNight} ₽`,
        currenciesAccepted: "RUB",
        checkinTime: "15:00",
        checkoutTime: "12:00",
        petsAllowed: false,
        sameAs: CONTACT.socials.map((s) => s.href),
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Русская баня", value: true },
          { "@type": "LocationFeatureSpecification", name: "Мангал", value: true },
          { "@type": "LocationFeatureSpecification", name: "Полная приватность", value: true },
        ],
      }),
    },
  ],
});
</script>

<style scoped lang="scss"></style>
