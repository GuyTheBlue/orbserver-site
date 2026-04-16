<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  masked: { type: Boolean, default: true },
  scale: { type: Number, default: 2.5 }
})

// Generate a random stable hash to ensure SVG definitions don't globally collide when multiple instances are rendered
const uid = Math.random().toString(36).substring(2, 9)

const styleMask = computed(() => {
  if (!props.masked) return {}
  return {
    maskImage: 'radial-gradient(100% 100% at 0% 0%, black 10%, transparent 60%), radial-gradient(100% 100% at 100% 100%, black 10%, transparent 50%)',
    WebkitMaskImage: 'radial-gradient(100% 100% at 0% 0%, black 10%, rgba(0,0,0,0) 60%), radial-gradient(100% 100% at 100% 100%, black 10%, rgba(0,0,0,0) 50%)'
  }
})
</script>

<template>
  <div class="absolute inset-0 z-0 pointer-events-none" :class="{ 'is-masked': masked }" :style="styleMask">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Seamless interlocking hexagon pattern -->
        <pattern :id="`hexagons-${uid}`" width="75" height="43.30127" patternUnits="userSpaceOnUse" :patternTransform="`scale(${scale})`">
          
          <!-- Glossy opaque hexagon (creates the glass panel aesthetic) -->
          <path class="hex-shimmer-glow" vector-effect="non-scaling-stroke" d="M 25 0 L 50 0 L 62.5 21.65 L 50 43.3 L 25 43.3 L 12.5 21.65 Z" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(180, 240, 255, 0.3)" stroke-width="1.5" />
          
          <!-- Outline-only border hexagon (creates the see-through aesthetic) -->
          <path class="hex-shimmer-subtle" vector-effect="non-scaling-stroke" d="M -12.5 0 L 12.5 0 L 25 21.65 L 12.5 43.3 L -12.5 43.3 L -25 21.65 Z" fill="none" stroke="rgba(180, 240, 255, 0.15)" stroke-width="1" />
          <path class="hex-shimmer-subtle" vector-effect="non-scaling-stroke" d="M 62.5 0 L 87.5 0 L 100 21.65 L 87.5 43.3 L 62.5 43.3 L 50 21.65 Z" fill="none" stroke="rgba(180, 240, 255, 0.15)" stroke-width="1" />
          
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#hexagons-${uid})`" />
    </svg>
  </div>
</template>

<style scoped>
/* By default (for unmasked UI panels), we render a completely static, high-tech geometric watermark */
.hex-shimmer-glow {
  opacity: 0.15;
}
.hex-shimmer-subtle {
  opacity: 0.3;
}

/* For the massive masked background, we apply the heavy mystic shimmer bloom */
.is-masked .hex-shimmer-glow {
  animation: shimmer-macro 4s infinite alternate ease-in-out;
}
.is-masked .hex-shimmer-subtle {
  animation: shimmer-macro 7s infinite alternate-reverse ease-in-out;
}

/* The massive drop-shadow driven bloom exclusively for the massive background layer */
@keyframes shimmer-macro {
  0% { opacity: 0.05; }
  100% { 
    opacity: 0.9; 
    filter: drop-shadow(0 0 6px rgba(180, 240, 255, 0.4));
  }
}
</style>
