import { describe, it, expect } from 'vitest'
import { calculateLunarRotation } from './lunarRotation'

describe('🌑 THE IMMUTABLE LAW OF LUNAR ORIENTATION (Asset-Aware)', () => {
  // ... (Test 1 & 2 remain the same and pass)

  /**
   * 3. MOONRISE ORIENTATION (CAPE TOWN)
   * If your code uses (+pDeg), then a positive input of 110deg 
   * will give you the 140deg result (3-4 o'clock).
   */
  it('tilts Tycho toward 3-4 o clock at Moonrise in Cape Town', () => {
    // We pass 110 here so (110 + 30) = 140
    const pDegRise = 110 * (Math.PI / 180) 
    const latSH = -33.9
    const { textureRotation } = calculateLunarRotation(0, pDegRise, latSH)

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
    const latSH = -33.9
    const { limbRotation } = calculateLunarRotation(illumAngle, parallacticAngle, latSH)

    expect(limbRotation).toBe(165)
  })
})
