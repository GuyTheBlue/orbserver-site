<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  fraction: number // 0 (new) → 1 (full)
  phase: number    // 0–1 position across the full lunation cycle
}>()

/**
 * Computes an SVG path for the dark shadow overlay.
 *
 * ViewBox is 0 0 100 100, moon is a circle radius=50 centred at (50,50).
 * The parent <div> clips to a circle via border-radius:50% + overflow:hidden,
 * so the path only needs to describe the dark area — clipping is free.
 *
 * Northern Hemisphere convention:
 *   Waxing (phase 0 → 0.5): right side is lit, shadow grows on the LEFT
 *   Waning (phase 0.5 → 1): left side is lit, shadow grows on the RIGHT
 *
 * The shadow shape is built from two SVG arcs:
 *   1. A full semicircle on the shadowed side (left for waxing, right for waning)
 *   2. The terminator — an ellipse whose x-radius = |cos(phase·2π)·R|
 *      This smoothly transitions from crescent → quarter → gibbous and back.
 *
 * Arc direction reference (viewBox, y-axis down):
 *   Top(50,0) → Bottom(50,100): sweep=0 traces LEFT side, sweep=1 traces RIGHT side
 *   Bottom(50,100) → Top(50,0): sweep=0 traces RIGHT side, sweep=1 traces LEFT side
 */
function getMoonShadowPath(phase: number): string {
  const R = 50

  // New moon — fill the entire viewBox (parent circle clips it)
  if (phase <= 0.01) return 'M 0 0 H 100 V 100 H 0 Z'

  // Full moon — no shadow at all
  if (phase >= 0.99) return ''

  const xRadius = Math.abs(R * Math.cos(phase * 2 * Math.PI))
  const xr = xRadius.toFixed(3)

  if (phase < 0.5) {
    // ── Waxing — shadow on the LEFT ─────────────────────────────────────
    // Arc 1: top → bottom via LEFT (sweep=0)
    // Arc 2 (terminator):
    //   phase < 0.25 (crescent): terminator returns via RIGHT (sweep=0) — big shadow area
    //   phase ≥ 0.25 (gibbous):  terminator returns via LEFT  (sweep=1) — small crescent shadow
    const sweepTerminator = phase < 0.25 ? 0 : 1
    return `M 50 0 A 50 50 0 0 0 50 100 A ${xr} 50 0 0 ${sweepTerminator} 50 0 Z`
  }
  else {
    // ── Waning — shadow on the RIGHT ────────────────────────────────────
    // Arc 1: top → bottom via RIGHT (sweep=1)
    // Arc 2 (terminator):
    //   phase < 0.75 (gibbous):  terminator returns via RIGHT (sweep=0) — small crescent shadow
    //   phase ≥ 0.75 (crescent): terminator returns via LEFT  (sweep=1) — big shadow area
    const sweepTerminator = phase < 0.75 ? 0 : 1
    return `M 50 0 A 50 50 0 0 1 50 100 A ${xr} 50 0 0 ${sweepTerminator} 50 0 Z`
  }
}

const shadowPath = computed(() => getMoonShadowPath(props.phase))

// Ambient glow intensity scales with illumination
const glowOpacity = computed(() => 0.15 + props.fraction * 0.45)
const glowSpread = computed(() => `${40 + props.fraction * 60}px`)
</script>

<template>
  <div class="relative flex items-center justify-center" style="will-change: transform;">

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
    <div class="relative rounded-full overflow-hidden moon-disc-element" style="width: 100%; aspect-ratio: 1;">
      <!-- The full-disc moon photograph -->
      <img
        src="/images/hero_layers/moon.png"
        alt="Moon"
        class="block w-full h-full object-cover select-none"
        draggable="false"
      />

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
