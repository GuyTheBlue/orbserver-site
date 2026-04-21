<script setup lang="ts">
const props = defineProps<{
  imageUrl?: string
}>()

// Use the current theme accent for tinting the monochrome bitmap
</script>

<template>
  <div class="relative w-full border-y border-hud-accent/20 bg-hud-accent/[0.02] overflow-hidden group">
    <div class="absolute inset-0 z-0 panel-grid-mesh opacity-10" />
    <div class="absolute inset-0 z-0 panel-scanlines opacity-20" />
    
    <div class="relative z-10 max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3">
      <!-- Left side decorative element -->
      <div class="flex items-center gap-4">
        <div class="w-1.5 h-6 bg-hud-accent/40 animate-pulse" />
        <div class="font-mono text-[9px] text-hud-accent tracking-[0.5em] uppercase opacity-60">
          PROMO_SUBSYSTEM :: UMPH_CORP
        </div>
      </div>

      <!-- Center Logo/Banner Content -->
      <div class="flex-1 flex justify-center h-12 overflow-hidden px-10">
        <NuxtImg
          src="/images/umph.png"
          alt="UMPH"
          class="h-full w-auto object-contain transition-all duration-700 hover:scale-110"
          style="filter: sepia(1) saturate(5) hue-rotate(140deg) brightness(1.2) contrast(1.2) drop-shadow(0 0 5px rgba(var(--hud-accent-rgb), 0.5));"
          :style="{ filter: 'sepia(1) saturate(5) hue-rotate(140deg) brightness(1.2) contrast(1.2)' }"
        />
      </div>

      <!-- Right side technical status -->
      <div class="flex items-center gap-6">
        <div class="hidden md:flex flex-col items-end">
          <span class="font-mono text-[8px] text-hud-accent/40 tracking-widest">BROADCAST_SYNC</span>
          <span class="font-mono text-[10px] text-hud-accent">ACTIVE_0.42ms</span>
        </div>
        <div class="flex gap-1.5">
          <div class="w-2 h-2 rounded-full bg-hud-accent/60" />
          <div class="w-2 h-2 rounded-full bg-hud-accent/30" />
          <div class="w-2 h-2 rounded-full bg-hud-accent/10" />
        </div>
      </div>
    </div>

    <!-- Glitch bar -->
    <div class="absolute bottom-0 left-0 h-[1px] w-full bg-hud-accent/40 overflow-hidden">
      <div class="h-full w-1/3 bg-white animate-[logo-scan_3s_linear_infinite]" />
    </div>
  </div>
</template>

<style scoped>
@keyframes logo-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
</style>
