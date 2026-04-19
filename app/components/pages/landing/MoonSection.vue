<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const {
  isLoading, fraction, phase, phaseName, age,
  distance, altitude, azimuth,
  nextFullMoon, nextNewMoon, daysToFullMoon, daysToNewMoon,
  apparentRotation, lat, lng, movingTowardPerigee
} = useMoonData()

// ── Intersection ────────────────────────────────────────────────────────────
const sectionEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
useIntersectionObserver(sectionEl, ([e]) => { if (e.isIntersecting) isVisible.value = true }, { threshold: 0.05 })

// ── Calculations ─────────────────────────────────────────────────────────────
const illuminationPct = computed(() => Math.round(fraction.value * 100))
const distFormatted   = computed(() => distance.value?.toLocaleString('en-GB') ?? '—')
const distRatio       = computed(() => {
  if (!distance.value) return 0
  return Math.min(100, Math.max(0, ((distance.value - 356500) / (406700 - 356500)) * 100))
})
const altStr = computed(() => altitude.value !== 0 ? `${altitude.value > 0 ? '+' : ''}${altitude.value}°` : '—')
const azStr  = computed(() => azimuth.value > 0 ? `${azimuth.value.toFixed(0)}°` : '—')
const latStr = computed(() => `${Math.abs(lat.value).toFixed(4)}° ${lat.value >= 0 ? 'N' : 'S'}`)
const lngStr = computed(() => `${Math.abs(lng.value).toFixed(4)}° ${lng.value >= 0 ? 'E' : 'W'}`)

// ── Orbital Diagram ──────────────────────────────────────────────────────────────────────────
// Ellipse: cx=140 cy=62 rx=92 ry=56. Earth at left focus.
// f = sqrt(92² - 56²) = sqrt(8464-3136) = sqrt(5328) ≈ 73
// → Earth at (140-73, 62) = (67, 62)
// Perigee (left vertex) = (48, 62) — distRatio = 0%
// Apogee  (right vertex)= (232, 62) — distRatio = 100%
const ORB = { cx: 140, cy: 62, rx: 92, ry: 56, ex: 67, ey: 62 } as const
const moonOrbitAngle = computed(() => Math.PI * (1 - distRatio.value / 100))
const moonOrbitX     = computed(() => ORB.cx + ORB.rx * Math.cos(moonOrbitAngle.value))
const moonOrbitY     = computed(() => ORB.cy + ORB.ry * Math.sin(moonOrbitAngle.value))
// Label sits above moon if in top arc, below if in bottom arc
const moonLabelY     = computed(() => moonOrbitY.value < ORB.cy ? moonOrbitY.value - 13 : moonOrbitY.value + 16)


// ── Background Terminal Typewriter ───────────────────────────────────────────
const termLines = ref<Array<{ text: string; cls: string }>>([])
const termCursor = ref(true)
let alive = false

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

async function typeChar(idx: number, full: string, isCmd: boolean) {
  for (let i = 0; i <= full.length; i++) {
    if (!alive) return
    termLines.value[idx] = { text: full.slice(0, i), cls: isCmd ? 'term-cmd' : 'term-out' }
    await sleep(isCmd ? 42 : 9)
  }
  await sleep(isCmd ? 280 : 50)
}

