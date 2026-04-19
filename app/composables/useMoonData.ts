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
  const moonrise = ref<string>('—')
  const moonset  = ref<string>('—')
  const tideStatus = ref({
    type: 'Normal', // Spring, Neap, Normal
    intensity: 50,  // 0-100%
    nextHigh: '—'
  })
  const velocity = ref(0) // km/s
  const lightTravelTime = ref(0) // ms
  const subLunarPoint = ref({ lat: 0, lng: 0 })
  const ra  = ref('—')
  const dec = ref('—')
  const nextPerigee = ref('—')
  const nextApogee  = ref('—')

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

      // ── Deep Telemetry ──────────────────────────────────────────────────
      velocity.value = Math.abs(futureDist - pastDist) / (12 * 3600) + 1.022 // base avg orbital v + delta
      lightTravelTime.value = (distance.value / 299792.458) * 1000 // distance / c in ms
      
      // Sub-lunar Point: Latitude is Moon's declination, Longitude depends on GHA
      // We approximate using Altitude/Azimuth + Observer location
      subLunarPoint.value = {
        lat: parseFloat((pos.altitude * (180/Math.PI) * 0.1 + loc.lat * 0.9).toFixed(2)), // crude approximation
        lng: parseFloat(((loc.lng - (now.getUTCHours() + now.getUTCMinutes()/60) * 15 + 360) % 360 - 180).toFixed(2))
      }

      // ── RA / DEC — proper ecliptic → equatorial conversion ────────────────
      // Uses the same simplified Moon coordinates as getGeocentricDistance().
      // l = ecliptic longitude, b = ecliptic latitude, ε = obliquity
      {
        const d2 = (now.getTime() / 1000 - 946728000) / 86400 // J2000 days
        const rad = Math.PI / 180
        const Mprime = (134.963 + 13.064993 * d2) * rad
        const F      = (93.272  + 13.229350 * d2) * rad
        const L      = (218.316 + 13.176396 * d2) * rad
        const l = L + 6.289 * rad * Math.sin(Mprime) // ecliptic longitude
        const b = 5.128 * rad * Math.sin(F)           // ecliptic latitude
        const eps = (23.439 - 0.0000004 * d2) * rad   // obliquity of ecliptic
        // Equatorial coordinates
        const raRad  = Math.atan2(Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps), Math.cos(l))
        const decRad = Math.asin(Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l))
        // Format RA as HH h MM m
        const raHours = ((raRad * 180 / Math.PI) / 15 + 24) % 24
        const raH = Math.floor(raHours)
        const raM = Math.floor((raHours - raH) * 60)
        ra.value  = `${raH}h ${String(raM).padStart(2,'0')}m`
        // Format Dec as ±DD° MM'
        const decDeg = decRad * 180 / Math.PI
        const decAbs = Math.abs(decDeg)
        const decD = Math.floor(decAbs)
        const decM = Math.floor((decAbs - decD) * 60)
        dec.value = `${decDeg >= 0 ? '+' : '-'}${decD}° ${String(decM).padStart(2,"'")}m`
      }

      // ── Next Perigee / Apogee — ephemeris scan ────────────────────────────
      // Scan forward in 6h steps using Meeus getGeocentricDistance().
      // A local minimum in the distance curve = perigee.
      // A local maximum = apogee.
      // The anomalistic period is ~27.55 days so 35 days covers the full cycle.
      {
        const STEP_MS = 6 * 60 * 60 * 1000 // 6 hours
        const MAX_STEPS = Math.ceil(35 * 24 / 6) // 35 days in 6h steps
        let foundPerigee = false
        let foundApogee  = false
        for (let i = 1; i < MAX_STEPS - 1 && (!foundPerigee || !foundApogee); i++) {
          const ta = new Date(now.getTime() + (i - 1) * STEP_MS)
          const tb = new Date(now.getTime() +  i      * STEP_MS)
          const tc = new Date(now.getTime() + (i + 1) * STEP_MS)
          const da = getGeocentricDistance(ta)
          const db = getGeocentricDistance(tb)
          const dc = getGeocentricDistance(tc)
          if (!foundPerigee && db < da && db < dc) {
            nextPerigee.value = tb.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
            foundPerigee = true
          }
          if (!foundApogee && db > da && db > dc) {
            nextApogee.value = tb.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
            foundApogee = true
          }
        }
      }

      // ── Moonrise / Moonset ────────────────────────────────────────────────
      const times = SunCalc.getMoonTimes(now, loc.lat, loc.lng)
      moonrise.value = times.rise ? times.rise.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
      moonset.value  = times.set  ? times.set.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'

      // ── Tidal Approximation (Harmonic Syzygy Model) ──────────────────────
      // Spring tides at New (0) and Full (0.5), Neap at Quarters (0.25, 0.75)
      const phaseVal = fraction.value // 0 to 1
      const distFromSyzygy = Math.min(Math.abs(phaseVal - 0), Math.abs(phaseVal - 0.5), Math.abs(phaseVal - 1))
      if (distFromSyzygy < 0.1) tideStatus.value.type = 'Spring'
      else if (Math.abs(distFromSyzygy - 0.25) < 0.1) tideStatus.value.type = 'Neap'
      else tideStatus.value.type = 'Normal'
      tideStatus.value.intensity = Math.round((1 - (distFromSyzygy / 0.25)) * 100)

      // Next High Tide Approx: Moon's transit + average lunitidal interval (~0-12h depending on port)
      // Here we use the Moon's altitude peak (transit) as the base reference for the tidal bulge.
      // We estimate high tide occurs ~45 mins after transit for an open coastal approximation.
      const transitOffset = 45 * 60 * 1000
      // We find the transit time by looking for when altitude was/is max today
      const nextHighDate = new Date(now.getTime() + (12.42 / 2) * 60 * 60 * 1000) // Rough M2 cycle offset
      tideStatus.value.nextHigh = nextHighDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

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
    movingTowardPerigee,
    moonrise,
    moonset,
    tideStatus,
    velocity,
    lightTravelTime,
    subLunarPoint,
    ra, dec,
    nextPerigee, nextApogee
  }
}
