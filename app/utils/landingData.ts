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
      diameter: 'ANGULAR_DIAMETER::SIZE_VAR',
      nextFull: 'NEXT_FULL',
      nextNew: 'NEXT_NEW'
    },
    nextFullFactoid: {
      label: 'OPPOSITION // LUM',
      text: 'Analysis detects #h#solar opposition#/h# state.'
    },
    nextNewFactoid: {
      label: 'CONJUNCTION // DARK',
      text: 'Orbital alignment at #h#conjunction#/h# state.'
    },
    terminal: [
      { t: 'INITIALIZING LUNAR_OBSERVER PROTOCOL...', cmd: true },
      { t: 'ESTABLISHING HANDSHAKE WITH SUNCALC_API...', cmd: true },
      { t: 'LINK_ESTABLISHED: OBS_LAT:{{lat}} // OBS_LNG:{{lng}}' },
      { t: 'LOC_SYNC_STATUS: {{locStatus}}' },
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
  },
  heroUI: {
    cta: {
      title: 'know thy',
      version: 'SYST_HUD_v4.5',
      status: 'REAL_TIME_LINK_ACTIVE'
    },
    telemetry: {
      header: 'SYSTEM_QUANTUM_CALIBRATION',
      rows: [
        { id: 'PHA', label: 'PHASE', info: 'Current lunar illumination cycle', scale: 75, unit: 'ILL' },
        { id: 'ZOD', label: 'ZODIAC', info: 'Lunar position in tropical zodiac', scale: 60, unit: 'ZOD' },
        { id: 'VEL', label: 'ORB_VEL', info: 'Moon orbital speed around Earth', scale: 75, unit: 'KPH' },
        { id: 'LT', label: 'LT_DELAY', info: 'Time for light to reach Earth from Moon', scale: 92, unit: 'SEC' }
      ]
    },
    intel: {
      label: 'AR_ANNOTATION::INTEL',
      factoids: [
        'The moon is receding from Earth at a rate of 3.8cm per year. Our link monitors exact proximity in real-time.',
        'Formation theory: The Moon likely formed from a giant impact between Earth and a Mars-sized body named Theia.',
        'Apollo 11 mission: Neil Armstrong became the first human to step onto the lunar surface on 20 July 1969.',
        'Apollo 1 tragedy: A cabin fire during a pre-launch test killed three astronauts on 27 January 1967.',
        'Artemis mission: NASA\'s multi-decade initiative to return humans to the Moon and establish a permanent base.',
        'Lunar Age: The Moon is approximately 4.5 billion years old, nearly as old as Earth itself.',
        'Apollo 13: An oxygen tank explosion aborted the landing, but the crew returned safely against all odds.',
        'Tidal Locking: The Moon rotates at the same speed it orbits, meaning we only ever see one side of it from Earth.',
        'Luna 2: In 1959, this Soviet spacecraft became the first human-made object to reach the lunar surface.',
        'Luna 9: The first spacecraft to achieve a survivable "soft" landing on the Moon and transmit photos in 1966.',
        'Gravity: The Moon\'s surface gravity is only about 1/6th that of Earth\'s due to its significantly smaller mass.',
        'Temperature Extremes: Surface temperatures fluctuate wildly between 127°C (260°F) and -173°C (-280°F).',
        'Lunar Scent: Apollo astronauts noted that lunar dust brought back into the cabin smelled like burnt gunpowder.',
        'Earthshine: Sunlight reflecting off Earth onto the Moon allows us to see the "dark" part of a crescent moon.',
        'Moonquakes: Seismic activity caused by Earth\'s tidal pull can last up to 30 minutes on the Moon.',
        'Elliptical Orbit: The Moon follows an oval path; at perigee, it appears 14% larger and 30% brighter than at apogee.',
        'Tidal Braking: The Moon\'s gravity is slowing Earth\'s rotation by approximately 1.7 milliseconds per century.',
        'Luna 3: This Soviet probe captured the first-ever photographs of the Moon\'s far side in 1959.',
        'Lunar Maria: The dark spots on the Moon are ancient lava plains formed by volcanic eruptions billions of years ago.',
        'Density: The Moon is the second densest satellite in our solar system, following Jupiter\'s moon Io.',
        'Egg-Shaped: The Moon is not a perfect sphere; it is slightly oblate due to rotation and gravitational forces.',
        'Regolith: The surface is covered in a layer of pulverized rock and dust created by billions of years of impacts.',
        'Exosphere: The Moon has a vanishingly thin atmosphere where gas molecules rarely collide with each other.',
        'Apollo 8: In 1968, this became the first crewed mission to leave Earth\'s orbit and circle the Moon.',
        'Baily\'s Beads: During a solar eclipse, sunlight peeking through lunar valleys creates bright points of light.',
        'Spring Tides: These occur when the Sun and Moon align, combining their gravity to create exceptionally high tides.',
        'Mascons: High-density "mass concentrations" under the surface were found to alter the orbits of spacecraft.',
        'Apollo 17: Commander Eugene Cernan became the last person to walk on the lunar surface in December 1972.',
        'Lunar Samples: Between 1969 and 1972, Apollo missions brought back 382 kilograms (842 lbs) of rock and soil.',
        'Blue Moon: This term refers to the relatively rare occurrence of a second full moon within one calendar month.'
      ]
    }
  },
  banners: {
    umph: {
      label: 'SPONSORSHIP_DEALING // SYSTEM_RESOURCES',
      title: 'This is an UMPH-sponsored application. Access is free. Always.',
      description: 'The mission continues on social. Please support the development by following the Story of Umph for updates and lore.',
      cta: 'FOLLOW THE STORY'
    },
    story: {
      label: 'FIND THE SECRET. FIX THE GLITCH.',
      status: 'Site status: Glitched.',
      description: 'The fix requires clues. Follow The Story of Umph on Instagram to find the upcoming patches.',
      cta: 'FOLLOW THE STORY'
    }
  }
}
