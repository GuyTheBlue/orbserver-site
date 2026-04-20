<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  fraction: number // 0 (new) → 1 (full)
  phase: number // 0–1 position across the full lunation cycle
  rotation?: number // Degrees of rotation relative to horizon
  lat?: number // Latitude for hemisphere-aware phase orientation
}>()

function getMoonShadowPath(phase: number, lat: number = 0): string {
  const R = 50
  if (phase <= 0.01) return 'M 0 0 H 100 V 100 H 0 Z'
  if (phase >= 0.99) return ''

  // The 'Immutable Law': Rotation handles hemisphere flip.
  // Shadow shape uses raw phase.
  const adjustedPhase = phase

  const xRadius = Math.abs(R * Math.cos(adjustedPhase * 2 * Math.PI))
  const xr = xRadius.toFixed(3)

  // Draw path based on adjusted phase to handle hemisphere flip
  if (adjustedPhase < 0.5) {
    const sweepTerminator = adjustedPhase < 0.25 ? 0 : 1
    return `M 50 0 A 50 50 0 0 0 50 100 A ${xr} 50 0 0 ${sweepTerminator} 50 0 Z`
  } else {
    const sweepTerminator = adjustedPhase < 0.75 ? 0 : 1
    return `M 50 0 A 50 50 0 0 1 50 100 A ${xr} 50 0 0 ${sweepTerminator} 50 0 Z`
  }
}

// Shape only — rotation (which encodes lit-limb direction) is in apparentRotation
const shadowPath = computed(() => getMoonShadowPath(props.phase))

// Ambient glow intensity scales with illumination
const glowOpacity = computed(() => 0.15 + props.fraction * 0.45)
const glowSpread = computed(() => `${40 + props.fraction * 60}px`)
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    style="will-change: transform;"
  >
    <!-- Outer ambient atmospheric glow — intensifies toward full moon -->
    <div
      class="absolute rounded-full pointer-events-none"
      :style="{
        inset: '-20%',
        background: `radial-gradient(circle, rgba(180,220,255,${glowOpacity}) 0%, transparent 70%)`,
        filter: `blur(${glowSpread})`,
        transition: 'all 2s ease'
      }"
    />

    <!-- Inner near-glow ring -->
    <div
      class="absolute rounded-full pointer-events-none"
      :style="{
        inset: '-6%',
        background: `radial-gradient(circle, rgba(210,235,255,${glowOpacity * 0.6}) 0%, transparent 65%)`,
        filter: 'blur(20px)'
      }"
    />

    <!-- The moon disc: image + shadow overlay, clipped to circle -->
    <!-- Shadow path handles SH via effectivePhase; disc just rotates by parallactic angle -->
    <div
      class="relative rounded-full overflow-hidden moon-disc-element"
      style="width: 100%; aspect-ratio: 1; transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1);"
      :style="{ transform: `rotate(${props.rotation ?? 0}deg)` }"
    >
      <!-- The full-disc moon photograph -->
      <img
        src="/images/hero_layers/moon.png"
        alt="Moon"
        class="block w-full h-full object-cover select-none"
        draggable="false"
      >

      <!-- SVG shadow overlay — covers the unlit portion of the moon -->
      <svg
        v-if="shadowPath"
        class="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <!-- Soft terminator edge: a blurred ellipse sitting on the boundary -->
        <defs>
          <filter id="terminator-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <!-- Blurred terminator strip for realism -->
        <path
          :d="shadowPath"
          fill="rgba(2, 6, 20, 0.35)"
          filter="url(#terminator-blur)"
        />
        <!-- Sharp hard shadow -->
        <path
          :d="shadowPath"
          fill="rgba(2, 6, 20, 0.95)"
        />
      </svg>
    </div>

    <!-- Subtle rotating orbital ring around the moon -->
    <div
      class="absolute rounded-full border border-cyan-400/15 pointer-events-none moon-orbit-ring"
      style="inset: -12%; animation: moon-orbit-spin 40s linear infinite;"
    >
      <!-- Small targeting dot on the orbital ring -->
      <div class="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-400/60 rounded-full -translate-x-1/2 -translate-y-1/2" />
    </div>
  </div>
</template>

<style scoped>
.moon-disc-element {
  box-shadow:
    0 0 40px rgba(150, 200, 255, 0.08),
    inset 0 0 30px rgba(0, 0, 0, 0.2);
}

@keyframes moon-orbit-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
