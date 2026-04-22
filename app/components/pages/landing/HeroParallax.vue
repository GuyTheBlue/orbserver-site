<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

// Parallax transforms
const backgroundTransform = computed(() => `translateY(-${y.value * 0.2}px)`)
const duneTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 0.6}px)`)
const figureTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 0.8}px)`)
const rockTransform = computed(() => `scale(${1 + y.value * 0.0005}) translateY(-${y.value * 1.0}px)`)

// The overall space transitions to pitch black/void as you sink
// The environment fades out while the dashboard reveals behind it
const voidOpacity = computed(() => {
  // Reveal much faster on mobile to accommodate the shorter scroll height
  const threshold = (typeof window !== 'undefined' && window.innerWidth < 640) ? 150 : 400
  return Math.min(y.value / threshold, 1)
})
const environmentOpacity = computed(() => 1 - voidOpacity.value)

// Real-time geographic rotation
const { textureRotation } = useMoonData()
const moonRotation = computed(() => `${textureRotation.value}deg`)

// Theme reactive logo
const { currentTheme } = useTerminalTheme()
const themeMap = {
  cyan: '#00f2ff',
  amber: '#ffb000',
  pink: '#ec4899',
  green: '#00dc82'
}
const accentColor = computed(() => themeMap[currentTheme.value] || themeMap.cyan)
</script>

