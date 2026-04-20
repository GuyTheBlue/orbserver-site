<script setup lang="ts">
import { useTerminalTheme, type TerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme, setTheme } = useTerminalTheme()

const themes: { id: TerminalTheme; label: string; color: string }[] = [
  { id: 'cyan', label: 'CYAN', color: '#00f2ff' },
  { id: 'amber', label: 'AMBER', color: '#ffb000' },
  { id: 'pink', label: 'PINK', color: '#ec4899' },
  { id: 'green', label: 'GREEN', color: '#00dc82' }
]
</script>

<template>
  <div class="flex items-center gap-4 bg-black/60 border border-white/20 p-2 rounded-lg pointer-events-auto shadow-2xl">
    <div class="flex gap-2">
      <button
        v-for="t in themes"
        :key="t.id"
        @click="setTheme(t.id)"
        class="group relative w-8 h-8 rounded-sm transition-all duration-300 overflow-hidden bento-flicker"
        :style="{ backgroundColor: t.color, opacity: currentTheme === t.id ? 1 : 0.4 }"
        :title="t.label"
      >
        <!-- Gritty Scanlines -->
        <div class="absolute inset-0 pointer-events-none opacity-40 panel-scanlines !bg-[length:100%_2px]" />
        
        <!-- Buggy Overlay -->
        <div 
          v-if="currentTheme === t.id"
          class="absolute inset-0 border-2 border-white/60 animate-pulse" 
        />
        <div 
          v-if="currentTheme === t.id"
          class="absolute inset-0 bg-white/10 animate-scan opacity-30" 
        />
      </button>
    </div>
  </div>
</template>