async function runSession() {
  alive = true
  termLines.value = []
  const latV = lat.value !== 0 ? lat.value.toFixed(4) : '-33.9249'
  const lngV = lng.value !== 0 ? lng.value.toFixed(4) : '18.4241'
  const script: Array<{ t: string; cmd?: boolean; blank?: boolean }> = [
    { t: `$ ./lunar-obs --connect --host=orbserver.io`, cmd: true },
    { t: `  > AUTH: cape_town_obs_001` },
    { t: `  > LAT=${latV}  LNG=${lngV}` },
    { t: `  > Link established. Telemetry LIVE.` },
    { t: '', blank: true },
    { t: `$ lunar-obs query --payload=telemetry --format=raw`, cmd: true },
    { t: '', blank: true },
    { t: `  PHASE          ${phaseName.value !== '…' ? phaseName.value.toUpperCase() : 'ACQUIRING'}` },
    { t: `  ILLUMINATION   ${fraction.value > 0 ? `${(fraction.value*100).toFixed(1)}%` : '...'}` },
    { t: `  AGE_IN_CYCLE   ${age.value > 0 ? `${age.value} days` : '...'}` },
    { t: `  DISTANCE       ${distance.value > 0 ? `${distFormatted.value} km` : '...'}` },
    { t: `  ALTITUDE       ${altStr.value}` },
    { t: `  AZIMUTH        ${azStr.value}` },
    { t: `  PARALLAX_ROT   ${Math.round(apparentRotation.value)}° [SH_CALIBRATED]` },
    { t: '', blank: true },
    { t: `  STATUS         OK // FEED_STABLE // SECURE_LINK_ACTIVE` },
    { t: '', blank: true },
    { t: `$ lunar-obs facts --random`, cmd: true },
    { t: `  > Lunar albedo: 0.12 (reflects only 12% of sunlight)` },
    { t: `  > Surface temp range: -173°C to +127°C` },
    { t: `  > Tidal locking: rotation = revolution (27.32 days)` },
    { t: `  > Escape velocity: 2.38 km/s` },
  ]
  for (let i = 0; i < script.length; i++) {
    if (!alive) return
    const e = script[i]
    if (e.blank) { termLines.value.push({ text: '', cls: 'term-blank' }); await sleep(160); continue }
    termLines.value.push({ text: '', cls: e.cmd ? 'term-cmd' : 'term-out' })
    await typeChar(termLines.value.length - 1, e.t, !!e.cmd)
  }
  await sleep(7000)
  termLines.value = []
  await sleep(600)
  if (alive) runSession()
}

onMounted(() => {
  if (!import.meta.client) return
  setInterval(() => { termCursor.value = !termCursor.value }, 530)
  setTimeout(runSession, 1400)
})
</script>

