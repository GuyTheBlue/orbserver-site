<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  lat: number
  azimuth: number
  altitude: number
}>()

// ── HEMISPHERE LOGIC ─────────────────────────────────────────────────────────
const hemisphere = computed(() => {
  if (props.lat > 5) return 'NORTH'
  if (props.lat < -5) return 'SOUTH'
  return 'EQUATOR'
})

// ── COMPASS ORIENTATION ───────────────────────────────────────────────────────
// Looking SOUTH (North Hemisphere): Left=East(90), Right=West(270)
// Looking NORTH (South Hemisphere): Left=West(270), Right=East(90)
const orientation = computed(() => {
  if (hemisphere.value === 'SOUTH') {
    return {
      looking: 'North',
      baseAz: 0,
      leftLabel: 'West [270°]',
      leftType: 'SUNSET',
      centerLabel: 'North [000°]',
      rightLabel: 'East [090°]',
      rightType: 'SUNRISE'
    }
  }
  return {
    looking: 'South',
    baseAz: 180,
    leftLabel: 'East [090°]',
    leftType: 'SUNRISE',
    centerLabel: 'South [180°]',
    rightLabel: 'West [270°]',
    rightType: 'SUNSET'
  }
})

// ── TARGET MAPPING ───────────────────────────────────────────────────────────
const svgWidth = 400
const horizonY = 220

const relAz = computed(() => {
  let diff = props.azimuth - orientation.value.baseAz
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return diff
})

const targetX = computed(() => {
  // Map relAz (-90 to 90) to 0 to 400
  // Note: For North Hemi looking South, relAz -90 is East (Left), 90 is West (Right).
  // For South Hemi looking North, relAz -90 is West (Left), 90 is East (Right).
  return (relAz.value / 180) * svgWidth + svgWidth / 2
})

const targetY = computed(() => {
  if (props.altitude < 0) return horizonY + 30 // Below horizon
  return horizonY - (props.altitude / 90) * 160
})

const isVisible = computed(() => props.altitude > 0)
const isInView = computed(() => relAz.value >= -90 && relAz.value <= 90)

// ── FORMATTING ───────────────────────────────────────────────────────────────
const azimuthDisplay = computed(() => Math.round(props.azimuth))
const altitudeDisplay = computed(() => Math.round(props.altitude))

const quadrant = computed(() => {
  const az = props.azimuth
  if (az >= 0 && az < 90) return { label: 'North-East', id: 'Q1' }
  if (az >= 90 && az < 180) return { label: 'South-East', id: 'Q2' }
  if (az >= 180 && az < 270) return { label: 'South-West', id: 'Q3' }
  return { label: 'North-West', id: 'Q4' }
})
</script>

