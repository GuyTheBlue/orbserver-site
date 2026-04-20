<script setup lang="ts">
import { useTerminalTheme, type TerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme, setTheme } = useTerminalTheme()

const themes: { id: TerminalTheme; label: string; color: string }[] = [
  { id: 'cyan', label: 'CYAN', color: '#00f2ff' },
  { id: 'amber', label: 'AMBER', color: '#ffb000' },
  { id: 'yellow', label: 'YELLO', color: '#fcd34d' },
  { id: 'green', label: 'GREEN', color: '#00dc82' }
]
</script>

<template>
  <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full pointer-events-auto">
    <span class="font-mono text-[9px] text-white/40 tracking-widest uppercase mr-2">Color_OS:</span>
    <div class="flex gap-2">
      <button
        v-for="t in themes"
        :key="t.id"
        @click="setTheme(t.id)"
        class="group relative w-5 h-5 rounded-full transition-all duration-300 hover:scale-125"
        :style="{ backgroundColor: t.color }"
        :title="t.label"
      >
        <span 
          v-if="currentTheme === t.id"
          class="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-40"
        />
        <span 
          v-if="currentTheme === t.id"
          class="absolute inset-[-4px] rounded-full border border-white/40"
        />
      </button>
    </div>
  </div>
</template>
