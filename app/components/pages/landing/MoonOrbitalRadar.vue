<script setup lang="ts">
import { computed } from 'vue'
import MoonEtymology from './MoonEtymology.vue'

interface Props {
  distance: number
  movingTowardPerigee: boolean
  lunar: {
    labels: {
      distRadar: string
      orbitalPath: string
      currentDist: string
      approachingPerigee: string
      recedingApogee: string
    }
    etymology: {
      perigee: string
      apogee: string
    }
  }
}

const props = defineProps<Props>()

// ── Calculations ─────────────────────────────────────────────────────────────
const distFormatted = computed(() => props.distance?.toLocaleString('en-GB') ?? '—')
const distRatio = computed(() => {
  if (!props.distance) return 0
  // Range: 356,500km (Perigee) to 406,700km (Apogee)
  return Math.min(100, Math.max(0, ((props.distance - 356500) / (406700 - 356500)) * 100))
})

// ── Orbital Diagram ──────────────────────────────────────────────────────────
const ORB = { cx: 140, cy: 62, rx: 92, ry: 56, ex: 67, ey: 62 } as const
const moonOrbitAngle = computed(() => {
  const base = Math.PI * (1 - distRatio.value / 100)
  // If approaching perigee (distance decreasing), use the top half of the orbit
  // If receding toward apogee (distance increasing), use the bottom half
  return props.movingTowardPerigee ? (Math.PI * 2 - base) : base
})
const moonOrbitX = computed(() => ORB.cx + ORB.rx * Math.cos(moonOrbitAngle.value))
const moonOrbitY = computed(() => ORB.cy + ORB.ry * Math.sin(moonOrbitAngle.value))
const moonLabelY = computed(() => moonOrbitY.value < ORB.cy ? moonOrbitY.value - 13 : moonOrbitY.value + 16)
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

    <div class="relative z-10 flex justify-between font-mono text-[12px] md:text-[10px] text-white/60 md:text-white/30 uppercase tracking-[0.4em] mb-4">
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
