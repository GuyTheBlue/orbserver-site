/**
 * useMoonFactoids.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * All static factoid / educational content for the Moon dashboard panels.
 * Kept separate from the view layer (MoonSection.vue) as per project
 * architecture rules — data belongs in composables, not inline in templates.
 *
 * Each factoid has:
 *   label   — terminal-style section header (e.g. "PHASE // ALBEDO")
 *   parts   — array of { text, highlight? } segments for mixed styling
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface FactoidPart {
  text: string
  highlight?: boolean
}

export interface Factoid {
  label: string
  parts: FactoidPart[]
}

export function useMoonFactoids() {
  // ── Main Panel Briefing ────────────────────────────────────────────────────
  const briefingFactoids: Factoid[] = [
    {
      label: 'PHASE // ALBEDO',
      parts: [
        { text: 'Analysis detects ' },
        { text: 'fragmented albedo', highlight: true },
        { text: '. The Moon\'s reflectivity is approximately ' },
        { text: '0.11', highlight: true },
        { text: ' — nearly identical to worn ' },
        { text: 'asphalt', highlight: true },
        { text: '. High luminosity is purely a function of ' },
        { text: 'solar opposition', highlight: true },
        { text: '.' }
      ]
    },
    {
      label: 'TEMPORAL // SYNODIC',
      parts: [
        { text: 'The ' },
        { text: 'synodic cycle', highlight: true },
        { text: ' averages ' },
        { text: '29.53 days', highlight: true },
        { text: '. Every lunation tracks the return to a precise ' },
        { text: 'Sun-Earth-Moon alignment', highlight: true },
        { text: ', distinct from the ' },
        { text: 'sidereal period', highlight: true },
        { text: ' of 27.32 days.' }
      ]
    },
    {
      label: 'SPATIAL // ZENITH',
      parts: [
        { text: 'Rotation is relative to your ' },
        { text: 'local zenith', highlight: true },
        { text: '. The apparent "tilt" accounts for ' },
        { text: 'parallactic rotation', highlight: true },
        { text: ' — a visual shift caused by the observer\'s motion ' },
        { text: 'around Earth\'s rotational axis', highlight: true },
        { text: '.' }
      ]
    },
    {
      label: 'MOTION // LIBRATION',
      parts: [
        { text: 'Detected ' },
        { text: 'optical libration', highlight: true },
        { text: '. Despite tidal locking, the Moon "wobbles" — allowing observers to view ' },
        { text: '59%', highlight: true },
        { text: ' of the total lunar surface over time, not merely 50%.' }
      ]
    },
    {
      label: 'PHYSICS // TIDAL_LOCK',
      parts: [
        { text: 'Synchronous rotation is forced by ' },
        { text: 'Earth\'s tidal torque', highlight: true },
        { text: '. The Moon\'s centre of mass is offset ' },
        { text: '~2 km', highlight: true },
        { text: ' toward Earth, perpetually anchoring the ' },
        { text: 'near side', highlight: true },
        { text: ' to face us.' }
      ]
    },
  ]

  // ── Rise/Set Panel Factoid ─────────────────────────────────────────────────
  const riseSetFactoid: Factoid = {
    label: 'REFRACTION // ERR_CAL',
    parts: [
      { text: 'Light bends through the ' },
      { text: 'atmosphere', highlight: true },
      { text: ', causing the Moon to appear ' },
      { text: 'flattened and larger', highlight: true },
      { text: ' near the horizon — an effect of ' },
      { text: 'atmospheric refraction', highlight: true },
      { text: ', not actual size change.' }
    ]
  }

  // ── Tidal Panel Factoid ────────────────────────────────────────────────────
  const tidalFactoid: Factoid = {
    label: 'SYZYGY // FORCES',
    parts: [
      { text: 'When Sun, Moon, and Earth ' },
      { text: 'align', highlight: true },
      { text: ' (Full or New Moon), the combined gravitational pull creates a ' },
      { text: 'spring tide', highlight: true },
      { text: ' — up to ' },
      { text: '20% greater', highlight: true },
      { text: ' tidal range than average.' }
    ]
  }

  // ── Next Full Moon Panel Factoid ───────────────────────────────────────────
  const nextFullFactoid: Factoid = {
    label: 'OPPOSITION // LUM',
    parts: [
      { text: 'The Moon reaches ' },
      { text: 'opposition', highlight: true },
      { text: ' when it is directly opposite the Sun from Earth\'s perspective. At this moment, ' },
      { text: '100%', highlight: true },
      { text: ' of the near-side is illuminated — the ' },
      { text: 'Full Moon', highlight: true },
      { text: '.' }
    ]
  }

  // ── Next New Moon Panel Factoid ────────────────────────────────────────────
  const nextNewFactoid: Factoid = {
    label: 'CONJUNCTION // DARK',
    parts: [
      { text: 'Occurs at ' },
      { text: 'conjunction', highlight: true },
      { text: ' — the Moon and Sun share the same ' },
      { text: 'ecliptic longitude', highlight: true },
      { text: '. The near-side receives no direct sunlight, rendering the Moon ' },
      { text: 'invisible', highlight: true },
      { text: ' to the naked eye.' }
    ]
  }

  return {
    briefingFactoids,
    riseSetFactoid,
    tidalFactoid,
    nextFullFactoid,
    nextNewFactoid
  }
}
