<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  zIndex?: number
  density?: number // 0 to 1
  baseSize?: number // Max size in px
}>()

interface GlitchInstance {
  id: number
  x: number
  y: number
  size: number
  type: 'solid-pop' | 'wire-pop' | 'sticky'
}

const activeGlitches = ref<GlitchInstance[]>([])
let glitchId = 0

function spawnGlitch() {
  if (!import.meta.client) return
  const id = glitchId++
  const r = Math.random()
  
  let type: GlitchInstance['type'] = 'solid-pop'
  if (r > 0.95) type = 'sticky'
  else if (r > 0.6) type = 'wire-pop'

  // Random size: minimum 40px, heavily weighted toward larger sizes
  const min = 40
  const max = props.baseSize || 64
  // Using Math.pow(Math.random(), 0.3) for even stronger weighting toward max
  const size = Math.floor(Math.pow(Math.random(), 0.3) * (max - min) + min)

  activeGlitches.value.push({
    id,
    x: Math.random() * 92 + 2,
    y: Math.random() * 85 + 5,
    size,
    type
  })

  // Sticky for 5s, pops for 0.6s
  const dur = type === 'sticky' ? 5000 : 600
  setTimeout(() => {
    activeGlitches.value = activeGlitches.value.filter(g => g.id !== id)
  }, dur)
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
          height: `${g.size}px`
        }"
        viewBox="0 0 100 100"
      >
        <polygon
          points="50,5 95,25 95,75 50,95 5,75 5,25"
          :fill="g.type === 'solid-pop' ? 'rgba(239,68,68,0.7)' : 'none'"
          :stroke="'rgba(239,68,68,0.9)'"
          :stroke-width="g.type === 'solid-pop' ? '0' : '4'"
        />
      </svg>
    </div>
  </ClientOnly>
</template>

<style scoped>
.hex-pop-anim {
  animation: glitch-instant-pop 0.35s forwards;
}
.hex-sticky-anim {
  animation: glitch-long-stick 5s forwards;
}

@keyframes glitch-instant-pop {
  0% { opacity: 0; transform: scale(0.6); }
  10% { opacity: 0.8; transform: scale(1.1); }
  20% { opacity: 0.2; transform: scale(0.9); }
  30% { opacity: 0.6; transform: scale(1.0); }
  100% { opacity: 0; transform: scale(1.2); }
}

@keyframes glitch-long-stick {
  0% { opacity: 0; transform: scale(0.9); }
  2% { opacity: 0.9; transform: scale(1.05); } 
  5%, 85% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.1); }
}
</style>
