<template>
  <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" class="overflow-visible w-full h-full">
    <defs>
      <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <g filter="url(#logo-glow)">
      
      <!-- The solid "O" quietly pulsing like a moon -->
      <circle 
        cx="40" 
        cy="36" 
        r="15" 
        fill="#FFFFFF" 
        class="origin-[40px_36px] animate-[o-pulse_4s_ease-in-out_infinite]"
      />

      <!-- The typography precisely aligned to follow the O -->
      <text 
        x="68" 
        y="50" 
        font-family="Orbitron" 
        font-weight="900" 
        font-size="38" 
        fill="#FFFFFF" 
        text-anchor="start"
        letter-spacing="14"
      >
        RBSERVER
      </text>

      <!-- The orbital path mathematically centered to slice cleanly through the O and B -->
      <ellipse 
        cx="85" 
        cy="33" 
        rx="65" 
        ry="18" 
        fill="none" 
        stroke="#FFFFFF" 
        stroke-width="1.5" 
        transform="rotate(-15 85 33)"
        opacity="0.8"
      />
    </g>
  </svg>
</template>

<style scoped>
/* Quiet, organic pulsing animation bound specifically to the origin coordinates of the O */
@keyframes o-pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 10px rgba(255,255,255,0.9)); }
  100% { transform: scale(0.95); opacity: 0.8; }
}
</style>
