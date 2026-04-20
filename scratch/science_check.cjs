
const SunCalc = require('suncalc');

const capeTown = { lat: -33.9249, lng: 18.4241 };
const date = new Date('2026-04-20T21:13:00+02:00'); // User's stated time

const illum = SunCalc.getMoonIllumination(date);
const pos = SunCalc.getMoonPosition(date, capeTown.lat, capeTown.lng);

const rawDegrees = (illum.angle - pos.parallacticAngle) * (180 / Math.PI);

// Current site rotation (with the +15 and +180 flip)
const currentRotation = (((rawDegrees + 180 + 15) % 360) + 360) % 360;

console.log('--- CAPE TOWN MOON ORIENTATION CHECK ---');
console.log('Time:', date.toLocaleTimeString());
console.log('Raw Astronomical Angle:', rawDegrees.toFixed(2) + '°');
console.log('Current Result (with flip + 15):', currentRotation.toFixed(2) + '°');
console.log('----------------------------------------');
