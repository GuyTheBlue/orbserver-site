<script setup lang="ts">
import { useTitleParser } from '~/composables/useTitleParser'

interface HandRuleStep {
  title: string
  desc: string
}

interface HandRuleData {
  intro: string
  establishmentHeading: {
    title: string
    description: string
  }
  measureAltitude: {
    title: string
    description: string
  }
  steps: HandRuleStep[]
}

defineProps<{
  show: boolean
  lat: number
  data: HandRuleData
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <UModal 
    :open="show" 
    @update:open="(val) => { if (!val) emit('close') }"
    class="bg-[#020a14] border border-hud-accent/40 shadow-[0_0_120px_rgba(0,0,0,1)] ring-1 ring-hud-accent/30 overflow-hidden"
    :ui="{ 
      content: 'p-0', 
      header: 'p-4 md:p-8',
      overlay: 'backdrop-blur-md bg-black/60'
    }"
  >
    <!-- Header -->
    <template #header>
      <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <h3 class="font-orbitron font-black text-hud-accent tracking-[0.1em] sm:tracking-[0.2em] uppercase text-xl md:text-3xl leading-tight">
            LOCATING THE MOON // MANUAL TELEMETRY
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            class="rounded-full text-hud-accent cursor-pointer"
            @click="emit('close')"
          />
        </div>
        <UButton
          block
          color="neutral"
          variant="subtle"
          class="py-4 border border-hud-accent/40 text-hud-accent font-orbitron text-xs sm:text-sm tracking-[0.4em] uppercase font-bold cursor-pointer"
          @click="emit('close')"
        >
          CLOSE OVERLAY PROTOCOL
        </UButton>
      </div>
    </template>

    <!-- Body -->
    <template #body>
      <div class="relative flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-black/40 max-h-[60vh] -m-4 md:-m-6">
        <div class="panel-grid-mesh opacity-10 absolute inset-0 pointer-events-none" />
        <div class="panel-scanlines opacity-40 absolute inset-0 pointer-events-none" />

        <div class="relative z-10 p-6 md:p-12 space-y-12 pb-24 text-left">
          <p class="text-lg sm:text-2xl text-hud-accent/80 leading-relaxed italic border-b border-hud-accent/10 pb-10">
            <template
              v-for="part in useTitleParser(data.intro)"
              :key="part.id"
            >
              <span
                v-if="part.type === 'highlight'"
                class="text-white drop-shadow-[0_0_8px_white]"
              >{{ part.content }}</span>
              <span v-else>{{ part.content }}</span>
            </template>
          </p>

          <div class="flex flex-col gap-16">
            <!-- Section 1: Azimuth -->
            <section class="block w-full text-left">
              <div class="flex items-center gap-4 mb-8">
                <div class="h-6 w-1 bg-hud-accent" />
                <h4 class="font-orbitron font-black text-white text-xl sm:text-3xl tracking-wider uppercase">
                  {{ data.establishmentHeading.title }}
                </h4>
              </div>
              <div class="space-y-8">
                <p class="text-base sm:text-xl text-white/50 leading-relaxed">
                  {{ data.establishmentHeading.description }}
                </p>
                <div class="p-6 sm:p-10 border border-hud-accent/20 bg-hud-accent/5 rounded-xl text-left">
                  <div class="flex items-center gap-3 mb-6">
                    <span class="w-2 h-2 rounded-full bg-hud-accent animate-pulse" />
                    <div class="h-[1px] flex-1 bg-hud-accent/10" />
                    <span class="font-mono text-[10px] text-hud-accent tracking-widest">{{ lat?.toFixed(2) ?? '0.00' }}°{{ lat >= 0 ? 'N' : 'S' }}</span>
                  </div>
                  <div class="space-y-6">
                    <p class="text-lg sm:text-2xl text-white font-bold leading-tight">
                      Target Sector: <span class="text-hud-accent uppercase">{{ lat >= 0 ? 'Southern' : 'Northern' }} Sky</span>
                    </p>
                    <div class="bg-black/60 p-6 rounded border border-white/5 font-mono text-left">
                      <p class="text-[11px] text-hud-accent font-black tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
                        Non-Compass Orientation
                      </p>
                      <ul class="space-y-4 list-disc pl-6 text-sm sm:text-lg text-white/70 leading-relaxed">
                        <li>Identify where the <span class="text-white">Sunset</span> point was today (West).</li>
                        <li>Stand with the sunset point on your <span class="text-hud-accent font-bold">{{ lat >= 0 ? 'Right' : 'Left' }}</span> shoulder.</li>
                        <li>You are now facing <span class="text-white font-bold">{{ lat >= 0 ? 'South (180°)' : 'North (0°)' }}</span>.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 2: Altitude -->
            <section class="block w-full text-left">
              <div class="flex items-center gap-4 mb-8">
                <div class="h-6 w-1 bg-hud-accent" />
                <h4 class="font-orbitron font-black text-white text-xl sm:text-3xl tracking-wider uppercase">
                  {{ data.measureAltitude.title }}
                </h4>
              </div>
              <p class="text-base sm:text-xl text-white/50 leading-relaxed text-left">
                {{ data.measureAltitude.description }}
              </p>

              <!-- Technical Illustration -->
              <div class="relative w-full max-w-lg mx-auto py-12 px-6 border border-hud-accent/10 rounded-2xl bg-hud-accent/[0.02]">
                <div class="panel-grid-mesh opacity-10 absolute inset-0 rounded-2xl" />
                <svg
                  viewBox="0 0 400 300"
                  class="w-full h-auto text-hud-accent"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="beamGrad"
                      x1="0%"
                      y1="100%"
                      x2="0%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stop-color="currentColor"
                        stop-opacity="0.2"
                      />
                      <stop
                        offset="100%"
                        stop-color="currentColor"
                        stop-opacity="0.05"
                      />
                    </linearGradient>
                  </defs>

                  <!-- Ground / Horizon -->
                  <line
                    x1="40"
                    y1="260"
                    x2="360"
                    y2="260"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-dasharray="4 4"
                    opacity="0.3"
                  />
                  <text
                    x="40"
                    y="275"
                    font-family="monospace"
                    font-size="8"
                    fill="currentColor"
                    opacity="0.5"
                  >REF_HORIZON // 000°_ALT</text>

                  <!-- The "Ladder" Beam -->
                  <rect
                    x="180"
                    y="60"
                    width="40"
                    height="200"
                    fill="url(#beamGrad)"
                  />

                  <!-- Fist 1 (10 deg) -->
                  <g opacity="0.8">
                    <rect
                      x="185"
                      y="215"
                      width="30"
                      height="40"
                      rx="4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <text
                      x="225"
                      y="240"
                      font-family="monospace"
                      font-size="10"
                      fill="currentColor"
                    >+ 10°</text>
                  </g>

                  <!-- Fist 2 (20 deg) -->
                  <g opacity="0.8">
                    <rect
                      x="185"
                      y="170"
                      width="30"
                      height="40"
                      rx="4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <text
                      x="225"
                      y="195"
                      font-family="monospace"
                      font-size="10"
                      fill="currentColor"
                    >+ 20°</text>
                  </g>

                  <!-- Fist 3 (30 deg) -->
                  <g class="animate-pulse">
                    <rect
                      x="185"
                      y="125"
                      width="30"
                      height="40"
                      rx="4"
                      fill="currentColor"
                      fill-opacity="0.1"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <text
                      x="225"
                      y="150"
                      font-family="monospace"
                      font-size="10"
                      fill="currentColor"
                      font-weight="bold"
                    >+ 30° [TARGET]</text>
                  </g>

                  <!-- Callouts -->
                  <path
                    d="M185 235 L120 235"
                    stroke="currentColor"
                    stroke-width="0.5"
                    opacity="0.4"
                  />
                  <text
                    x="60"
                    y="235"
                    font-family="monospace"
                    font-size="7"
                    fill="currentColor"
                    opacity="0.6"
                  >FIST_BASE_SYNC</text>

                  <path
                    d="M215 125 L280 80"
                    stroke="currentColor"
                    stroke-width="0.5"
                    opacity="0.4"
                  />
                  <text
                    x="285"
                    y="75"
                    font-family="monospace"
                    font-size="7"
                    fill="white"
                    opacity="0.8"
                  >LUNAR_INTERSECT</text>

                  <!-- The Moon circle -->
                  <circle
                    cx="215"
                    cy="125"
                    r="6"
                    fill="white"
                    class="animate-pulse"
                  />
                </svg>
                <p class="mt-6 text-center text-[10px] text-hud-accent/40 font-mono tracking-[0.4em] uppercase">
                  Fig_01 // Angular_Altitude_Ladder
                </p>
              </div>
            </section>

            <!-- Section 3: Protocol Steps -->
            <section class="bg-hud-accent/5 p-6 sm:p-10 border border-hud-accent/30 rounded-xl text-left">
              <h5 class="text-xs sm:text-base text-hud-accent tracking-[0.4em] uppercase font-black mb-12 text-center">
                EXECUTION_PROTOCOL // MANUAL_TRACKING
              </h5>

              <div class="flex flex-col gap-12 w-full">
                <div
                  v-for="(step, i) in data.steps"
                  :key="i"
                  class="flex flex-col w-full text-left"
                >
                  <div class="h-[1px] w-full bg-hud-accent/30 mb-8" />
                  <div class="font-orbitron font-black text-hud-accent text-sm sm:text-xl tracking-[0.4em] mb-4">
                    {{ (i + 1).toString().padStart(2, '0') }}
                  </div>
                  <div class="text-2xl sm:text-4xl text-white font-black uppercase tracking-widest mb-4 leading-tight">
                    {{ step.title }}
                  </div>
                  <div class="text-base sm:text-xl text-white/50 leading-relaxed font-medium">
                    <template
                      v-for="part in useTitleParser(step.desc)"
                      :key="part.id"
                    >
                      <span
                        v-if="part.type === 'highlight'"
                        class="text-white drop-shadow-[0_0_8px_white]"
                      >{{ part.content }}</span>
                      <span v-else>{{ part.content }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(var(--hud-accent-rgb), 0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--hud-accent-rgb), 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--hud-accent-rgb), 0.5); }
</style>
