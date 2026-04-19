<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const { isLoading, distance, fraction, phaseName, apparentRotation } = useMoonData()

// ── Command Line Animation ───────────────────────────────────────────────────
const termText = ref('')
const termLines = [
  'ESTABLISHING SECURE_LINK...',
  'SCANNING LUNAR_SURFACE...',
  'DECODING TELEMETRY_STREAM...',
  'PROTOCOL 001 ACTIVE.'
]
let lineIdx = 0
let charIdx = 0

function typeStep() {
  if (lineIdx >= termLines.length) {
    setTimeout(() => { lineIdx = 0; charIdx = 0; termText.value = ''; typeStep() }, 8000)
    return
  }
  const currentLine = termLines[lineIdx]
  if (charIdx < currentLine.length) {
    termText.value += currentLine[charIdx++]
    setTimeout(typeStep, 30)
  } else {
    setTimeout(() => {
      termText.value += '\n'
      lineIdx++
      charIdx = 0
      typeStep()
    }, 600)
  }
}

// ── Factoid Typewriter Animation ─────────────────────────────────────────────
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
let fIdx = 0
let fCharIdx = 0
let isDeleting = false

function typeFactoid() {
  const currentFact = factoids[fIdx]

  if (!isDeleting) {
    factoidText.value = currentFact.slice(0, fCharIdx++)
    if (fCharIdx > currentFact.length) {
      setTimeout(() => { isDeleting = true; typeFactoid() }, 4000)
      return
    }
    setTimeout(typeFactoid, 20)
  } else {
    factoidText.value = currentFact.slice(0, fCharIdx--)
    if (fCharIdx < 0) {
      isDeleting = false
      fIdx = (fIdx + 1) % factoids.length
      fCharIdx = 0
      setTimeout(typeFactoid, 500)
      return
    }
    setTimeout(typeFactoid, 10)
  }
}

onMounted(() => {
  if (!import.meta.client) return
  typeStep()
  setTimeout(typeFactoid, 1500)
})

// ── Dynamic Hero HUD Stats ──────────────────────────────────────────────────
const stats = computed(() => {
  if (isLoading.value) return [
    { label: 'Status', value: 'SCANNING', scatter: -10 },
    { label: 'Signal', value: 'LOCKING', scatter: 15 }
  ]

  const meanDist = 384400
  const baseSpeed = 3683
  const currentSpeed = Math.round(baseSpeed * (1 + ((meanDist - distance.value) / meanDist) * 1.5)).toLocaleString('en-GB')

  return [
    { label: 'DIST_KM', value: distance.value.toLocaleString('en-GB'), scatter: -10 },
    { label: 'PHASE_ANG', value: phaseName.value.toUpperCase(), scatter: 15 },
    { label: 'VEL_KMH', value: currentSpeed, scatter: -5 },
    { label: 'APP_ROT', value: `${Math.round(apparentRotation.value)}°`, scatter: 22 }
  ]
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <!-- Top-Left: OS Command Line Overlay -->
    <div class="absolute top-[8%] left-[5%] pointer-events-auto max-w-xs bento-flicker">
      <div class="font-mono text-[10px] text-cyan-400 opacity-60 flex flex-col gap-1 uppercase tracking-widest whitespace-pre">
        <div class="flex gap-1.5 mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>System: Active</span>
        </div>
        {{ termText }}<span class="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse align-middle ml-1" />
      </div>
    </div>

    <!-- Center-Left: Primary CTA Protocol -->
    <div class="absolute bottom-[25%] left-[5%] md:left-[8%] pointer-events-auto">
      <div class="panel-card p-8 md:p-10 rounded-2xl bento-flicker max-w-md">
        <div class="panel-grid-mesh opacity-30" /><div class="panel-scanlines opacity-20" />
        <!-- Terminal Dots (Mac Style) -->
        <div class="terminal-dots absolute top-4 left-4">
          <span class="term-dot-1" /><span class="term-dot-2" /><span class="term-dot-3" />
        </div>

        <div class="relative z-10 pt-4">
          <label class="font-mono text-[9px] text-cyan-400/60 tracking-[0.6em] uppercase block mb-4">HUD_INIT_SEQUENCE</label>
          <h1
            class="font-orbitron font-black text-4xl md:text-6xl text-white tracking-[0.2em] uppercase leading-none mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          >
            know thy <span class="text-cyan-400">moon.</span>
          </h1>
          <p class="text-[11px] text-cyan-400/50 font-mono tracking-[0.4em] uppercase border-t border-white/5 pt-6">
            Real-time orbital intelligence.
          </p>
        </div>
      </div>
    </div>

    <!-- Right: Telemetry AR Overlay -->
    <div class="absolute top-[12%] right-[5%] pointer-events-auto z-[70]">
      <div class="flex flex-col gap-4">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="panel-card px-6 py-5 rounded-xl bento-flicker animate-floating shadow-2xl min-w-[200px]"
          :style="{ 'animationDelay': `${i * 0.4}s`, '--scatter-x': `${stat.scatter}px` }"
        >
          <div class="panel-grid-mesh opacity-20" /><div class="panel-scanlines" />
          <div class="terminal-dots absolute top-3 left-4 scale-75">
            <span class="term-dot-1" /><span class="term-dot-2" /><span class="term-dot-3" />
          </div>

          <div class="relative z-10 pt-3 text-right">
            <p class="text-[8px] text-cyan-400 font-mono uppercase tracking-[0.4em] mb-1 opacity-70">
              {{ stat.label }}
            </p>
            <p class="text-2xl md:text-3xl text-white font-orbitron font-black tracking-widest leading-none">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating AR Factoid (Annotations on Reality) -->
    <div class="absolute bottom-[10%] right-[10%] max-w-sm pointer-events-auto hidden lg:block min-h-[80px]">
      <div class="relative pl-6 py-4 border-l border-cyan-400/30 bento-flicker">
        <div class="absolute -left-1 top-0 w-2 h-2 bg-cyan-400" />
        <div class="absolute -left-1 bottom-0 w-2 h-2 bg-cyan-400" />
        <p class="font-mono text-[9px] text-cyan-400 tracking-[0.5em] uppercase mb-1">AR_ANNOTATION::THOUGHT</p>
        <p class="font-orbitron text-xs text-white/50 tracking-wider leading-relaxed">
          {{ factoidText }}<span class="inline-block w-1.5 h-3 bg-cyan-400 opacity-50 ml-1 animate-pulse" />
        </p>
      </div>
    </div>

    <!-- HUD Crosshair (Subtle AR focus) -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
      <svg width="200" height="200" viewBox="0 0 200 200" class="text-cyan-400">
        <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="10 200" />
        <path d="M 100 10 L 100 30 M 100 170 L 100 190 M 10 100 L 30 100 M 170 100 L 190 100" fill="none" stroke="currentColor" stroke-width="1" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.animate-floating {
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translate(var(--scatter-x, 0px), 0px) rotate(0deg); }
  50% { transform: translate(calc(var(--scatter-x, 0px) - 10px), -20px) rotate(0.2deg); }
  100% { transform: translate(var(--scatter-x, 0px), 0px) rotate(0deg); }
}
</style>
