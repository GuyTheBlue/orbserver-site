<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const {
  isLoading, distance, fraction, phaseName, apparentRotation,
  velocity, lightTravelTime, ra, dec, apparentDiameter,
  altitude, azimuth
} = useMoonData()

// ── DYNAMIC MATRIX CODE RAINFALL (IMPRESSIVE DATA WASH) ──────────────────────
const dataWash = ref('')
const chars = '01ABCDEF#$@%&'
function generateDeepWash() {
  let wash = ''
  for (let i = 0; i < 30; i++) {
    let line = ''
    for (let j = 0; j < 50; j++) {
      line += Math.random() > 0.9 ? chars[Math.floor(Math.random() * chars.length)] : (Math.random() > 0.5 ? '0' : '1')
    }
    wash += line + '\n'
  }
  dataWash.value = wash
}

// ── TYPEWRITER & HUD FACTOIDS ──────────────────────────────────────────────
const factoidText = ref('')
const factoids = [
  "The moon is receding from Earth at a rate of 3.8cm per year. Our link monitors exact proximity in real-time.",
  "Formation theory: The Moon likely formed from a giant impact between Earth and a Mars-sized body named Theia.",
  "Apollo 11 mission: Neil Armstrong became the first human to step onto the lunar surface on 20 July 1969.",
  "Apollo 1 tragedy: A cabin fire during a pre-launch test killed three astronauts on 27 January 1967.",
  "Artemis mission: NASA's multi-decade initiative to return humans to the Moon and establish a permanent base.",
  "Lunar Age: The Moon is approximately 4.5 billion years old, nearly as old as Earth itself.",
  "Apollo 13: An oxygen tank explosion aborted the landing, but the crew returned safely against all odds."
]
let fIdx = 0; let fCharIdx = 0; let isDeleting = false

function typeFactoid() {
  const currentFact = factoids[fIdx]
  if (!isDeleting) {
    factoidText.value = currentFact.slice(0, fCharIdx++)
    if (fCharIdx > currentFact.length) {
      setTimeout(() => { isDeleting = true; typeFactoid() }, 6000)
      return
    }
    setTimeout(typeFactoid, 30)
  } else {
    factoidText.value = currentFact.slice(0, fCharIdx--)
    if (fCharIdx < 0) {
      isDeleting = false; fIdx = (fIdx + 1) % factoids.length; fCharIdx = 0
      setTimeout(typeFactoid, 800); return
    }
    setTimeout(typeFactoid, 15)
  }
}

// Telemetry Rows (High Visibility HUD)
const telemetryRows = computed(() => [
  { label: 'DISTANCE', val: distance.value?.toLocaleString('en-GB') + ' KM', unit: 'KM', scale: distance.value ? (distance.value / 406000) * 100 : 0 },
  { label: 'VELOCITY', val: Math.round(velocity.value).toLocaleString('en-GB'), unit: 'KM/H', scale: 75 },
  { label: 'LOC_COORD', val: `${altitude.value}° / ${azimuth.value}°`, unit: 'ALT/AZ', scale: 40 },
  { label: 'LIGHT_SPD', val: lightTravelTime.value?.toFixed(3), unit: 'SEC', scale: 92 }
])

