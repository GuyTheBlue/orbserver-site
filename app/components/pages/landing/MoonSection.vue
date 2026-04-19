<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const {
  isLoading,
  fraction,
  phase,
  phaseName,
  phaseGlyph,
  age,
  distance,
  altitude,
  azimuth,
  nextFullMoon,
  nextNewMoon,
  daysToFullMoon,
  daysToNewMoon
} = useMoonData()

// ── Scroll reveal ────────────────────────────────────────────────────────────
const sectionEl = ref<HTMLElement | null>(null)
const moonVisible = ref(false)
const contentVisible = ref(false)

useIntersectionObserver(sectionEl, ([entry]) => {
  if (entry.isIntersecting) {
    moonVisible.value = true
    setTimeout(() => { contentVisible.value = true }, 400)
  }
}, { threshold: 0.05 })

// ── Illumination ring (SVG circle trick) ─────────────────────────────────────
const CIRC = 2 * Math.PI * 36 // circumference of r=36 circle
const illuminationDash = computed(() => `${fraction.value * CIRC} ${CIRC}`)
const illuminationPct = computed(() => Math.round(fraction.value * 100))

// ── Distance context ─────────────────────────────────────────────────────────
const PERIGEE = 356_500
const APOGEE  = 406_700
const MEAN    = 384_400

const distContext = computed(() => {
  const d = distance.value
  if (!d) return null
  const pct = Math.abs(((d - MEAN) / MEAN) * 100).toFixed(1)
  const closer = d < MEAN
  const rangePos = ((d - PERIGEE) / (APOGEE - PERIGEE)) * 100
  const badge =
    d < 363_300 ? 'Near Perigee' :
    d > 405_500 ? 'Near Apogee' :
    null
  return {
    pct,
    closer,
    badge,
    rangePos: Math.min(100, Math.max(0, rangePos)),
    fromPerigee: Math.round(d - PERIGEE).toLocaleString('en-GB'),
    fromApogee: Math.round(APOGEE - d).toLocaleString('en-GB'),
    formatted: d.toLocaleString('en-GB')
  }
})

// ── Altitude ────────────────────────────────────────────────────────────────
const altStr = computed(() =>
  altitude.value !== 0 ? `${altitude.value > 0 ? '+' : ''}${altitude.value}°` : '—'
)
const moonUp = computed(() => altitude.value > 0)

// ── Azimuth compass ──────────────────────────────────────────────────────────
function compass(deg: number) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16] ?? '—'
}
const azStr = computed(() =>
  azimuth.value > 0 ? `${azimuth.value.toFixed(0)}° ${compass(azimuth.value)}` : '—'
)

// ── Cycle progress ───────────────────────────────────────────────────────────
const cyclePct = computed(() => phase.value * 100)
</script>

