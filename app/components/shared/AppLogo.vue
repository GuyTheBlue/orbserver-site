<template>
  <svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" class="overflow-visible w-full h-full">
    <defs>
      <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <g filter="url(#logo-glow)">
      <text 
        x="200" 
        y="50" 
        font-family="sans-serif" 
        font-weight="900" 
        font-size="42" 
        fill="#FFFFFF" 
        text-anchor="middle"
        letter-spacing="12"
      >
        ORBSERVER
      </text>

      <ellipse 
        cx="140" 
        cy="40" 
        rx="90" 
        ry="25" 
        fill="none" 
        stroke="#FFFFFF" 
        stroke-width="1.5" 
        transform="rotate(-15 140 40)"
        opacity="0.8"
      />
    </g>
  </svg>
</template>
