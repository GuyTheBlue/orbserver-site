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
const { textureRotation } = useMoonData()
const moonRotation = computed(() => `${textureRotation.value}deg`)
</script>

<template>
  <div class="relative h-[140vh] w-full">
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
          class="absolute inset-0 z-[5] bg-black flex items-center justify-center pointer-events-none overflow-hidden"
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
            <div class="font-orbitron font-black text-4xl md:text-7xl text-center space-y-4 tracking-[-0.05em] uppercase">
              <div class="text-white/20 blur-[1px] flex items-center justify-center">
                M
                <span class="relative inline-flex items-center justify-center mx-2 sm:mx-4">
                  <!-- Solid Glowing Orb -->
                  <span class="w-8 h-8 md:w-16 md:h-16 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,1)]" />
                  <!-- Orbit Line -->
                  <svg
                    class="absolute w-[200%] h-[200%] pointer-events-none opacity-40"
                    viewBox="0 0 100 100"
                  >
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="48"
                      ry="12"
                      fill="none"
                      stroke="white"
                      stroke-width="1.2"
                      transform="rotate(-20 50 50)"
                    />
                  </svg>
                </span>
                ON
              </div>
              <div class="text-white/40 blur-[2px]">
                TELEMETRY
              </div>
              <div class="text-hud-accent/80 drop-shadow-[var(--hud-accent-glow)] animate-focus-pulse">
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
@keyframes focus-pulse {

  0%,
  100% {
    filter: blur(0px);
    opacity: 0.8;
  }

  50% {
    filter: blur(8px);
    opacity: 0.4;
  }
}

.animate-focus-pulse {
  animation: focus-pulse 5s ease-in-out infinite;
}
</style>
