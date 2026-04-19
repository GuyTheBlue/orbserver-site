<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const {
  isLoading, fraction, phase, phaseName, age,
  distance, altitude, azimuth,
  nextFullMoon, nextNewMoon, daysToFullMoon, daysToNewMoon,
  apparentRotation, lat, lng
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
  <section ref="sectionEl" class="relative bg-[#010810] overflow-hidden" style="min-height: 120vh;">

    <!-- ── 1. BACKGROUND TERMINAL (z-0, absolute, full section) ─────────── -->
    <!-- Panels above it use backdrop-blur, causing this to bleed through blurred -->
    <ClientOnly>
      <div class="absolute inset-0 z-0 p-10 lg:p-16 font-mono overflow-hidden select-none pointer-events-none">
        <!-- Mac-style header for the bg terminal -->
        <div class="flex items-center gap-3 mb-6 opacity-40">
          <span class="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span class="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span class="w-3 h-3 rounded-full bg-[#28c840]" />
          <span class="ml-4 text-[11px] text-white/20 tracking-widest">lunar-obs@orbserver:~</span>
        </div>
        <!-- Typed output -->
        <div class="text-[13px] leading-7 opacity-25">
          <div v-for="(line, i) in termLines" :key="i">
            <div v-if="line.cls === 'term-blank'" class="h-5" />
            <div v-else :class="{
              'text-cyan-400':    line.cls === 'term-cmd',
              'text-green-300/80': line.cls === 'term-out',
            }">{{ line.text }}</div>
          </div>
          <span
            class="inline-block w-[9px] h-[1.1em] bg-cyan-400 align-middle"
            :class="termCursor ? 'opacity-60' : 'opacity-0'"
          />
        </div>
      </div>
      <template #fallback><div class="absolute inset-0 z-0" /></template>
    </ClientOnly>

    <!-- ── 2. CRT LAYER STACK (above terminal, below panels) ──────────────── -->
    <!-- Grid lines -->
    <div class="absolute inset-0 z-[2] pointer-events-none opacity-[0.09] grid-overlay" />
    <!-- Heavy scanlines -->
    <div class="absolute inset-0 z-[3] pointer-events-none opacity-[0.22] scanline-overlay" />
    <!-- Vignette -->
    <div class="absolute inset-0 z-[4] pointer-events-none crt-vignette opacity-40" />

    <!-- ── 3. BACKGROUND TYPOGRAPHY WASH ────────────────────────────────── -->
    <div class="absolute inset-0 z-[1] pointer-events-none overflow-hidden select-none">
      <div
        class="absolute -top-[8%] -left-[5%] font-orbitron font-black text-white/[0.025] whitespace-nowrap leading-none"
        style="font-size: clamp(80px, 18vw, 240px); transform: rotate(-8deg);"
      >{{ latStr }}</div>
      <div
        class="absolute bottom-[5%] -right-[5%] font-orbitron font-black text-white/[0.015] whitespace-nowrap leading-none"
        style="font-size: clamp(60px, 12vw, 180px); transform: rotate(4deg);"
      >LUNAR_OBS</div>
      <!-- Hex clusters -->
      <div class="absolute -top-8 -right-8  w-72 h-72 hex-cluster opacity-25 rotate-12" />
      <div class="absolute top-1/3 -left-12 w-56 h-56 hex-cluster opacity-15 -rotate-45" />
      <div class="absolute -bottom-10 right-1/4 w-64 h-64 hex-cluster opacity-10" />
    </div>

    <!-- ── 4. PANELS (z-10, backdrop-blur makes terminal visible blurred) ── -->
    <div class="relative z-10 max-w-[1600px] mx-auto px-6 pt-24 pb-24 2xl:pt-32">

      <!-- STATUS BAR -->
      <div class="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 uppercase tracking-[0.4em] mb-14 border-b border-white/5 pb-6">
        <div class="flex items-center gap-6">
          <div class="flex gap-2">
            <span class="w-2 h-2 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.8)]" />
            <span class="w-2 h-2 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.8)]" />
            <span class="w-2 h-2 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.8)]" />
          </div>
          <span class="text-white">ORBSERVER::ACTIVE_FEED</span>
          <span class="opacity-40 hidden md:inline">OBS: {{ latStr }} / {{ lngStr }}</span>
        </div>
        <div class="overflow-hidden whitespace-nowrap ticker-wrap w-80 opacity-30">
          <div class="ticker-content font-mono text-[9px]">GEOGRAPHIC_PARALLAX_SYNC // SUNCALC_FEED // SOUTHERN_HEMISPHERE_CALIBRATED // V4.6 // GEOGRAPHIC_PARALLAX_SYNC // SUNCALC_FEED // SOUTHERN_HEMISPHERE_CALIBRATED // V4.6</div>
        </div>
      </div>

      <!-- ── ROW 1: MOON + QUICK STATS SIDE ─────────────────────────────── -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">

        <!-- MOON PANEL -->
        <div class="xl:col-span-7 panel-card group flex flex-col items-center justify-center min-h-[580px] lg:min-h-[700px] p-10">
          <div class="card-brackets" />
          <div class="card-glow" />
          <div class="panel-scanlines" />
          <label class="font-mono text-[10px] text-cyan-400/50 tracking-[0.5em] uppercase mb-8 self-start">CURRENT_PHASE::VISUAL</label>

          <div
            class="relative w-full max-w-[400px] xl:max-w-[460px] transition-all duration-1000"
            :class="isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
          >
            <SharedMoonPhase :fraction="fraction" :phase="phase" :rotation="apparentRotation" :lat="lat" />
            <svg class="absolute pointer-events-none text-cyan-400/20 rotate-ring" style="inset:-14%;width:128%;height:128%;">
              <circle cx="50%" cy="50%" r="44%" stroke="currentColor" fill="none" stroke-dasharray="3 14" stroke-width="0.8"/>
              <g stroke="currentColor" stroke-width="0.8">
                <line x1="50%" y1="0%" x2="50%" y2="6%"/>
                <line x1="50%" y1="94%" x2="50%" y2="100%"/>
                <line x1="0%" y1="50%" x2="6%" y2="50%"/>
                <line x1="94%" y1="50%" x2="100%" y2="50%"/>
              </g>
            </svg>
          </div>

          <div class="mt-10 text-center w-full">
            <h2 class="font-orbitron font-black text-5xl xl:text-6xl text-white tracking-widest uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]">
              {{ isLoading ? '…' : phaseName }}
            </h2>
            <div class="mt-6 flex items-stretch justify-center">
              <div class="flex flex-col items-center px-8 border-r border-white/10">
                <span class="font-mono text-[9px] text-cyan-400/40 tracking-[0.5em] uppercase mb-2">Age</span>
                <span class="font-orbitron font-black text-4xl text-white">{{ age }}<span class="text-xl text-white/25 ml-1">d</span></span>
              </div>
              <div class="flex flex-col items-center px-8 border-r border-white/10">
                <span class="font-mono text-[9px] text-cyan-400/40 tracking-[0.5em] uppercase mb-2">Illuminated</span>
                <span class="font-orbitron font-black text-4xl text-white">{{ illuminationPct }}<span class="text-xl text-white/25 ml-1">%</span></span>
              </div>
              <div class="flex flex-col items-center px-8">
                <span class="font-mono text-[9px] text-cyan-400/40 tracking-[0.5em] uppercase mb-2">Parallax</span>
                <span class="font-orbitron font-black text-4xl text-cyan-400">{{ Math.round(apparentRotation) }}<span class="text-xl text-white/25 ml-1">°</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- SIDE STATS COLUMN -->
        <div class="xl:col-span-5 flex flex-col gap-6">

          <!-- Distance -->
          <div class="panel-card group flex-1 p-8 bento-flicker">
            <div class="card-brackets" /><div class="card-glow" /><div class="card-scan" />
            <label class="font-mono text-[10px] text-cyan-400/50 tracking-[0.5em] uppercase block mb-4">RADAR::DISTANCE</label>
            <div class="font-orbitron font-black text-5xl xl:text-6xl text-white tracking-tighter">
              {{ distFormatted }}<span class="text-xl text-white/20 ml-3 font-mono">KM</span>
            </div>
            <div class="mt-6 h-1.5 bg-white/5 rounded-full relative">
              <div class="absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.9)] rounded-full transition-all duration-1000" :style="{ width: `${distRatio}%` }" />
              <div class="absolute -top-1.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-1000" :style="{ left: `calc(${distRatio}% - 8px)` }" />
            </div>
            <div class="flex justify-between mt-3 font-mono text-[9px] text-white/20 uppercase tracking-[0.3em]">
              <span>PERIGEE 356k</span><span>APOGEE 406k</span>
            </div>
          </div>

          <!-- Next events (2 col) -->
          <div class="grid grid-cols-2 gap-6">
            <div class="panel-card group p-8 bento-flicker" style="animation-delay:0.8s">
              <div class="card-brackets" /><div class="card-glow opacity-50" />
              <label class="font-mono text-[10px] text-cyan-400/50 tracking-[0.5em] uppercase block mb-4">NEXT::FULL</label>
              <div class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ daysToFullMoon }}<span class="text-xl text-white/20 ml-1">d</span></div>
              <p class="font-mono text-[9px] text-white/15 uppercase tracking-widest mt-4 truncate">{{ nextFullMoon }}</p>
            </div>
            <div class="panel-card group p-8 bento-flicker" style="animation-delay:1.4s">
              <div class="card-brackets" /><div class="card-glow opacity-50" />
              <label class="font-mono text-[10px] text-cyan-400/50 tracking-[0.5em] uppercase block mb-4">NEXT::NEW</label>
              <div class="font-orbitron font-black text-5xl xl:text-6xl text-cyan-300">{{ daysToNewMoon }}<span class="text-xl text-white/20 ml-1">d</span></div>
              <p class="font-mono text-[9px] text-white/15 uppercase tracking-widest mt-4 truncate">{{ nextNewMoon }}</p>
            </div>
          </div>

        </div>
      </div>

      <!-- ── ROW 2: OBSERVER COORDS + ALT/AZ ──────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <div class="lg:col-span-2 panel-card group p-8 bento-flicker" style="animation-delay:2s">
          <div class="card-brackets" /><div class="card-glow" />
          <label class="font-mono text-[10px] text-cyan-400/50 tracking-[0.5em] uppercase block mb-8">OBSERVER::GEODETICS</label>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <span class="font-mono text-[9px] text-white/20 uppercase tracking-widest block mb-3">LATITUDE</span>
              <span class="font-orbitron font-black text-4xl xl:text-5xl text-white leading-none">{{ latStr }}</span>
            </div>
            <div>
              <span class="font-mono text-[9px] text-white/20 uppercase tracking-widest block mb-3">LONGITUDE</span>
              <span class="font-orbitron font-black text-4xl xl:text-5xl text-white leading-none">{{ lngStr }}</span>
            </div>
          </div>
          <div class="mt-8 flex items-center gap-3 px-4 py-3 border border-cyan-400/15 bg-cyan-400/5">
            <span class="w-2 h-2 rounded-full bg-[#28c840] animate-pulse shadow-[0_0_8px_rgba(40,200,64,0.8)]" />
            <span class="font-mono text-[9px] text-cyan-300/60 tracking-[0.3em] uppercase">SH_PARALLAX_ACTIVE // SOUTHERN_HEMISPHERE // CALIBRATED</span>
          </div>
        </div>

        <div class="panel-card group p-8 flex flex-col justify-between bento-flicker" style="animation-delay:2.8s">
          <div class="card-brackets" /><div class="card-glow opacity-50" />
          <label class="font-mono text-[10px] text-cyan-400/50 tracking-[0.5em] uppercase block mb-8">SKY::POSITION</label>
          <div class="flex flex-col gap-6">
            <div class="border-b border-white/5 pb-6">
              <span class="font-mono text-[9px] text-white/20 uppercase tracking-widest block mb-3">ALTITUDE</span>
              <span class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ altStr }}</span>
            </div>
            <div>
              <span class="font-mono text-[9px] text-white/20 uppercase tracking-widest block mb-3">AZIMUTH</span>
              <span class="font-orbitron font-black text-5xl xl:text-6xl text-white">{{ azStr }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="mt-12 border-t border-white/5 pt-8 flex justify-between items-center gap-6">
        <div class="font-mono text-[10px] text-white/10 tracking-[0.8em] uppercase hidden md:block">GEOGRAPHIC_PARALLAX_SYNC // SOUTHERN_HEMISPHERE_CAL // SECURE_LINK</div>
        <div class="flex gap-3 items-center">
          <span class="w-2 h-2 rounded-full bg-[#28c840] animate-pulse" />
          <div class="px-4 py-2 border border-cyan-400/15 bg-cyan-400/5 font-mono text-[10px] text-cyan-400/50 tracking-[0.4em] uppercase">FEED_ACTIVE</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── CRT STACK ── */
.grid-overlay {
  background-image:
    linear-gradient(rgba(0, 242, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 242, 255, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
}
.scanline-overlay {
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.68) 0px,
    rgba(0, 0, 0, 0.68) 1px,
    transparent 1px,
    transparent 4px
  );
}
.crt-vignette {
  background: radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.9) 100%);
}

