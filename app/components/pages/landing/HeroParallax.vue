<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

// Parallax transforms
const backgroundTransform = computed(() => `translateY(-${y.value * 0.2}px)`)
const duneTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 0.6}px)`)
const rockTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 1.0}px)`)

// The overall space transitions to pitch black/void as you sink
// The environment fades out while the dashboard reveals behind it
const voidOpacity = computed(() => Math.min(y.value / 400, 1))
const environmentOpacity = computed(() => 1 - voidOpacity.value)

// Real-time geographic rotation
const { apparentRotation } = useMoonData()
const moonRotation = computed(() => `${apparentRotation.value}deg`)
</script>

<template>
  <div class="relative h-[140vh] w-full">
    <ClientOnly>
      <!-- The camera frame: locks to the screen while you scroll down the track -->
      <div class="sticky top-0 h-screen w-full overflow-hidden bg-transparent flex flex-col justify-end">
        <!-- ── ENVIRONMENT & HERO HUD LAYER (FADES OUT TOGETHER) ── -->
        <div
          class="absolute inset-0 pointer-events-none"
          :style="{ opacity: environmentOpacity }"
        >
          <img
            src="/images/hero_layers/night_sky.png"
            class="absolute top-0 left-0 w-full h-[55%] object-cover object-bottom z-10"
            :style="{ transform: backgroundTransform }"
            alt="Sky"
          >

          <!-- Background Top-Left Hexagon Overlay -->
          <div
            id="hexagon-overlay-bg"
            class="absolute inset-0 z-15"
            :style="{ transform: backgroundTransform }"
          >
            <PagesLandingHeroHexagons mask-mode="top-left" />
          </div>

          <!-- Moon -->
          <div
            class="absolute left-1/2 w-[18rem] md:w-[24rem] top-[15%] sm:top-[10%] md:top-[5%] lg:top-[5%] xl:top-[5%] -translate-x-1/2 z-20 transition-transform duration-[2s] cubic-bezier(0.16, 1, 0.3, 1)"
            :style="{ transform: `${backgroundTransform} rotate(${moonRotation})` }"
          >
            <!-- The spherical ambient glow behind the moon -->
            <div class="absolute -inset-12 md:-inset-16 rounded-full bg-cyan-100/40 blur-[70px] md:blur-[90px]" />
            <div class="absolute inset-0 rounded-full bg-white/60 blur-3xl" />

            <img
              src="/images/hero_layers/moon.png"
              class="relative w-full block z-10"
              alt="Moon"
            >
          </div>

          <img
            src="/images/hero_layers/sea.png"
            class="absolute bottom-0 left-0 w-full h-[45%] object-cover object-top z-30"
            :style="{ transform: backgroundTransform }"
            alt="Sea"
          >

          <!-- Dune -->
          <div
            class="absolute bottom-0 w-full z-50 origin-bottom"
            :style="{ transform: duneTransform }"
          >
            <img
              src="/images/hero_layers/dunes.png"
              class="w-full h-[35vh] xl:h-[45vh] object-cover object-top block"
              alt="Dune"
            >
            <div class="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
            <div class="absolute top-full left-0 w-full h-[200vh] bg-black" />
          </div>

          <!-- Foreground rock -->
          <div
            class="absolute left-0 -bottom-[10%] sm:-bottom-[2%] md:-bottom-[10%] w-[80vw] sm:w-[50vw] md:w-[60vw] lg:w-[40vw] xl:w-[50vw] max-w-none origin-bottom-left z-60"
            :style="{ transform: rockTransform }"
          >
            <img
              src="/images/hero_layers/fore_front_rock.png"
              class="w-full object-cover origin-bottom-left block"
              alt="Foreground Rock"
            >
            <div class="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
            <div class="absolute top-full left-0 w-full h-[200vh] bg-black" />
          </div>

          <!-- Global darkening gradient -->
          <div
            class="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black to-transparent opacity-100 z-[61] pointer-events-none"
            :style="{ transform: backgroundTransform }"
          />

          <!-- Technical HUD lines -->
          <svg class="absolute inset-0 w-full h-full z-[65] pointer-events-none text-cyan-400 hidden sm:block">
            <defs><linearGradient
              id="techGlow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            ><stop
              offset="0%"
              stop-color="#00ffff"
              stop-opacity="0.8"
            /><stop
              offset="100%"
              stop-color="#00ffff"
              stop-opacity="0.1"
            /></linearGradient></defs>
            <g class="hidden sm:block">
              <line
                x1="50%"
                :y1="`calc(5% + 12rem - ${y * 0.2}px)`"
                x2="92%"
                y2="20%"
                stroke="url(#techGlow)"
                stroke-width="1.5"
                style="filter: drop-shadow(0 0 8px rgba(0,255,255,0.8));"
              />
            </g>
          </svg>

          <!-- ── HERO HUD (Moves with environment and fades) ── -->
          <div class="absolute inset-0 z-[66]">
            <PagesLandingHeroUI />
          </div>
        </div>

        <!-- Debug utility -->
        <SharedScreenSizeHelper />
      </div>

      <template #fallback>
        <div class="h-screen w-full bg-black flex items-center justify-center">
          <p class="text-white text-lg animate-pulse">
            Initializing Interface...
          </p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
