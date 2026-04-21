const SunCalc = require('suncalc')

const capeTown = { lat: -33.9249, lng: 18.4241 }
const london = { lat: 51.5074, lng: -0.1278 }
const date = new Date('2026-04-20T21:13:00+02:00')

const illum = SunCalc.getMoonIllumination(date)
const posCT = SunCalc.getMoonPosition(date, capeTown.lat, capeTown.lng)
const posLDN = SunCalc.getMoonPosition(date, london.lat, london.lng)

const rawCT = (illum.angle - posCT.parallacticAngle) * (180 / Math.PI)
const rawLDN = (illum.angle - posLDN.parallacticAngle) * (180 / Math.PI)

// DESIRED: Tycho (180 deg in asset) should be at 1 o'clock (30 deg) in CT.
// This requires a rotation of (30 - 180) = -150 or +210.
// rawCT is -225.5. To get 210, we need: rawCT + X = 210 => X = 210 - (-225.5) = +435.5 => +75.5.

console.log('CAPE TOWN RAW:', rawCT.toFixed(2))
console.log('LONDON RAW:', rawLDN.toFixed(2))

// If we use (raw + 75.5) for CT: result is 210. Tycho at 30 (1 o'clock).
// If we use (raw + 75.5) for LDN: result is -150 + 75.5 = -74.5 (285.5).
// At 285.5 rotation: Tycho (180) + 285.5 = 465.5 = 105.5 (approx 3-4 o'clock).
// In London, Tycho should be at roughly 6 o'clock (at the bottom) or 5?
