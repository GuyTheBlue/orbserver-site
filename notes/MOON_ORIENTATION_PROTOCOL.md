# 🌑 LUNAR ORIENTATION PROTOCOL (THE IMMUTABLE LAW)

**DO NOT MODIFY THIS CALCULATION UNDER ANY CIRCUMSTANCES.** 
THIS IS THE RESULT OF MULTIPLE CALIBRATIONS FOR SOUTHERN HEMISPHERE ACCURACY (CAPE TOWN).

## 1. THE GROUND TRUTH
The base asset (`/images/hero_layers/moon.png`) is a standard **Northern Hemisphere** photograph. 
- **North Pole**: Top of image.
- **Tycho Crater**: Bottom of image.

## 2. THE MATHEMATICAL MODEL
We use `SunCalc` to derive the observer's relative perspective.

### Step A: The Astronomical Delta
```ts
const rawRotation = (illum.angle - pos.parallacticAngle) * (180 / Math.PI)
```
1. **`illum.angle`**: The position angle of the Moon's bright limb (measured clockwise from Celestial North).
2. **`pos.parallacticAngle`**: The angle between Celestial North and the Observer's Zenith.
3. **`rawRotation`**: The resulting angle from the Observer's Zenith to the Moon's bright limb. This aligns the moon so the "top" of the image points to the Zenith.

### Step B: The Hemispheric Correction (THE IMMUTABLE LAW)
Because the observer in the **Southern Hemisphere (SH)** is physically inverted relative to the Earth's axis compared to a **Northern Hemisphere (NH)** observer:
1. The entire celestial sphere appears upside down.
2. The Moon's features (craters) are inverted.
3. The direction of the Sun (and thus the bright limb) relative to the horizon is flipped.

**REQUIRED LOGIC:**
```ts
apparentRotation = (lat < 0) ? (rawRotation + 180) : rawRotation
```
- **NH (lat >= 0)**: No correction. The math correctly aligns the NH-native image.
- **SH (lat < 0)**: **ADDS 180 DEGREES.** This flips the image to match the Southern perspective.

## 3. FAILSAFE COORDINATES
If Geolocation fails, the system **MUST** default to Cape Town, South Africa to preserve Southern Hemisphere testing fidelity:
- **Lat**: `-33.9249`
- **Lng**: `18.4241`

## 4. IMPACT
Changing this math will:
1. Rotate the moon 180° off-axis for SH users (making it look like London).
2. Misalign the phase shadow (lit side will be on the wrong side of the craters).
3. Break the "Manual Telemetry" guide logic.

---
**END OF PROTOCOL**