<template>
  <section ref="sectionEl" class="relative bg-[#010810] overflow-hidden broken-terminal-jitter" style="min-height: 120vh;">

    <!-- ── 1. BACKGROUND TERMINAL (z-0, absolute, full section) ─────────── -->
    <ClientOnly>
      <div class="absolute inset-0 z-0 p-10 lg:p-16 font-mono overflow-hidden select-none pointer-events-none">
        <div class="flex items-center gap-2.5 mb-10 opacity-60">
          <span class="w-3 h-3 rounded-full bg-cyan-400 opacity-100 shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
          <span class="w-3 h-3 rounded-full bg-cyan-400 opacity-70" />
          <span class="w-3 h-3 rounded-full bg-cyan-400 opacity-40" />
          <span class="ml-6 text-[13px] text-cyan-400/40 tracking-[0.4em] uppercase">terminal_bg::process_feed</span>
        </div>
        <!-- BIGGER wash for depth -->
        <div class="text-[22px] leading-relaxed opacity-[0.35]">
          <div v-for="(line, i) in termLines" :key="i">
            <div v-if="line.cls === 'term-blank'" class="h-6" />
            <div v-else :class="{
              'text-cyan-400':    line.cls === 'term-cmd',
              'text-green-300':   line.cls === 'term-out',
            }">{{ line.text }}</div>
          </div>
          <span
            class="inline-block w-[12px] h-[1em] bg-cyan-400 align-middle"
            :class="termCursor ? 'opacity-50' : 'opacity-0'"
          />
        </div>
      </div>
      <template #fallback><div class="absolute inset-0 z-0" /></template>
    </ClientOnly>

    <!-- ── 2. CRT LAYER STACK (above terminal, below panels) ──────────────── -->
    <div class="absolute inset-0 z-[2] pointer-events-none opacity-[0.12] grid-overlay" />
    <div class="absolute inset-0 z-[3] pointer-events-none opacity-[0.35] scanline-overlay" />
    <div class="absolute inset-0 z-[4] pointer-events-none crt-vignette opacity-50" />

    <!-- ── 3. BACKGROUND TYPOGRAPHY WASH ────────────────────────────────── -->
    <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden select-none">
      <div
        class="absolute -top-[5%] -left-[5%] font-orbitron font-black text-white/[0.035] whitespace-nowrap leading-none"
        style="font-size: clamp(100px, 22vw, 320px); transform: rotate(-5deg);"
      >{{ latStr }}</div>
      <div class="absolute bottom-[5%] -right-[5%] font-orbitron font-black text-white/[0.02] whitespace-nowrap leading-none" style="font-size: clamp(80px, 16vw, 240px); transform: rotate(2deg);">LUNAR_OBS</div>
    </div>

    <!-- ── 4. PANELS (z-10) ──────────────────────────────────────────────── -->
    <div class="relative z-10 max-w-[1600px] mx-auto px-6 pt-24 pb-24 2xl:pt-32">

      <!-- STATUS BAR -->
      <div class="flex items-center justify-between font-mono text-[10px] text-cyan-400 uppercase tracking-[0.5em] mb-14 border-b border-white/10 pb-6 bento-flicker">
        <div class="flex items-center gap-6">
          <div class="flex gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]" />
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 opacity-60" />
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 opacity-30" />
          </div>
          <span class="text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">OBSERVER::ACTIVE_LINK</span>
          <span class="opacity-50 hidden md:inline">LOC_DATA: {{ latStr }} / {{ lngStr }}</span>
        </div>
        <div class="overflow-hidden whitespace-nowrap ticker-wrap w-80 opacity-40">
          <div class="ticker-content font-mono text-[9px]">GEOGRAPHIC_PARALLAX_SYNC // SUNCALC_FEED // SOUTHERN_HEMISPHERE_CALIBRATED // GEOGRAPHIC_PARALLAX_SYNC // SUNCALC_FEED // SOUTHERN_HEMISPHERE_CALIBRATED</div>
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
          <!-- Logo Watermark -->
          <svg class="absolute bottom-6 left-6 w-10 h-10 text-cyan-400/10 pointer-events-none" viewBox="0 0 50 43"><path d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
          
          <label class="relative z-10 font-mono text-[11px] text-cyan-400 tracking-[0.5em] uppercase mb-8 self-start">VISUAL_FEED::PRIMARY</label>

          <div class="relative z-10 w-full max-w-[400px] xl:max-w-[480px] transition-all duration-1000" :class="isVisible ? 'opacity-100 rotate-0' : 'opacity-0 rotate-12'">
            <SharedMoonPhase :fraction="fraction" :phase="phase" :rotation="apparentRotation" :lat="lat" />
            <svg class="absolute pointer-events-none text-cyan-400/30 rotate-ring" style="inset:-15%;width:130%;height:130%;">
              <circle cx="50%" cy="50%" r="44%" stroke="currentColor" fill="none" stroke-dasharray="4 14" stroke-width="1"/><g stroke="currentColor" stroke-width="1"><line x1="50%" y1="0%" x2="50%" y2="8%"/><line x1="50%" y1="92%" x2="50%" y2="100%"/><line x1="0%" y1="50%" x2="8%" y2="50%"/><line x1="92%" y1="50%" x2="100%" y2="50%"/></g>
            </svg>
          </div>

          <div class="relative z-10 mt-12 text-center w-full">
            <h2 class="font-orbitron font-black text-6xl xl:text-7xl text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{{ isLoading ? '…' : phaseName }}</h2>
            <div class="mt-8 flex items-stretch justify-center">
              <div class="flex flex-col items-center px-10 border-r border-white/10"><span class="font-mono text-[10px] text-cyan-400/60 tracking-[0.5em] uppercase mb-3">Age</span><span class="font-orbitron font-black text-5xl text-white">{{ age }}<span class="text-xl text-white/20 ml-1">d</span></span></div>
              <div class="flex flex-col items-center px-10 border-r border-white/10"><span class="font-mono text-[10px] text-cyan-400/60 tracking-[0.5em] uppercase mb-3">Illum</span><span class="font-orbitron font-black text-5xl text-white">{{ illuminationPct }}<span class="text-xl text-white/20 ml-1">%</span></span></div>
              <div class="flex flex-col items-center px-10"><span class="font-mono text-[10px] text-cyan-400/60 tracking-[0.5em] uppercase mb-3">Rot</span><span class="font-orbitron font-black text-5xl text-cyan-400">{{ Math.round(apparentRotation) }}<span class="text-xl text-white/20 ml-1">°</span></span></div>
            </div>
          </div>
        </div>

        <!-- SIDE STATS COLUMN -->
        <div class="xl:col-span-5 flex flex-col gap-8">
          <div class="panel-card group flex-1 p-10 rounded-2xl bento-flicker">
            <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" /><div class="card-glow" /><div class="card-scan" />
            <svg class="absolute bottom-6 right-6 w-8 h-8 text-white/5 pointer-events-none" viewBox="0 0 50 43"><path d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
            <label class="relative z-10 font-mono text-[11px] text-cyan-400 tracking-[0.5em] uppercase block mb-6">RADAR::DIST_CAL</label>
            <div class="relative z-10 font-orbitron font-black text-5xl xl:text-7xl text-white tracking-tighter mb-6">{{ distFormatted }}<span class="text-xl text-white/30 ml-4 font-mono">KM</span></div>
            <!-- Distance progress bar: PERIGEE → APOGEE -->
            <div class="relative z-10 h-2 bg-white/5 rounded-full mb-3">
              <div class="absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,1)] rounded-full transition-all duration-1000" :style="{ width: `${distRatio}%` }" />
              <div class="absolute -top-1.5 w-5 h-5 bg-white rounded-full transition-all duration-1000" :style="{ left: `calc(${distRatio}% - 10px)` }" />
            </div>
            <div class="relative z-10 flex justify-between font-mono text-[10px] text-white/30 uppercase tracking-[0.4em] mb-4"><span>[PRG] NEAR</span><span>[APG] FAR</span></div>
            <!-- Orbital Diagram: Earth–Moon system, terminal-style SVG -->
            <svg
              class="relative z-10 w-full mt-2"
              viewBox="0 0 280 124"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Background micro-grid -->
              <defs>
                <pattern id="orbit-grid" width="14" height="14" patternUnits="userSpaceOnUse">
                  <path d="M14 0 L0 0 0 14" fill="none" stroke="rgba(0,242,255,0.04)" stroke-width="0.5" />
                </pattern>
              </defs>
              <rect width="280" height="124" fill="url(#orbit-grid)" />

              <!-- Orbit ellipse — dashed cyan -->
              <ellipse
                :cx="ORB.cx" :cy="ORB.cy" :rx="ORB.rx" :ry="ORB.ry"
                fill="none" stroke="rgba(0,242,255,0.22)" stroke-width="0.8"
                stroke-dasharray="5 8"
              />

              <!-- Perigee tick + label -->
              <line x1="48" y1="55" x2="48" y2="69" stroke="rgba(0,242,255,0.45)" stroke-width="0.8" />
              <text x="48" y="48" text-anchor="middle" font-family="monospace" font-size="6.5"
                    fill="rgba(0,242,255,0.55)" letter-spacing="1">PRG</text>

              <!-- Apogee tick + label -->
              <line x1="232" y1="55" x2="232" y2="69" stroke="rgba(0,242,255,0.30)" stroke-width="0.8" />
              <text x="232" y="48" text-anchor="middle" font-family="monospace" font-size="6.5"
                    fill="rgba(0,242,255,0.35)" letter-spacing="1">APG</text>

              <!-- Dashed line: Earth → Moon (current distance) -->
              <line
                :x1="ORB.ex" :y1="ORB.ey"
                :x2="moonOrbitX" :y2="moonOrbitY"
                stroke="rgba(0,242,255,0.12)" stroke-width="0.7" stroke-dasharray="2 4"
              />

              <!-- EARTH: circle + crosshair -->
              <circle :cx="ORB.ex" :cy="ORB.ey" r="6" fill="rgba(0,60,100,0.7)" stroke="rgba(0,242,255,0.9)" stroke-width="1.2" />
              <line :x1="ORB.ex - 10" :y1="ORB.ey" :x2="ORB.ex + 10" :y2="ORB.ey" stroke="rgba(0,242,255,0.55)" stroke-width="0.7" />
              <line :x1="ORB.ex" :y1="ORB.ey - 10" :x2="ORB.ex" :y2="ORB.ey + 10" stroke="rgba(0,242,255,0.55)" stroke-width="0.7" />
              <text :x="ORB.ex" :y="ORB.ey + 20" text-anchor="middle" font-family="monospace" font-size="7"
                    fill="rgba(0,242,255,0.8)" letter-spacing="1.5">EARTH</text>

              <!-- MOON: circle + targeting ring + label -->
              <circle :cx="moonOrbitX" :cy="moonOrbitY" r="10" fill="none"
                      stroke="rgba(255,255,255,0.12)" stroke-width="0.6" stroke-dasharray="2 3" />
              <circle :cx="moonOrbitX" :cy="moonOrbitY" r="4.5" fill="rgba(200,215,255,0.15)"
                      stroke="rgba(255,255,255,0.85)" stroke-width="1.2"
                      style="transition: all 1s ease;" />
              <text :x="moonOrbitX" :y="moonLabelY" text-anchor="middle" font-family="monospace" font-size="7"
                    fill="rgba(255,255,255,0.9)" letter-spacing="1.5">LUNA</text>

              <!-- Orbital path label -->
              <text x="140" y="116" text-anchor="middle" font-family="monospace" font-size="6"
                    fill="rgba(0,242,255,0.25)" letter-spacing="3">ORBITAL PATH — SUNCALC LIVE</text>
            </svg>

            <!-- Etymology & Facts — fills the gap on xl/2xl screens -->
            <div class="relative z-10 mt-6 hidden xl:block border-t border-cyan-400/10 pt-6 space-y-4">
              <!-- Perigee -->
              <div>
                <p class="font-mono text-[9px] text-cyan-400/50 tracking-[0.5em] uppercase mb-2">ETYMOLOGY // PERIGEE</p>
                <p class="font-mono text-[11px] text-cyan-400/70 leading-relaxed">
                  From Greek <span class="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">περίγειον</span> — <span class="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">peri</span> ("near") +
                  <span class="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">gē</span> ("Earth"). The point in the lunar orbit of
                  <span class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">closest approach</span> — approximately
                  <span class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">356,500 km</span>. At perigee, the Moon appears
                  <span class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">14% larger</span> and drives stronger <span class="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">tidal forces</span>.
                </p>
              </div>
              <!-- Apogee -->
              <div>
                <p class="font-mono text-[9px] text-cyan-400/50 tracking-[0.5em] uppercase mb-2">ETYMOLOGY // APOGEE</p>
                <p class="font-mono text-[11px] text-cyan-400/70 leading-relaxed">
                  From Greek <span class="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">ἀπόγειον</span> — <span class="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">apo</span> ("away from") +
                  <span class="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">gē</span> ("Earth"). The point of
                  <span class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">maximum separation</span> — approximately
                  <span class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">406,700 km</span>. The Moon moves
                  <span class="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">~30% slower</span> here per Kepler's second law — equal areas in equal times.
                </p>
              </div>
              <!-- Current position -->
              <div class="flex items-center gap-3 pt-2 border-t border-white/5">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(0,255,255,1)]" />
                <span class="font-mono text-[9px] text-cyan-400/60 tracking-[0.3em] uppercase">
                  CURRENT_DIST: <span class="text-white/80">{{ distFormatted }} KM</span>
                  &nbsp;//&nbsp; {{ movingTowardPerigee ? 'APPROACHING PERIGEE' : 'RECEDING → APOGEE' }}
                </span>
              </div>
            </div>

          </div>

          <div class="grid grid-cols-2 gap-8">
            <div class="panel-card group p-10 rounded-2xl bento-flicker" style="animation-delay:0.8s">
              <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
              <svg class="absolute top-6 right-6 w-6 h-6 text-white/5 pointer-events-none" viewBox="0 0 50 43"><path d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z" fill="none" stroke="currentColor" stroke-width="1" /></svg>
              <label class="relative z-10 font-mono text-[11px] text-cyan-400 tracking-[0.5em] uppercase block mb-6">NEXT_FULL</label>
              <div class="relative z-10 font-orbitron font-black text-5xl xl:text-6xl text-white">{{ daysToFullMoon }}<span class="text-2xl text-white/20 ml-2">d</span></div>
              <p class="relative z-10 font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mt-6 truncate">{{ nextFullMoon }}</p>
            </div>
            <div class="panel-card group p-10 rounded-2xl bento-flicker" style="animation-delay:1.4s">
              <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
              <svg class="absolute top-6 right-6 w-6 h-6 text-white/5 pointer-events-none" viewBox="0 0 50 43"><path d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z" fill="none" stroke="currentColor" stroke-width="1" /></svg>
              <label class="relative z-10 font-mono text-[11px] text-cyan-400 tracking-[0.5em] uppercase block mb-6">NEXT_NEW</label>
              <div class="relative z-10 font-orbitron font-black text-5xl xl:text-6xl text-cyan-400">{{ daysToNewMoon }}<span class="text-2xl text-white/20 ml-2">d</span></div>
              <p class="relative z-10 font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mt-6 truncate">{{ nextNewMoon }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── ROW 2: OBSERVER COORDS + ALT/AZ ──────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 panel-card group p-10 rounded-2xl bento-flicker" style="animation-delay:2s">
          <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
          <svg class="absolute top-6 right-8 w-10 h-10 text-cyan-400/5 pointer-events-none" viewBox="0 0 50 43"><path d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z" fill="none" stroke="currentColor" stroke-width="1" /></svg>
          <label class="relative z-10 font-mono text-[11px] text-cyan-400 tracking-[0.5em] uppercase block mb-10">LOC_SYSLOG::COORDS</label>
          <div class="relative z-10 grid grid-cols-2 gap-8">
            <div><span class="font-mono text-[11px] text-white/20 uppercase tracking-[0.4em] block mb-4">LATITUDE</span><span class="font-orbitron font-black text-4xl xl:text-6xl text-white">{{ latStr }}</span></div>
            <div><span class="font-mono text-[11px] text-white/20 uppercase tracking-[0.4em] block mb-4">LONGITUDE</span><span class="font-orbitron font-black text-4xl xl:text-6xl text-white">{{ lngStr }}</span></div>
          </div>
          <div class="relative z-10 mt-10 flex items-center gap-4 px-6 py-4 border border-cyan-400/20 bg-cyan-400/5">
            <div class="w-3 h-3 rounded-full bg-[#28c840] animate-pulse shadow-[0_0_12px_rgba(40,200,64,1)]" />
            <span class="font-mono text-[11px] text-cyan-400 tracking-[0.4em] uppercase">SH_CALIBRATION: ACTIVE // FEED: SYNCED</span>
          </div>
        </div>

        <div class="panel-card group p-10 rounded-2xl flex flex-col justify-between bento-flicker" style="animation-delay:2.8s">
          <div class="panel-grid-mesh" /><div class="panel-scanlines" /><div class="card-brackets" />
          <svg class="absolute bottom-6 right-6 w-8 h-8 text-white/5 pointer-events-none" viewBox="0 0 50 43"><path d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
          <label class="relative z-10 font-mono text-[11px] text-cyan-400 tracking-[0.5em] uppercase block mb-10">POSITION_DATA</label>
          <div class="relative z-10 flex flex-col gap-8">
            <div class="border-b border-white/10 pb-8"><span class="font-mono text-[11px] text-white/20 uppercase tracking-widest block mb-4">ALTITUDE</span><span class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ altStr }}</span></div>
            <div><span class="font-mono text-[11px] text-white/20 uppercase tracking-widest block mb-4">AZIMUTH</span><span class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ azStr }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── BROKEN TERMINAL ANIMATIONS ── */
