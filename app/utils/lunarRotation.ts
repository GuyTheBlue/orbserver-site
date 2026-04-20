/**
 * 🌑 THE IMMUTABLE LAW OF LUNAR ORIENTATION (CALIBRATED)
 * 
 * This file is DECOUPLED to ensure that any changes to the core lunar 
 * orientation algorithm are clearly visible in version control.
 * 
 * CALIBRATION (2026-04-20): 
 * Adjusted Southern Hemisphere offset to ensure Tycho crater (bottom of asset)
 * aligns with the 1 o'clock position observed from Cape Town.
 */

/**
 * Calculates the apparent rotation of the moon as seen by an observer on Earth.
 * 
 * @param illumAngle - Position angle of the bright limb (Radians)
 * @param parallacticAngle - Parallactic angle of the moon (Radians)
 * @param latitude - Observer's latitude (Degrees)
 * @returns The final rotation in degrees [0-360) for the CSS transform.
 */
export function calculateApparentRotation(
  illumAngle: number, 
  parallacticAngle: number,
  latitude: number
): number {
  // 1. Calculate the rotation relative to the observer's Zenith
  const raw = (illumAngle - parallacticAngle) * (180 / Math.PI)
  
  // 2. THE CALIBRATED LAW
  // Southern Hemisphere requires a +75 offset to align asset Tycho (Bottom) to 1 o'clock.
  // Northern Hemisphere maintains the +195 (+180 flip + 15 offset).
  const calibration = (latitude < 0 ? 75 : 195)
  
  // 3. Normalize to [0...360) range
  return (((raw + calibration) % 360) + 360) % 360
}