/* ── HEX CLUSTERS ── */
.hex-cluster {
  background-image: url("data:image/svg+xml,%3Csvg width='50' height='43' viewBox='0 0 50 43' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z' fill='none' stroke='%2300f2ff' stroke-width='0.6' /%3E%3C/svg%3E");
  background-size: 30px 26px;
  mask-image: radial-gradient(circle, black 20%, transparent 75%);
}

/* ── PANEL CARDS (backdrop-blur causes terminal to bleed through blurred) ── */
.panel-card {
  position: relative;
  background: rgba(4, 12, 22, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(0, 242, 255, 0.10);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-card:hover {
  border-color: rgba(0, 242, 255, 0.40);
  background: rgba(4, 12, 22, 0.92);
  box-shadow: 0 0 60px rgba(0, 242, 255, 0.08), inset 0 0 40px rgba(0, 242, 255, 0.02);
  transform: translateY(-3px);
}

/* CRT scanlines visible inside each panel */
.panel-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.3) 0px,
    rgba(0, 0, 0, 0.3) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

/* Corner brackets */
.card-brackets::before, .card-brackets::after {
  content: '';
  position: absolute;
  width: 20px; height: 20px;
  border-color: rgba(0, 242, 255, 0.40);
  transition: all 0.5s ease;
  z-index: 20;
}
.card-brackets::before { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
.card-brackets::after  { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }
.panel-card:hover .card-brackets::before { width: 32px; height: 32px; border-color: rgba(0, 242, 255, 1); }
.panel-card:hover .card-brackets::after  { width: 32px; height: 32px; border-color: rgba(0, 242, 255, 1); }

/* Gradient edge glow */
.card-glow {
  position: absolute; inset: -1px;
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.14), transparent 40%, transparent 60%, rgba(0, 242, 255, 0.07));
  opacity: 0; transition: opacity 0.5s ease; pointer-events: none; z-index: 0;
}
.panel-card:hover .card-glow { opacity: 1; }

