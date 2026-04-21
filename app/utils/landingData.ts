export const landingData = {
  hero: {
    title: 'Welcome to #h#OrbServer#/h##br#The Clean Orchestrator',
    description: 'A highly scalable, logic-less architecture for Nuxt 4.'
  },
  lunar: {
    labels: {
      visualPrimary: 'LOC_SYSLOG::VISUAL_FEED',
      distRadar: 'ORBITAL_RADAR::DIST_FEED',
      riseSet: 'CELENTIAL_TIMING::RISE_SET',
      diameter: 'ANGULAR_DIAMETER::SIZE_VAR'
    },
    terminal: [
      { t: 'INITIALIZING LUNAR_OBSERVER PROTOCOL...', cmd: true },
      { t: 'ESTABLISHING HANDSHAKE WITH SUNCALC_API...', cmd: true },
      { t: 'LINK_ESTABLISHED: OBS_LAT:{{lat}} // OBS_LNG:{{lng}}' },
      { blank: true },
      { t: 'TELEMETRY_SYNC [LIVE]:' },
      { t: '> PHASE: {{phaseName}} [{{illum}}%]' },
      { t: '> AGE: {{age}} DAYS' },
      { t: '> DISTANCE: {{dist}} KM' },
      { t: '> POS: ALT {{alt}} // AZ {{az}}' },
      { t: '> TEXTURE_ROT: {{rot}}°' },
      { blank: true },
      { t: 'HEMISPHERE_CALIBRATION: ACTIVE' },
      { t: 'IMMUTABLE_LAW_ENFORCED: +180° FLIP APPLIED' },
      { blank: true },
      { t: 'SYSTEM_STATUS: NOMINAL // MONITORING CONTINUES...', cmd: true }
    ],
    briefing: [
      { label: 'ATMOSPHERE', text: '#h#Exosphere#/h# only. No protection from solar radiation or micrometeorites. Requires #h#pressurised#/h# containment.' },
      { label: 'TEMPERATURE', text: 'Extreme variance: #h#127°C#/h# at equator noon to #h#−173°C#/h# at night. Thermal shielding is #h#critical#/h#.' }
    ],
    etymology: {
      perigee: 'From Greek #h#peri#/h# (near) + #h#gee#/h# (earth). The point in orbit closest to the observer.',
      apogee: 'From Greek #h#apo#/h# (away) + #h#gee#/h# (earth). The point in orbit furthest from the observer.'
    },
    riseSetFactoid: {
      label: 'LUNAR_DAY',
      text: 'A full day-night cycle on the Moon lasts #h#27.3 Earth days#/h#. The Moon is #h#tidally locked#/h# to Earth.'
    },
    handRule: {
      intro: 'When you have #h#no tools#/h#, your body becomes the measuring device. Use cardinal orientation and the "Hand Rule" method.',
      establishmentHeading: {
        title: '1. Establish Heading',
        description: 'To measure the Moon\'s position, you must first orient yourself toward the correct sector of the sky.'
      },
      measureAltitude: {
        title: '2. Measure Altitude',
        description: 'Once facing the correct quadrant, use your arm at full extension to measure degrees above the horizon.'
      },
      steps: [
        { title: 'Fully Extend Your Arm', desc: 'Your arm must be #h#straight out#/h#. The Hand Rule fails if your elbow is bent.' },
        { title: 'The Horizon Line', desc: 'Align the #h#bottom#/h# of your first fist with the visible horizon.' },
        { title: 'The Ladder', desc: 'Stack your #h#second hand#/h# directly on top of the first (20° Altitude).' },
        { title: 'The Target', desc: 'The Moon should appear at the #h#top knuckle#/h# of the third fist (30° Altitude).' }
      ]
    }
  }
}
