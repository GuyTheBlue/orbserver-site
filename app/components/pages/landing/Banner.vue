<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTerminalTheme } from '~/composables/useTerminalTheme'
import { landingData } from '~/utils/landingData'

const { currentTheme } = useTerminalTheme()
const isMounted = ref(false)
const data = landingData.banners.umph

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
  <div class="relative w-full border-y border-hud-accent/20 bg-hud-accent/[0.03] overflow-hidden group py-16 sm:py-24 transition-all duration-500">
    <!-- Background elements -->
    <div class="absolute inset-0 z-0 panel-grid-mesh opacity-[0.15]" />
    <div class="absolute inset-0 z-0 panel-scanlines opacity-20" />
    
    <div class="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
      <!-- Left side: The Wording -->
      <div class="flex-col items-center lg:items-start gap-6 flex-1 text-center lg:text-left space-y-6">
        <div class="flex items-center gap-3 justify-center lg:justify-start">
          <div class="w-2.5 h-2.5 animate-ping bg-hud-accent" style="box-shadow: 0 0 10px var(--hud-accent)" />
          <h3 class="font-mono text-[10px] md:text-[11px] text-hud-accent tracking-[0.8em] uppercase opacity-60">
            {{ data.label }}
          </h3>
        </div>
        <p class="font-orbitron font-black text-3xl sm:text-5xl text-white tracking-wider leading-tight uppercase">
          <SharedGlitchText :text="data.title" />
        </p>
        <p class="text-sm sm:text-lg text-white/50 leading-relaxed font-medium">
          {{ data.description }}
        </p>
      </div>

      <!-- Right side: The Terminal / CTA Block (Image + CTA) -->
      <div class="flex flex-col items-center lg:items-end gap-12 w-full lg:w-auto">
        <!-- The Logo -->
        <div class="relative w-64 sm:w-60 group-hover:scale-105 transition-all duration-700 p-8 bg-black rounded-[2rem] border border-hud-accent/50 overflow-hidden shadow-[0_0_60px_rgba(var(--hud-accent-rgb),0.2)]">
          <div class="absolute inset-0 panel-scanlines opacity-40 pointer-events-none z-10" />
          <NuxtImg
            src="/images/umph.png"
            alt="UMPH"
            class="relative z-0 w-full h-auto object-contain transition-all duration-700 animate-image-glitch"
            :style="{ 
              '--base-filter': `sepia(1) saturate(10) hue-rotate(${style.hue}) brightness(1.1) contrast(1.4)`,
              filter: `var(--base-filter)`
            }"
          />
        </div>

        <!-- The CTA Button -->
        <a
          href="https://www.instagram.com/thelittleblueguy/"
          target="_blank"
          rel="noopener noreferrer"
          class="group/btn relative inline-flex items-center justify-center gap-8 px-10 sm:px-12 py-5 sm:py-6 border rounded-sm transition-all duration-300 active:scale-95 shadow-2xl hover:shadow-[0_0_70px_rgba(var(--hud-accent-rgb),0.3)] w-full md:w-auto overflow-hidden animate-anomaly-pulse"
          :style="{
            backgroundColor: `rgba(var(--hud-accent-rgb), 0.1)`,
            borderColor: `rgba(var(--hud-accent-rgb), 0.4)`
          }"
        >
          <div class="flex flex-col items-start leading-none text-left relative z-10">
            <span class="font-mono text-[9px] text-white/40 tracking-[0.4em] uppercase mb-2">CONNECT_FEED</span>
            <span class="font-orbitron font-black text-sm md:text-base tracking-[0.2em] uppercase transition-colors duration-300 animate-text-flicker-cyan group-hover/btn:text-black">
              <SharedGlitchText :text="data.cta" />
            </span>
          </div>

          <div 
            class="relative z-10 w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full transition-all group-hover/btn:scale-110 shadow-lg group-hover/btn:-rotate-12 overflow-hidden"
            :style="{ backgroundColor: 'var(--hud-accent)', color: 'black' }"
          >
            <UIcon
              name="i-lucide-instagram"
              class="w-7 h-7 animate-icon-glitch"
            />
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

@keyframes anomaly-pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.02); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.animate-anomaly-pulse {
  animation: anomaly-pulse 3s infinite ease-in-out;
}

.group\/btn:hover .animate-text-flicker-cyan {
  animation: none !important;
  color: #000000 !important;
  text-shadow: none !important;
}

@keyframes icon-glitch {
  0%, 90%, 100% { transform: translate(0) scale(1); filter: none; opacity: 1; }
  92% { transform: translate(-3px, 2px) scale(1.1); filter: hue-rotate(90deg) contrast(2) invert(0.1); opacity: 0.8; }
  94% { transform: translate(3px, -2px) scale(0.9); filter: hue-rotate(-90deg) contrast(3) sepia(1); opacity: 0.9; }
  96% { transform: translate(-1px, -1px) scale(1.05); filter: brightness(2) saturate(5); opacity: 1; }
  98% { transform: translate(1px, 1px) scale(1.2); filter: invert(1); opacity: 0.7; }
}

.animate-icon-glitch {
  animation: icon-glitch 4s infinite step-end;
}

@keyframes image-glitch {
  0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); filter: var(--base-filter); }
  91% { clip-path: inset(20% 0 50% 0); transform: translate(-10px, 5px); filter: brightness(2) saturate(10) hue-rotate(-50deg) sepia(1); }
  92% { clip-path: inset(10% 0 80% 0); transform: translate(10px, -5px); filter: brightness(1.5) saturate(10) hue-rotate(-50deg) sepia(1); }
  93% { clip-path: inset(60% 0 5% 0); transform: translate(-5px, 10px); filter: brightness(3) saturate(10) hue-rotate(-50deg) sepia(1); }
  94% { clip-path: inset(0 0 0 0); transform: translate(0); filter: var(--base-filter); }
}

.animate-image-glitch {
  animation: image-glitch 5s infinite step-end;
}
</style>
