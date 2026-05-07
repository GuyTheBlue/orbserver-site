// composables/useMoonData.ts
// All calculations run client-side only via suncalc.
// Guarded by import.meta.client to prevent any SSR execution.
//
// ── SINGLETON + REACTIVE PATTERN ─────────────────────────────────────────────
// All moon telemetry state is module-level (shared by all consumers).
// useMoonData() reads lat/lng/time from useObserverContext, so the Moon Lab
// page can override those values and this composable reacts automatically.
import { ref, watchEffect, onMounted } from 'vue'
import { calculateLunarRotation } from '../utils/lunarRotation'
import { useObserverContext } from './useObserverContext'

// The standard 29.53-day synodic lunar month
const LUNAR_MONTH = 29.530588853

// Maps suncalc's 0–1 phase value to a Northern Hemisphere phase name
function getPhaseName(phase: number): string {
  if (phase < 0.02 || phase >= 0.98) return 'New Moon'
  if (phase < 0.23) return 'Waxing Crescent'
  if (phase < 0.27) return 'First Quarter'
  if (phase < 0.48) return 'Waxing Gibbous'
  if (phase < 0.52) return 'Full Moon'
  if (phase < 0.73) return 'Waning Gibbous'
  if (phase < 0.77) return 'Last Quarter'
  return 'Waning Crescent'
}

// Returns an emoji glyph matching the current phase for display
function getPhaseGlyph(phase: number): string {
  if (phase < 0.02 || phase >= 0.98) return '🌑'
  if (phase < 0.23) return '🌒'
  if (phase < 0.27) return '🌓'
  if (phase < 0.48) return '🌔'
  if (phase < 0.52) return '🌕'
  if (phase < 0.73) return '🌖'
  if (phase < 0.77) return '🌗'
  return '🌘'
}

// ── High Precision Geocentric Lunar Distance (Meeus/ELP82) ──────────────────
function getGeocentricDistance(date: Date): number {
  const T = (date.getTime() / 1000 - 946728000) / 3155760000
  const D = (297.85 + 445267.111 * T) * (Math.PI / 180)
  const M = (357.529 + 35999.05 * T) * (Math.PI / 180)
  const Mprime = (134.963 + 477198.867 * T) * (Math.PI / 180)
  let sum = -20905 * Math.cos(Mprime)
  sum -= 3699 * Math.cos(2 * D - Mprime)
  sum -= 2956 * Math.cos(2 * D)
  sum -= 570 * Math.cos(2 * Mprime)
  sum += 246 * Math.cos(2 * Mprime - 2 * D)
  sum -= 205 * Math.cos(M - Mprime)
  sum -= 171 * Math.cos(Mprime + 2 * D)
  sum -= 152 * Math.cos(Mprime + M - 2 * D)
  return 385001 + sum
}

// ── Next full/new moon — pure function, no closures ──────────────────────────
function nextPhaseJDE(now: Date, targetPhase: 0 | 0.5): Date {
  const jde = (now.getTime() / 86400000) + 2440587.5
  const k0 = (jde - 2451550.09766) / 29.530588861
  let kk = Math.ceil(k0 - targetPhase) + targetPhase
  for (let attempt = 0; attempt < 30; attempt++) {
    const jdeK = 2451550.09766 + 29.530588861 * kk
    const msUtc = (jdeK - 2440587.5) * 86400000
    if (msUtc > now.getTime()) return new Date(msUtc)
    kk += 1
  }
  return new Date(now.getTime() + 30 * 86400000)
}

// ── IAU constellation boundaries ─────────────────────────────────────────────
function getConstellation(long: number): string {
  if (long < 28.5) return 'Pisces'
  if (long < 53.5) return 'Aries'
  if (long < 90.3) return 'Taurus'
  if (long < 118.1) return 'Gemini'
  if (long < 138.2) return 'Cancer'
  if (long < 173.9) return 'Leo'
  if (long < 218.0) return 'Virgo'
  if (long < 241.0) return 'Libra'
  if (long < 247.7) return 'Scorpio'
  if (long < 266.6) return 'Ophiuchus'
  if (long < 300.0) return 'Sagittarius'
  if (long < 327.9) return 'Capricorn'
  if (long < 352.0) return 'Aquarius'
  return 'Pisces'
}

