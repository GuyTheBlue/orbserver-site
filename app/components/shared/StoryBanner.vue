<script setup lang="ts">
import { computed } from 'vue'
import { useTerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme } = useTerminalTheme()

interface BannerStyle {
  color: string
  hex: string
  hue: string
  rgb: string
}

const themeMap: Record<string, BannerStyle> = {
  cyan: { color: 'pink', hex: '#ec4899', hue: '280deg', rgb: '236, 72, 153' },
  pink: { color: 'amber', hex: '#f59e0b', hue: '15deg', rgb: '245, 158, 11' },
  amber: { color: 'green', hex: '#00dc82', hue: '90deg', rgb: '0, 220, 130' },
  green: { color: 'cyan', hex: '#22d3ee', hue: '140deg', rgb: '34, 211, 238' }
}

const style = computed(() => themeMap[currentTheme.value] || themeMap.cyan)
</script>

<template>
  <ClientOnly>
    <div
      class="relative w-full border-t-2 border-b transition-all duration-500 overflow-hidden group py-8 sm:py-16 broken-terminal-jitter bento-flicker"
      :style="{
        borderColor: `rgba(${style.rgb}, 0.3)`,
        backgroundColor: `rgba(${style.rgb}, 0.03)`,
        '--anomaly-color': style.hex,
        '--anomaly-rgb': style.rgb
      }"
    >
      <!-- Global Banner Scanlines -->
      <div class="absolute inset-0 panel-scanlines opacity-[0.15] pointer-events-none z-10" />

      <!-- Narrative Hexagon Glitches -->
      <SharedGlitchSystem
        :z-index="15"
        :density="2.5"
        :min-size="40"
        :max-size="120"
        color="rgba(239, 68, 68, 0.9)"
      />

      <!-- Story Lore background elements -->
      <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div
          class="absolute inset-0 transition-all duration-500"
          :style="{ background: `radial-gradient(circle at 50% 50%, rgba(${style.rgb}, 0.1), transparent 70%)` }"
        />
        <div
          class="panel-grid-mesh !bg-[size:40px_40px] opacity-10 transition-all duration-500"
          :style="{ backgroundImage: `linear-gradient(rgba(${style.rgb}, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(${style.rgb}, 0.1) 1px, transparent 1px)` }"
        />
      </div>

      <div class="relative z-20 max-w-7xl mx-auto px-6 h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24 justify-between">
        <!-- The Anomaly Identity -->
        <div class="flex flex-col items-center lg:items-start gap-6">
          <div class="flex items-center gap-3">
            <div
              class="w-2.5 h-2.5 animate-ping transition-colors duration-500"
              :style="{ backgroundColor: style.hex, boxShadow: `0 0 10px ${style.hex}` }"
            />
            <h2
              class="font-orbitron font-black tracking-[0.4em] uppercase text-[10px] sm:text-xs transition-colors duration-500"
              :style="{ color: style.hex }"
            >
              FIND THE SECRET. FIX THE GLITCH.
            </h2>
          </div>

          <div class="max-w-2xl text-center lg:text-left space-y-4">
            <p class="font-orbitron font-black text-3xl sm:text-5xl text-white tracking-wider leading-tight uppercase">
              Site status: <span
                class="transition-colors duration-500"
                :style="{ color: style.hex, textShadow: `0 0 15px rgba(${style.rgb}, 0.5)` }"
              >Glitched.</span>
            </p>
            <p class="text-sm sm:text-lg text-white/50 leading-relaxed font-medium">
              The fix requires clues. Follow <span class="text-white italic">The Story of Umph</span> on Instagram to find the upcoming patches.
            </p>
          </div>
        </div>

        <!-- The Terminal / CTA Block -->
        <div class="flex flex-col items-center lg:items-end gap-10 w-full lg:w-auto">
          
          <!-- IMAGE SECTION -->
          <div
            class="relative w-40 sm:w-60 group-hover:scale-105 transition-all duration-700 p-6 bg-black rounded-3xl border overflow-hidden"
            :style="{ borderColor: `rgba(${style.rgb}, 0.5)` }"
          >
            <div class="absolute inset-0 panel-scanlines opacity-40 pointer-events-none z-10" />
            <NuxtImg
              src="/images/umph.png"
              class="relative z-0 w-full h-auto object-contain brightness-125 contrast-125 transition-all duration-500"
              :style="{ filter: `sepia(1) saturate(10) hue-rotate(${style.hue}) brightness(1.1) contrast(1.4)` }"
              alt="The Umph"
            />
          </div>

          <!-- CRYPTO TYPOGRAPHY AND INPUT CONSOLE -->
          <div class="flex flex-col items-center lg:items-end gap-4 w-full">
            <div class="font-mono text-[9px] tracking-[0.6em] text-white/30 uppercase">
              sha256(clues) = <span :style="{ color: style.hex }">patch_ref_0x7c</span>
            </div>

            <!-- Decorative Input Box -->
            <div 
              class="w-full max-w-[320px] bg-black border h-10 px-4 flex items-center gap-3 opacity-60 pointer-events-none"
              :style="{ borderColor: `rgba(${style.rgb}, 0.2)` }"
            >
              <div class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ backgroundColor: style.hex }" />
              <span class="font-mono text-[10px] text-white/20 tracking-wider">ENTER_PATCH_KEY...</span>
            </div>

            <a
              href="https://www.instagram.com/thelittleblueguy/"
              target="_blank"
              rel="noopener noreferrer"
              class="group/btn relative inline-flex items-center gap-4 px-10 py-4 border rounded-2xl transition-all duration-300 overflow-hidden w-full max-w-[320px] justify-center animate-anomaly-pulse"
              :style="{
                backgroundColor: `rgba(${style.rgb}, 0.1)`,
                borderColor: `rgba(${style.rgb}, 0.4)`,
                boxShadow: `0 0 15px rgba(${style.rgb}, 0.3)`
              }"
              @mouseenter="$event.currentTarget.style.backgroundColor = style.hex"
              @mouseleave="$event.currentTarget.style.backgroundColor = `rgba(${style.rgb}, 0.1)`"
            >
              <div
                class="absolute inset-0 w-full h-full -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"
                :style="{ backgroundColor: `rgba(${style.rgb}, 0.2)` }"
              />
              <span
                class="relative z-10 font-orbitron font-black text-xs sm:text-sm tracking-[0.4em] uppercase italic transition-colors animate-text-flicker group-hover:text-black"
                :style="{ color: style.hex }"
              >
                FOLLOW THE STORY
              </span>
              <UIcon
                name="i-lucide-instagram"
                class="relative z-10 w-5 h-5 group-hover/btn:scale-110 transition-transform transition-colors animate-text-flicker group-hover:text-black"
                :style="{ color: style.hex }"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Decorative Edge Text -->
      <div class="absolute top-4 right-6 hidden md:block opacity-20 pointer-events-none">
        <span
          class="font-mono text-[8px] tracking-[0.8em] uppercase rotate-90 origin-right whitespace-nowrap transition-colors duration-500"
          :style="{ color: style.hex }"
        >
          UNAUTHORISED_SYSTEM_OVERRIDE_0xAF4
        </span>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
/* Any local glitch animations specific to this banner */
</style>

<style scoped>
@keyframes anomaly-pulse {
  0% { box-shadow: 0 0 10px rgba(var(--anomaly-rgb), 0.2); transform: scale(1); }
  50% { box-shadow: 0 0 30px rgba(var(--anomaly-rgb), 0.5); transform: scale(1.02); }
  100% { box-shadow: 0 0 10px rgba(var(--anomaly-rgb), 0.2); transform: scale(1); }
}

.animate-anomaly-pulse {
  animation: anomaly-pulse 3s infinite ease-in-out;
}

@keyframes text-flicker {
  0%, 88%, 92%, 96%, 100% { color: var(--anomaly-color); filter: brightness(1); }
  90%, 94%, 98% { color: white; filter: brightness(2); text-shadow: 0 0 10px white; }
}

.animate-text-flicker {
  animation: text-flicker 5s infinite step-end;
}

/* Force text to black on hover to remain visible against solid background */
.group\/btn:hover .animate-text-flicker {
  animation: none !important;
  color: #000000 !important;
  text-shadow: none !important;
}
</style>