<template>
  <div class="relative w-full border border-hud-accent/20 rounded-2xl bg-black/40 overflow-hidden p-6 sm:p-10 bento-flicker">
    <div class="panel-grid-mesh opacity-10 absolute inset-0 pointer-events-none" />
    
    <!-- Status Bar -->
    <div class="relative z-10 flex justify-between items-center mb-8 border-b border-white/10 pb-4">
      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full bg-hud-accent shadow-[0_0_8px_var(--hud-accent)] animate-pulse" />
        <span class="font-mono text-[10px] text-hud-accent tracking-[0.3em] uppercase">LIVE_TELEMETRY_FEED</span>
      </div>
      <div class="font-mono text-[10px] text-white/40 uppercase tracking-widest">
        LAT: {{ lat.toFixed(2) }}° / HEMI: {{ hemisphere }}
      </div>
    </div>

    <!-- SVG Container -->
    <svg
      viewBox="0 0 400 300"
      class="relative z-10 w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--hud-accent)" stop-opacity="0.05" />
          <stop offset="100%" stop-color="transparent" />
        </linearGradient>
        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- The Sky Dome -->
      <path
        d="M 0 220 Q 200 -20 400 220"
        fill="url(#skyGrad)"
        stroke="var(--hud-accent)"
        stroke-width="0.5"
        stroke-dasharray="2 4"
        opacity="0.2"
      />

      <!-- Horizon Line -->
      <line x1="0" y1="220" x2="400" y2="220" stroke="var(--hud-accent)" stroke-width="1.5" />
      <g opacity="0.3">
        <line v-for="i in 11" :key="i" :x1="(i-1)*40" y1="220" :x2="(i-1)*40" y2="225" stroke="currentColor" stroke-width="1" />
      </g>

      <!-- Compass Labels -->
      <g class="font-mono text-[9px] fill-white/40 tracking-widest uppercase">
        <text x="5" y="240" text-anchor="start">
          {{ orientation.leftLabel }}
          <tspan x="5" dy="12" fill="var(--hud-accent)" font-weight="bold">[{{ orientation.leftType }}]</tspan>
        </text>
        <text x="200" y="240" text-anchor="middle" fill="white">
          {{ orientation.centerLabel }}
        </text>
        <text x="395" y="240" text-anchor="end">
          {{ orientation.rightLabel }}
          <tspan x="395" dy="12" fill="var(--hud-accent)" font-weight="bold">[{{ orientation.rightType }}]</tspan>
        </text>
      </g>

      <!-- The Moon Marker -->
      <g v-if="isInView">
        <!-- Vertical Projection -->
        <line
          :x1="targetX"
          y1="220"
          :x2="targetX"
          :y2="targetY"
          stroke="var(--hud-accent)"
          stroke-width="1"
          stroke-dasharray="4 2"
          opacity="0.4"
        />
        
        <!-- Target Bubble -->
        <circle
          :cx="targetX"
          :cy="targetY"
          r="10"
          fill="white"
          :class="{ 'animate-pulse': isVisible }"
          :opacity="isVisible ? 1 : 0.3"
          filter="url(#moonGlow)"
        />

        <!-- Annotation -->
        <g :transform="`translate(${targetX > 300 ? targetX - 100 : targetX + 15}, ${targetY})`">
          <rect x="0" y="-35" width="90" height="40" fill="black" fill-opacity="0.8" stroke="var(--hud-accent)" stroke-width="0.5" rx="4" />
          <text x="8" y="-22" class="font-mono text-[8px] fill-hud-accent font-bold uppercase">Target: LUNA</text>
          <text x="8" y="-10" class="font-mono text-[9px] fill-white uppercase tracking-tighter">
            {{ azimuthDisplay }}° AZ / {{ altitudeDisplay }}° ALT
          </text>
        </g>

        <!-- Under Horizon Label -->
        <text
          v-if="!isVisible"
          :x="targetX"
          y="265"
          text-anchor="middle"
          class="font-mono text-[9px] fill-red-400 uppercase font-black"
        >
          [STATUS: BELOW_HORIZON]
        </text>

      </g>

      <!-- Out of View Indicator -->
      <g v-else>
        <rect x="100" y="80" width="200" height="60" fill="rgba(255,0,0,0.05)" stroke="red" stroke-width="0.5" stroke-dasharray="4 4" rx="8" />
        <text x="200" y="105" text-anchor="middle" class="font-mono text-[10px] fill-red-400 font-black uppercase">TARGET_OUT_OF_FOV</text>
        <text x="200" y="125" text-anchor="middle" class="font-mono text-[8px] fill-white/60 uppercase">
          Moon is in the {{ quadrant.label }} sector ({{ azimuthDisplay }}°)
        </text>
        <path
          :d="relAz < 0 ? 'M40,150 L20,150 L30,140 M20,150 L30,160' : 'M360,150 L380,150 L370,140 M380,150 L370,160'"
          fill="none"
          stroke="var(--hud-accent)"
          stroke-width="2"
          class="animate-bounce"
        />
      </g>
    </svg>

    <!-- Detailed Explanation Footer -->
    <div class="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.03] p-6 border border-white/5 rounded-xl">
      <div class="space-y-3">
        <label class="font-mono text-[10px] text-hud-accent uppercase tracking-widest font-black">Azimuth Alignment</label>
        <p class="text-xs text-white/60 leading-relaxed uppercase">
          Currently looking <span class="text-white font-bold">{{ orientation.looking }}</span>. 
          The Moon is at <span class="text-hud-accent font-bold">{{ azimuthDisplay }}°</span>, which places it in the 
          <span class="text-white font-bold">{{ quadrant.label }}</span> sector. 
          {{ isInView ? 'Use the center point of the diagram to calibrate your heading.' : 'Rotate your position to align with the target sector.' }}
        </p>
      </div>
      <div class="space-y-3">
        <label class="font-mono text-[10px] text-hud-accent uppercase tracking-widest font-black">Altitude Calibration</label>
        <p class="text-xs text-white/60 leading-relaxed uppercase">
          The Moon's altitude is <span class="text-hud-accent font-bold">{{ altitudeDisplay }}°</span>. 
          <span v-if="isVisible">
            Measure #h#{{ Math.ceil(altitude / 10) }} fists UP#/h# from the horizon to find the center of the lunar disk.
          </span>
          <span v-else>
            Current coordinates are <span class="text-red-400/80 font-bold">below the horizon</span>. 
            Measure #h#{{ Math.ceil(Math.abs(altitude) / 10) }} fists DOWN#/h# from the horizon to locate its hidden position.
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-grid-mesh {
  background-image: radial-gradient(circle, var(--hud-accent) 0.5px, transparent 0.5px);
  background-size: 30px 30px;
}
</style>
