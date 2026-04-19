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

  // Random size from 25% to 100% of baseSize
  const max = props.baseSize || 40
  const size = Math.floor(Math.random() * (max - 12) + 12)

  activeGlitches.value.push({
    id,
    x: Math.random() * 90 + 5,
    y: Math.random() * 80 + 10,
    size,
    type
  })

  const dur = type === 'sticky' ? 10000 : 1000
  setTimeout(() => {
    activeGlitches.value = activeGlitches.value.filter(g => g.id !== id)
  }, dur)
}

onMounted(() => {
  if (!import.meta.client) return
  // Interval based on density
  const interval = props.density ? 1000 / (props.density * 10) : 300
  setInterval(spawnGlitch, interval)
})
</script>

<template>
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
</template>

<style scoped>
.hex-pop-anim {
  animation: glitch-instant-pop 0.35s forwards;
}
.hex-sticky-anim {
  animation: glitch-long-stick 10s forwards;
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
