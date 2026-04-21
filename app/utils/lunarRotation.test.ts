import { describe, it, expect } from 'vitest'
import { calculateLunarRotation } from './lunarRotation'

describe('🌑 THE IMMUTABLE LAW OF LUNAR ORIENTATION (Asset-Aware)', () => {
  /**
   * 1. MERIDIAN GROUND TRUTH (CAPE TOWN)
   * Asset is Tycho @ 11. SH Meridian wants Tycho @ 12.
   * Rotation needed: +30°
   */
  it('aligns Tycho to 12 o clock at Meridian in Cape Town (SH)', () => {
    const illumAngle = 0
    const parallacticAngle = 0
    const latSH = -33.9249
    const { textureRotation } = calculateLunarRotation(illumAngle, parallacticAngle, latSH)

    // Result 30 means Tycho (at -30 in image) moves to 0 (top)
    expect(textureRotation).toBe(30)
  })

  /**
   * 2. MERIDIAN GROUND TRUTH (LONDON)
   * NH Meridian wants Tycho at 6 o'clock (180°).
   * Rotation needed: 180 + 30 = 210°
   */
  it('aligns Tycho to 6 o clock at Meridian in London (NH)', () => {
    const illumAngle = 0
    const parallacticAngle = 0
    const latNH = 51.5074
    const { textureRotation } = calculateLunarRotation(illumAngle, parallacticAngle, latNH)

    expect(textureRotation).toBe(210)
  })

  /**
   * 3. MOONRISE ORIENTATION (CAPE TOWN)
   * At moonrise, pDeg is roughly -110°. 
   * Calculation: (-110 + 30) = -80. Normalize to 280°.
   * This puts Tycho at ~9 o'clock relative to the vertical, 
   * but effectively tilted for the horizon.
   */
  it('tilts Tycho toward 3-4 o clock at Moonrise in Cape Town', () => {
  // At moonrise in SH, pDeg is roughly -110 degrees
  const pDegRise = -110 * (Math.PI / 180) 
  const latSH = -33.9
  const { textureRotation } = calculateLunarRotation(0, pDegRise, latSH)

  // Logic: (-110 + 30) = -80. Normalized: 280.
  // 280 degrees clockwise from 12 o'clock lands at ~9 o'clock (Wrong side).
  // Flipping the sign to +pDeg (110 + 30) = 140 lands at ~4 o'clock (Correct!).
  expect(textureRotation).toBe(140) 
})


  /**
   * 4. LIMB / LIGHT CHECK
   * Verifies the shadow follows the sun regardless of texture rotation.
   */
  it('calculates the limb rotation correctly including parallax', () => {
    const illumAngle = 90 * (Math.PI / 180) // Sun at 3 o'clock
    const parallacticAngle = 45 * (Math.PI / 180) // Horizon tilt
    const latSH = -33.9
    const { limbRotation } = calculateLunarRotation(illumAngle, parallacticAngle, latSH)

    // (90 - 45) + 30 = 75
    expect(limbRotation).toBe(75)
  })
})
