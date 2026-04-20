<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const {
  isLoading, distance, fraction, phaseName, apparentRotation,
  velocity, lightTravelTime, ra, dec, apparentDiameter,
  altitude, azimuth, zodiac, zodiacSymbol
} = useMoonData()

// ── DYNAMIC MATRIX RAINFALL ──────────────────────────────────────────────────
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

// ── CYPHER ANIMATION FOR "MOON" ──────────────────────────────────────────────
const moonWord = ref('moon.')
function cypherMoon() {
  const cypherSet = '!@#$%^&*()_+{}:"<>?|~'
  // 75% chance to be stable, 25% chance to glitch/scramble
  if (Math.random() > 0.25) {
    moonWord.value = 'moon.'
  } else {
    moonWord.value = Array(5).fill(0).map(() => cypherSet[Math.floor(Math.random() * cypherSet.length)]).join('')
  }
}

// ── TELEMETRY GLITCH LOGIC ──────────────────────────────────────────────────
const glitchMap = ref<Record<string, boolean>>({})
function triggerGlitch() {
  const keys = ['PHASE', 'ZODIAC', 'ORB_VEL', 'LT_DELAY']
  const target = keys[Math.floor(Math.random() * keys.length)]
  glitchMap.value[target] = true
  setTimeout(() => { glitchMap.value[target] = false }, 150)
}

