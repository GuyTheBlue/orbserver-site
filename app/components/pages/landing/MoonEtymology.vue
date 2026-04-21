<script setup lang="ts">
import { useTitleParser } from '~/composables/useTitleParser'

interface EtymologyData {
  perigee: string
  apogee: string
}

defineProps<{
  data: EtymologyData
}>()
</script>

<template>
  <div>
    <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-2">
      ETYMOLOGY // PERIGEE
    </p>
    <p class="font-mono text-[11px] text-hud-accent/70 leading-relaxed">
      <template
        v-for="part in useTitleParser(data.perigee)"
        :key="part.id"
      >
        <span
          v-if="part.type === 'highlight'"
          class="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        >{{ part.content }}</span>
        <span v-else>{{ part.content }}</span>
      </template>
    </p>
  </div>
  <div>
    <p class="font-mono text-[9px] text-hud-accent/50 tracking-[0.5em] uppercase mb-2">
      ETYMOLOGY // APOGEE
    </p>
    <p class="font-mono text-[11px] text-hud-accent/70 leading-relaxed">
      <template
        v-for="part in useTitleParser(data.apogee)"
        :key="part.id"
      >
        <span
          v-if="part.type === 'highlight'"
          class="text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        >{{ part.content }}</span>
        <span v-else>{{ part.content }}</span>
      </template>
    </p>
  </div>
</template>
