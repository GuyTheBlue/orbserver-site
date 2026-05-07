<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  text: string
  pulseColor?: 'red' | 'theme'
}>()

const chars = '!@#$%^&*()_+-=[]{}|;:,.<>/?'
const words = ref(props.text.split(' ').map(w => ({ original: w, current: w, isGlitching: false })))
let intervalId: ReturnType<typeof setTimeout> | null = null

function performGlitch() {
  if (!import.meta.client) return

  // Randomly pick 1 to 3 words to glitch
  const targetCount = Math.floor(Math.random() * 2) + 1
  const targetIndices = new Set<number>()
  while (targetIndices.size < Math.min(targetCount, words.value.length)) {
    targetIndices.add(Math.floor(Math.random() * words.value.length))
  }

  // Corrupt the target words
  targetIndices.forEach((idx) => {
    const word = words.value[idx]
    word.isGlitching = true
    word.current = word.original
      .split('')
      .map(char => Math.random() < 0.4 ? chars[Math.floor(Math.random() * chars.length)] : char)
      .join('')
  })

  // Return to normal after a short "pop"
  setTimeout(() => {
    targetIndices.forEach((idx) => {
      const word = words.value[idx]
      word.isGlitching = false
      word.current = word.original
    })
  }, Math.random() * 300 + 150)
}

function startRandomGlitching() {
  const nextGlitch = () => {
    const delay = Math.random() * 2500 + 800 // Frequent glitches
    intervalId = setTimeout(() => {
      performGlitch()
      nextGlitch()
    }, delay)
  }
  nextGlitch()
}

onMounted(() => {
  if (import.meta.client) {
    startRandomGlitching()
  }
})

onBeforeUnmount(() => {
  if (intervalId) clearTimeout(intervalId)
})

watch(() => props.text, (newVal) => {
  words.value = newVal.split(' ').map(w => ({ original: w, current: w, isGlitching: false }))
})
</script>

<template>
  <span class="glitch-sentence">
    <template
      v-for="(word, i) in words"
      :key="i"
    >
      <span
        class="glitch-word"
        :class="{ 'is-glitching-red': word.isGlitching }"
      >
        {{ word.current }}
      </span>
      <span v-if="i < words.length - 1">&nbsp;</span>
    </template>
  </span>
</template>

<style scoped>
.glitch-sentence {
  display: inline;
}

.glitch-word {
  transition: color 0.1s ease;
  display: inline-block;
}

.is-glitching-red {
  color: #ff0000 !important;
  text-shadow: 0 0 20px rgba(255, 0, 0, 1);
  transform: skewX(-10deg) scale(1.1);
  filter: brightness(1.2);
  z-index: 50;
  position: relative;
}
</style>
