<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  maskMode: { type: String, default: 'top-left' }, // 'top-left', 'bottom-right', or 'none'
  scale: { type: Number, default: 2.5 },
  offsetX: { type: Number, default: 0 },
  offsetY: { type: Number, default: 0 }
})

// Generate a random stable hash to ensure SVG definitions don't globally collide
const uid = Math.random().toString(36).substring(2, 9)

const styleMask = computed(() => {
  if (props.maskMode === 'none') return {}
  if (props.maskMode === 'top-left') {
    return {
      maskImage: 'radial-gradient(ellipse at 0% 0%, black 10%, transparent 60%)',
      WebkitMaskImage: 'radial-gradient(ellipse at 0% 0%, black 10%, rgba(0,0,0,0) 60%)'
    }
  }
  return {
    maskImage: 'radial-gradient(ellipse at 100% 100%, black 10%, transparent 60%)',
    WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, black 10%, rgba(0,0,0,0) 60%)'
  }
})
</script>

<template>
  <div
    class="absolute inset-0 z-0 pointer-events-none"
    :class="{ 'is-masked': maskMode !== 'none' }"
    :style="styleMask"
  >
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Seamless interlocking Base Wireframe (Provides structural background lattice) -->
        <pattern
          :id="`hexbase-${uid}`"
          width="75"
          height="43.30127"
          patternUnits="userSpaceOnUse"
          :patternTransform="`scale(${scale}) translate(${offsetX}, ${offsetY})`"
        >
          <path
            d="M -12.5 0 L 12.5 0 L 25 21.65 L 12.5 43.3 L -12.5 43.3 L -25 21.65 Z"
            fill="none"
            stroke="rgba(180, 240, 255, 0.08)"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
          <path
            d="M 62.5 0 L 87.5 0 L 100 21.65 L 87.5 43.3 L 62.5 43.3 L 50 21.65 Z"
            fill="none"
            stroke="rgba(180, 240, 255, 0.08)"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
        </pattern>

        <!-- Organic Scatter Tile (Massive 3x3 layout holding randomly firing panels) -->
        <pattern
          :id="`hexscatter-${uid}`"
          width="225"
          height="129.90381"
          patternUnits="userSpaceOnUse"
          :patternTransform="`scale(${scale}) translate(${offsetX}, ${offsetY})`"
        >

          <!-- Node 1 (Fast Pulse at Origin) -->
          <path
            class="node-pulse-fast"
            d="M 25 0 L 50 0 L 62.5 21.65 L 50 43.3 L 25 43.3 L 12.5 21.65 Z"
            fill="rgba(255, 255, 255, 0.04)"
            stroke="rgba(0, 255, 255, 0.6)"
            stroke-width="1.5"
            vector-effect="non-scaling-stroke"
          />

          <!-- Node 2 (Staggered Slow Pulse down/right) -->
          <path
            class="node-pulse-slow"
            d="M 100 43.3 L 125 43.3 L 137.5 64.95 L 125 86.6 L 100 86.6 L 87.5 64.95 Z"
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(0, 255, 255, 0.4)"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />

          <!-- Node 3 (Ethereal Drag Bot/Right) -->
          <path
            class="node-pulse-drag"
            d="M 175 86.6 L 200 86.6 L 212.5 108.25 L 200 129.9 L 175 129.9 L 162.5 108.25 Z"
            fill="rgba(255, 255, 255, 0.02)"
            stroke="rgba(0, 255, 255, 0.2)"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />

          <!-- Node 4 (Off-beat offset node overlapping center) -->
          <path
            class="node-pulse-shift"
            d="M 25 43.3 L 50 43.3 L 62.5 64.95 L 50 86.6 L 25 86.6 L 12.5 64.95 Z"
            fill="rgba(255, 255, 255, 0.05)"
            stroke="rgba(0, 255, 255, 0.5)"
            stroke-width="1.5"
            vector-effect="non-scaling-stroke"
          />

        </pattern>
      </defs>

      <!-- Composite the lattice natively into the frame! -->
      <rect
        width="100%"
        height="100%"
        :fill="`url(#hexbase-${uid})`"
      />
      <rect
        width="100%"
        height="100%"
        :fill="`url(#hexscatter-${uid})`"
      />
    </svg>
  </div>
</template>

<style scoped>
/* Highly randomized, organically desynchronized pulsing algorithms for the mesh nodes! */
.is-masked .node-pulse-fast { animation: flash-node 3s infinite alternate ease-in-out; }
.is-masked .node-pulse-slow { animation: flash-node 6.5s infinite alternate ease-in; animation-delay: -2s; }
.is-masked .node-pulse-drag { animation: flash-node 9s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); animation-delay: -5s; }
.is-masked .node-pulse-shift { animation: flash-node 4.5s infinite alternate ease-out; animation-delay: -1.5s; }

@keyframes flash-node {
  0% {
    opacity: 0.1;
    filter: drop-shadow(0 0 0px transparent);
  }
  30% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
    filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.9));
  }
}
</style>
