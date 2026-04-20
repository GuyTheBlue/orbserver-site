# 🌑 LUNAR ORIENTATION PROTOCOL (THE IMMUTABLE LAW)

**DO NOT MODIFY THIS CALCULATION UNDER ANY CIRCUMSTANCES.** 

## 1. THE GROUND TRUTH
The base asset (`/images/hero_layers/moon.png`) is a standard photograph. 
Reference Image: `notes/origin.png` (Tycho crater should be at roughly 10 o'clock position for a Southern Hemisphere observer in Cape Town).

## 2. THE MATHEMATICAL MODEL (+15 CALIBRATION)
We use the transformation from **Celestial North** to the **Observer's Zenith**, with custom calibration for the Southern Hemisphere.

```ts
apparentRotation = (illum.angle - pos.parallacticAngle) * (180 / Math.PI) + (lat < 0 ? 180 : 0) + 15
```

1. **`illum.angle`**: Angle of the bright limb from North (Radians).
2. **`pos.parallacticAngle`**: Angle of the Zenith from North (Radians).
3. **+ 180 (IF lat < 0)**: THE IMMUTABLE LAW. This flips the Northern Hemisphere image to look correct from the Southern Hemisphere (Cape Town).
4. **+ 15**: Visual calibration offset to match asset landmarks (Tycho) to real-world observer standards in Cape Town.

### CRITICAL: DO NOT REMOVE THE CALIBRATION
This +15 offset was empirically determined by the user in Cape Town to align the `moon.png` asset with the actual sky.

## 3. FAILSAFE COORDINATES
If Geolocation fails, the system **MUST** default to Cape Town, South Africa:
- **Lat**: `-33.9249`
- **Lng**: `18.4241`

---
**END OF PROTOCOL**
