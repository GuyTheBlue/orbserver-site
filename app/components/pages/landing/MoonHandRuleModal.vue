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
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="show"
          class="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 pointer-events-auto"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-pointer"
            @click="emit('close')"
          />

          <!-- Modal Container -->
          <div class="relative w-full max-w-2xl max-h-[90vh] bg-[#020a14] border border-hud-accent/40 rounded-lg overflow-hidden flex flex-col shadow-[0_0_120px_rgba(0,0,0,1)] ring-1 ring-hud-accent/30">
            <!-- Header -->
            <div class="flex-none p-4 md:p-8 border-b border-hud-accent/20 bg-hud-accent/5 flex flex-col gap-6 z-20">
              <h3 class="font-orbitron font-black text-hud-accent tracking-[0.1em] sm:tracking-[0.2em] uppercase text-xl md:text-3xl leading-tight">
                LOCATING THE MOON // MANUAL TELEMETRY
              </h3>
              <button
                class="w-full py-4 rounded bg-hud-accent/10 border border-hud-accent/40 text-hud-accent font-orbitron text-xs sm:text-sm tracking-[0.4em] hover:bg-hud-accent hover:text-black transition-all duration-300 uppercase font-bold"
                @click="emit('close')"
              >
                CLOSE OVERLAY PROTOCOL
              </button>
            </div>

            <!-- Body -->
            <div class="relative flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-black/40">
              <div class="panel-grid-mesh opacity-10 absolute inset-0 pointer-events-none" />
              <div class="panel-scanlines opacity-40 absolute inset-0 pointer-events-none" />

              <div class="relative z-10 p-6 md:p-12 space-y-12 pb-24">
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
                  <section class="block w-full">
                    <div class="flex items-center gap-4 mb-8">
                      <div class="h-6 w-1 bg-hud-accent" />
                      <h4 class="font-orbitron font-black text-white text-xl sm:text-3xl tracking-wider uppercase">
                        {{ data.establishmentHeading.title }}
                      </h4>
                    </div>
                    <div class="space-y-8 text-left">
                      <p class="text-base sm:text-xl text-white/50 leading-relaxed">
                        {{ data.establishmentHeading.description }}
                      </p>
                      <div class="p-6 sm:p-10 border border-hud-accent/20 bg-hud-accent/5 rounded-xl">
                        <div class="flex items-center gap-3 mb-6">
                          <span class="w-2 h-2 rounded-full bg-hud-accent animate-pulse" />
                          <div class="h-[1px] flex-1 bg-hud-accent/10" />
                          <span class="font-mono text-[10px] text-hud-accent tracking-widest">{{ lat?.toFixed(2) ?? '0.00' }}°{{ lat >= 0 ? 'N' : 'S' }}</span>
                        </div>
                        <div class="space-y-6">
                          <p class="text-lg sm:text-2xl text-white font-bold leading-tight">
                            Target Sector: <span class="text-hud-accent uppercase">{{ lat >= 0 ? 'Southern' : 'Northern' }} Sky</span>
                          </p>
                          <div class="bg-black/60 p-6 rounded border border-white/5 font-mono">
                            <p class="text-[11px] text-hud-accent font-black tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
                              Non-Compass Orientation
                            </p>
                            <ul class="space-y-4 list-disc pl-6 text-sm sm:text-lg text-white/70 leading-relaxed text-left">
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
                  <section class="block w-full">
                    <div class="flex items-center gap-4 mb-8">
                      <div class="h-6 w-1 bg-hud-accent" />
                      <h4 class="font-orbitron font-black text-white text-xl sm:text-3xl tracking-wider uppercase">
                        {{ data.measureAltitude.title }}
                      </h4>
                    </div>
                    <p class="text-base sm:text-xl text-white/50 leading-relaxed">
                      {{ data.measureAltitude.description }}
                    </p>
                  </section>

                  <!-- Section 3: Protocol Steps -->
                  <section class="bg-hud-accent/5 p-6 sm:p-10 border border-hud-accent/30 rounded-xl">
                    <h5 class="text-xs sm:text-base text-hud-accent tracking-[0.4em] uppercase font-black mb-12 text-center">
                      EXECUTION_PROTOCOL // MANUAL_TRACKING
                    </h5>

                    <div class="flex flex-col gap-12 w-full text-left">
                      <div
                        v-for="(step, i) in data.steps"
                        :key="i"
                        class="flex flex-col w-full"
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
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(var(--hud-accent-rgb), 0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--hud-accent-rgb), 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--hud-accent-rgb), 0.5); }
</style>
