/**
 * LUNAR RADAR CONFIGURATION & LOGIC
 * Handles the orbital mapping of geocentric distance to SVG radar coordinates.
 */

export const RADAR_CONFIG = {
  // Approximate orbital bounds for UI scaling
  MIN_DIST_KM: 356500, // Perigee
  MAX_DIST_KM: 406700, // Apogee
  KM_TO_MILES: 0.621371,

  // SVG Geometry Constants
  SVG: {
    cx: 140, // Ellipse Center X
    cy: 62,  // Ellipse Center Y
    rx: 92,  // Radius X
    ry: 56,  // Radius Y
    ex: 67,  // Earth X
    ey: 62   // Earth Y
  }
} as const

export interface RadarTelemetry {
  ratio: number
  angle: number
  x: number
  y: number
  miles: number
  labelY: number
}

/**
 * Calculates the visual telemetry for the Orbital Radar module.
 * @param distance Geocentric distance in KM
 * @param movingTowardPerigee Direction of travel
 */
export function calculateRadarTelemetry(distance: number, movingTowardPerigee: boolean): RadarTelemetry {
  // 1. Calculate the proximity ratio (0 = Perigee, 100 = Apogee)
  const ratio = Math.min(100, Math.max(0,
    ((distance - RADAR_CONFIG.MIN_DIST_KM) / (RADAR_CONFIG.MAX_DIST_KM - RADAR_CONFIG.MIN_DIST_KM)) * 100
  ))

  // 2. Map ratio to base angle (Perigee is at PI, Apogee is at 0)
  const baseAngle = Math.PI * (1 - ratio / 100)

  // 3. Determine orbital loop position
  // If approaching Perigee (distance decreasing), traverse the top half (PI to 2PI)
  // If receding toward Apogee (distance increasing), traverse the bottom half (PI to 0)
  const angle = movingTowardPerigee ? (Math.PI * 2 - baseAngle) : baseAngle

  // 4. Map to SVG Ellipse coordinates
  const x = RADAR_CONFIG.SVG.cx + RADAR_CONFIG.SVG.rx * Math.cos(angle)
  const y = RADAR_CONFIG.SVG.cy + RADAR_CONFIG.SVG.ry * Math.sin(angle)

  // 5. Unit conversion
  const miles = Math.round(distance * RADAR_CONFIG.KM_TO_MILES)

  return {
    ratio,
    angle,
    x,
    y,
    miles,
    labelY: y < RADAR_CONFIG.SVG.cy ? y - 13 : y + 16
  }
}
