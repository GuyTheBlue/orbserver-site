<script setup lang="ts">
import { computed } from 'vue'
import MoonEtymology from './MoonEtymology.vue'
import { calculateRadarTelemetry, RADAR_CONFIG } from '~/utils/radar'

interface Props {
  distance: number
  movingTowardPerigee: boolean
  lunar: {
    labels: Record<string, string>
    etymology: {
      perigee: string
      apogee: string
    }
  }
}

const props = defineProps<Props>()

// ── Calculations ─────────────────────────────────────────────────────────────
const tel = computed(() => calculateRadarTelemetry(props.distance, props.movingTowardPerigee))

const distFormatted = computed(() => props.distance?.toLocaleString('en-GB') ?? '—')
const distMilesFormatted = computed(() => tel.value.miles.toLocaleString('en-GB'))
</script>

<template>
  <div class="panel-card group flex-1 p-10 rounded-2xl bento-flicker">
    <div class="panel-grid-mesh" />
    <div class="panel-scanlines" />
    <div class="card-brackets" />
    <div class="card-glow" />
    <div class="card-scan" />

    <svg
      class="absolute bottom-6 right-6 w-8 h-8 text-white/5 pointer-events-none"
      viewBox="0 0 50 43"
    >
      <path
        d="M12.5 0L37.5 0L50 21.5L37.5 43L12.5 43L0 21.5Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      />
    </svg>

    <label class="relative z-10 font-mono text-[14px] md:text-[13px] lg:text-[14px] text-hud-accent tracking-[0.5em] uppercase block mb-6">
      {{ props.lunar.labels.distRadar }}
    </label>

    <div class="relative z-10 font-orbitron font-black text-5xl xl:text-7xl text-white tracking-tighter mb-1">
      {{ distFormatted }}<span class="text-xl text-white/30 ml-4 font-mono">KM</span>
    </div>
    <div class="relative z-10 font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-6">
      {{ props.lunar.labels.radarEquivalent }} {{ distMilesFormatted }} MILES
    </div>

    <div class="relative z-10 h-[2px] bg-white/5 rounded-full mb-3">
      <!-- The "Softer Line" (Background) -->
      <div class="absolute inset-0 bg-white/5 rounded-full" />
      <!-- The "Accent Line" (Progress) -->
      <div
        class="absolute inset-y-0 left-0 bg-hud-accent shadow-[0_0_10px_rgba(var(--hud-accent-rgb),0.5)] rounded-full transition-all duration-1000"
        :style="{ width: `${tel.ratio}%` }"
      />
      <!-- Progress Tip Notch (Technical look instead of a dot) -->
      <div
        class="absolute top-1/2 -translate-y-1/2 w-[2px] h-3 bg-white shadow-[0_0_8px_white] transition-all duration-1000"
        :style="{ left: `calc(${tel.ratio}% - 1px)` }"
      />
    </div>

    <div class="relative z-10 flex justify-between font-mono text-[12px] md:text-[10px] text-white/60 md:text-white/30 uppercase tracking-[0.4em] mb-4">
      <span>[{{ props.lunar.labels.radarPrg }}] NEAR</span><span>[{{ props.lunar.labels.radarApg }}] FAR</span>
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
        :cx="RADAR_CONFIG.SVG.cx"
        :cy="RADAR_CONFIG.SVG.cy"
        :rx="RADAR_CONFIG.SVG.rx"
        :ry="RADAR_CONFIG.SVG.ry"
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
      >{{ props.lunar.labels.radarPrg }}</text>
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
      >{{ props.lunar.labels.radarApg }}</text>
      <line
        :x1="RADAR_CONFIG.SVG.ex"
        :y1="RADAR_CONFIG.SVG.ey"
        :x2="tel.x"
        :y2="tel.y"
        stroke="rgba(var(--hud-accent-rgb), 0.12)"
        stroke-width="0.7"
        stroke-dasharray="2 4"
      />
      <circle
        :cx="RADAR_CONFIG.SVG.ex"
        :cy="RADAR_CONFIG.SVG.ey"
        r="6"
        fill="rgba(0,60,100,0.7)"
        stroke="rgba(var(--hud-accent-rgb), 0.9)"
        stroke-width="1.2"
      />
      <line
        :x1="RADAR_CONFIG.SVG.ex - 10"
        :y1="RADAR_CONFIG.SVG.ey"
        :x2="RADAR_CONFIG.SVG.ex + 10"
        :y2="RADAR_CONFIG.SVG.ey"
        stroke="rgba(var(--hud-accent-rgb), 0.55)"
        stroke-width="0.7"
      />
      <line
        :x1="RADAR_CONFIG.SVG.ex"
        :y1="RADAR_CONFIG.SVG.ey - 10"
        :x2="RADAR_CONFIG.SVG.ex"
        :y2="RADAR_CONFIG.SVG.ey + 10"
        stroke="rgba(var(--hud-accent-rgb), 0.55)"
        stroke-width="0.7"
      />
      <text
        :x="RADAR_CONFIG.SVG.ex"
        :y="RADAR_CONFIG.SVG.ey + 20"
        text-anchor="middle"
        font-family="monospace"
        font-size="7"
        fill="rgba(var(--hud-accent-rgb), 0.8)"
        letter-spacing="1.5"
      >{{ props.lunar.labels.radarEarth }}</text>
      <circle
        :cx="tel.x"
        :cy="tel.y"
        r="10"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        stroke-width="0.6"
        stroke-dasharray="2 3"
      />
      <circle
        :cx="tel.x"
        :cy="tel.y"
        r="4.5"
        fill="rgba(200,215,255,0.15)"
        stroke="rgba(255,255,255,0.85)"
        stroke-width="1.2"
        style="transition: all 1s ease;"
      />
      <text
        :x="tel.x"
        :y="tel.labelY"
        text-anchor="middle"
        font-family="monospace"
        font-size="7"
        fill="rgba(255,255,255,0.9)"
        letter-spacing="1.5"
      >{{ props.lunar.labels.radarLuna }}</text>
      <text
        x="140"
        y="116"
        text-anchor="middle"
        font-family="monospace"
        font-size="6"
        fill="rgba(var(--hud-accent-rgb), 0.25)"
        letter-spacing="3"
      >{{ props.lunar.labels.orbitalPath }}</text>
    </svg>

    <div class="relative z-10 mt-6 border-t border-hud-accent/10 pt-6 space-y-4">
      <MoonEtymology :data="props.lunar?.etymology ?? { perigee: '', apogee: '' }" />
      <div class="flex items-center gap-3 pt-2 border-t border-white/5">
        <span class="w-1.5 h-1.5 rounded-full bg-hud-accent animate-pulse shadow-[var(--hud-accent-glow)]" />
        <span class="font-mono text-[11px] md:text-[11px] lg:text-[12px] text-hud-accent/80 md:text-hud-accent/70 tracking-[0.3em] uppercase">
          {{ props.lunar.labels.currentDist }}: <span class="text-white/80">{{ distFormatted }} KM</span>
          &nbsp;//&nbsp; {{ props.movingTowardPerigee ? props.lunar.labels.approachingPerigee : props.lunar.labels.recedingApogee }}
        </span>
      </div>
    </div>
  </div>
</template>