// ── SunCalc module cache ──────────────────────────────────────────────────────
// Import the library once; all subsequent calls use the cached promise.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sunCalcPromise: Promise<any> | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSunCalc(): Promise<any> {
  if (!_sunCalcPromise) {
    _sunCalcPromise = import('suncalc').then(m => m.default)
  }
  return _sunCalcPromise
}

// ── Shared singleton moon telemetry state ────────────────────────────────────
// lat, lng, locationStatus are NOT stored here — they live in useObserverContext.
// This composable exposes them as pass-throughs so the component API is unchanged.

const isLoading = ref(true)
const hasError = ref(false)

const fraction = ref(0)
const phase = ref(0)
const phaseName = ref('…')
const phaseGlyph = ref('🌑')

const age = ref(0)
const nextFullMoon = ref('…')
const nextNewMoon = ref('…')
const daysToFullMoon = ref(0)
const daysToNewMoon = ref(0)

const distance = ref(0)
const altitude = ref(0)
const azimuth = ref(0)
const librationAngle = ref(0)
const textureRotation = ref(0)
const limbRotation = ref(0)
const movingTowardPerigee = ref(false)
const moonrise = ref<string>('—')
const moonset = ref<string>('—')
const apparentDiameter = ref(0)
const apparentDiameterRatio = ref(0)
const apparentVsMean = ref(0)
const velocity = ref(0)
const lightTravelTime = ref(0)
const subLunarPoint = ref({ lat: 0, lng: 0 })
const ra = ref('—')
const dec = ref('—')
const nextPerigee = ref('—')
const nextApogee = ref('—')
const zodiac = ref('—')
const zodiacSymbol = ref('—')
const constellation = ref('—')

// ── watchEffect guard ─────────────────────────────────────────────────────────
// The reactive calculation is registered once; subsequent useMoonData() calls
// from other components find it already running and skip registration.
let _watchEffectRegistered = false

