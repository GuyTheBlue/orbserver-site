
import { describe, it, expect } from 'vitest'
import { calculateApparentRotation } from './lunarRotation'

describe('Calibrated Lunar Orientation Protocol', () => {
  
  /**
   * 1. THE GROUND TRUTH CHECK (SPECIFIC)
   * This anchors our logic to your real-world observation from tonight.
   */
  it('aligns Tycho to 1 o clock in Cape Town (+75 check)', () => {
    const illumAngle = -113.88 * (Math.PI / 180) 
    const parallacticAngle = 111.64 * (Math.PI / 180)
    const latSH = -33.9249
    const result = calculateApparentRotation(illumAngle, parallacticAngle, latSH)
    
    // Result is 209.48
    // Asset Tycho (180) + 209.48 = 389.48 = 29.48 deg (Effectively 1 o'clock)
    expect(result).toBeCloseTo(209.48, 1)
  })

  /**
   * 2. THE GENERIC STRESS TEST (NON-SPECIFIC)
   * This proves that the logic works for ANY time of day and ANY angle.
   * We generate 100 random astronomical states to ensure the Law holds.
   */
  it('verifies the Law holds true for 100 random times & positions', () => {
    for (let i = 0; i < 100; i++) {
       // Generate random astronomical inputs
       const randomIllum = (Math.random() * 360 - 180) * (Math.PI / 180)
       const randomPara = (Math.random() * 360 - 180) * (Math.PI / 180)
       
       // Test Southern Hemisphere Logic
       const resSH = calculateApparentRotation(randomIllum, randomPara, -33.9)
       const rawSH = (randomIllum - randomPara) * (180 / Math.PI)
       const expectedSH = (((rawSH + 75) % 360) + 360) % 360
       expect(resSH).toBeCloseTo(expectedSH, 2)
       
       // Test Northern Hemisphere Logic
       const resNH = calculateApparentRotation(randomIllum, randomPara, 51.5)
       const rawNH = (randomIllum - randomPara) * (180 / Math.PI)
       const expectedNH = (((rawNH + 195) % 360) + 360) % 360
       expect(resNH).toBeCloseTo(expectedNH, 2)
    }
  })

  /**
   * 3. THE BOUNDARY TEST
   * Ensures the system doesn't crash at the Equator.
   */
  it('handles equator and edge cases safely', () => {
    expect(calculateApparentRotation(0, 0, 0)).toBe(195) // Equator defaults to NH logic
    expect(calculateApparentRotation(0, 0, -0.001)).toBe(75) // Just below equator
  })
})
