<script setup lang="ts">
import { computed } from 'vue'
import { useTerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme } = useTerminalTheme()

const themeMap: Record<string, { hue: string }> = {
  cyan: { hue: '145deg' },
  amber: { hue: '0deg' },
  pink: { hue: '280deg' },
  green: { hue: '95deg' }
}

const style = computed(() => themeMap[currentTheme.value] || themeMap.cyan)
</script>

<template>
  <div class="relative w-full border-y border-hud-accent/20 bg-hud-accent/[0.03] overflow-hidden group py-16 md:py-20 transition-all duration-500">
    <!-- Background elements -->
    <div class="absolute inset-0 z-0 panel-grid-mesh opacity-[0.15]" />
    <div class="absolute inset-0 z-0 panel-scanlines opacity-20" />
    
    <div class="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
      <!-- Left side: The Logo (Bigger & Tidied) -->
      <div class="flex-shrink-0 relative group/logo">
        <div class="absolute -inset-6 bg-hud-accent/10 blur-3xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700" />
        <div class="relative z-10 bg-black p-6 md:p-8 rounded-[2rem] border border-hud-accent/30 transition-all duration-700 group-hover/logo:scale-105 shadow-[0_0_40px_rgba(var(--hud-accent-rgb),0.1)] overflow-hidden">
          <div class="absolute inset-0 panel-scanlines opacity-30 pointer-events-none" />
          <NuxtImg
            src="/images/umph.png"
            alt="UMPH"
            class="h-20 md:h-32 lg:h-40 w-auto object-contain transition-all duration-700"
            :style="{ filter: `sepia(1) saturate(5) hue-rotate(${style.hue}) brightness(1.2) contrast(1.2)` }"
          />
        </div>
      </div>

      <!-- Center: The Wording (CTA Lingo) -->
      <div class="flex-1 text-center md:text-left space-y-4">
        <h3 class="font-mono text-[10px] md:text-[11px] text-hud-accent tracking-[0.6em] uppercase opacity-60">
          SPONSORSHIP_DEALING // SYSTEM_RESOURCES
        </h3>
        <p class="font-orbitron font-black text-2xl md:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-[1.1]">
          This is an <span class="text-hud-accent">UMPH-sponsored</span> application. <br class="hidden lg:block">
          Access is free. Always.
        </p>
        <p class="font-mono text-[11px] md:text-[12px] text-white/40 tracking-widest uppercase max-w-2xl">
          The mission continues on social. Please support the development by following the <span class="text-white">Story of Umph</span> for updates and lore.
        </p>
      </div>

      <!-- Right side: The CTA Button -->
      <div class="flex-shrink-0 w-full md:w-auto">
        <a
          href="https://www.instagram.com/thelittleblueguy/"
          target="_blank"
          rel="noopener noreferrer"
          class="group/btn relative inline-flex items-center justify-center gap-6 px-10 py-5 bg-hud-accent/10 border border-hud-accent/30 rounded-sm hover:bg-hud-accent/20 transition-all active:scale-95 shadow-[0_0_40px_rgba(var(--hud-accent-rgb),0.1)] hover:shadow-[0_0_50px_rgba(var(--hud-accent-rgb),0.2)] w-full md:w-auto"
        >
          <div class="flex flex-col items-start leading-none text-left">
            <span class="font-mono text-[9px] text-hud-accent/60 tracking-widest uppercase mb-1">CONNECT_FEED</span>
            <span class="font-orbitron font-black text-sm md:text-base text-hud-accent tracking-[0.2em] uppercase">FOLLOW UMPH</span>
          </div>
          <div class="w-12 h-12 flex items-center justify-center bg-hud-accent text-black rounded-full transition-all group-hover/btn:scale-110 shadow-[0_0_15px_rgba(var(--hud-accent-rgb),0.5)]">
            <UIcon name="i-lucide-instagram" class="w-6 h-6 group-hover/btn:-rotate-12 transition-transform" />
          </div>
        </a>
      </div>
    </div>

    <!-- Bottom scanning glitch -->
    <div class="absolute bottom-0 left-0 h-[2px] w-full bg-hud-accent/10 overflow-hidden">
      <div class="h-full w-1/3 bg-white/30 animate-[logo-scan_4s_linear_infinite]" />
    </div>
  </div>
</template>

<style scoped>
@keyframes logo-scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
</style>
