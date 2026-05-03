// composables/useObserverContext.ts
import { ref, computed } from 'vue'

const FALLBACK_LAT = -33.9249
const FALLBACK_LNG = 18.4241

// Shared singleton state
const actualLat = ref(FALLBACK_LAT)
const actualLng = ref(FALLBACK_LNG)
const actualTime = ref<Date | null>(null) // Null for SSR safety

const simLat = ref(FALLBACK_LAT)
const simLng = ref(FALLBACK_LNG)
const simTimeMinutes = ref(0)

const isOverridden = ref(false)
const locationStatus = ref<'ACQUIRING' | 'SYNCED' | 'FALLBACK'>('ACQUIRING')

const effectiveLat = computed(() => isOverridden.value ? simLat.value : actualLat.value)
const effectiveLng = computed(() => isOverridden.value ? simLng.value : actualLng.value)

const effectiveTime = computed((): Date => {
  if (!isOverridden.value) return actualTime.value || new Date()
  const d = new Date()
  d.setHours(Math.floor(simTimeMinutes.value / 60), simTimeMinutes.value % 60, 0, 0)
  return d
})

let _geoInitialized = false

function initGeolocation(): Promise<void> {
  if (_geoInitialized || !import.meta.client) return Promise.resolve()
  _geoInitialized = true

  // Set initial "actual" time on client mount to avoid hydration mismatch
  actualTime.value = new Date()
  simTimeMinutes.value = actualTime.value.getHours() * 60 + actualTime.value.getMinutes()

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      locationStatus.value = 'FALLBACK'
      resolve()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationStatus.value = 'SYNCED'
        actualLat.value = pos.coords.latitude
        actualLng.value = pos.coords.longitude
        simLat.value = pos.coords.latitude
        simLng.value = pos.coords.longitude
        resolve()
      },
      () => {
        locationStatus.value = 'FALLBACK'
        resolve()
      },
      { timeout: 5000, enableHighAccuracy: false }
    )
  })
}

function setOverride(lat: number, lng: number, timeMinutes: number) {
  simLat.value = lat
  simLng.value = lng
  simTimeMinutes.value = timeMinutes
  isOverridden.value = true
}

function resetToActual() {
  isOverridden.value = false
  if (import.meta.client) actualTime.value = new Date()
}

export function useObserverContext() {
  return {
    actualLat, actualLng, actualTime,
    simLat, simLng, simTimeMinutes,
    isOverridden, locationStatus,
    effectiveLat, effectiveLng, effectiveTime,
    initGeolocation, setOverride, resetToActual,
  }
}
