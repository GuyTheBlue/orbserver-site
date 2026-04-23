<script setup lang="ts">
import { computed } from 'vue'
import { useTitleParser } from '~/composables/useTitleParser'
import MoonManualTelemetryDiagram from './MoonManualTelemetryDiagram.vue'

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
  azimuthManual: {
    north: string
    south: string
    equator: string
  }
  quadrants: {
    q1: string
    q2: string
    q3: string
    q4: string
  }
}

const props = defineProps<{
  show: boolean
  lat: number
  azimuth: number
  altitude: number
  data: HandRuleData
}>()

const quadrantLabel = computed(() => {
  const az = props.azimuth
  if (az >= 0 && az < 90) return props.data.quadrants.q1
  if (az >= 90 && az < 180) return props.data.quadrants.q2
  if (az >= 180 && az < 270) return props.data.quadrants.q3
  return props.data.quadrants.q4
})

const hemisphereManualText = computed(() => {
  if (props.lat > 5) return props.data.azimuthManual.north
  if (props.lat < -5) return props.data.azimuthManual.south
  return props.data.azimuthManual.equator
})

const orientationGuide = computed(() => {
  if (props.lat > 5) return 'Stand with the sunset point on your #h#Right#/h# shoulder.'
  if (props.lat < -5) return 'Stand with the sunset point on your #h#Left#/h# shoulder.'
  return 'Align with the #h#East-West#/h# axis (Sunset/Sunrise).'
})

const targetSky = computed(() => {
  if (props.lat > 5) return 'Southern Sky'
  if (props.lat < -5) return 'Northern Sky'
  return 'Zenith Sector'
})

const targetBearing = computed(() => {
  if (props.lat > 5) return 'South (180°)'
  if (props.lat < -5) return 'North (0°)'
  return 'Optimal Bearing (Live)'
})

const emit = defineEmits(['close'])
</script>

<template>
  <UModal 
    :open="show" 
    @update:open="(val) => { if (!val) emit('close') }"
    :ui="{ 
      content: 'p-0 sm:p-0 bg-transparent shadow-none ring-0 border-0 max-w-4xl w-full',
      overlay: 'backdrop-blur-md bg-black/60'
    }"
  >
    <template #content>
      <div class="bg-[#020a14] border border-hud-accent/40 shadow-[0_0_120px_rgba(0,0,0,1)] ring-1 ring-hud-accent/30 overflow-hidden relative rounded-xl flex flex-col max-h-[90vh]">
        <!-- Broken OS Aesthetic Overlays -->
        <div class="absolute inset-0 opacity-20 scanline-overlay pointer-events-none z-0" />
        <div class="absolute inset-0 opacity-10 grid-overlay pointer-events-none z-0" />

        <!-- Header -->
        <div class="p-4 md:p-8 border-b border-white/5 relative z-20">
          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h3 class="font-orbitron font-black text-hud-accent tracking-[0.1em] sm:tracking-[0.2em] uppercase text-xl md:text-3xl leading-tight">
                LOCATING THE MOON // MANUAL TELEMETRY
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                class="rounded-full text-hud-accent cursor-pointer hover:bg-white/10"
                @click="emit('close')"
              />
            </div>
            <UButton
              block
              color="neutral"
              variant="subtle"
              class="py-4 border border-hud-accent/40 text-hud-accent font-orbitron text-xs sm:text-sm tracking-[0.4em] uppercase font-bold cursor-pointer hover:bg-hud-accent/10"
              @click="emit('close')"
            >
              CLOSE OVERLAY PROTOCOL
            </UButton>
          </div>
        </div>

        <!-- Body -->
        <div class="relative flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-black/40 z-10">
          <div class="relative z-10 p-6 md:p-12 space-y-12 pb-24 text-left bento-flicker">
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
              <!-- Azimuth Section -->
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
                        Target Sector: <span class="text-hud-accent uppercase">{{ targetSky }}</span>
                      </p>
                      <p class="text-base sm:text-xl text-white/70">
                        <template v-for="part in useTitleParser(hemisphereManualText)" :key="part.id">
                          <span v-if="part.type === 'highlight'" class="text-hud-accent font-bold">{{ part.content }}</span>
                          <span v-else>{{ part.content }}</span>
                        </template>
                      </p>
                      <div class="bg-black/60 p-6 rounded border border-white/5 font-mono text-left">
                        <p class="text-[11px] text-hud-accent font-black tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
                          Non-Compass Orientation
                        </p>
                        <ul class="space-y-4 list-disc pl-6 text-sm sm:text-lg text-white/70 leading-relaxed">
                          <li>Identify where the <span class="text-white">Sunset</span> point was today (West).</li>
                          <li>
                            <template v-for="part in useTitleParser(orientationGuide)" :key="part.id">
                              <span v-if="part.type === 'highlight'" class="text-hud-accent font-bold">{{ part.content }}</span>
                              <span v-else>{{ part.content }}</span>
                            </template>
                          </li>
                          <li>You are now facing <span class="text-white font-bold">{{ targetBearing }}</span>.</li>
                          <li class="pt-2 border-t border-white/5">
                            Active Target: <span class="text-hud-accent">{{ quadrantLabel }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Altitude Section -->
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
                <MoonManualTelemetryDiagram
                  :lat="lat"
                  :azimuth="azimuth"
                  :altitude="altitude"
                />
              </section>

              <!-- Protocol Steps -->
              <section class="bg-hud-accent/5 p-6 sm:p-10 border border-hud-accent/30 rounded-xl text-left">
                <h5 class="text-xs sm:text-base text-hud-accent tracking-[0.4em] uppercase font-black mb-12 text-center">
                  EXECUTION_PROTOCOL // MANUAL_TRACKING
                </h5>
                <div class="flex flex-col gap-12 w-full">
                  <div v-for="(step, i) in data.steps" :key="i" class="flex flex-col w-full text-left">
                    <div class="h-[1px] w-full bg-hud-accent/30 mb-8" />
                    <div class="font-orbitron font-black text-hud-accent text-sm sm:text-xl tracking-[0.4em] mb-4">
                      {{ (i + 1).toString().padStart(2, '0') }}
                    </div>
                    <div class="text-2xl sm:text-4xl text-white font-black uppercase tracking-widest mb-4 leading-tight">
                      {{ step.title }}
                    </div>
                    <div class="text-base sm:text-xl text-white/50 leading-relaxed font-medium">
                      <template v-for="part in useTitleParser(step.desc)" :key="part.id">
                        <span v-if="part.type === 'highlight'" class="text-white drop-shadow-[0_0_8px_white]">{{ part.content }}</span>
                        <span v-else>{{ part.content }}</span>
                      </template>
                    </div>
                  </div>
                </div>
              </section>
            </div>
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
