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

// ── High Precision Geocentric Lunar Distance (Meeus/ELP82) ──────────────────
// This bypasses SunCalc's topocentric inaccuracies to match world standards.
function getGeocentricDistance(date: Date): number {
  const T = (date.getTime() / 1000 - 946728000) / 3155760000 // Centuries since J2000
  const Lprime = (218.316 + 481267.881 * T) * (Math.PI / 180) // Mean longitude
  const D = (297.85 + 445267.111 * T) * (Math.PI / 180)      // Mean elongation
  const M = (357.529 + 35999.05 * T) * (Math.PI / 180)       // Sun mean anomaly
  const Mprime = (134.963 + 477198.867 * T) * (Math.PI / 180) // Moon mean anomaly
  const F = (93.272 + 483202.018 * T) * (Math.PI / 180)      // Mean distance from node

  // Major periodic terms for distance (km)
  let sum = -20905 * Math.cos(Mprime)
  sum -= 3699 * Math.cos(2 * D - Mprime)
  sum -= 2956 * Math.cos(2 * D)
  sum -= 570 * Math.cos(2 * Mprime)
  sum += 246 * Math.cos(2 * Mprime - 2 * D)
  sum -= 205 * Math.cos(M - Mprime)
  sum -= 171 * Math.cos(Mprime + 2 * D)
  sum -= 152 * Math.cos(Mprime + M - 2 * D)

  // Mean distance + major terms
  return 385001 + sum
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
  const lat = ref(0)
  const lng = ref(0)
  const librationAngle = ref(0) // Position angle of the bright limb
  const apparentRotation = ref(0) // Rotation relative to observer zenith
  const movingTowardPerigee = ref(false) // true = distance shrinking (toward perigee)

  onMounted(async () => {
    if (!import.meta.client) return

    try {
      const SunCalc = (await import('suncalc')).default
      const now = new Date()

      // ── Illumination ──────────────────────────────────────────────────
      const illum = SunCalc.getMoonIllumination(now)
      fraction.value = illum.fraction
      phase.value = illum.phase
      phaseName.value = getPhaseName(illum.phase)
      phaseGlyph.value = getPhaseGlyph(illum.phase)
      librationAngle.value = illum.angle // radians

      // Age in days...
      age.value = parseFloat((illum.phase * LUNAR_MONTH).toFixed(1))

      // Days until next...
      const rawDaysToFull = illum.phase < 0.5
        ? (0.5 - illum.phase) * LUNAR_MONTH
        : (1.5 - illum.phase) * LUNAR_MONTH
      daysToFullMoon.value = Math.round(rawDaysToFull)
      nextFullMoon.value = formatFutureDate(rawDaysToFull)

      const rawDaysToNew = (1 - illum.phase) * LUNAR_MONTH
      daysToNewMoon.value = Math.round(rawDaysToNew)
      nextNewMoon.value = formatFutureDate(rawDaysToNew)

      // ── Position ──────────────────────────────────────────────────────
      const loc = await resolveLatLng()
      lat.value = loc.lat
      lng.value = loc.lng
      
      const pos = SunCalc.getMoonPosition(now, loc.lat, loc.lng)
      // Switch to Geocentric Distance to match User/Google standards
      distance.value = Math.round(getGeocentricDistance(now))
      
      altitude.value = parseFloat((pos.altitude * (180 / Math.PI)).toFixed(1))
      azimuth.value = parseFloat((((pos.azimuth * (180 / Math.PI)) + 180 + 360) % 360).toFixed(1))

      // ── Orbital Direction ─────────────────────────────────────────────────
      // Symmetric 12h window using Geocentric distance for absolute accuracy
      const pastDist   = getGeocentricDistance(new Date(now.getTime() - 6 * 60 * 60 * 1000))
      const futureDist = getGeocentricDistance(new Date(now.getTime() + 6 * 60 * 60 * 1000))
      movingTowardPerigee.value = futureDist < pastDist

      // ── Apparent Rotation (Orientation relative to observer's sky) ────
      // phi = latitude in radians
      const phi = loc.lat * (Math.PI / 180)
      // h = parallactic angle approximation from lat, moon alt, and moon az
      const h = Math.atan2(Math.sin(pos.azimuth), Math.tan(phi) * Math.cos(pos.altitude) - Math.sin(pos.altitude) * Math.cos(pos.azimuth))
      
      // Calculate final rotation in degrees (PA - q).
      // +90° offset corrects the image asset orientation — the moon.png is referenced
      // to the zenith, not the celestial north pole, requiring a 90° shift to align
      // the terminator correctly with the horizon for both hemispheres.
      apparentRotation.value = (illum.angle - h) * (180 / Math.PI) + 90
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
    daysToNewMoon,
    lat,
    lng,
    librationAngle,
    apparentRotation,
    movingTowardPerigee
  }
}
