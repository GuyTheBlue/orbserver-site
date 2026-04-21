<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { landingData } from '~/utils/landingData'
import MoonHandRuleModal from './MoonHandRuleModal.vue'
import MoonBriefingRows from './MoonBriefingRows.vue'
import MoonEtymology from './MoonEtymology.vue'

const lunar = landingData.lunar

const {
  isLoading, fraction, phase, phaseName, age,
  distance, altitude, azimuth,
  nextFullMoon, nextNewMoon, daysToFullMoon, daysToNewMoon,
  textureRotation, limbRotation, lat, lng, movingTowardPerigee,
  moonrise, moonset,
  apparentDiameter, apparentDiameterRatio, apparentVsMean,
  velocity, lightTravelTime, subLunarPoint,
  ra, dec, nextPerigee, nextApogee, zodiac, zodiacSymbol,
  constellation,
  locationStatus
} = useMoonData()

const showHandRule = ref(false)
function openModal() {
  showHandRule.value = true
}

// ── Intersection ────────────────────────────────────────────────────────────
const sectionEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isSupermoon = computed(() =>
  (apparentDiameter.value || 0) >= 33.0 && ((fraction.value || 0) > 0.85 || (fraction.value || 0) < 0.15)
)

useIntersectionObserver(sectionEl, ([e]) => {
  if (e?.isIntersecting) isVisible.value = true
}, { threshold: 0.05 })

// ── Calculations ─────────────────────────────────────────────────────────────
const illuminationPct = computed(() => Math.round((fraction.value || 0) * 100))
const distFormatted = computed(() => distance.value?.toLocaleString('en-GB') ?? '—')
const distRatio = computed(() => {
  if (!distance.value) return 0
  return Math.min(100, Math.max(0, ((distance.value - 356500) / (406700 - 356500)) * 100))
})
const altStr = computed(() => altitude.value ? `${altitude.value > 0 ? '+' : ''}${altitude.value}°` : '—')
const azStr = computed(() => azimuth.value ? `${azimuth.value.toFixed(0)}°` : '—')
const latStr = computed(() => `${Math.abs(lat.value || 0).toFixed(4)}° ${lat.value >= 0 ? 'N' : 'S'}`)
const lngStr = computed(() => `${Math.abs(lng.value || 0).toFixed(4)}° ${lng.value >= 0 ? 'E' : 'W'}`)

// ── Orbital Diagram ──────────────────────────────────────────────────────────
const ORB = { cx: 140, cy: 62, rx: 92, ry: 56, ex: 67, ey: 62 } as const
const moonOrbitAngle = computed(() => Math.PI * (1 - distRatio.value / 100))
const moonOrbitX = computed(() => ORB.cx + ORB.rx * Math.cos(moonOrbitAngle.value))
const moonOrbitY = computed(() => ORB.cy + ORB.ry * Math.sin(moonOrbitAngle.value))
const moonLabelY = computed(() => moonOrbitY.value < ORB.cy ? moonOrbitY.value - 13 : moonOrbitY.value + 16)

// ── Background Terminal Logic (Extracted) ────────────────────────────────────
const terminalTelemetry = computed(() => ({
  lat: latStr.value,
  lng: lngStr.value,
  phaseName: phaseName.value ?? '—',
  illum: illuminationPct.value.toString(),
  age: (age.value || 0).toString(),
  dist: distFormatted.value,
  alt: altStr.value,
  az: azStr.value,
  rot: Math.round(textureRotation.value || 0).toString(),
  zodiac: zodiac.value,
  constellation: constellation.value,
  locStatus: locationStatus.value === 'FALLBACK' ? 'SIGNAL_LOSS // IP_DEFAULT' : 'SYNCED'
}))

const { termLines, termCursor } = useMoonTerminal(lunar?.terminal ?? [], terminalTelemetry)
</script>

