export interface LunarRotation {
  textureRotation: number
  limbRotation: number
}

/**
 * Calculates the rotation of the moon texture and limb.
 * SunCalc's parallacticAngle already accounts for the observer's latitude
 * (Zenith-relative orientation), so no manual hemisphere flip is required.
 */
export function calculateLunarRotation(
  illumAngle: number,
  parallacticAngle: number
): LunarRotation {
  const pDeg = parallacticAngle * (180 / Math.PI)
  const iDeg = (illumAngle * (180 / Math.PI))

  // 1. Asset Calibration
  // Tycho is at approx -30 deg from vertical in the raw image asset.
  // This offset aligns the image to the celestial North Pole.
  const assetOffset = 30

  // 2. TEXTURE ROTATION (Craters)
  // pDeg naturally handles the 180° flip between Northern and Southern hemispheres.
  const textureRotation = (((pDeg + assetOffset) % 360) + 360) % 360

  // 3. LIMB ROTATION (Shadow)
  const limbRotation = (((iDeg + pDeg + assetOffset) % 360) + 360) % 360

  return { textureRotation, limbRotation }
}