/* Scan-pass sweep on hover */
.card-scan {
  position: absolute; top: 0; left: 0; width: 100%; height: 3px;
  background: linear-gradient(to bottom, rgba(0, 242, 255, 0.6), transparent);
  animation: scan-drop 5s linear infinite; opacity: 0; transition: opacity 0.3s ease; z-index: 10;
}
.panel-card:hover .card-scan { opacity: 1; }
@keyframes scan-drop {
  0%   { top: 0%;   opacity: 0; }
  3%   { opacity: 1; }
  97%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* Signal flicker */
.bento-flicker { animation: signal-flicker 11s infinite; }
@keyframes signal-flicker {
  0%   { opacity: 1; }
  1%   { opacity: 0.90; filter: brightness(1.2); }
  2%   { opacity: 1; }
  47%  { opacity: 1; }
  48%  { opacity: 0.97; }
  49%  { opacity: 1; }
  91%  { opacity: 1; }
  92%  { opacity: 0.85; filter: brightness(0.9) contrast(1.1); }
  93%  { opacity: 1; }
}

/* Moon ring */
.rotate-ring { animation: rotate-slow 80s linear infinite; }
@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Ticker */
.ticker-wrap { mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); }
.ticker-content { display: inline-block; animation: ticker 30s linear infinite; }
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
