<template>
  <ClientOnly>
    <div class="min-h-screen bg-[#010810] text-white font-mono p-4 md:p-8 pt-24 md:pt-32 selection:bg-cyan-500/30">
      <!-- HUD Header -->
      <header class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-white/10 pb-6">
        <div class="broken-terminal-jitter">
          <h1 class="font-orbitron text-3xl font-black tracking-tighter text-hud-accent uppercase italic">
            Moon Lab <span class="text-white/20 not-italic font-light ml-2 text-xs">v4.0.2</span>
          </h1>
          <p class="text-[10px] uppercase tracking-[0.4em] text-white/40 mt-1">Experimental Lunar Rotation Simulator</p>
        </div>
        
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer group">
            <span class="text-[9px] uppercase tracking-widest text-white/40 group-hover:text-hud-accent transition-colors">Show Shadow</span>
            <div 
              @click="showShadow = !showShadow"
              class="w-10 h-5 border border-white/20 rounded-full relative transition-colors"
              :class="showShadow ? 'bg-hud-accent/20 border-hud-accent/50' : 'bg-white/5'"
            >
              <div 
                class="absolute top-1 w-2.5 h-2.5 rounded-full transition-all"
                :class="showShadow ? 'left-6 bg-hud-accent' : 'left-1 bg-white/20'"
              />
            </div>
          </label>

          <button 
            @click="handleReset"
            class="px-6 py-2 border border-hud-accent/30 bg-hud-accent/5 hover:bg-hud-accent/20 transition-all text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            [ Reset to Actual ]
          </button>
        </div>
      </header>

      <main class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <!-- Left Column: The Moon Visual -->
        <section class="lg:col-span-5 flex flex-col items-center">
          <div class="relative w-full aspect-square max-w-[420px] mb-8 group">
             <!-- Status indicator -->
             <div class="absolute -top-4 -left-4 z-20 px-3 py-1 bg-black border border-white/10 text-[9px] tracking-widest uppercase bento-flicker">
                Status: <span :class="isLoading ? 'text-yellow-400' : 'text-green-400'">{{ isLoading ? 'Calibrating' : 'Synced' }}</span>
             </div>

             <div class="panel-card p-8 rounded-full border-hud-accent/20 overflow-visible">
               <MoonPhase 
                 :fraction="fraction"
                 :phase="phase"
                 :texture-rotation="debugTextureRotation"
                 :limb-rotation="limbRotation"
                 :show-shadow="showShadow"
                 class="w-full h-full"
               />
             </div>

             <div v-if="isLoading" class="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-full">
                <span class="font-orbitron font-black text-hud-accent text-sm tracking-[0.5em] animate-pulse uppercase">Recalculating...</span>
             </div>
          </div>

          <div class="grid grid-cols-2 gap-4 w-full">
            <div class="p-5 border border-white/5 bg-white/[0.02] rounded-xl backdrop-blur-md">
              <label class="text-[9px] uppercase tracking-widest text-white/30 block mb-1">Texture Rot</label>
              <div class="font-orbitron text-2xl font-black text-hud-accent">{{ Math.round(textureRotation) }}°</div>
            </div>
            <div class="p-5 border border-white/5 bg-white/[0.02] rounded-xl backdrop-blur-md">
              <label class="text-[9px] uppercase tracking-widest text-white/30 block mb-1">Limb Rot</label>
              <div class="font-orbitron text-2xl font-black text-hud-accent">{{ Math.round(limbRotation) }}°</div>
            </div>
          </div>
        </section>

        <!-- Right Column: Controls & Data -->
        <section class="lg:col-span-7 space-y-12">
          <div class="panel-card p-1 overflow-hidden rounded-2xl">
            <table class="w-full text-left text-[11px] uppercase tracking-tighter">
              <thead>
                <tr class="border-b border-white/5 bg-white/[0.03]">
                  <th class="p-4 text-white/40 font-normal">Observer Metric</th>
                  <th class="p-4 font-bold text-white/60 text-center">Actual (GPS)</th>
                  <th class="p-4 font-bold text-hud-accent text-center" :class="{'opacity-30': !isOverridden}">Override</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 font-mono">
                <tr>
                  <td class="p-4 text-white/30">Latitude</td>
                  <td class="p-4 text-center">{{ actualLat.toFixed(4) }}°</td>
                  <td class="p-4 text-center text-hud-accent font-bold" :class="{'opacity-20': !isOverridden}">{{ simLat.toFixed(4) }}°</td>
                </tr>
                <tr>
                  <td class="p-4 text-white/30">Longitude</td>
                  <td class="p-4 text-center">{{ actualLng.toFixed(4) }}°</td>
                  <td class="p-4 text-center text-hud-accent font-bold" :class="{'opacity-20': !isOverridden}">{{ simLng.toFixed(4) }}°</td>
                </tr>
                <tr>
                  <td class="p-4 text-white/30">Time (Sim)</td>
                  <td class="p-4 text-center">{{ actualTime ? formatTime(actualTime) : '--:--' }}</td>
                  <td class="p-4 text-center text-hud-accent font-bold" :class="{'opacity-20': !isOverridden}">{{ formatMinutes(simTimeMinutes) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="showCalibration" class="p-6 border border-hud-accent/20 bg-hud-accent/5 rounded-2xl space-y-6">
            <div class="flex justify-between items-center">
              <label class="text-[10px] uppercase tracking-[0.4em] text-hud-accent font-bold">Manual Calibration</label>
              <button @click="showCalibration = false" class="text-[9px] text-white/40 uppercase tracking-widest">[ Close ]</button>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-end">
                <label class="text-[9px] uppercase tracking-widest text-white/40">Base Asset Offset</label>
                <span class="font-orbitron font-black text-sm text-hud-accent">{{ manualOffset }}°</span>
              </div>
              <input v-model.number="manualOffset" type="range" min="0" max="360" step="1" class="hud-slider" />
            </div>
          </div>

          <div class="space-y-10 p-10 panel-card rounded-2xl overflow-visible">
            <div class="panel-grid-mesh"></div>

            <div class="space-y-4 relative z-10">
              <div class="flex justify-between items-end">
                <label class="text-[10px] uppercase tracking-[0.4em] text-hud-accent font-bold">Latitude Override</label>
                <span class="font-orbitron font-black text-2xl text-white">{{ simLat.toFixed(1) }}°</span>
              </div>
              <input 
                v-model.number="localSimLat"
                type="range" min="-90" max="90" step="0.1"
                class="hud-slider"
                @input="handleOverride"
              />
            </div>

            <div class="space-y-4 relative z-10">
              <div class="flex justify-between items-end">
                <label class="text-[10px] uppercase tracking-[0.4em] text-hud-accent font-bold">Time Cycle (24H)</label>
                <span class="font-orbitron font-black text-2xl text-white">{{ formatMinutes(simTimeMinutes) }}</span>
              </div>
              <input 
                v-model.number="localSimTime"
                type="range" min="0" max="1439" step="1"
                class="hud-slider"
                @input="handleOverride"
              />
            </div>

            <div class="flex flex-wrap gap-3 relative z-10 pt-4">
              <button v-for="city in presets" :key="city.name" @click="applyPreset(city)" class="px-4 py-2 border border-white/10 bg-white/5 hover:border-hud-accent/40 hover:bg-hud-accent/10 transition-all text-[9px] uppercase tracking-widest font-bold rounded">
                {{ city.name }}
              </button>
              <button @click="showCalibration = !showCalibration" class="px-4 py-2 border border-white/5 bg-white/5 text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                [ Calibrate ]
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer class="max-w-6xl mx-auto mt-32 border-t border-white/5 pt-12 pb-24 text-[9px] text-white/20 uppercase tracking-[0.5em] leading-loose text-center">
        <div class="animate-footer-breathe">
          <p>Simulation Engine: SunCalc 1.9.0 // Local Calculation // Reactive watchEffect</p>
          <p class="mt-2 text-hud-accent/30">Observer Relative Telemetry // No Manual Flip</p>
        </div>
      </footer>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMoonData } from '../composables/useMoonData'
import { useObserverContext } from '../composables/useObserverContext'
import MoonPhase from '../components/shared/MoonPhase.vue'

const { fraction, phase, textureRotation, limbRotation, isLoading } = useMoonData()
const { actualLat, actualLng, actualTime, simLat, simLng, simTimeMinutes, isOverridden, setOverride, resetToActual } = useObserverContext()

const showShadow = ref(true)
const showCalibration = ref(false)
const manualOffset = ref(30)
const debugTextureRotation = computed(() => textureRotation.value + (manualOffset.value - 30))

const localSimLat = ref(simLat.value)
const localSimLng = ref(simLng.value)
const localSimTime = ref(simTimeMinutes.value)

watch([simLat, simLng, simTimeMinutes], () => {
  localSimLat.value = simLat.value
  localSimLng.value = simLng.value
  localSimTime.value = simTimeMinutes.value
})

const presets = [
  { name: 'Looe', lat: 50.3562, lng: -4.4552 },
  { name: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 }
]

function handleOverride() { setOverride(localSimLat.value, localSimLng.value, localSimTime.value) }
function applyPreset(city: any) { localSimLat.value = city.lat; localSimLng.value = city.lng; setOverride(city.lat, city.lng, localSimTime.value) }
function handleReset() { resetToActual(); manualOffset.value = 30 }
function formatTime(date: Date) { return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
function formatMinutes(totalMinutes: number) { return `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}:${(totalMinutes % 60).toString().padStart(2, '0')}` }

definePageMeta({ layout: false })
</script>

<style scoped>
@reference "../assets/css/main.css";

.hud-slider {
  appearance: none;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;
}

.hud-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--hud-accent);
  border-radius: 1px;
  box-shadow: 0 0 10px rgba(var(--hud-accent-rgb), 0.5);
  cursor: pointer;
  transition: transform 0.2s;
}

.hud-slider::-webkit-slider-thumb:hover {
  transform: scale(1.4);
}
</style>
