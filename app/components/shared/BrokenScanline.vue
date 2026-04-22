<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * SharedBrokenScanline.vue
 * A high-fidelity, state-driven glitch engine that simulates a failing CRT beam.
 * Patterns: Move -> Stop -> Jitter -> Bounce -> Zip.
 */

const beamRef = ref<HTMLElement | null>(null)
const beamY = ref(-20)
const beamOpacity = ref(0)
const beamJitterX = ref(0)
const beamJitterY = ref(0)
const beamScale = ref(1)

// Engine State Machine
type BeamState = 'IDLE' | 'SCANNING' | 'STUCK' | 'JITTERING' | 'ZIP'
let currentState: BeamState = 'IDLE'
let stateTimer = 0
let velocity = 1

function resetBeam() {
  beamY.value = -10
  beamOpacity.value = 0.4
  velocity = Math.random() * 2 + 1
  currentState = 'SCANNING'
  stateTimer = Math.random() * 100 + 50
}

function updateEngine() {
  if (!import.meta.client) return

  switch (currentState) {
    case 'IDLE':
      if (Math.random() > 0.98) resetBeam()
      break

    case 'SCANNING':
      beamY.value += velocity
      stateTimer--
      // Randomly decide to get "stuck"
      if (stateTimer <= 0) {
        currentState = 'STUCK'
        stateTimer = Math.random() * 40 + 20
      }
      break

    case 'STUCK':
      // Micro-vibrations while stuck
      beamJitterX.value = (Math.random() - 0.5) * 4
      beamJitterY.value = (Math.random() - 0.5) * 2
      stateTimer--
      if (stateTimer <= 0) {
        // Decide whether to jitter violently or zip off
        currentState = Math.random() > 0.5 ? 'JITTERING' : 'ZIP'
        stateTimer = Math.random() * 30 + 10
      }
      break

    case 'JITTERING':
      // Violent vibration and scale bounce
      beamJitterX.value = (Math.random() - 0.5) * 15
      beamJitterY.value = (Math.random() - 0.5) * 8
      beamScale.value = 0.9 + Math.random() * 0.4
      beamOpacity.value = 0.2 + Math.random() * 0.8
      stateTimer--
      if (stateTimer <= 0) {
        currentState = 'ZIP'
      }
      break

    case 'ZIP':
      // Rapid acceleration off-screen
      velocity *= 1.25
      beamY.value += velocity
      beamScale.value = 1
      beamJitterX.value = 0
      beamJitterY.value = 0
      if (beamY.value > 110) {
        currentState = 'IDLE'
        beamOpacity.value = 0
      }
      break
  }

  requestAnimationFrame(updateEngine)
}

let rafId: number
onMounted(() => {
  rafId = requestAnimationFrame(updateEngine)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden select-none">
    <div
      ref="beamRef"
      class="absolute inset-x-0 h-[2px] sm:h-[4px] z-[50]"
      :style="{
        top: `${beamY}%`,
        opacity: beamOpacity,
        transform: `translate(${beamJitterX}px, ${beamJitterY}px) scaleY(${beamScale})`,
        background: `linear-gradient(to right, transparent, var(--hud-accent), white, var(--hud-accent), transparent)`,
        boxShadow: `0 0 15px var(--hud-accent)`
      }"
    />
  </div>
</template>
