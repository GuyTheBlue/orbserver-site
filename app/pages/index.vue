<script setup lang="ts">
import { landingData } from '~/utils/landingData'
</script>

<template>
  <div>
    <!-- The Parallax Scene (Full Bleed Layout natively managed by the component) -->
    <PagesLandingHeroParallax v-if="landingData.hero" />
    <PagesLandingMoonSection />
    
    <!-- Later on, as you build more content, you will put your UPageSection blocks here. The void fade transition will perfectly transition into them! -->

  </div>
</template>
