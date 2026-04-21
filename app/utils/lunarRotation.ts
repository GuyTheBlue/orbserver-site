export interface LunarRotation {
  textureRotation: number
  limbRotation: number
}

export function calculateLunarRotation(
  illumAngle: number,
  parallacticAngle: number,
  latitude: number
): LunarRotation {
  const pDeg = parallacticAngle * (180 / Math.PI)
  const iDeg = (illumAngle * (180 / Math.PI))

  // 1. Asset Calibration (Tycho is at -30 deg from vertical in image)
  const assetOffset = 30
  const textureBase = (latitude < 0 ? assetOffset : 180 + assetOffset)

  // 2. TEXTURE ROTATION (Craters)
  // Using +pDeg correctly rotates -110 (rise) + 30 = -80 (or 280)
  // BUT if your UI needs 140, we must consistently invert the parallactic shift.
  const textureRotation = (((pDeg + textureBase) % 360) + 360) % 360

  // 3. LIMB ROTATION (Shadow)
  // To keep the shadow aligned with the rotated texture,
  // we must also switch to +pDeg here.
  const limbRotation = (((iDeg + pDeg + textureBase) % 360) + 360) % 360

  return { textureRotation, limbRotation }
}
