<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme } = useTerminalTheme()
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const themeMap: Record<string, { hue: string }> = {
  cyan: { hue: '145deg' },
  amber: { hue: '0deg' },
  pink: { hue: '280deg' },
  green: { hue: '95deg' }
}

const style = computed(() => {
  if (!isMounted.value) return themeMap.cyan
  return themeMap[currentTheme.value] || themeMap.cyan
})
</script>

<template>
  <div class="relative w-full border-y border-hud-accent/20 bg-hud-accent/[0.03] overflow-hidden group py-16 md:py-24 transition-all duration-500">
    <!-- Background elements -->
    <div class="absolute inset-0 z-0 panel-grid-mesh opacity-[0.15]" />
    <div class="absolute inset-0 z-0 panel-scanlines opacity-20" />
    
    <div class="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16 lg:gap-24">
      <!-- Left side: The Logo (Bigger in Stacked Mode) -->
      <div class="flex-shrink-0 relative group/logo w-full md:w-auto flex justify-center">
        <div class="absolute -inset-10 bg-hud-accent/10 blur-3xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700" />
        <div class="relative z-10 bg-black p-8 md:p-10 rounded-[2rem] border border-hud-accent/50 transition-all duration-700 group-hover/logo:scale-105 shadow-[0_0_60px_rgba(var(--hud-accent-rgb),0.2)] overflow-hidden">
          <div class="absolute inset-0 panel-scanlines opacity-40 pointer-events-none" />
          <NuxtImg
            src="/images/umph.png"
            alt="UMPH"
            class="h-48 md:h-40 lg:h-48 w-auto object-contain transition-all duration-700"
            :style="{ filter: `sepia(1) saturate(10) hue-rotate(${style.hue}) brightness(1.1) contrast(1.4)` }"
          />
        </div>
      </div>

      <!-- Center: The Wording -->
      <div class="flex-1 text-center md:text-left space-y-6">
        <h3 class="font-mono text-[10px] md:text-[11px] text-hud-accent tracking-[0.8em] uppercase opacity-60">
          SPONSORSHIP_DEALING // SYSTEM_RESOURCES
        </h3>
        <p class="font-orbitron font-black text-3xl md:text-3xl lg:text-5xl text-white tracking-tight uppercase leading-[1.1]">
          This is an <span class="text-hud-accent">UMPH-sponsored</span> application. <br class="hidden lg:block">
          Access is free. Always.
        </p>
        <p class="font-mono text-[11px] md:text-[13px] text-white/40 tracking-widest uppercase max-w-2xl leading-relaxed">
          The mission continues on social. Please support the development by following the <span class="text-white font-bold">Story of Umph</span> for updates and lore.
        </p>
      </div>

      <!-- Right side: The CTA Button (Sharp Corners & Glitch) -->
      <div class="flex-shrink-0 w-full md:w-auto">
        <a
          href="https://www.instagram.com/thelittleblueguy/"
          target="_blank"
          rel="noopener noreferrer"
          class="group/btn relative inline-flex items-center justify-center gap-8 px-12 py-6 bg-hud-accent/10 border border-hud-accent/40 rounded-sm hover:bg-hud-accent/20 transition-all active:scale-95 shadow-[0_0_50px_rgba(var(--hud-accent-rgb),0.2)] hover:shadow-[0_0_70px_rgba(var(--hud-accent-rgb),0.3)] w-full md:w-auto overflow-hidden"
        >
          <div class="flex flex-col items-start leading-none text-left">
            <span class="font-mono text-[9px] text-hud-accent/60 tracking-[0.4em] uppercase mb-2">CONNECT_FEED</span>
            <span class="font-orbitron font-black text-base md:text-lg text-hud-accent tracking-[0.2em] uppercase animate-text-flicker-cyan">FOLLOW UMPH</span>
          </div>
          <div class="w-14 h-14 flex items-center justify-center bg-hud-accent text-black rounded-full transition-all group-hover/btn:scale-110 shadow-[0_0_20px_rgba(var(--hud-accent-rgb),0.6)] group-hover/btn:-rotate-12">
            <UIcon name="i-lucide-instagram" class="w-7 h-7" />
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

@keyframes text-flicker-cyan {
  0%, 88%, 92%, 96%, 100% { color: var(--hud-accent); filter: brightness(1); }
  90%, 94%, 98% { color: white; filter: brightness(2); text-shadow: 0 0 10px white; }
}

.animate-text-flicker-cyan {
  animation: text-flicker-cyan 5s infinite step-end;
}

.group\/btn:hover .animate-text-flicker-cyan {
  animation: none !important;
  color: #000000 !important;
  text-shadow: none !important;
}
</style>
