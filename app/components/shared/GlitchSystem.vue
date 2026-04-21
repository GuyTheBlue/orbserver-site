<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  zIndex?: number
  density?: number // 0 to 1
  minSize?: number
  maxSize?: number
  color?: string
}>()

interface GlitchInstance {
  id: number
  x: number
  y: number
  size: number
  type: 'solid-pop' | 'wire-pop' | 'sticky'
  duration: number
  blur: number
}

const activeGlitches = ref<GlitchInstance[]>([])
let glitchId = 0

function spawnGlitch() {
  if (!import.meta.client) return
  const id = glitchId++
  const r = Math.random()

  let type: GlitchInstance['type'] = 'solid-pop'
  if (r > 0.5) type = 'sticky' // Increased chance to 50%
  else if (r > 0.2) type = 'wire-pop'

  // Size logic: min to max (e.g. 32 to 100)
  const minS = props.minSize || 32
  const maxS = props.maxSize || 100
  const size = Math.floor(Math.random() * (maxS - minS) + minS)

  // Stickiness: 8s to 12s
  const duration = type === 'sticky'
    ? Math.floor(Math.random() * 4000 + 8000)
    : 600

  // Random blur for sticky (0px to 4px)
  const blur = type === 'sticky' ? (Math.random() * 4) : 0

  activeGlitches.value.push({
    id,
    x: Math.random() * 92 + 2,
    y: Math.random() * 85 + 5,
    size,
    type,
    duration,
    blur
  })

  // Auto-remove after unique duration
  setTimeout(() => {
    activeGlitches.value = activeGlitches.value.filter(g => g.id !== id)
  }, duration + 500) // extra padding for animation
}

onMounted(() => {
  if (!import.meta.client) return
  // Interval based on density: density 1 = 1s, density 4 = 1.2s?
  // Let's just make it slower: 800ms - 1500ms
  const interval = props.density ? (2000 / props.density) : 1200
  setInterval(spawnGlitch, interval)
})
</script>

<template>
  <ClientOnly>
    <div
      class="absolute inset-0 pointer-events-none overflow-hidden"
      :style="{ zIndex: zIndex || 500 }"
    >
      <svg
        v-for="g in activeGlitches"
        :key="g.id"
        class="absolute opacity-0"
        :class="{
          'hex-sticky-anim': g.type === 'sticky',
          'hex-pop-anim': g.type !== 'sticky'
        }"
        :style="{
          top: `${g.y}%`,
          left: `${g.x}%`,
          width: `${g.size}px`,
          height: `${g.size}px`,
          animationDuration: `${g.duration}ms`,
          filter: g.type === 'sticky' ? `blur(${g.blur}px)` : 'none'
        }"
        viewBox="0 0 100 100"
      >
        <polygon
          points="50,5 95,25 95,75 50,95 5,75 5,25"
          :fill="g.type === 'solid-pop' ? (props.color || 'rgba(239,68,68,0.7)') : 'none'"
          :stroke="props.color || 'rgba(239,68,68,0.9)'"
          :stroke-width="g.type === 'solid-pop' ? '0' : '4'"
          :style="{ opacity: g.type === 'solid-pop' ? 0.7 : 0.9 }"
        />
      </svg>
    </div>
  </ClientOnly>
</template>

<style scoped>
.hex-pop-anim {
  animation: glitch-instant-pop linear forwards;
}
.hex-sticky-anim {
  animation: glitch-long-stick linear forwards;
}

@keyframes glitch-instant-pop {
  0% { opacity: 0; transform: scale(0.6); }
  10% { opacity: 0.8; transform: scale(1.1); }
  20% { opacity: 0.2; transform: scale(0.9); }
  30% { opacity: 0.6; transform: scale(1.0); }
  100% { opacity: 0; transform: scale(1.2); }
}

@keyframes glitch-long-stick {
  0% { opacity: 0; transform: scale(0.9) translate(0); filter: blur(0); }
  2% { opacity: 1; transform: scale(1.05) translate(-2px, 1px); filter: blur(0.5px); }
  5% { opacity: 0.8; transform: scale(1.0) translate(2px, -1px); filter: blur(0); }
  8%, 92% { opacity: 0.5; transform: scale(1) translate(0); }
  95% { opacity: 0.9; transform: scale(1.02); filter: blur(2px); }
  98% { opacity: 0.4; transform: scale(0.98); filter: blur(4px); }
  100% { opacity: 0; transform: scale(1.1); filter: blur(8px); }
}
</style>