<template>
  <section
    ref="sectionEl"
    class="relative bg-black overflow-hidden"
    style="min-height: 100vh;"
  >
    <!-- ── Decorative hexagons — sparse, intentional, not tiled ─────────────────
         These are standalone SVG shapes, not a background grid.
    ─────────────────────────────────────────────────────────────────────────── -->
    <!-- Large ghost hex — bottom-right -->
    <svg
      class="absolute bottom-[-5%] right-[-8%] pointer-events-none select-none"
      width="480" height="480"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style="opacity: 0.025;"
    >
      <polygon points="50,2 93,25 93,75 50,98 7,75 7,25"
               fill="none" stroke="rgba(100,200,255,1)" stroke-width="0.8" />
      <polygon points="50,12 83,30 83,70 50,88 17,70 17,30"
               fill="none" stroke="rgba(100,200,255,1)" stroke-width="0.4" />
    </svg>

    <!-- Medium hex — top-left -->
    <svg
      class="absolute top-[5%] left-[2%] pointer-events-none select-none"
      width="180" height="180"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style="opacity: 0.04;"
    >
      <polygon points="50,3 93,26 93,74 50,97 7,74 7,26"
               fill="none" stroke="rgba(100,200,255,1)" stroke-width="1" />
    </svg>

    <!-- Tiny hex — mid-right -->
    <svg
      class="absolute top-[40%] right-[4%] pointer-events-none select-none"
      width="64" height="64"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style="opacity: 0.06;"
    >
      <polygon points="50,3 93,26 93,74 50,97 7,74 7,26"
               fill="none" stroke="rgba(100,200,255,1)" stroke-width="1.5" />
    </svg>

    <!-- ── Content ───────────────────────────────────────────────────────────── -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 pb-24">

      <!-- Section label — whisper-quiet, very small -->
      <div
        class="pt-10 text-center transition-all duration-700"
        :class="moonVisible ? 'opacity-100' : 'opacity-0'"
      >
        <p class="font-orbitron text-[8px] tracking-[0.6em] text-white/20 uppercase">
          Lunar Observatory
        </p>
      </div>

      <!-- ──────────────────────────────────────────────────────────────────────
           The Moon — centred, dominant, immediate
      ────────────────────────────────────────────────────────────────────────── -->
      <div
        class="flex flex-col items-center mt-8 transition-all duration-1000"
        :class="moonVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
        style="transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);"
      >
        <!-- Moon visual -->
        <div class="relative w-56 sm:w-64 md:w-72 lg:w-80">
          <SharedMoonPhase :fraction="fraction" :phase="phase" />

          <!-- Subtle rotating targeting ring -->
          <svg
            class="absolute pointer-events-none text-cyan-400"
            style="inset: -14%; width: calc(100% + 28%); height: calc(100% + 28%);"
            viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="90"
                    stroke="rgba(0,255,255,0.06)" stroke-width="0.5"
                    fill="none" stroke-dasharray="3 9"
                    class="targeting-ring" />
            <!-- Four tick marks at cardinal points -->
            <g stroke="rgba(0,255,255,0.25)" stroke-width="1" fill="none">
              <line x1="100" y1="7"  x2="100" y2="16" />
              <line x1="100" y1="184" x2="100" y2="193" />
              <line x1="7"   y1="100" x2="16"  y2="100" />
              <line x1="184" y1="100" x2="193" y2="100" />
            </g>
          </svg>
        </div>

        <!-- Phase name — clean, centred, immediately below moon -->
        <div class="mt-6 text-center">
          <ClientOnly>
            <h2 class="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
              {{ isLoading ? '…' : phaseName }}
            </h2>
            <p class="mt-1 font-mono text-xs text-white/30 tracking-widest">
              {{ phaseGlyph }} &nbsp; Day {{ isLoading ? '—' : age }} of 29.5-day cycle
            </p>

            <!-- Cycle progress track — thin, minimal -->
            <div class="mt-5 mx-auto w-64 sm:w-80">
              <div class="relative h-px bg-white/8">
                <!-- Quarter markers -->
                <div class="absolute inset-y-0 left-1/4  w-px bg-white/15" style="height: 4px; top: -1.5px;" />
                <div class="absolute inset-y-0 left-1/2  w-px bg-white/15" style="height: 4px; top: -1.5px;" />
                <div class="absolute inset-y-0 left-3/4  w-px bg-white/15" style="height: 4px; top: -1.5px;" />
                <!-- Progress fill -->
                <div
                  class="absolute top-0 left-0 h-px bg-gradient-to-r from-white/20 via-cyan-400/80 to-cyan-400/20 transition-all duration-1000"
                  :style="{ width: `${cyclePct}%` }"
                />
                <!-- Current position dot -->
                <div
                  class="absolute top-1/2 w-2 h-2 bg-cyan-300 rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
                  :style="{ left: `${cyclePct}%`, boxShadow: '0 0 8px 2px rgba(0,255,255,0.5)' }"
                />
              </div>
              <div class="flex justify-between mt-1.5 text-[8px] font-mono text-white/20 tracking-widest">
                <span>NEW</span><span>QTR</span><span>FULL</span><span>QTR</span><span>NEW</span>
              </div>
            </div>
            <template #fallback><div class="h-20" /></template>
          </ClientOnly>
        </div>
      </div>

      <!-- ──────────────────────────────────────────────────────────────────────
           Bento grid — staggered reveal after moon is shown
      ────────────────────────────────────────────────────────────────────────── -->
      <ClientOnly>
        <div
          class="bento-grid mt-16 transition-all duration-700"
          :class="contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        >
          <!-- ══ Card 1: Phase + Illumination ══ -->
          <div class="bento-phase bento-card group">
            <div class="bento-card-accent-line bg-cyan-400/50" />
            <p class="bento-label text-cyan-400/50">Illumination</p>

            <div class="mt-4 flex items-center justify-between">
              <div>
                <div class="text-4xl font-orbitron font-black text-white tracking-tight">
                  {{ illuminationPct }}<span class="text-2xl text-white/40">%</span>
                </div>
                <p class="mt-1 text-xs font-mono text-white/25 tracking-wide">
                  {{ fraction >= 0.99 ? 'Total illumination' : fraction <= 0.01 ? 'Fully in shadow' : `${(100 - illuminationPct)}% in shadow` }}
                </p>
              </div>

              <!-- SVG illumination arc -->
              <svg viewBox="0 0 80 80" class="w-16 h-16 shrink-0 -rotate-90">
                <circle cx="40" cy="40" r="36" fill="none"
                        stroke="rgba(255,255,255,0.04)" stroke-width="3" />
                <circle cx="40" cy="40" r="36" fill="none"
                        stroke="rgba(100,210,255,0.75)" stroke-width="3"
                        stroke-linecap="round"
                        :stroke-dasharray="illuminationDash" />
              </svg>
            </div>
          </div>

          <!-- ══ Card 2: Distance — featured, blue, tall ══ -->
          <div class="bento-dist bento-card bento-card--blue group">
            <div class="bento-card-accent-line bg-blue-400/40" />
            <p class="bento-label text-blue-300/50">Distance to Earth</p>

            <div class="mt-4">
              <div class="text-3xl font-orbitron font-black tracking-tight"
                   :class="distContext?.closer ? 'text-cyan-100' : 'text-blue-100'">
                {{ distContext ? distContext.formatted : '—' }}
                <span class="text-sm font-normal text-white/30">km</span>
              </div>

              <!-- Deviation from mean -->
              <p v-if="distContext" class="mt-2 text-[10px] font-mono text-white/35 tracking-wide">
                {{ distContext.pct }}% {{ distContext.closer ? 'closer' : 'farther' }} than mean orbit
              </p>

              <!-- Badge for near perigee/apogee -->
              <div v-if="distContext?.badge"
                   class="inline-block mt-2 px-2 py-0.5 border border-blue-400/30 text-blue-300/70
                          text-[9px] font-mono tracking-widest uppercase rounded">
                {{ distContext.badge }}
              </div>

              <!-- Perigee → Apogee range slider -->
              <div v-if="distContext" class="mt-5">
                <div class="relative h-px bg-white/8">
                  <div
                    class="absolute top-0 h-px bg-gradient-to-r from-cyan-400/60 to-blue-400/60"
                    :style="{ width: `${distContext.rangePos}%` }"
                  />
                  <div
                    class="absolute top-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full -translate-y-1/2 -translate-x-1/2"
                    :style="{ left: `${distContext.rangePos}%`, boxShadow: '0 0 6px rgba(100,150,255,0.8)' }"
                  />
                </div>
                <div class="flex justify-between mt-1.5 text-[8px] font-mono text-white/20">
                  <span>Perigee<br />356,500 km</span>
                  <span class="text-right">Apogee<br />406,700 km</span>
                </div>
              </div>

              <!-- Factoid divider -->
              <div class="mt-5 pt-4 border-t border-white/5">
                <p class="text-[9px] font-mono text-white/20 leading-relaxed">
                  At perigee the Moon appears 14% larger and 30% brighter — a SuperMoon.
                  At apogee it becomes a MicroMoon, subtly smaller in the sky.
                </p>
              </div>
            </div>
          </div>

          <!-- ══ Card 3: Age / Lunation ══ -->
          <div class="bento-age bento-card group">
            <div class="bento-card-accent-line bg-teal-400/40" />
            <p class="bento-label text-teal-400/40">Lunation Age</p>
            <div class="mt-4 text-3xl font-orbitron font-bold text-white">
              {{ isLoading ? '—' : age }}
              <span class="text-base font-normal text-white/30">days</span>
            </div>
            <p class="mt-1 text-[9px] font-mono text-white/20 tracking-wide">of 29.5-day synodic month</p>
          </div>

          <!-- ══ Card 4: Next Full Moon ══ -->
          <div class="bento-nextfull bento-card group">
            <div class="bento-card-accent-line bg-white/20" />
            <p class="bento-label text-white/30">Next Full Moon</p>
            <div class="mt-3 flex items-start gap-3">
              <span class="text-3xl leading-none">🌕</span>
              <div>
                <div class="text-xl font-orbitron font-bold text-white">
                  {{ isLoading ? '—' : (daysToFullMoon <= 0 ? 'Tonight' : `${daysToFullMoon}d`) }}
                </div>
                <p class="text-[9px] font-mono text-white/25 mt-0.5 leading-relaxed">
                  {{ isLoading ? '' : nextFullMoon }}
                </p>
              </div>
            </div>
          </div>

          <!-- ══ Card 5: Next New Moon ══ -->
          <div class="bento-nextnew bento-card group">
            <div class="bento-card-accent-line bg-white/10" />
            <p class="bento-label text-white/30">Next New Moon</p>
            <div class="mt-3 flex items-start gap-3">
              <span class="text-3xl leading-none">🌑</span>
              <div>
                <div class="text-xl font-orbitron font-bold text-white">
                  {{ isLoading ? '—' : (daysToNewMoon <= 0 ? 'Tonight' : `${daysToNewMoon}d`) }}
                </div>
                <p class="text-[9px] font-mono text-white/25 mt-0.5 leading-relaxed">
                  {{ isLoading ? '' : nextNewMoon }}
                </p>
              </div>
            </div>
          </div>

          <!-- ══ Card 6: Altitude ══ -->
          <div class="bento-alt bento-card group">
            <div
              class="bento-card-accent-line transition-colors duration-700"
              :class="moonUp ? 'bg-cyan-400/50' : 'bg-slate-600/40'"
            />
            <p class="bento-label"
               :class="moonUp ? 'text-cyan-400/50' : 'text-white/25'">Altitude</p>
            <div class="mt-4 text-3xl font-orbitron font-bold"
                 :class="moonUp ? 'text-white' : 'text-white/40'">
              {{ isLoading ? '—' : altStr }}
            </div>
            <p class="mt-1 text-[9px] font-mono tracking-wide"
               :class="moonUp ? 'text-cyan-400/40' : 'text-white/20'">
              {{ moonUp ? 'Above horizon' : 'Below horizon' }}
            </p>
          </div>

          <!-- ══ Card 7: Azimuth ══ -->
          <div class="bento-az bento-card group">
            <div class="bento-card-accent-line bg-teal-400/30" />
            <p class="bento-label text-teal-400/40">Azimuth</p>
            <div class="mt-4 text-3xl font-orbitron font-bold text-white">
              {{ isLoading ? '—' : azStr }}
            </div>
            <p class="mt-1 text-[9px] font-mono text-white/20 tracking-wide">Compass bearing</p>
          </div>
        </div>

        <!-- Attribution -->
        <p class="mt-8 text-right text-[8px] font-mono text-white/10 tracking-widest uppercase">
          Calculated via SunCalc · Northern Hemisphere · Based on your local clock
        </p>

        <template #fallback>
          <div class="mt-16 h-64 flex items-center justify-center">
            <p class="text-white/10 font-mono text-xs tracking-widest animate-pulse">Calculating…</p>
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
/* ── Targeting ring animation ──────────────────────────────────────────────── */
.targeting-ring {
  transform-origin: 100px 100px;
  animation: ring-spin 30s linear infinite;
}
@keyframes ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Card base ─────────────────────────────────────────────────────────────── */
.bento-card {
  position: relative;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: rgba(6, 9, 18, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.065);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.02),
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
  overflow: hidden;
}
.bento-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 16px 48px rgba(0, 0, 0, 0.4);
}

