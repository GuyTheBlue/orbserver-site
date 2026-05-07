import { describe, it, expect } from 'vitest'
import { calculateLunarRotation } from './lunarRotation'

describe('🌑 THE IMMUTABLE LAW OF LUNAR ORIENTATION (Asset-Aware)', () => {
  /**
   * 1. NORTHERN HEMISPHERE (LONDON)
   * With a small parallactic angle (e.g. 10°), the rotation should
   * just be the angle + the 30° asset offset.
   */
  it('calculates rotation for London (Northern Hemisphere)', () => {
    const pDeg = 10 * (Math.PI / 180)
    const { textureRotation } = calculateLunarRotation(0, pDeg)
    expect(textureRotation).toBe(40) // 10 + 30
  })

  /**
   * 2. SOUTHERN HEMISPHERE (CAPE TOWN)
   * In the SH, parallacticAngle is naturally ~180° offset.
   * (190° + 30°) = 220°
   */
  it('calculates rotation for Cape Town (Southern Hemisphere)', () => {
    const pDeg = 190 * (Math.PI / 180)
    const { textureRotation } = calculateLunarRotation(0, pDeg)
    expect(textureRotation).toBe(220)
  })

  /**
   * 3. MOONRISE ORIENTATION (CAPE TOWN)
   * Verification of Tycho positioning at the horizon.
   */
  it('tilts Tycho toward 3-4 o clock at Moonrise in Cape Town', () => {
    // 110 + 30 = 140
    const pDegRise = 110 * (Math.PI / 180)
    const { textureRotation } = calculateLunarRotation(0, pDegRise)
    expect(textureRotation).toBe(140)
  })

  /**
   * 4. LIMB / LIGHT CHECK
   * Logic: (iDeg + pDeg + textureBase)
   * (90 + 45 + 30) = 165
   */
  it('calculates the limb rotation correctly including parallax', () => {
    const illumAngle = 90 * (Math.PI / 180)
    const parallacticAngle = 45 * (Math.PI / 180)
    const { limbRotation } = calculateLunarRotation(illumAngle, parallacticAngle)
    expect(limbRotation).toBe(165)
  })
})
