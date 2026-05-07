<script setup lang="ts">
import { computed } from 'vue'
import { useTerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme } = useTerminalTheme()

const themeMap = {
  cyan: { hex: '#00f2ff', hue: '145deg' },
  amber: { hex: '#ffb000', hue: '0deg' },
  pink: { hex: '#ec4899', hue: '280deg' },
  green: { hex: '#00dc82', hue: '95deg' }
}

const style = computed(() => themeMap[currentTheme.value] || themeMap.cyan)
</script>

<template>
  <div class="inline-flex items-center gap-2 group cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]">
    <!-- The "O" - High-fidelity orb image -->
    <div class="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center">
      <div
        class="absolute inset-0 rounded-full blur-md opacity-20 transition-colors"
        :style="{ backgroundColor: style.hex }"
      />
      <!-- The Solid "O" Stencil -->
      <div
        class="relative z-10 w-full h-full animate-[o-pulse_6s_ease-in-out_infinite]"
        :style="{
          backgroundColor: style.hex,
          maskImage: 'url(/images/logo_orb.png)',
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskImage: 'url(/images/logo_orb.png)',
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center'
        }"
      />
      <!-- Decorative orbital ring -->
      <div
        class="absolute inset-[-4px] rounded-full border transition-colors pointer-events-none opacity-20 group-hover:opacity-40"
        :style="{ borderColor: style.hex }"
      />
    </div>

    <!-- The lowercase branding -->
    <span
      class="font-orbitron font-black text-2xl md:text-3xl lg:text-4xl tracking-[0.1em] lowercase select-none transition-colors leading-none"
      :style="{ color: style.hex, textShadow: `0 0 15px ${style.hex}40` }"
    >
      rbserver
    </span>
  </div>
</template>

<style scoped>
@keyframes o-pulse {
  0%, 100% {
    transform: scale(0.96);
    filter: brightness(0.95);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.15);
  }
}
</style>
