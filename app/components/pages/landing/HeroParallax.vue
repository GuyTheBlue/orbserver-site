<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

// The background elements move upward very fast to "drop" out of frame
const backgroundTransform = computed(() => `translateY(-${y.value * 0.8}px)`)

// The foreground elements (dune/front rock) slowly translate up and slightly scale, eclipsing the background
const duneTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 0.2}px)`)
const rockTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 0.2}px)`)

// The overall space transitions to pitch black/void as you sink
const voidOpacity = computed(() => Math.min(y.value / 600, 1))
</script>

<template>
  <!-- The track allows for vertical scrolling space -->
  <div class="relative h-[200vh] w-full">
    <!-- ClientOnly wrapper to satisfy our strict Nuxt 4 guard-rail! -->
    <ClientOnly>
      <!-- The camera frame: locks to the screen while you scroll down the track -->
      <div class="sticky top-0 h-screen w-full overflow-hidden bg-slate-950 flex flex-col justify-end">
        
        <img src="/images/hero_layers/night_sky.png" class="absolute top-0 left-0 w-full h-[55%] object-cover object-bottom z-10" :style="{ transform: backgroundTransform }" alt="Sky" />

        <!-- Mystic Hexagon Overlay (Lifted to z-15 so it paints cleanly above the starry sky) -->
        <div id="hexagon-overlay" class="absolute inset-0 z-15" :style="{ transform: backgroundTransform }">
          <PagesLandingHeroHexagons />
        </div>
        
        <!-- Moon massive and shifted higher on LG screens -->
        <img src="/images/hero_layers/moon.png" class="absolute left-1/2 w-[24rem] md:w-[48rem] top-[20%] lg:top-[5%] -translate-x-1/2 z-20" :style="{ transform: backgroundTransform }" alt="Moon" />

        <img src="/images/hero_layers/sea.png" class="absolute bottom-0 left-0 w-full h-[45%] object-cover object-top z-30" :style="{ transform: backgroundTransform }" alt="Sea" />
        
        <!-- Stones temporarily hidden as requested -->
        <!-- <img src="/images/hero_layers/stones_left.png" class="absolute bottom-[20%] xl:bottom-[32%] left-4 md:left-12 w-16 md:w-32 z-40" :style="{ transform: backgroundTransform }" alt="Left Stone" /> -->
        <!-- <img src="/images/hero_layers/stones_right.png" class="absolute bottom-[20%] xl:bottom-[32%] right-4 md:right-12 w-16 md:w-32 z-40" :style="{ transform: backgroundTransform }" alt="Right Stone" /> -->

        <!-- Dune restricted on mobile, but grows to h-[45%] on XL screens to reach higher up -->
        <img src="/images/hero_layers/dunes.png" class="absolute bottom-0 w-full h-[35%] xl:h-[45%] object-cover object-top origin-bottom z-50" :style="{ transform: duneTransform }" alt="Dune" />
        
        <!-- Foreground rock vastly increased in size and tucked into the black void structurally -->
        <img src="/images/hero_layers/fore_front_rock.png" class="absolute left-0 -bottom-[10%] w-[40vw] max-w-none origin-bottom-left z-60" :style="{ transform: rockTransform }" alt="Foreground Rock" />

        <!-- Dynamic Tech Line Tracking SVG (Locked to Moon Center organically) -->
        <svg class="absolute inset-0 w-full h-full z-[65] pointer-events-none lg:hidden">
          <circle cx="50%" :cy="`calc(20% + 12rem - ${y * 0.8}px)`" r="8" fill="#00ffff" class="animate-ping hidden md:block" />
          <line x1="50%" :y1="`calc(20% + 12rem - ${y * 0.8}px)`" x2="85%" y2="28%" stroke="url(#techGlow)" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));" class="hidden md:block" />
          <defs><linearGradient id="techGlow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00ffff" stop-opacity="0.8" /><stop offset="100%" stop-color="#00ffff" stop-opacity="0.1" /></linearGradient></defs>
        </svg>

        <svg class="absolute inset-0 w-full h-full z-[65] pointer-events-none hidden lg:block">
          <circle cx="50%" :cy="`calc(5% + 24rem - ${y * 0.8}px)`" r="8" fill="#00ffff" class="animate-ping" />
          <line x1="50%" :y1="`calc(5% + 24rem - ${y * 0.8}px)`" x2="85%" y2="28%" stroke="url(#techGlow)" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));" />
        </svg>

        <!-- Our static Foreground HUD (Logo, Text, and Panels) -->
        <div class="absolute inset-0 z-[66]">
          <PagesLandingHeroUI />
        </div>

        <!-- Debug utility for dynamic resolution tweaking -->
        <SharedScreenSizeHelper />

        <!-- Pitch Black Void Fade-in Layer -->
        <div class="absolute inset-0 z-[70] bg-slate-950 pointer-events-none" :style="{ opacity: voidOpacity }"></div>
      </div>
      
      <template #fallback>
        <!-- SSR loading state -->
        <div class="h-screen w-full bg-slate-950 flex items-center justify-center">
          <p class="text-white text-lg animate-pulse">Initializing Interface...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
