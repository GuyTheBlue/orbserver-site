<script setup lang="ts">
import { landingData } from '~/utils/landingData'
</script>

<template>
  <div class="bg-black">
    <!-- The Parallax Scene (z-10) -->
    <PagesLandingHeroParallax
      v-if="landingData.hero"
      class="relative z-10"
    />

    <!-- The Moon Observatory (z-0, overlaps the hero sink) -->
    <PagesLandingMoonSection class="relative z-0 -mt-[40vh]" />

    <!-- Later on, as you build more content, you will put your UPageSection blocks here. -->
  </div>
</template>
