<script setup lang="ts">
import { useTitleParser } from '~/composables/useTitleParser'

interface BriefingFactoid {
  label: string
  text: string
}

defineProps<{
  data: BriefingFactoid[]
}>()
</script>

<template>
  <div
    v-for="f in data"
    :key="f.label"
  >
    <p class="font-mono text-[12px] text-hud-accent/50 tracking-[0.5em] uppercase mb-3">
      {{ f.label }}
    </p>
    <p class="font-mono text-[13px] text-hud-accent/60 leading-relaxed uppercase tracking-wider">
      <template
        v-for="part in useTitleParser(f.text)"
        :key="part.id"
      >
        <span
          v-if="part.type === 'highlight'"
          class="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
        >{{ part.content }}</span>
        <template v-else>
          {{ part.content }}
        </template>
      </template>
    </p>
  </div>
</template>