<template>
  <section
    ref="sectionEl"
    class="relative bg-[#010810] overflow-hidden broken-terminal-jitter"
    style="min-height: 120vh;"
  >
    <!-- ── 1. BACKGROUND TERMINAL (z-0, absolute, full section) ─────────── -->
    <ClientOnly>
      <div class="absolute inset-0 z-0 p-10 lg:p-16 font-mono overflow-hidden select-none pointer-events-none">
        <div class="flex items-center gap-2.5 mb-10 opacity-60">
          <span
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: 'var(--hud-accent)', boxShadow: 'var(--hud-accent-glow)' }"
          />
          <span
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: 'rgba(var(--hud-accent-rgb), 0.7)' }"
          />
          <span
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: 'rgba(var(--hud-accent-rgb), 0.4)' }"
          />
          <span class="ml-3 sm:ml-6 text-[9px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.4em] uppercase text-hud-accent/60">terminal_bg::process_feed</span>
        </div>
        <div class="text-[22px] leading-relaxed opacity-[0.35]">
          <div
            v-for="(line, i) in termLines"
            :key="i"
          >
            <div
              v-if="line.cls === 'term-blank'"
              class="h-6"
            />
            <div
              v-else
              :style="{
                color: line.cls === 'term-cmd' ? 'var(--hud-accent)' : '#86efac'
              }"
            >
              {{ line.text }}
            </div>
          </div>
          <span
            class="inline-block w-[12px] h-[1em] align-middle"
            :style="{ backgroundColor: 'var(--hud-accent)' }"
            :class="termCursor ? 'opacity-50' : 'opacity-0'"
          />
        </div>
      </div>
      <template #fallback>
        <div class="absolute inset-0 z-0" />
      </template>
    </ClientOnly>

    <!-- ── 2. CRT LAYER STACK (above terminal, below panels) ──────────────── -->
    <div class="absolute inset-0 z-[2] pointer-events-none opacity-[0.12] grid-overlay" />
    <div class="absolute inset-0 z-[3] pointer-events-none opacity-[0.35] scanline-overlay" />
    <div class="absolute inset-0 z-[4] pointer-events-none crt-vignette opacity-50" />

    <!-- ── 3. BACKGROUND TYPOGRAPHY WASH ────────────────────────────────── -->
    <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden select-none">
      <div
        class="absolute -top-[5%] -left-[5%] font-orbitron font-black text-white/[0.035] whitespace-nowrap leading-none"
        style="font-size: clamp(80px, 20vw, 320px); transform: rotate(-5deg);"
      >
        {{ latStr }}
      </div>
      <div
        class="absolute bottom-[5%] -right-[5%] font-orbitron font-black text-white/[0.02] whitespace-nowrap leading-none"
        style="font-size: clamp(80px, 16vw, 240px); transform: rotate(2deg);"
      >
        LUNAR_OBS
      </div>
      <div
        v-if="zodiac"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron font-black text-hud-accent/[0.015] whitespace-nowrap leading-none transition-all duration-[3s]"
        style="font-size: clamp(80px, 25vw, 500px); pointer-events: none;"
      >
        {{ zodiac?.toUpperCase() }}
      </div>
    </div>

    <!-- ── 4. DYNAMIC RED HEXAGON GLITCHES ──────────────────────────────── -->
    <ClientOnly>
      <SharedGlitchSystem
        :z-index="400"
        :density="1.8"
        :min-size="40"
        :max-size="90"
      />
    </ClientOnly>

    <!-- ── 4. PANELS (z-10) ──────────────────────────────────────────────── -->
    <div class="relative z-10 max-w-[1600px] mx-auto px-6 pt-24 pb-24 2xl:pt-32">
      <!-- STATUS BAR -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] text-hud-accent uppercase tracking-[0.2em] sm:tracking-[0.5em] mb-14 border-b border-white/10 pb-6 bento-flicker">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
          <div class="flex gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-hud-accent shadow-[var(--hud-accent-glow)]" />
            <span class="w-2.5 h-2.5 rounded-full bg-hud-accent opacity-60" />
            <span class="w-2.5 h-2.5 rounded-full bg-hud-accent opacity-30" />
          </div>
          <span class="text-white drop-shadow-[var(--hud-accent-glow)]">OBSERVER::ACTIVE_LINK</span>
          <span class="opacity-50 hidden md:inline">LOC_DATA: {{ latStr }} / {{ lngStr }}</span>
        </div>
        <div class="flex items-center justify-center sm:justify-end gap-6 w-full sm:w-auto">
          <div class="overflow-hidden whitespace-nowrap ticker-wrap w-48 opacity-40 hidden xl:block">
            <div class="ticker-content font-mono text-[9px]">
              GEOGRAPHIC_PARALLAX_SYNC // SUNCALC_FEED // SOUTHERN_HEMISPHERE_CALIBRATED
            </div>
          </div>
          <ClientOnly>
            <SharedThemeSelector />
          </ClientOnly>
        </div>
      </div>

      <!-- ── ROW 1: MOON + QUICK STATS SIDE ─────────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
        <!-- MOON PANEL -->
        <div class="xl:col-span-7 panel-card group flex flex-col items-center justify-center min-h-[580px] lg:min-h-[700px] p-12 rounded-2xl bento-flicker">
          <div class="panel-grid-mesh" />
          <div class="panel-scanlines" />
          <div class="card-brackets" />
          <div class="card-glow" />
          <svg
            class="absolute bottom-6 left-6 w-10 h-10 text-hud-accent/10 pointer-events-none"
            viewBox="0 0 50 43"
          ><path
            d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          /></svg>

          <div class="absolute top-8 left-8 flex flex-col gap-1 z-10">
            <label class="font-mono text-[14px] text-hud-accent tracking-[0.5em] uppercase">{{ lunar.labels.visualPrimary }}</label>
            <div class="font-mono text-[12px] text-white/20 tracking-widest uppercase italic">
              {{ constellation }} :: {{ zodiac }}
            </div>
          </div>

          <div
            class="relative z-10 w-full max-w-[400px] xl:max-w-[480px] transition-all duration-1000"
            :class="isVisible ? 'opacity-100 rotate-0' : 'opacity-0 rotate-12'"
          >
            <SharedMoonPhase
              :fraction="fraction"
              :phase="phase"
              :texture-rotation="textureRotation"
              :limb-rotation="limbRotation"
            />
            <svg
              class="absolute pointer-events-none text-cyan-400/30 rotate-ring"
              style="inset:-15%;width:130%;height:130%;"
            >
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                stroke="currentColor"
                fill="none"
                stroke-dasharray="4 14"
                stroke-width="1"
              /><g
                stroke="currentColor"
                stroke-width="1"
              ><line
                x1="50%"
                y1="0%"
                x2="50%"
                y2="8%"
              /><line
                x1="50%"
                y1="92%"
                x2="50%"
                y2="100%"
              /><line
                x1="0%"
                y1="50%"
                x2="8%"
                y2="50%"
              /><line
                x1="92%"
                y1="50%"
                x2="100%"
                y2="50%"
              /></g>
            </svg>
          </div>

          <div class="relative z-10 mt-12 text-center w-full px-2 max-w-full overflow-hidden">
            <h2 class="font-orbitron font-black text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white tracking-[0.1em] sm:tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] flex flex-wrap justify-center items-center gap-x-4 gap-y-2 break-words leading-tight">
              {{ isLoading ? '…' : phaseName }}
            </h2>
            <div class="mt-8 flex flex-wrap items-center justify-center gap-y-8">
              <div class="flex flex-col items-center px-6 sm:px-10 border-r border-white/10 last:border-r-0">
                <span class="font-mono text-[13px] text-hud-accent/60 tracking-[0.5em] uppercase mb-2">Age</span>
                <span class="font-orbitron font-black text-3xl sm:text-5xl text-white">{{ age }}<span class="text-lg text-white/20 ml-1">d</span></span>
              </div>
              <div class="flex flex-col items-center px-6 sm:px-10 border-r border-white/10 last:border-r-0">
                <span class="font-mono text-[13px] text-hud-accent/60 tracking-[0.5em] uppercase mb-2">Illum</span>
                <span class="font-orbitron font-black text-3xl sm:text-5xl text-white">{{ illuminationPct }}<span class="text-lg text-white/20 ml-1">%</span></span>
              </div>
              <div class="flex flex-col items-center px-6 sm:px-10 border-r-0 sm:border-r last:border-r-0">
                <span class="font-mono text-[13px] text-hud-accent/60 tracking-[0.5em] uppercase mb-2">Rot</span>
                <span class="font-orbitron font-black text-3xl sm:text-5xl text-hud-accent">{{ Math.round(textureRotation) }}<span class="text-lg text-white/20 ml-1">°</span></span>
              </div>
            </div>

            <!-- Technical Briefing -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-10 border-t border-white/5 pt-10 text-left">
              <MoonBriefingRows :data="lunar?.briefing ?? []" />

              <div>
                <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-3">
                  ORBITAL // VELOCITY
                </p>
                <div class="space-y-4">
                  <div class="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">V_ORB</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base">{{ velocity.toFixed(3) }} <small class="text-[8px] opacity-30">KM/S</small></span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">SIG_DELAY</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base">{{ lightTravelTime.toFixed(2) }} <small class="text-[8px] opacity-30">MS</small></span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">SUB_LUNA</span>
                    <span class="font-orbitron font-black text-hud-accent text-[10px] sm:text-xs">{{ subLunarPoint.lat > 0 ? subLunarPoint.lat + 'N' : Math.abs(subLunarPoint.lat) + 'S' }}, {{ subLunarPoint.lng > 0 ? subLunarPoint.lng + 'E' : Math.abs(subLunarPoint.lng) + 'W' }}</span>
                  </div>
                </div>
              </div>
              <div>
                <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-3">
                  COORDINATES // RA_DEC
                </p>
                <div class="space-y-4">
                  <div class="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">R_ASCENSION</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base">{{ ra }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">DECLINATION</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base">{{ dec }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider uppercase">ZODIAC_SIGN</span>
                    <span class="font-orbitron font-black text-hud-accent text-[12px] sm:text-base uppercase underline decoration-hud-accent/20">{{ zodiac }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider uppercase">CONSTELLATION</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base uppercase">{{ constellation }}</span>
                  </div>
                </div>
              </div>
              <div>
                <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-3">
                  ORBITAL // EVENTS
                </p>
                <div class="space-y-4">
                  <div class="flex justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">NEXT_PERIGEE</span>
                    <span class="font-orbitron font-black text-hud-accent ml-2 uppercase text-[10px] sm:text-xs text-right">{{ nextPerigee }}</span>
                  </div>
                  <div class="flex justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">NEXT_APOGEE</span>
                    <span class="font-orbitron font-black text-white/40 ml-2 uppercase text-[10px] sm:text-xs text-right">{{ nextApogee }}</span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">GRAVITY</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base">1.62 <small class="text-[8px] opacity-30">M/S²</small></span>
                  </div>
                  <div class="flex flex-col sm:flex-row sm:justify-between">
                    <span class="font-mono text-[9px] sm:text-[10px] text-white/20 tracking-wider">ESCAPE_V</span>
                    <span class="font-orbitron font-black text-white text-[12px] sm:text-base">2.38 <small class="text-[8px] opacity-30">KM/S</small></span>
                  </div>
                </div>
              </div>

              <div class="flex md:col-start-2 xl:col-start-auto items-center justify-center relative overflow-hidden min-h-[160px] opacity-90 border border-white/5 rounded-lg bg-white/[0.02]">
                <div class="absolute inset-0 z-0 panel-grid-mesh opacity-40" />
                <svg
                  class="relative z-10 w-full h-full max-w-[280px]"
                  viewBox="0 0 200 120"
                >
                  <circle
                    cx="100"
                    cy="60"
                    r="8"
                    fill="none"
                    stroke="var(--hud-accent)"
                    stroke-width="0.5"
                    class="animate-pulse"
                  />
                  <circle
                    cx="100"
                    cy="60"
                    r="12"
                    fill="none"
                    stroke="var(--hud-accent)"
                    stroke-width="0.2"
                    stroke-dasharray="2 4"
                  />
                  <ellipse
                    cx="100"
                    cy="60"
                    rx="90"
                    ry="35"
                    fill="none"
                    stroke="white"
                    stroke-width="0.6"
                    stroke-dasharray="4 8"
                    opacity="0.4"
                  />
                  <g class="celestial-system-anim">
                    <circle
                      cx="0"
                      cy="0"
                      r="4"
                      fill="none"
                      stroke="white"
                      stroke-width="1"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="none"
                      stroke="white"
                      stroke-width="0.6"
                      stroke-dasharray="2 2"
                      opacity="0.6"
                    />
                    <g class="moon-orbit-anim">
                      <circle
                        cx="12"
                        cy="0"
                        r="1.5"
                        fill="var(--hud-accent)"
                        stroke="none"
                      />
                    </g>
                  </g>
                </svg>
                <p class="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] text-white/30 tracking-[0.5em] uppercase pointer-events-none">
                  simulation::orbital_sync
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- SIDE STATS COLUMN -->
        <div class="xl:col-span-5 flex flex-col gap-8">
          <div class="panel-card group flex-1 p-10 rounded-2xl bento-flicker">
            <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" /><div class="card-glow" /><div class="card-scan" />
            <svg
              class="absolute bottom-6 right-6 w-8 h-8 text-white/5 pointer-events-none"
              viewBox="0 0 50 43"
            ><path
              d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            /></svg>
            <label class="relative z-10 font-mono text-[11px] text-hud-accent tracking-[0.5em] uppercase block mb-6">{{ lunar.labels.distRadar }}</label>
            <div class="relative z-10 font-orbitron font-black text-5xl xl:text-7xl text-white tracking-tighter mb-6">
              {{ distFormatted }}<span class="text-xl text-white/30 ml-4 font-mono">KM</span>
            </div>
            <div class="relative z-10 h-2 bg-white/5 rounded-full mb-3">
              <div
                class="absolute inset-y-0 left-0 bg-hud-accent shadow-[var(--hud-accent-glow)] rounded-full transition-all duration-1000"
                :style="{ width: `${distRatio}%` }"
              />
              <div
                class="absolute -top-1.5 w-5 h-5 bg-white rounded-full transition-all duration-1000"
                :style="{ left: `calc(${distRatio}% - 10px)` }"
              />
            </div>
            <div class="relative z-10 flex justify-between font-mono text-[10px] text-white/30 uppercase tracking-[0.4em] mb-4">
              <span>[PRG] NEAR</span><span>[APG] FAR</span>
            </div>
            <svg
              class="relative z-10 w-full mt-2"
              viewBox="0 0 280 124"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="orbit-grid-radar"
                  width="14"
                  height="14"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M14 0 L0 0 0 14"
                    fill="none"
                    stroke="rgba(var(--hud-accent-rgb), 0.04)"
                    stroke-width="0.5"
                  />
                </pattern>
              </defs>
              <rect
                width="280"
                height="124"
                fill="url(#orbit-grid-radar)"
              />
              <ellipse
                :cx="ORB.cx"
                :cy="ORB.cy"
                :rx="ORB.rx"
                :ry="ORB.ry"
                fill="none"
                stroke="rgba(var(--hud-accent-rgb), 0.22)"
                stroke-width="0.8"
                stroke-dasharray="5 8"
              />
              <line
                x1="48"
                y1="55"
                x2="48"
                y2="69"
                stroke="rgba(var(--hud-accent-rgb), 0.45)"
                stroke-width="0.8"
              />
              <text
                x="48"
                y="48"
                text-anchor="middle"
                font-family="monospace"
                font-size="6.5"
                fill="rgba(var(--hud-accent-rgb), 0.55)"
                letter-spacing="1"
              >PRG</text>
              <line
                x1="232"
                y1="55"
                x2="232"
                y2="69"
                stroke="rgba(var(--hud-accent-rgb), 0.30)"
                stroke-width="0.8"
              />
              <text
                x="232"
                y="48"
                text-anchor="middle"
                font-family="monospace"
                font-size="6.5"
                fill="rgba(var(--hud-accent-rgb), 0.35)"
                letter-spacing="1"
              >APG</text>
              <line
                :x1="ORB.ex"
                :y1="ORB.ey"
                :x2="moonOrbitX"
                :y2="moonOrbitY"
                stroke="rgba(var(--hud-accent-rgb), 0.12)"
                stroke-width="0.7"
                stroke-dasharray="2 4"
              />
              <circle
                :cx="ORB.ex"
                :cy="ORB.ey"
                r="6"
                fill="rgba(0,60,100,0.7)"
                stroke="rgba(var(--hud-accent-rgb), 0.9)"
                stroke-width="1.2"
              />
              <line
                :x1="ORB.ex - 10"
                :y1="ORB.ey"
                :x2="ORB.ex + 10"
                :y2="ORB.ey"
                stroke="rgba(var(--hud-accent-rgb), 0.55)"
                stroke-width="0.7"
              />
              <line
                :x1="ORB.ex"
                :y1="ORB.ey - 10"
                :x2="ORB.ex"
                :y2="ORB.ey + 10"
                stroke="rgba(var(--hud-accent-rgb), 0.55)"
                stroke-width="0.7"
              />
              <text
                :x="ORB.ex"
                :y="ORB.ey + 20"
                text-anchor="middle"
                font-family="monospace"
                font-size="7"
                fill="rgba(var(--hud-accent-rgb), 0.8)"
                letter-spacing="1.5"
              >EARTH</text>
              <circle
                :cx="moonOrbitX"
                :cy="moonOrbitY"
                r="10"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                stroke-width="0.6"
                stroke-dasharray="2 3"
              />
              <circle
                :cx="moonOrbitX"
                :cy="moonOrbitY"
                r="4.5"
                fill="rgba(200,215,255,0.15)"
                stroke="rgba(255,255,255,0.85)"
                stroke-width="1.2"
                style="transition: all 1s ease;"
              />
              <text
                :x="moonOrbitX"
                :y="moonLabelY"
                text-anchor="middle"
                font-family="monospace"
                font-size="7"
                fill="rgba(255,255,255,0.9)"
                letter-spacing="1.5"
              >LUNA</text>
              <text
                x="140"
                y="116"
                text-anchor="middle"
                font-family="monospace"
                font-size="6"
                fill="rgba(var(--hud-accent-rgb), 0.25)"
                letter-spacing="3"
              >ORBITAL PATH — SUNCALC LIVE</text>
            </svg>

            <div class="relative z-10 mt-6 border-t border-hud-accent/10 pt-6 space-y-4">
              <MoonEtymology :data="lunar?.etymology ?? { perigee: '', apogee: '' }" />
              <div class="flex items-center gap-3 pt-2 border-t border-white/5">
                <span class="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse shadow-[var(--hud-accent-glow)]" />
                <span class="font-mono text-[9px] text-hud-accent/60 tracking-[0.3em] uppercase">
                  CURRENT_DIST: <span class="text-white/80">{{ distFormatted }} KM</span>
                  &nbsp;//&nbsp; {{ movingTowardPerigee ? 'APPROACHING PERIGEE' : 'RECEDING → APOGEE' }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Panel: Moon Rise / Set -->
            <div class="panel-card group p-10 rounded-2xl bento-flicker">
              <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
              <div class="relative z-10 flex flex-col h-full">
                <label class="font-mono text-[11px] text-hud-accent tracking-[0.5em] uppercase block mb-6">{{ lunar.labels.riseSet }}</label>
                <div class="space-y-6 mb-8">
                  <div>
                    <span class="block font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] mb-1">Rise</span>
                    <span class="font-orbitron font-black text-4xl text-white">{{ moonrise }}</span>
                  </div>
                  <div>
                    <span class="block font-mono text-[9px] text-white/30 uppercase tracking-[0.3em] mb-1">Set</span>
                    <span class="font-orbitron font-black text-4xl text-white">{{ moonset }}</span>
                  </div>
                </div>
                <div class="mt-auto pt-6 border-t border-white/5">
                  <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-2">
                    {{ lunar.riseSetFactoid.label }}
                  </p>
                  <p class="font-mono text-[10px] text-hud-accent/60 leading-relaxed uppercase">
                    <template
                      v-for="part in useTitleParser(lunar.riseSetFactoid.text)"
                      :key="part.id"
                    >
                      <span
                        v-if="part.type === 'highlight'"
                        class="text-white drop-shadow-[0_0_6px_white]"
                      >{{ part.content }}</span>
                      <span v-else>{{ part.content }}</span>
                    </template>
                  </p>
                </div>
              </div>
            </div>

            <!-- Panel: Apparent Angular Diameter -->
            <div
              class="panel-card group p-10 rounded-2xl bento-flicker"
              style="animation-delay:0.4s"
            >
              <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
              <div class="relative z-10 flex flex-col h-full">
                <label class="font-mono text-[11px] text-hud-accent tracking-[0.5em] uppercase block mb-6">{{ lunar.labels.diameter }}</label>
                <div class="mb-6">
                  <div class="flex items-baseline gap-3 mb-1">
                    <span class="font-orbitron font-black text-5xl text-white">{{ apparentDiameter }}′</span>
                    <span
                      v-if="isSupermoon"
                      class="font-mono text-[9px] text-hud-accent border border-hud-accent/50 px-2 py-0.5 rounded tracking-widest animate-pulse"
                    >SUPERMOON</span>
                  </div>
                  <p class="font-mono text-[10px] text-white/30 uppercase tracking-wider">
                    <span :class="apparentVsMean >= 0 ? 'text-hud-accent' : 'text-white/40'">{{ apparentVsMean >= 0 ? '+' : '' }}{{ apparentVsMean }}%</span>
                    vs mean diameter
                  </p>
                </div>
                <div class="mt-auto pt-6 border-t border-white/5">
                  <div class="flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-widest mb-3">
                    <span>Minimum (29.4′)</span><span>Maximum (33.5′)</span>
                  </div>
                  <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-hud-accent shadow-[var(--hud-accent-glow)] transition-all duration-[1.5s]"
                      :style="{ width: `${apparentDiameterRatio}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel: Next Full -->
            <div
              class="panel-card group p-10 rounded-2xl bento-flicker"
              style="animation-delay:0.8s"
            >
              <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
              <div class="relative z-10 h-full flex flex-col">
                <label class="font-mono text-[11px] text-hud-accent tracking-[0.5em] uppercase block mb-6">NEXT_FULL</label>
                <div class="font-orbitron font-black text-5xl xl:text-6xl text-white mb-2">
                  {{ daysToFullMoon }}<span class="text-2xl text-white/20 ml-2">d</span>
                </div>
                <p class="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-6 truncate">
                  {{ nextFullMoon }}
                </p>
                <div class="mt-auto pt-6 border-t border-white/5">
                  <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-2">
                    OPPOSITION // LUM
                  </p>
                  <p class="font-mono text-[10px] text-hud-accent/60 leading-relaxed uppercase tracking-wider">
                    Analysis detects #h#solar opposition#/h# state.
                  </p>
                </div>
              </div>
            </div>

            <!-- Panel: Next New -->
            <div
              class="panel-card group p-10 rounded-2xl bento-flicker"
              style="animation-delay:1.4s"
            >
              <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
              <div class="relative z-10 h-full flex flex-col">
                <label class="font-mono text-[11px] text-hud-accent tracking-[0.5em] uppercase block mb-6">NEXT_NEW</label>
                <div class="font-orbitron font-black text-5xl xl:text-6xl text-hud-accent mb-2">
                  {{ daysToNewMoon }}<span class="text-2xl text-white/20 ml-2">d</span>
                </div>
                <p class="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-6 truncate">
                  {{ nextNewMoon }}
                </p>
                <div class="mt-auto pt-6 border-t border-white/5">
                  <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-2">
                    CONJUNCTION // DARK
                  </p>
                  <p class="font-mono text-[10px] text-hud-accent/60 leading-relaxed uppercase tracking-wider">
                    Orbital alignment at #h#conjunction#/h# state.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 2: OBSERVER COORDS + ALT/AZ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          class="lg:col-span-2 panel-card group p-10 rounded-2xl bento-flicker"
          style="animation-delay:2s"
        >
          <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
          <svg
            class="absolute top-6 right-8 w-10 h-10 text-hud-accent/5 pointer-events-none"
            viewBox="0 0 50 43"
          ><path
            d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          /></svg>
          <label class="relative z-10 font-mono text-[11px] text-hud-accent tracking-[0.5em] uppercase block mb-10">LOC_SYSLOG::COORDS</label>
          <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div class="border-b border-white/5 sm:border-0 pb-4 sm:pb-0">
              <span class="font-mono text-[10px] sm:text-[11px] text-white/20 uppercase tracking-[0.4em] block mb-2 sm:mb-4">LATITUDE</span><span class="font-orbitron font-black text-2xl sm:text-4xl xl:text-6xl text-white">{{ latStr }}</span>
            </div>
            <div><span class="font-mono text-[10px] sm:text-[11px] text-white/20 uppercase tracking-[0.4em] block mb-2 sm:mb-4">LONGITUDE</span><span class="font-orbitron font-black text-2xl sm:text-4xl xl:text-6xl text-white">{{ lngStr }}</span></div>
          </div>
          <div
            class="relative z-10 mt-10 flex items-center gap-4 px-6 py-4 border bg-opacity-5 transition-colors duration-1000"
            :class="locationStatus === 'FALLBACK' ? 'border-red-500/30 bg-red-500/5' : 'border-hud-accent/20 bg-hud-accent/5'"
          >
            <div
              class="w-3 h-3 rounded-full animate-pulse transition-all duration-1000"
              :class="locationStatus === 'FALLBACK' ? 'bg-[#ff3e3e] shadow-[0_0_12px_rgba(255,62,62,1)]' : 'bg-[#28c840] shadow-[0_0_12px_rgba(40,200,64,1)]'"
            />
            <span
              class="font-mono text-[11px] tracking-[0.4em] uppercase transition-colors duration-1000"
              :class="locationStatus === 'FALLBACK' ? 'text-red-400' : 'text-hud-accent'"
            >
              SH_CALIBRATION: {{ locationStatus === 'FALLBACK' ? 'SIGNAL_LOSS // IP_DEFAULT' : 'ACTIVE // FEED: SYNCED' }}
            </span>
          </div>
        </div>

        <div
          class="panel-card group p-10 rounded-2xl flex flex-col justify-between bento-flicker relative"
          style="animation-delay:2.8s"
        >
          <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
          <div class="relative z-10 flex flex-col gap-8">
            <div class="border-b border-white/10 pb-8">
              <span class="font-mono text-[14px] text-white/20 uppercase tracking-widest block mb-4">ALTITUDE</span><span class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ altStr }}</span>
            </div>
            <div>
              <span class="font-mono text-[14px] text-white/20 uppercase tracking-widest block mb-4">AZIMUTH</span><span class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ azStr }}</span>
            </div>
          </div>
          <button
            class="absolute bottom-6 right-6 z-[100] w-12 h-12 rounded-sm border border-hud-accent/40 bg-black/80 backdrop-blur-md flex items-center justify-center text-2xl font-orbitron font-black text-hud-accent hover:bg-hud-accent hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(var(--hud-accent-rgb),0.3)] pointer-events-auto active:scale-95"
            title="Open Hand Rule Guide"
            @click="openModal"
          >
            ?
          </button>
        </div>
      </div>
    </div>

    <!-- OVERLAYS (TELEPORTED) -->
    <MoonHandRuleModal
      :show="showHandRule"
      :lat="lat"
      :data="lunar?.handRule"
      @close="showHandRule = false"
    />
  </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(var(--hud-accent-rgb), 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--hud-accent-rgb), 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--hud-accent-rgb), 0.5);
}

.rotate-ring {
  animation: rotate-slow 90s linear infinite;
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.ticker-wrap {
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.ticker-content {
  display: inline-block;
  animation: ticker 40s linear infinite;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.celestial-system-anim {
  /* Using offset-path for 1:1 precision with the SVG ellipse */
  offset-path: ellipse(90px 35px at 100px 60px);
  animation: orbit-follow 60s linear infinite;
}

@keyframes orbit-follow {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}

.moon-orbit-anim {
  animation: moon-orbit 10s linear infinite;
}

@keyframes earth-orbit {
  from {
    transform: translate(100px, 60px) rotate(0deg) translateX(90px) scaleY(0.388) rotate(0deg);
  }

  to {
    transform: translate(100px, 60px) rotate(360deg) translateX(90px) scaleY(0.388) rotate(-360deg);
  }
}

@keyframes moon-orbit {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.card-scan {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--hud-accent), transparent);
  opacity: 0.1;
  animation: scan 4s linear infinite;
}

@keyframes scan {
  from {
    top: 0;
  }

  to {
    top: 100%;
  }
}
</style>
