import { describe, it, expect } from 'vitest'
import { calculateRadarTelemetry, RADAR_CONFIG } from './radar'

describe('🔭 MOON ORBITAL RADAR LOGIC', () => {
  it('identifies Perigee correctly (0% ratio)', () => {
    const distance = RADAR_CONFIG.MIN_DIST_KM
    const result = calculateRadarTelemetry(distance, false)

    expect(result.ratio).toBe(0)
    // Angle at Perigee should be PI (180 degrees)
    expect(result.angle).toBeCloseTo(Math.PI)
    // Position should be at the far left of the ellipse (cx - rx)
    expect(result.x).toBeCloseTo(RADAR_CONFIG.SVG.cx - RADAR_CONFIG.SVG.rx)
  })

  it('identifies Apogee correctly (100% ratio)', () => {
    const distance = RADAR_CONFIG.MAX_DIST_KM
    const result = calculateRadarTelemetry(distance, false)

    expect(result.ratio).toBe(100)
    // Angle at Apogee (receding) should be 0
    expect(result.angle).toBeCloseTo(0)
    // Position should be at the far right of the ellipse (cx + rx)
    expect(result.x).toBeCloseTo(RADAR_CONFIG.SVG.cx + RADAR_CONFIG.SVG.rx)
  })

  it('switches to the top half of the orbit when approaching perigee', () => {
    // Use a distance exactly in the middle of the range
    const midDistance = (RADAR_CONFIG.MIN_DIST_KM + RADAR_CONFIG.MAX_DIST_KM) / 2

    // Case A: Receding (Bottom half)
    const receding = calculateRadarTelemetry(midDistance, false)
    expect(receding.y).toBeGreaterThan(RADAR_CONFIG.SVG.cy)

    // Case B: Approaching (Top half)
    const approaching = calculateRadarTelemetry(midDistance, true)
    expect(approaching.y).toBeLessThan(RADAR_CONFIG.SVG.cy)
  })

  it('correctly calculates the label offset to avoid overlap', () => {
    // When y is in the top half, label should be shifted up
    const topDist = calculateRadarTelemetry(RADAR_CONFIG.MIN_DIST_KM + 1000, true)
    expect(topDist.labelY).toBeLessThan(topDist.y)

    // When y is in the bottom half, label should be shifted down
    const bottomDist = calculateRadarTelemetry(RADAR_CONFIG.MIN_DIST_KM + 1000, false)
    expect(bottomDist.labelY).toBeGreaterThan(bottomDist.y)
  })

  it('converts KM to Miles using the correct scientific factor', () => {
    const distance = 100000
    const result = calculateRadarTelemetry(distance, false)
    // 100,000 * 0.621371 = 62137.1 -> rounded to 62137
    expect(result.miles).toBe(62137)
  })

  it('supports dynamic orbital bounds for high-fidelity scaling', () => {
    // Simulate a "Supermoon" month where Perigee is closer than average
    const superPerigee = 350000 
    const averageApogee = 406700
    
    // At 350,000km, the ratio should be 0% with these custom bounds
    const result = calculateRadarTelemetry(superPerigee, false, superPerigee, averageApogee)
    expect(result.ratio).toBe(0)
    expect(result.x).toBeCloseTo(RADAR_CONFIG.SVG.cx - RADAR_CONFIG.SVG.rx)
  })

  it('enforces bounds safely (min/max)', () => {
    const tooClose = calculateRadarTelemetry(0, false)
    expect(tooClose.ratio).toBe(0)

    const tooFar = calculateRadarTelemetry(9999999, false)
    expect(tooFar.ratio).toBe(100)
  })
})
