// composables/useMoonData.ts
// All calculations run client-side only via suncalc.
// Guarded by import.meta.client to prevent any SSR execution.
import { ref, onMounted } from 'vue'

// The standard 29.53-day synodic lunar month
const LUNAR_MONTH = 29.530588853

// Maps suncalc's 0–1 phase value to a Northern Hemisphere phase name
function getPhaseName(phase: number): string {
  if (phase < 0.0625 || phase >= 0.9375) return 'New Moon'
  if (phase < 0.1875) return 'Waxing Crescent'
  if (phase < 0.3125) return 'First Quarter'
  if (phase < 0.4375) return 'Waxing Gibbous'
  if (phase < 0.5625) return 'Full Moon'
  if (phase < 0.6875) return 'Waning Gibbous'
  if (phase < 0.8125) return 'Last Quarter'
  return 'Waning Crescent'
}

// Returns an emoji glyph matching the current phase for display
function getPhaseGlyph(phase: number): string {
  if (phase < 0.0625 || phase >= 0.9375) return '🌑'
  if (phase < 0.1875) return '🌒'
  if (phase < 0.3125) return '🌓'
  if (phase < 0.4375) return '🌔'
  if (phase < 0.5625) return '🌕'
  if (phase < 0.6875) return '🌖'
  if (phase < 0.8125) return '🌗'
  return '🌘'
}

// Formats a future date offset (in days) from now as "14 April 2026"
function formatFutureDate(daysFromNow: number): string {
  const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Attempts to resolve the user's geolocation, falls back to Greenwich, London
async function resolveLatLng(): Promise<{ lat: number, lng: number }> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { lat: 51.4779, lng: -0.0015 }
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: 51.4779, lng: -0.0015 }), // silent fallback to Greenwich
      { timeout: 3000 }
    )
  })
}

export function useMoonData() {
  const isLoading = ref(true)
  const hasError = ref(false)

  // Core illumination data (from suncalc.getMoonIllumination)
  const fraction = ref(0)   // 0 (new) → 1 (full)
  const phase = ref(0)      // 0–1 across the lunation
  const phaseName = ref('…')
  const phaseGlyph = ref('🌑')

  // Derived timing
  const age = ref(0)              // days since new moon
  const nextFullMoon = ref('…')   // formatted date string
  const nextNewMoon = ref('…')    // formatted date string
  const daysToFullMoon = ref(0)
  const daysToNewMoon = ref(0)

  // Position data (requires lat/lng; from suncalc.getMoonPosition)
  const distance = ref(0)   // km
  const altitude = ref(0)   // degrees above/below horizon
  const azimuth = ref(0)    // degrees, 0° = North, clockwise

  onMounted(async () => {
    if (!import.meta.client) return

    try {
      // Dynamic import keeps suncalc out of the SSR bundle entirely
      const SunCalc = (await import('suncalc')).default
      const now = new Date()

      // ── Illumination ──────────────────────────────────────────────────
      const illum = SunCalc.getMoonIllumination(now)
      fraction.value = illum.fraction
      phase.value = illum.phase
      phaseName.value = getPhaseName(illum.phase)
      phaseGlyph.value = getPhaseGlyph(illum.phase)

      // Age in days through the lunation (0 = new moon, ~14.76 = full moon)
      age.value = parseFloat((illum.phase * LUNAR_MONTH).toFixed(1))

      // Days until next events (derived from phase position in the cycle)
      // Full moon is at phase 0.5; if past it, next is 1.5 – phase away
      const rawDaysToFull = illum.phase < 0.5
        ? (0.5 - illum.phase) * LUNAR_MONTH
        : (1.5 - illum.phase) * LUNAR_MONTH
      daysToFullMoon.value = Math.round(rawDaysToFull)
      nextFullMoon.value = formatFutureDate(rawDaysToFull)

      // New moon is at phase 0/1 boundary
      const rawDaysToNew = (1 - illum.phase) * LUNAR_MONTH
      daysToNewMoon.value = Math.round(rawDaysToNew)
      nextNewMoon.value = formatFutureDate(rawDaysToNew)

      // ── Position ──────────────────────────────────────────────────────
      const { lat, lng } = await resolveLatLng()
      const pos = SunCalc.getMoonPosition(now, lat, lng)

      distance.value = Math.round(pos.distance)
      altitude.value = parseFloat((pos.altitude * (180 / Math.PI)).toFixed(1))

      // suncalc azimuth is measured from south, clockwise; convert to compass bearing
      azimuth.value = parseFloat((((pos.azimuth * (180 / Math.PI)) + 180 + 360) % 360).toFixed(1))
    }
    catch {
      hasError.value = true
    }
    finally {
      isLoading.value = false
    }
  })

  return {
    isLoading,
    hasError,
    fraction,
    phase,
    phaseName,
    phaseGlyph,
    age,
    distance,
    altitude,
    azimuth,
    nextFullMoon,
    nextNewMoon,
    daysToFullMoon,
    daysToNewMoon
  }
}
