export const landingData = {
  hero: {
    title: 'Welcome to #h#OrbServer#/h##br#The Clean Orchestrator',
    description: 'A highly scalable, logic-less architecture for Nuxt 4.'
  },
  lunar: {
    terminal: [
      { t: '$ ./lunar-obs --connect --host=orbserver.io', cmd: true },
      { t: '  > AUTH: cape_town_obs_001' },
      { t: '  > LAT={{lat}}  LNG={{lng}}' },
      { t: '  > Link established. Telemetry LIVE.' },
      { t: '', blank: true },
      { t: '$ lunar-obs query --payload=telemetry --format=raw', cmd: true },
      { t: '', blank: true },
      { t: '  PHASE          {{phaseName}}' },
      { t: '  ILLUMINATION   {{illum}}%' },
      { t: '  AGE_IN_CYCLE   {{age}} days' },
      { t: '  DISTANCE       {{dist}} km' },
      { t: '  ALTITUDE       {{alt}}' },
      { t: '  AZIMUTH        {{az}}' },
      { t: '  PARALLAX_ROT   {{rot}}° [SH_CALIBRATED]' },
      { t: '', blank: true },
      { t: '  STATUS         OK // FEED_STABLE // SECURE_LINK_ACTIVE' },
      { t: '', blank: true },
      { t: '$ lunar-obs facts --random', cmd: true },
      { t: '  > Lunar albedo: 0.12 (reflectivity comparable to asphalt)' },
      { t: '  > Surface temp range: -173°C to +127°C' },
      { t: '  > Tidal locking: rotation = revolution (27.32 days)' },
      { t: '  > Escape velocity: 2.38 km/s' }
    ],
    labels: {
      visualPrimary: 'VISUAL_FEED::PRIMARY',
      distRadar: 'RADAR::DIST_CAL',
      riseSet: 'EVENT::RISE_SET',
      diameter: 'APPARENT_Ø::ARC',
      protocol: 'EXECUTION_PROTOCOL // MANUAL_TRACKING'
    },
    briefing: [
      {
        label: 'PHASE // ALBEDO',
        text: 'Analysis detects #h#fragmented albedo#/h#. The Moon\'s reflectivity is approximately #h#0.11#/h# — nearly identical to worn #h#asphalt#/h#. High luminosity is purely a function of #h#solar opposition#/h#.'
      },
      {
        label: 'TEMPORAL // SYNODIC',
        text: 'The #h#synodic cycle#/h# averages #h#29.53 days#/h#. Every lunation tracks the return to a precise #h#Sun-Earth-Moon alignment#/h#, distinct from the #h#sidereal period#/h# of 27.32 days.'
      },
      {
        label: 'SPATIAL // ZENITH',
        text: 'Rotation is relative to your #h#local zenith#/h#. The apparent "tilt" accounts for #h#parallactic rotation#/h# — a visual shift caused by the observer\'s motion #h#around Earth\'s rotational axis#/h#.'
      }
    ],
    handRule: {
      intro: 'When you have no tools, your body becomes the measuring device. This guide explains how to find the Moon\'s position using cardinal orientation and the #h#"Hand Rule"#/h# method.',
      establishmentHeading: {
        title: '1. Establish Heading',
        description: 'To measure the Moon\'s position, you must first orient yourself toward the correct sector of the sky.'
      },
      measureAltitude: {
        title: '2. Measure Altitude',
        description: 'Once facing the correct quadrant, use your arm at full extension to measure degrees above the horizon using the "Hand Rule" ladder.'
      },
      steps: [
        { title: 'Fully Extend Your Arm', desc: 'Your arm must be straight out. The Hand Rule fails if your elbow is bent.' },
        { title: 'The Horizon Line', desc: 'Align the bottom of your first fist with the visible horizon.' },
        { title: 'The Ladder', desc: 'Stack your second hand directly on top of the first (#h#20° Altitude#/h#).' },
        { title: 'The Target', desc: 'The Moon should appear at the top knuckle of the third fist (#h#30° Altitude#/h#).' }
      ]
    },
    etymology: {
      perigee: 'From Greek #h#περίγειον#/h# — #h#peri#/h# ("near") + #h#gē#/h# ("Earth"). The point in the lunar orbit of #h#closest approach#/h# — approximately #h#356,500 km#/h#. At perigee, the Moon appears #h#14% larger#/h# and drives stronger #h#tidal forces#/h#.',
      apogee: 'From Greek #h#ἀπόγειον#/h# — #h#apo#/h# ("away from") + #h#gē#/h# ("Earth"). The point of #h#maximum separation#/h# — approximately #h#406,700 km#/h#. The Moon moves #h#~30% slower#/h# here per Kepler\'s second law — equal areas in equal times.'
    }
  }
}