export function useMoonData() {
  const {
    effectiveLat,
    effectiveLng,
    effectiveTime,
    locationStatus,
    initGeolocation
  } = useObserverContext()

  onMounted(async () => {
    if (!import.meta.client) return

    // Resolve geolocation first (no-op if already done)
    await initGeolocation()

    // Register the reactive calculation exactly once for the app lifetime
    if (_watchEffectRegistered) return
    _watchEffectRegistered = true

    watchEffect(async () => {
      // ── Read ALL reactive dependencies BEFORE the first await ──────────
      // Vue tracks these synchronously; changing any one re-triggers the effect.
      const lat = effectiveLat.value
      const lng = effectiveLng.value
      const now = effectiveTime.value

      isLoading.value = true
      hasError.value = false

      try {
        // SunCalc loads from cache after the first call (~instant)
        const SunCalc = await getSunCalc()

        // ── Illumination ────────────────────────────────────────────────
        const illum = SunCalc.getMoonIllumination(now)
        fraction.value = illum.fraction
        phase.value = illum.phase
        phaseName.value = getPhaseName(illum.phase)
        phaseGlyph.value = getPhaseGlyph(illum.phase)
        librationAngle.value = illum.angle

        age.value = parseFloat((illum.phase * LUNAR_MONTH).toFixed(1))

        // ── Next Full Moon & New Moon ────────────────────────────────────
        const fullMoonDate = nextPhaseJDE(now, 0.5)
        const newMoonDate = nextPhaseJDE(now, 0)
        daysToFullMoon.value = Math.round((fullMoonDate.getTime() - now.getTime()) / 86400000)
        daysToNewMoon.value = Math.round((newMoonDate.getTime() - now.getTime()) / 86400000)
        nextFullMoon.value = fullMoonDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        nextNewMoon.value = newMoonDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

        // ── Moon Position ────────────────────────────────────────────────
        const pos = SunCalc.getMoonPosition(now, lat, lng)
        distance.value = Math.round(getGeocentricDistance(now))
        altitude.value = parseFloat((pos.altitude * (180 / Math.PI)).toFixed(1))
        azimuth.value = parseFloat((((pos.azimuth * (180 / Math.PI)) + 180 + 360) % 360).toFixed(1))

        // ── Orbital Direction ────────────────────────────────────────────
        const pastDist = getGeocentricDistance(new Date(now.getTime() - 6 * 60 * 60 * 1000))
        const futureDist = getGeocentricDistance(new Date(now.getTime() + 6 * 60 * 60 * 1000))
        movingTowardPerigee.value = futureDist < pastDist

        // ── Deep Telemetry ───────────────────────────────────────────────
        velocity.value = Math.abs(futureDist - pastDist) / (12 * 3600) + 1.022
        lightTravelTime.value = (distance.value / 299792.458) * 1000

        subLunarPoint.value = {
          lat: parseFloat((pos.altitude * (180 / Math.PI) * 0.1 + lat * 0.9).toFixed(2)),
          lng: parseFloat(((lng - (now.getUTCHours() + now.getUTCMinutes() / 60) * 15 + 360) % 360 - 180).toFixed(2))
        }

        // ── RA / DEC ─────────────────────────────────────────────────────
        {
          const d2 = (now.getTime() / 1000 - 946728000) / 86400
          const rad = Math.PI / 180
          const Mp = (134.963 + 13.064993 * d2) * rad
          const F = (93.272 + 13.229350 * d2) * rad
          const L = (218.316 + 13.176396 * d2) * rad
          const l = L + 6.289 * rad * Math.sin(Mp)
          const b = 5.128 * rad * Math.sin(F)
          const eps = (23.439 - 0.0000004 * d2) * rad
          const raRad = Math.atan2(Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps), Math.cos(l))
          const decRad = Math.asin(Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l))
          const raHours = ((raRad * 180 / Math.PI) / 15 + 24) % 24
          const raH = Math.floor(raHours)
          const raM = Math.floor((raHours - raH) * 60)
          ra.value = `${raH}h ${String(raM).padStart(2, '0')}m`
          const decDeg = decRad * 180 / Math.PI
          const decAbs = Math.abs(decDeg)
          const decD = Math.floor(decAbs)
          const decM = Math.floor((decAbs - decD) * 60)
          dec.value = `${decDeg >= 0 ? '+' : '-'}${decD}° ${String(decM).padStart(2, '0')}m`

          // ── Zodiac ─────────────────────────────────────────────────────
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

          // ── Constellation ──────────────────────────────────────────────
          constellation.value = getConstellation(lDeg)
        }

        // ── Next Perigee / Apogee — 35-day ephemeris scan ────────────────
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

        // ── Apparent Angular Diameter ─────────────────────────────────────
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

        // ── Moonrise / Moonset ────────────────────────────────────────────
        const times = SunCalc.getMoonTimes(now, lat, lng)
        moonrise.value = times.rise ? times.rise.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
        moonset.value = times.set ? times.set.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'

        // ── Rotation — driven by the effective lat, not a hardcoded value ─
        const rotations = calculateLunarRotation(illum.angle, pos.parallacticAngle)
        textureRotation.value = rotations.textureRotation
        limbRotation.value = rotations.limbRotation
      } catch {
        hasError.value = true
      } finally {
        isLoading.value = false
      }
    })
  })

  // ── Return the same public API as before ──────────────────────────────────
  // lat, lng, locationStatus are pass-throughs from useObserverContext so
  // no existing component needs to change.
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
    lat: effectiveLat,
    lng: effectiveLng,
    librationAngle,
    textureRotation,
    limbRotation,
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
    zodiac, zodiacSymbol,
    constellation,
    locationStatus
  }
}
