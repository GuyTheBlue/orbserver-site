<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

// The background elements (Sky/Moon) are distant, so they barely move (anchoring down visually)
const backgroundTransform = computed(() => `translateY(-${y.value * 0.2}px)`)

// The foreground elements move up faster relative to the camera to overtake the horizon naturally
const duneTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 0.6}px)`)
const rockTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 1.0}px)`)

// The overall space transitions to pitch black/void as you sink
const voidOpacity = computed(() => Math.min(y.value / 600, 1))
</script>

<template>
  <!-- The track allows for vertical scrolling space -->
  <div class="relative h-[200vh] w-full">
    <!-- ClientOnly wrapper to satisfy our strict Nuxt 4 guard-rail! -->
    <ClientOnly>
      <!-- The camera frame: locks to the screen while you scroll down the track -->
      <div class="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col justify-end">
        
        <img src="/images/hero_layers/night_sky.png" class="absolute top-0 left-0 w-full h-[55%] object-cover object-bottom z-10" :style="{ transform: backgroundTransform }" alt="Sky" />

        <!-- Mystic Hexagon Overlay (Lifted to z-15 so it paints cleanly above the starry sky) -->
        <div id="hexagon-overlay" class="absolute inset-0 z-15" :style="{ transform: backgroundTransform }">
          <PagesLandingHeroHexagons />
        </div>
        
        <!-- Moon scaled massively and raised dynamically per breakpoint to keep ~20% intersecting the horizon -->
        <img src="/images/hero_layers/moon.png" class="absolute left-1/2 w-[36rem] md:w-[48rem] top-[10%] sm:top-0 md:-top-[15%] lg:-top-[20%] xl:-top-[25%] -translate-x-1/2 z-20" :style="{ transform: backgroundTransform }" alt="Moon" />

        <img src="/images/hero_layers/sea.png" class="absolute bottom-0 left-0 w-full h-[45%] object-cover object-top z-30" :style="{ transform: backgroundTransform }" alt="Sea" />
        
        <!-- Stones temporarily hidden as requested -->
        <!-- <img src="/images/hero_layers/stones_left.png" class="absolute bottom-[20%] xl:bottom-[32%] left-4 md:left-12 w-16 md:w-32 z-40" :style="{ transform: backgroundTransform }" alt="Left Stone" /> -->
        <!-- <img src="/images/hero_layers/stones_right.png" class="absolute bottom-[20%] xl:bottom-[32%] right-4 md:right-12 w-16 md:w-32 z-40" :style="{ transform: backgroundTransform }" alt="Right Stone" /> -->

        <!-- Dune visually grouped with an infinite black base so it bleeds into the lower page dynamically -->
        <div class="absolute bottom-0 w-full z-50 origin-bottom" :style="{ transform: duneTransform }">
          <img src="/images/hero_layers/dunes.png" class="w-full h-[35vh] xl:h-[45vh] object-cover object-top block" alt="Dune" />
          
          <!-- Inner gradient creating a soft fade from the dune texture into absolute black -->
          <div class="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          
          <!-- Infinite solid black base mathematically pinned to the bottom of the dune -->
          <div class="absolute top-full left-0 w-full h-[200vh] bg-black"></div>
        </div>
        
        <!-- Foreground rock anchored similarly with a massive black bleed for the parallax uplift effect -->
        <div class="absolute left-0 -bottom-[10%] sm:-bottom-[2%] md:-bottom-[10%] w-[80vw] sm:w-[50vw] md:w-[60vw] lg:w-[40vw] xl:w-[50vw] max-w-none origin-bottom-left z-60" :style="{ transform: rockTransform }">
          <img src="/images/hero_layers/fore_front_rock.png" class="w-full object-cover origin-bottom-left block" alt="Foreground Rock" />
          
          <div class="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          
          <!-- The infinite black bleed anchored underneath the rock -->
          <div class="absolute top-full left-0 w-full h-[200vh] bg-black"></div>
        </div>

        <!-- Dynamic Tech Line Tracking SVG (Locked to Moon Center organically per Breakpoint) -->
        <!-- Hidden entirely on XS so it doesn't wildly intersect the newly woven left-and-right alternating layout -->
        <svg class="absolute inset-0 w-full h-full z-[65] pointer-events-none text-cyan-400 hidden sm:block">
          <defs><linearGradient id="techGlow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00ffff" stop-opacity="0.8" /><stop offset="100%" stop-color="#00ffff" stop-opacity="0.1" /></linearGradient></defs>

          <!-- SM -->
          <g class="hidden sm:block md:hidden">
            <line x1="50%" :y1="`calc(0% + 18rem - ${y * 0.2}px)`" x2="90%" y2="20%" stroke="url(#techGlow)" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));" />
          </g>

          <!-- MD -->
          <g class="hidden md:block lg:hidden">
            <line x1="50%" :y1="`calc(-15% + 24rem - ${y * 0.2}px)`" x2="90%" y2="20%" stroke="url(#techGlow)" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));" />
          </g>

          <!-- LG -->
          <g class="hidden lg:block xl:hidden">
            <line x1="50%" :y1="`calc(-20% + 24rem - ${y * 0.2}px)`" x2="92%" y2="20%" stroke="url(#techGlow)" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));" />
          </g>

          <!-- XL / 2XL -->
          <g class="hidden xl:block">
            <line x1="50%" :y1="`calc(-25% + 24rem - ${y * 0.2}px)`" x2="92%" y2="20%" stroke="url(#techGlow)" stroke-width="1.5" style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));" />
          </g>
        </svg>

        <!-- Our static Foreground HUD (Logo, Text, and Panels) -->
        <div class="absolute inset-0 z-[66]">
          <PagesLandingHeroUI />
        </div>

        <!-- Debug utility for dynamic resolution tweaking -->
        <SharedScreenSizeHelper />

        <!-- Pitch Black Void Fade-in Layer -->
        <div class="absolute inset-0 z-[70] bg-black pointer-events-none" :style="{ opacity: voidOpacity }"></div>
      </div>
      
      <template #fallback>
        <!-- SSR loading state -->
        <div class="h-screen w-full bg-black flex items-center justify-center">
          <p class="text-white text-lg animate-pulse">Initializing Interface...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
