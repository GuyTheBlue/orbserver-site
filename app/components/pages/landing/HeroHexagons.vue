<template>
  <div 
    class="absolute inset-0 z-0 pointer-events-none" 
    style="
      mask-image: radial-gradient(100% 100% at 0% 0%, black 10%, transparent 60%);
      -webkit-mask-image: radial-gradient(100% 100% at 0% 0%, black 10%, rgba(0,0,0,0) 60%);
    "
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Seamless interlocking hexagon pattern -->
        <pattern id="hexagons" width="75" height="43.30127" patternUnits="userSpaceOnUse" patternTransform="scale(2.5)">
          
          <!-- Glossy opaque hexagon (creates the glass panel aesthetic) -->
          <path class="hex-shimmer-glow" d="M 25 0 L 50 0 L 62.5 21.65 L 50 43.3 L 25 43.3 L 12.5 21.65 Z" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(180, 240, 255, 0.3)" stroke-width="0.8" />
          
          <!-- Outline-only border hexagon (creates the see-through aesthetic) -->
          <path class="hex-shimmer-subtle" d="M -12.5 0 L 12.5 0 L 25 21.65 L 12.5 43.3 L -12.5 43.3 L -25 21.65 Z" fill="none" stroke="rgba(180, 240, 255, 0.15)" stroke-width="0.5" />
          <path class="hex-shimmer-subtle" d="M 62.5 0 L 87.5 0 L 100 21.65 L 87.5 43.3 L 62.5 43.3 L 50 21.65 Z" fill="none" stroke="rgba(180, 240, 255, 0.15)" stroke-width="0.5" />
          
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  </div>
</template>

<style scoped>
/* Chilling, mystic shimmer logic */
.hex-shimmer-glow {
  animation: shimmer 4s infinite alternate ease-in-out;
}
.hex-shimmer-subtle {
  animation: shimmer 7s infinite alternate-reverse ease-in-out;
}

@keyframes shimmer {
  0% { 
    opacity: 0.1;
  }
  100% { 
    opacity: 0.9; 
    filter: drop-shadow(0 0 6px rgba(180, 240, 255, 0.4));
  }
}
</style>