onMounted(() => {
  if (!import.meta.client) return
  generateDeepWash()
  setInterval(generateDeepWash, 150) // High-speed digital jitter
  typeFactoid()
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden broken-terminal-jitter">
    
    <!-- 1. ADVANCED DIGITAL MATRIX WASH (Behind all layers) -->
    <div class="absolute inset-0 opacity-[0.06] select-none pointer-events-none bento-flicker overflow-hidden">
      <div class="font-mono text-[10px] text-cyan-400 whitespace-pre leading-[0.85] p-10">
        {{ dataWash.repeat(10) }}
      </div>
    </div>

    <!-- 2. "KNOW THY MOON" DASHBOARD CTA (Corrected Size + OS Style) -->
    <div class="absolute bottom-[20%] left-[5%] md:left-[8%] pointer-events-auto">
      <div class="panel-card p-10 md:p-14 rounded-3xl bento-flicker backdrop-blur-[30px] border-cyan-400/30 card-brackets shadow-[0_0_100px_rgba(0,242,255,0.05)]">
        <div class="panel-grid-mesh opacity-30" /><div class="panel-scanlines opacity-50" />
        
        <div class="terminal-dots absolute top-5 left-6">
          <span class="term-dot-1" /><span class="term-dot-2" /><span class="term-dot-3" />
        </div>

        <div class="relative z-10 pt-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-1.5 h-6 bg-cyan-400 animate-pulse" />
            <label class="font-mono text-[10px] text-cyan-400 tracking-[0.8em] uppercase opacity-70">SYST_HUD_v4.5</label>
          </div>
          
          <h1 class="font-orbitron font-black text-4xl md:text-7xl text-white tracking-[0.15em] uppercase leading-none mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            know thy <br> <span class="text-cyan-400">moon.</span>
          </h1>
          
          <div class="font-mono text-[11px] text-cyan-400/50 tracking-[0.6em] uppercase border-t border-cyan-400/10 pt-8 flex items-center justify-between">
            <span>REAL_TIME_LINK_ACTIVE</span>
            <span class="text-[8px] animate-pulse">00:00:00:01</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. HIGH-VISIBLE TELEMETRY MATRIX (TOP-RIGHT) -->
    <div class="absolute top-[8%] right-[5%] lg:right-[10%] pointer-events-auto z-[80] space-y-8 min-w-[320px]">
      
      <!-- Calibration Header -->
      <div class="flex flex-col items-end gap-1 opacity-60">
        <div class="font-mono text-[9px] text-cyan-400 tracking-[0.8em] uppercase">SYSTEM_QUANTUM_CALIBRATION</div>
        <div class="w-full h-[1px] bg-cyan-400/20" />
      </div>

      <!-- Telemetry Matrix -->
      <div class="space-y-6">
        <div 
          v-for="(row, i) in telemetryRows" 
          :key="row.label"
          class="flex flex-col items-end gap-2 group"
          :style="{ animationDelay: `${i * 0.2}s` }"
        >
          <div class="flex items-baseline gap-4">
            <span class="font-mono text-[9px] text-cyan-400/40 uppercase tracking-[0.5em]">{{ row.label }}</span>
            <span class="font-orbitron text-2xl lg:text-4xl text-white font-black tracking-widest tabular-nums drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
              {{ isLoading ? 'SCAN...' : row.val }}
            </span>
          </div>
          <!-- Signal Scalar Meter -->
          <div class="w-48 h-1 bg-white/5 relative overflow-hidden flex items-center">
            <div class="h-full bg-cyan-400 opacity-60 transition-all duration-1000" :style="{ width: `${row.scale}%` }" />
            <div class="absolute inset-0 bg-white/10 translate-x-[-100%] animate-scan" />
            <div class="absolute right-0 top-0 text-[7px] font-mono text-cyan-400/30 uppercase mr-[-24px]">{{ row.unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. BOTTOM-RIGHT FACTOID AR (Integrated Dash Style) -->
    <div class="absolute bottom-[10%] right-[10%] max-w-sm pointer-events-auto hidden md:block">
      <div class="panel-card p-6 rounded-xl border-cyan-400/10 bento-flicker backdrop-blur-md">
        <div class="panel-grid-mesh opacity-10" /><div class="panel-scanlines opacity-20" />
        <div class="relative z-10">
          <p class="font-mono text-[9px] text-cyan-400/60 tracking-[0.6em] uppercase mb-4 flex items-center justify-between">
            AR_ANNOTATION::INTEL
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </p>
          <p class="font-orbitron text-[11px] text-white/70 tracking-wider leading-relaxed bg-black/20 p-4 border-l-2 border-cyan-400/40">
            {{ factoidText }}<span class="inline-block w-2 h-4 bg-cyan-400 opacity-80 align-middle ml-1" />
          </p>
        </div>
      </div>
    </div>

    <!-- 5. HUD CALIBRATION RING (Center-Oriented around Moon) -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.2] pointer-events-none scale-150 bento-flicker">
      <svg width="400" height="400" viewBox="0 0 240 240" class="text-cyan-400">
        <circle cx="120" cy="120" r="115" fill="none" stroke="currentColor" stroke-width="0.2" stroke-dasharray="1 8" />
        <circle cx="120" cy="120" r="100" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="20 40" />
        <path d="M 120 10 L 120 20 M 120 220 L 120 230 M 10 120 L 20 120 M 220 120 L 230 120" stroke="currentColor" stroke-width="1" />
        <rect x="117" y="117" width="6" height="6" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-scan {
  animation: scan 3s linear infinite;
}
</style>
