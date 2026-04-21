<script setup lang="ts">
import { useTerminalTheme, type TerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme, setTheme } = useTerminalTheme()

const themes: { id: TerminalTheme, label: string, color: string }[] = [
  { id: 'cyan', label: 'CYAN', color: '#00f2ff' },
  { id: 'amber', label: 'AMBER', color: '#ffb000' },
  { id: 'pink', label: 'PINK', color: '#ec4899' },
  { id: 'green', label: 'GREEN', color: '#00dc82' }
]
</script>

<template>
  <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 bg-black/60 border border-white/20 p-1.5 sm:p-2 rounded-lg pointer-events-auto shadow-2xl">
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="t in themes"
        :key="t.id"
        class="group relative w-10 h-10 rounded-sm transition-all duration-300 overflow-hidden bento-flicker border border-white/10 cursor-pointer"
        :title="t.label"
        @click="setTheme(t.id)"
      >
        <!-- Color Background -->
        <div
          class="absolute inset-0 transition-opacity duration-300"
          :style="{ backgroundColor: t.color, opacity: currentTheme === t.id ? 1 : 0.3 }"
        />

        <!-- CRT Texture Overlay -->
        <div class="absolute inset-0 pointer-events-none opacity-25 panel-scanlines" />

        <!-- Selection Highlight -->
        <div
          v-if="currentTheme === t.id"
          class="absolute inset-0 border-t-2 border-white/50 mix-blend-overlay"
        />
        <div
          v-if="currentTheme === t.id"
          class="absolute inset-0 bg-white/5"
        />
      </button>
    </div>
  </div>
</template>
