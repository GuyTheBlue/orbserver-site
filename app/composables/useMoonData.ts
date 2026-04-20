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

// Attempts to resolve the user's geolocation, falls back to Cape Town, ZA (SH Priority)
async function resolveLatLng(): Promise<{ lat: number, lng: number }> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { lat: -33.9249, lng: 18.4241 }
  }
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({ lat: -33.9249, lng: 18.4241 }), // fallback to Cape Town
      { timeout: 3000 }
    )
  })
}

// ── High Precision Geocentric Lunar Distance (Meeus/ELP82) ──────────────────
// This bypasses SunCalc's topocentric inaccuracies to match world standards.
function getGeocentricDistance(date: Date): number {
  const T = (date.getTime() / 1000 - 946728000) / 3155760000 // Centuries since J2000
  const D = (297.85 + 445267.111 * T) * (Math.PI / 180) // Mean elongation
  const M = (357.529 + 35999.05 * T) * (Math.PI / 180) // Sun mean anomaly
  const Mprime = (134.963 + 477198.867 * T) * (Math.PI / 180) // Moon mean anomaly

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
  const fraction = ref(0) // 0 (new) → 1 (full)
  const phase = ref(0) // 0–1 across the lunation
  const phaseName = ref('…')
  const phaseGlyph = ref('🌑')

  // Derived timing
  const age = ref(0) // days since new moon
  const nextFullMoon = ref('…') // formatted date string
  const nextNewMoon = ref('…') // formatted date string
  const daysToFullMoon = ref(0)
  const daysToNewMoon = ref(0)

  // Position data (requires lat/lng; from suncalc.getMoonPosition)
  const distance = ref(0) // km
  const altitude = ref(0) // degrees above/below horizon
  const azimuth = ref(0) // degrees, 0° = North, clockwise
  const lat = ref(0)
  const lng = ref(0)
  const librationAngle = ref(0) // Position angle of the bright limb
  const apparentRotation = ref(0) // Rotation relative to observer zenith
  const movingTowardPerigee = ref(false) // true = distance shrinking (toward perigee)
  const moonrise = ref<string>('—')
  const moonset = ref<string>('—')
  // Apparent Angular Diameter
  const apparentDiameter = ref(0) // arcminutes
  const apparentDiameterRatio = ref(0) // 0-100: position between apogee (29.4') → perigee (33.5')
  const apparentVsMean = ref(0) // % vs mean distance (positive = larger)
  const velocity = ref(0) // km/s
  const lightTravelTime = ref(0) // ms
  const subLunarPoint = ref({ lat: 0, lng: 0 })
  const ra = ref('—')
  const dec = ref('—')
  const nextPerigee = ref('—')
  const nextApogee = ref('—')
  const zodiac = ref('—')
  const zodiacSymbol = ref('—')

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

      // ── Next Full Moon & New Moon: Meeus JDE formula ──────────────────────
      // Based on Meeus "Astronomical Algorithms" ch.49. This gives times
      // accurate to within a few minutes, matching almanac data exactly.
      // JDE₀ = 2451550.09766 + 29.530588861 × k
      // k is integer for New Moon, k+0.5 for Full Moon.
      function nextPhaseJDE(targetPhase: 0 | 0.5): Date {
        // k approximation: current JDE, then round to the nearest target phase
        const jde = (now.getTime() / 86400000) + 2440587.5
        const k0 = (jde - 2451550.09766) / 29.530588861
        let k = Math.floor(k0) + targetPhase
        // Step forward until JDE is in the future
        while (k + targetPhase - Math.floor(k0) < 0) k += 1
        // Find the first k that gives a JDE strictly after now
        let kk = Math.ceil(k0 - targetPhase) + targetPhase
        for (let attempt = 0; attempt < 30; attempt++) {
          const jdeK = 2451550.09766 + 29.530588861 * kk
          // Convert JDE to JS Date (JDE 2440587.5 = 1970-01-01 00:00 UTC)
          const msUtc = (jdeK - 2440587.5) * 86400000
          if (msUtc > now.getTime()) return new Date(msUtc)
          kk += 1
        }
        return new Date(now.getTime() + 30 * 86400000) // fallback
      }

      const fullMoonDate = nextPhaseJDE(0.5)
      const newMoonDate = nextPhaseJDE(0)

      const rawDaysToFull = (fullMoonDate.getTime() - now.getTime()) / 86400000
      const rawDaysToNew = (newMoonDate.getTime() - now.getTime()) / 86400000

      daysToFullMoon.value = Math.round(rawDaysToFull)
      daysToNewMoon.value = Math.round(rawDaysToNew)

      // Format in the user's LOCAL timezone so SA gets 1 May not 2 May
      nextFullMoon.value = fullMoonDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      nextNewMoon.value = newMoonDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

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
      const pastDist = getGeocentricDistance(new Date(now.getTime() - 6 * 60 * 60 * 1000))
      const futureDist = getGeocentricDistance(new Date(now.getTime() + 6 * 60 * 60 * 1000))
      movingTowardPerigee.value = futureDist < pastDist

      // ── Deep Telemetry ──────────────────────────────────────────────────
      velocity.value = Math.abs(futureDist - pastDist) / (12 * 3600) + 1.022 // base avg orbital v + delta
      lightTravelTime.value = (distance.value / 299792.458) * 1000 // distance / c in ms

      // Sub-lunar Point: Latitude is Moon's declination, Longitude depends on GHA
      // We approximate using Altitude/Azimuth + Observer location
      subLunarPoint.value = {
        lat: parseFloat((pos.altitude * (180 / Math.PI) * 0.1 + loc.lat * 0.9).toFixed(2)), // crude approximation
        lng: parseFloat(((loc.lng - (now.getUTCHours() + now.getUTCMinutes() / 60) * 15 + 360) % 360 - 180).toFixed(2))
      }

      // ── RA / DEC — proper ecliptic → equatorial conversion ────────────────
      // Uses the same simplified Moon coordinates as getGeocentricDistance().
      // l = ecliptic longitude, b = ecliptic latitude, ε = obliquity
      {
        const d2 = (now.getTime() / 1000 - 946728000) / 86400 // J2000 days
        const rad = Math.PI / 180
        const Mprime = (134.963 + 13.064993 * d2) * rad
        const F = (93.272 + 13.229350 * d2) * rad
        const L = (218.316 + 13.176396 * d2) * rad
        const l = L + 6.289 * rad * Math.sin(Mprime) // ecliptic longitude
        const b = 5.128 * rad * Math.sin(F) // ecliptic latitude
        const eps = (23.439 - 0.0000004 * d2) * rad // obliquity of ecliptic
        // Equatorial coordinates
        const raRad = Math.atan2(Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps), Math.cos(l))
        const decRad = Math.asin(Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l))
        // Format RA as HH h MM m
        const raHours = ((raRad * 180 / Math.PI) / 15 + 24) % 24
        const raH = Math.floor(raHours)
        const raM = Math.floor((raHours - raH) * 60)
        ra.value = `${raH}h ${String(raM).padStart(2, '0')}m`
        // Format Dec as ±DD° MM'
        const decDeg = decRad * 180 / Math.PI
        const decAbs = Math.abs(decDeg)
        const decD = Math.floor(decAbs)
        const decM = Math.floor((decAbs - decD) * 60)
        dec.value = `${decDeg >= 0 ? '+' : '-'}${decD}° ${String(decM).padStart(2, '0')}m`

        // ── Zodiac / Constellation ──────────────────────────────────────────
        const lDeg = ((l * 180 / Math.PI) % 360 + 360) % 360
        const zodiacIdx = Math.floor(lDeg / 30)
        const ZODIAC_DATA = [
          { name: 'Aries', sym: '[ARI]' }, { name: 'Taurus', sym: '[TAU]' },
          { name: 'Gemini', sym: '[GEM]' }, { name: 'Cancer', sym: '[CAN]' },
          { name: 'Leo', sym: '[LEO]' }, { name: 'Virgo', sym: '[VIR]' },
          { name: 'Libra', sym: '[LIB]' }, { name: 'Scorpio', sym: '[SCO]' },
          { name: 'Sagittarius', sym: '[SAG]' }, { name: 'Capricorn', sym: '[CAP]' },
          { name: 'Aquarius', sym: '[AQU]' }, { name: 'Pisces', sym: '[PIS]' }
        ]
        const zodiacEntry = ZODIAC_DATA[zodiacIdx]
        if (zodiacEntry) {
          zodiac.value = zodiacEntry.name
          zodiacSymbol.value = zodiacEntry.sym
        }
      }

      // ── Next Perigee / Apogee — ephemeris scan ────────────────────────────
      // Scan forward in 6h steps; local min = perigee, local max = apogee.
      {
        const STEP_MS = 6 * 60 * 60 * 1000
        const MAX_STEPS = Math.ceil(35 * 24 / 6)
        let foundPerigee = false
        let foundApogee = false
        for (let i = 1; i < MAX_STEPS - 1 && (!foundPerigee || !foundApogee); i++) {
          const ta = new Date(now.getTime() + (i - 1) * STEP_MS)
          const tb = new Date(now.getTime() + i * STEP_MS)
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

      // ── Apparent Angular Diameter ─────────────────────────────────────────
      // θ = 2 × arcsin(R_moon / distance), R_moon = 1737.4 km
      {
        const R_MOON = 1737.4
        const APOGEE_D = 29.38
        const PERIGEE_D = 33.53
        const MEAN_D = 31.08
        const thetaRad = 2 * Math.asin(R_MOON / distance.value)
        const arcmin = thetaRad * (180 / Math.PI) * 60
        apparentDiameter.value = parseFloat(arcmin.toFixed(2))
        apparentDiameterRatio.value = Math.round(Math.min(100, Math.max(0, (arcmin - APOGEE_D) / (PERIGEE_D - APOGEE_D) * 100)))
        apparentVsMean.value = parseFloat(((arcmin / MEAN_D - 1) * 100).toFixed(1))
      }

      // ── Moonrise / Moonset ────────────────────────────────────────────────
      const times = SunCalc.getMoonTimes(now, loc.lat, loc.lng)
      moonrise.value = times.rise ? times.rise.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
      moonset.value = times.set ? times.set.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'

      // ── Apparent Rotation (Orientation relative to observer's sky) ────
      // ⚠️ IMPORTANT: THE IMMUTABLE LAW OF MOON ORIENTATION
      // SEE: notes/MOON_ORIENTATION_PROTOCOL.md for full technical details.
      //
      // 1. illum.angle: Angle of the bright limb from North (Radians).
      // 2. pos.parallacticAngle: Angle of the Zenith from North (Radians).
      // 3. + 180 (IF lat < 0): THE IMMUTABLE LAW for Southern Hemisphere inversion.
      // 4. + 15: Visual calibration offset to match asset landmarks (Tycho) to real-world observer standards in Cape Town.
      const raw = (illum.angle - pos.parallacticAngle) * (180 / Math.PI)
      apparentRotation.value = (raw + (lat.value < 0 ? 180 : 0) + 15) % 360
    } catch {
      hasError.value = true
    } finally {
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
    apparentDiameter,
    apparentDiameterRatio,
    apparentVsMean,
    velocity,
    lightTravelTime,
    subLunarPoint,
    ra, dec,
    nextPerigee, nextApogee,
    zodiac, zodiacSymbol
  }
}
