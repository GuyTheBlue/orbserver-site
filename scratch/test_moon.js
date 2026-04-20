import SunCalc from 'suncalc'

const date = new Date('2026-04-20T03:48:00')
const lat = -33.9249
const lng = 18.4241

const illum = SunCalc.getMoonIllumination(date)
const pos = SunCalc.getMoonPosition(date, lat, lng)

const rawRot = (illum.angle - pos.parallacticAngle) * (180 / Math.PI)
const shRot = (rawRot + 180) % 360

console.log('--- LUNAR TELEMETRY CALIBRATION ---')
console.log('Date:', date.toISOString())
console.log('Phase:', illum.phase.toFixed(4))
console.log('Illum Angle (rad):', illum.angle.toFixed(4))
console.log('Parallactic Angle (rad):', pos.parallacticAngle.toFixed(4))
console.log('Raw Rotation (deg):', rawRot.toFixed(2))
console.log('SH Corrected (deg):', shRot.toFixed(2))