/* ── Blue / moony distance card ─────────────────────────────────────────────── */
.bento-card--blue {
  background: linear-gradient(145deg, rgba(8, 18, 52, 0.85) 0%, rgba(5, 9, 26, 0.9) 100%);
  border-color: rgba(80, 130, 255, 0.15);
  box-shadow:
    inset 0 0 0 1px rgba(80, 130, 255, 0.04),
    inset 0 0 60px rgba(50, 80, 200, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.4);
}
.bento-card--blue:hover {
  border-color: rgba(100, 150, 255, 0.25);
  box-shadow:
    inset 0 0 0 1px rgba(100, 150, 255, 0.06),
    inset 0 0 60px rgba(60, 100, 220, 0.06),
    0 16px 48px rgba(0, 0, 20, 0.5);
}

/* ── Thin accent line at top of each card ───────────────────────────────────── */
.bento-card-accent-line {
  position: absolute;
  top: 0;
  left: 1.5rem;
  right: 1.5rem;
  height: 1px;
  border-radius: 9999px;
  transition: opacity 0.4s ease;
  opacity: 0.8;
}
.bento-card:hover .bento-card-accent-line {
  opacity: 1;
}

/* ── Label style ────────────────────────────────────────────────────────────── */
.bento-label {
  font-family: monospace;
  font-size: 9px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-top: 0.75rem;
}

/* ── Bento grid layout ───────────────────────────────────────────────────────── 
   Mobile (2 col) → Desktop (3 col) with strategic spanning
────────────────────────────────────────────────────────────────────────────── */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  gap: 0.75rem;
  grid-template-areas:
    "phase   phase"
    "dist    dist"
    "age     nextfull"
    "nextnew alt"
    "az      az";
}

/* Desktop: 3-column bento with asymmetric spanning */
@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    grid-template-areas:
      "phase   phase   dist"
      "age     nextfull dist"
      "nextnew alt     az";
  }
}

.bento-phase   { grid-area: phase; }
.bento-dist    { grid-area: dist; }
.bento-age     { grid-area: age; }
.bento-nextfull { grid-area: nextfull; }
.bento-nextnew { grid-area: nextnew; }
.bento-alt     { grid-area: alt; }
.bento-az      { grid-area: az; }
</style>