<template>
  <div class="relative h-[105vh] sm:h-[140vh] w-full">
    <ClientOnly>
      <!-- The camera frame: locks to the screen while you scroll down the track -->
      <div class="sticky top-0 h-screen w-full overflow-hidden bg-transparent flex flex-col justify-end">
        <!-- ── ENVIRONMENT & HERO HUD LAYER (FADES OUT TOGETHER) ── -->
        <div
          class="absolute inset-0 pointer-events-none broken-terminal-jitter"
          :style="{ opacity: environmentOpacity }"
        >
          <!-- Bug Bio-Lens / HUD Overlay -->
          <div class="absolute inset-0 z-[64] vr-lens mix-blend-overlay opacity-80" />

          <NuxtImg
            src="/images/hero_layers/night_sky.png"
            class="absolute top-0 left-0 w-full h-[55%] object-cover object-bottom z-10"
            :style="{ transform: backgroundTransform }"
            alt="Sky"
          />

          <!-- Moon Layer (Full Disc - No Shadow) -->
          <div
            class="absolute left-1/2 w-[22rem] md:w-[32rem] top-[5%] sm:top-[2%] md:top-[0%] lg:top-[0%] xl:top-[0%] -translate-x-1/2 z-20 transition-all duration-[2s] cubic-bezier(0.16, 1, 0.3, 1)"
            :style="{ transform: `${backgroundTransform} rotate(${moonRotation})` }"
          >
            <!-- The spherical ambient glow behind the moon -->
            <div class="absolute -inset-12 md:-inset-16 rounded-full bg-cyan-100/40 blur-[70px] md:blur-[90px]" />
            <div class="absolute inset-0 rounded-full bg-white/60 blur-3xl opacity-50" />

            <NuxtImg
              src="/images/hero_layers/moon.png"
              class="relative w-full block z-10"
              alt="Moon"
            />
          </div>

          <NuxtImg
            src="/images/hero_layers/sea.png"
            class="absolute bottom-0 left-0 w-full h-[45%] object-cover object-top z-30"
            :style="{ transform: backgroundTransform }"
            alt="Sea"
          />

          <!-- Dune -->
          <div
            class="absolute bottom-0 w-full z-50 origin-bottom"
            :style="{ transform: duneTransform }"
          >
            <NuxtImg
              src="/images/hero_layers/dunes.png"
              class="w-full h-[35vh] xl:h-[45vh] object-cover object-top block"
              alt="Dune"
            />
            <div class="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
            <div class="absolute top-full left-0 w-full h-[200vh] bg-black" />
          </div>
          
          <!-- Cloaked Figure (z-55) -->
          <div
            class="absolute bottom-[18%] z-[55] origin-bottom left-[20%] w-[21vw] min-w-[205px] max-w-[360px] sm:left-1/2 sm:-translate-x-1/2 sm:w-[30vw] md:left-[35%] md:translate-x-0 md:w-[22vw] lg:left-[25%] lg:w-[25vw]"
            :style="{ transform: figureTransform }"
          >
            <NuxtImg
              src="/images/hero_layers/cloaked_figure.png"
              class="w-full h-auto block drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
              alt="Cloaked Figure"
            />
          </div>

          <!-- Foreground rock -->
          <div
            class="absolute left-0 -bottom-[10%] sm:-bottom-[2%] md:-bottom-[10%] w-[80vw] sm:w-[50vw] md:w-[60vw] lg:w-[40vw] xl:w-[50vw] max-w-none origin-bottom-left z-60"
            :style="{ transform: rockTransform }"
          >
            <NuxtImg
              src="/images/hero_layers/fore_front_rock.png"
              class="w-full object-cover origin-bottom-left block"
              alt="Foreground Rock"
            />
            <div class="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
            <div class="absolute top-full left-0 w-full h-[200vh] bg-black" />
          </div>

          <!-- Global darkening gradient -->
          <div
            class="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black to-transparent opacity-100 z-[61] pointer-events-none"
            :style="{ transform: backgroundTransform }"
          />

          <!-- Technical HUD lines -->
          <svg class="absolute inset-0 w-full h-full z-[65] pointer-events-none text-hud-accent hidden sm:block">
            <defs><linearGradient
              id="techGlow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            ><stop
              offset="0%"
              stop-color="currentColor"
              stop-opacity="0.8"
            /><stop
              offset="100%"
              stop-color="currentColor"
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

        <!-- ── 80s CRT BRIDGE LAYER (REVEALS ON SINK) ── -->
        <div
          class="absolute inset-0 z-[5] bg-black flex items-end justify-center sm:items-center pb-[15vh] sm:pb-0 px-6 pointer-events-none overflow-hidden"
          :style="{ opacity: voidOpacity }"
        >
          <!-- 80s Noise & Scanline Overlay -->
          <div class="absolute inset-0 opacity-40 scanline-overlay pointer-events-none z-20" />
          <div class="absolute inset-0 opacity-10 grid-overlay pointer-events-none z-10 scale-[2]" />

          <!-- Title Card -->
          <div
            class="relative z-30 transition-transform duration-700"
            :style="{ transform: `translateY(${50 - y * 0.05}px) scale(${0.95 + y * 0.0001})` }"
          >
            <div class="font-orbitron font-black text-4xl md:text-7xl text-center space-y-4 tracking-[-0.05em] uppercase transition-all duration-1000" :class="voidOpacity > 0.8 ? 'blur-0' : 'blur-[2px]'">
              <div class="text-white/20 flex items-center justify-center">
                M
                <div
                  class="w-7 h-7 md:w-14 md:h-14 mx-1 md:mx-2"
                  :style="{ 
                    backgroundColor: accentColor,
                    maskImage: 'url(/images/logo_orb.png)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url(/images/logo_orb.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    filter: `drop-shadow(0 0 12px ${accentColor}80)`
                  }"
                />
                O
                N
              </div>
              <div class="text-white/40">
                TELEMETRY
              </div>
              <div class="font-bold tracking-widest animate-random-pulse">
                DASHBOARD
              </div>
            </div>

            <!-- Technical Underline -->
            <div class="mt-12 h-0.5 w-64 bg-hud-accent/30 mx-auto relative overflow-hidden">
              <div class="absolute inset-0 bg-hud-accent animate-scan" />
            </div>
            <div class="mt-4 font-mono text-[9px] text-hud-accent/40 tracking-[0.8em] text-center">
              INITIALIZING_OS_ENVIRONMENT
            </div>
          </div>
        </div>

        <!-- Debug utility -->
        <DevOnly>
          <SharedScreenSizeHelper />
        </DevOnly>
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

<style scoped>
@keyframes random-white-pulse {
  0%, 88%, 100% {
    color: rgba(var(--hud-accent-rgb), 0.8);
    filter: drop-shadow(0 0 10px rgba(var(--hud-accent-rgb), 0.5));
  }
  90%, 96% {
    color: #ffffff;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
  }
  93% {
    color: rgba(var(--hud-accent-rgb), 0.4);
    filter: none;
  }
}

.animate-random-pulse {
  animation: random-white-pulse 5.5s infinite;
}
</style>