.broken-terminal-jitter { animation: glitch-jitter 12s infinite alternate; }
@keyframes glitch-jitter {
  0%, 95%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
  96% { transform: translate(2px, -1px); filter: hue-rotate(5deg) brightness(1.1); }
  97% { transform: translate(-2px, 1px); filter: hue-rotate(-5deg); }
  98% { transform: translate(4px, 0px); }
  99% { transform: translate(-3px, -2px); }
}

/* ── CRT STACK ── */
.grid-overlay { background-image: linear-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px); background-size: 32px 32px; }
.scanline-overlay { background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0px, rgba(0, 0, 0, 0.8) 1.5px, transparent 1.5px, transparent 4px); }
.crt-vignette { background: radial-gradient(circle at 50% 50%, transparent 25%, rgba(0,0,0,0.95) 100%); }

/* ── PANEL CARDS ── */
.panel-card {
  position: relative;
  background: rgba(4, 12, 18, 0.25); /* LIGHTER for bleed through */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid rgba(0, 242, 255, 0.15);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

/* PERMANENT INTERNAL GRID */
.panel-grid-mesh {
  position: absolute; inset: 0;
  background-image: 
    linear-gradient(rgba(0, 242, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 242, 255, 0.04) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none; z-index: 0;
}

/* Red Alert / Glitch Theme (INTERNAL ONLY) */
@keyframes red-glitch-alert {
  0%, 88%, 100% { 
    background: rgba(4, 12, 18, 0.25); border-color: rgba(0, 242, 255, 0.15);
  }
  89%, 91% { 
    background: rgba(180, 10, 10, 0.15); border-color: rgba(255, 0, 50, 0.6);
  }
}

.bento-flicker { animation: signal-flicker 11s infinite, red-glitch-alert 15s infinite; }
.panel-card:hover { border-color: rgba(0, 242, 255, 0.6); background: rgba(4, 12, 18, 0.55); box-shadow: 0 0 80px rgba(0, 242, 255, 0.12); }

.panel-scanlines {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 3px);
  pointer-events: none; z-index: 0; opacity: 0.6;
}

.card-brackets::before, .card-brackets::after { content: ''; position: absolute; width: 24px; height: 24px; border-color: rgba(0, 242, 255, 0.6); z-index: 20; }
.card-brackets::before { top: 0; left: 0; border-top: 3px solid; border-left: 3px solid; }
.card-brackets::after  { bottom: 0; right: 0; border-bottom: 3px solid; border-right: 3px solid; }

@keyframes signal-flicker {
  0%   { opacity: 1; filter: contrast(1); }
  1%   { opacity: 0.85; filter: contrast(1.4) brightness(1.2); }
  2%   { opacity: 1; filter: contrast(1); }
}

.rotate-ring { animation: rotate-slow 90s linear infinite; }
@keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.ticker-wrap { mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); }
.ticker-content { display: inline-block; animation: ticker 40s linear infinite; }
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>
