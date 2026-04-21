<template>
  <div class="inline-flex items-center gap-2 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]">
    <!-- The "O" - High-fidelity orb image -->
    <div class="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center">
      <div class="absolute inset-0 bg-white/5 rounded-full blur-md group-hover:bg-hud-accent/20 transition-colors" />
      <NuxtImg
        src="/images/logo_orb.png"
        class="relative z-10 w-full h-full object-contain animate-[o-pulse_6s_ease-in-out_infinite]"
        alt="o"
      />
      <!-- Decorative orbital ring -->
      <div class="absolute inset-[-4px] rounded-full border border-white/5 group-hover:border-hud-accent/20 transition-colors pointer-events-none" />
    </div>

    <!-- The lowercase branding -->
    <span class="font-orbitron font-black text-2xl md:text-3xl lg:text-4xl text-white tracking-[0.1em] lowercase select-none group-hover:text-hud-accent transition-colors leading-none">
      rbserver
    </span>
  </div>
</template>

<style scoped>
@keyframes o-pulse {
  0%, 100% {
    transform: scale(0.96);
    filter: brightness(0.9) drop-shadow(0 0 5px rgba(255,255,255,0.1));
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.3));
  }
}
</style>