const getGlitchedVal = (label: string, original: string) => {
  if (glitchMap.value[label]) {
    const symbols = '!@#$%^&*'
    return original.split('').map(() => symbols[Math.floor(Math.random() * symbols.length)]).join('')
  }
  return original
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
const telemetryRows = computed(() => {
  const ltSeconds = (lightTravelTime.value / 1000).toFixed(3)
  
  return [
    { id: 'PHA', label: 'PHASE', val: getGlitchedVal('PHASE', phaseName.value?.toUpperCase()), info: 'Current lunar illumination cycle', scale: 75 },
    { id: 'ZOD', label: 'ZODIAC', val: getGlitchedVal('ZODIAC', (zodiac.value + ' ' + zodiacSymbol.value).toUpperCase()), info: 'Lunar position in tropical zodiac', scale: 60 },
    { id: 'VEL', label: 'ORB_VEL', val: getGlitchedVal('ORB_VEL', Math.round(velocity.value * 3600).toLocaleString('en-GB') + ' KM/H'), info: 'Moon orbital speed around Earth', scale: 75 },
    { id: 'LT', label: 'LT_DELAY', val: getGlitchedVal('LT_DELAY', ltSeconds + ' SEC'), info: 'Time for light to reach Earth from Moon', scale: 92 }
  ]
})

onMounted(() => {
  if (!import.meta.client) return
  generateDeepWash()
  setInterval(generateDeepWash, 150)
  setInterval(cypherMoon, 80)
  setInterval(triggerGlitch, 2000)
  typeFactoid()

  // Rhythmic Spawner (HIGH DENSITY // RAPID)
  // Logic refactored into SharedGlitchSystem component
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden broken-terminal-jitter">
    
    <!-- 1. ADVANCED DIGITAL MATRIX WASH (Behind all layers) -->
    <div class="absolute inset-0 opacity-[0.7] select-none pointer-events-none bento-flicker overflow-hidden">
      <div class="font-mono text-[10px] text-hud-accent/30 whitespace-pre leading-[0.85] p-10">
        {{ dataWash.repeat(10) }}
      </div>
    </div>

    <ClientOnly>
      <SharedGlitchSystem :z-index="500" :density="5.0" :min-size="48" :max-size="120" />
    </ClientOnly>

    <!-- 2. "KNOW THY MOON" DASHBOARD CTA (Corrected Size + OS Style) -->
    <div class="absolute bottom-[20%] left-[5%] md:left-[8%] pointer-events-auto">
      <div class="panel-card p-10 md:p-14 rounded-3xl bento-flicker backdrop-blur-[30px] border-cyan-400/30 card-brackets shadow-[0_0_100px_rgba(0,242,255,0.05)]">
        <div class="panel-grid-mesh opacity-30" /><div class="panel-scanlines opacity-50" />
        
        <div class="terminal-dots absolute top-5 left-6">
          <span class="term-dot-1" /><span class="term-dot-2" /><span class="term-dot-3" />
        </div>

        <div class="relative z-10 pt-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-1.5 h-6 bg-hud-accent animate-pulse" />
            <label class="font-mono text-[13px] text-hud-accent tracking-[0.8em] uppercase opacity-70">SYST_HUD_v4.5</label>
          </div>
          
          <h1 class="font-orbitron font-black text-4xl md:text-7xl text-white tracking-[0.15em] uppercase leading-none mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            know thy <br> <span class="font-mono transition-colors duration-75" :class="moonWord === 'moon.' ? 'text-hud-accent' : 'text-red-600 animate-pulse'">{{ moonWord }}</span>
          </h1>
          
          <div class="font-mono text-[14px] text-hud-accent/50 tracking-[0.6em] uppercase border-t border-white/10 pt-8 flex items-center justify-between">
            <span>REAL_TIME_LINK_ACTIVE</span>
            <span class="text-[11px] animate-pulse">00:00:00:01</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. HIGH-VISIBLE TELEMETRY MATRIX (TOP-RIGHT) -->
    <div class="absolute top-[8%] right-[5%] lg:right-[10%] pointer-events-auto z-[80] space-y-8 min-w-[320px]">
      
      <!-- Calibration Header -->
      <div class="flex flex-col items-end gap-1 opacity-60">
        <div class="font-mono text-[12px] text-hud-accent tracking-[0.8em] uppercase">SYSTEM_QUANTUM_CALIBRATION</div>
        <div class="w-full h-[1px] bg-hud-accent/20" />
      </div>

      <!-- Telemetry Matrix -->
      <div class="space-y-6">
        <div 
          v-for="(row, i) in telemetryRows" 
          :key="row.label"
          class="flex flex-col items-end group transition-colors duration-150 mb-4"
          :style="{ animationDelay: `${i * 0.2}s` }"
        >
          <div class="font-mono text-[13px] text-hud-accent/60 uppercase tracking-widest mb-1">{{ row.info }}</div>
          <div class="flex items-baseline gap-4">
            <span class="font-mono text-[14px] uppercase tracking-[0.5em] transition-colors" :class="glitchMap[row.label] ? 'text-red-500' : 'text-hud-accent/50'">{{ row.label }}</span>
            <span 
              class="font-orbitron text-3xl lg:text-5xl font-black tracking-widest tabular-nums transition-all"
              :class="glitchMap[row.label] ? 'text-red-600 animate-pulse scale-105' : 'text-white'"
            >
              {{ isLoading ? 'SCAN...' : row.val }}
            </span>
          </div>
          <!-- Signal Scalar Meter -->
          <div class="w-48 h-1 bg-white/5 relative overflow-hidden flex items-center">
            <div 
              class="h-full transition-all duration-1000" 
              :class="glitchMap[row.label] ? 'bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'bg-hud-accent opacity-60'"
              :style="{ width: `${row.scale}%` }" 
            />
            <div class="absolute inset-0 bg-white/10 translate-x-[-100%] animate-scan" />
            <div class="absolute right-0 top-0 text-[7px] font-mono text-hud-accent/30 uppercase mr-[-24px]">{{ row.unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. BOTTOM-RIGHT FACTOID AR (Integrated Dash Style) -->
    <div class="absolute bottom-[10%] right-[10%] max-w-sm pointer-events-auto hidden md:block">
      <div class="panel-card p-6 rounded-xl border-white/5 bento-flicker backdrop-blur-md">
        <div class="panel-grid-mesh opacity-10" /><div class="panel-scanlines opacity-20" />
        <div class="relative z-10">
          <p class="font-mono text-[12px] text-hud-accent/60 tracking-[0.6em] uppercase mb-4 flex items-center justify-between">
            AR_ANNOTATION::INTEL
            <span class="w-2 h-2 rounded-full bg-hud-accent animate-pulse" />
          </p>
          <p class="font-orbitron text-[14px] text-white/70 tracking-wider leading-relaxed bg-black/20 p-4 border-l-2 border-hud-accent/40">
            {{ factoidText }}<span class="inline-block w-2 h-4 bg-hud-accent opacity-80 align-middle ml-1" />
          </p>
        </div>
      </div>
    </div>

    <!-- 5. HUD CALIBRATION RING (Center-Oriented around Moon) -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.2] pointer-events-none scale-150 bento-flicker">
      <svg width="400" height="400" viewBox="0 0 240 240" class="text-hud-accent">
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

.hexagon-sticky {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

/* New v2 Hexagon Glitches (SVG Spawner optimized) */
.hex-pop-anim {
  animation: glitch-instant-pop 0.35s forwards;
}
.hex-sticky-anim {
  animation: glitch-long-stick 10s forwards;
}

@keyframes glitch-instant-pop {
  0% { opacity: 0; transform: scale(0.6); }
  10% { opacity: 0.8; transform: scale(1.1); }
  20% { opacity: 0.2; transform: scale(0.9); }
  30% { opacity: 0.6; transform: scale(1.0); }
  100% { opacity: 0; transform: scale(1.2); }
}

@keyframes glitch-long-stick {
  0% { opacity: 0; transform: scale(0.9); }
  2% { opacity: 0.9; transform: scale(1.05); } /* Flash in */
  5%, 85% { opacity: 0.5; transform: scale(1); } /* Stick */
  100% { opacity: 0; transform: scale(1.1); }
}
</style>
