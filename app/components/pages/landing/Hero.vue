<script setup lang="ts">
import { useTitleParser } from '#imports'

const props = defineProps<{
  data: {
    title: string
    description: string
  }
}>()
</script>

<template>
  <div class="text-center max-w-4xl mx-auto">
    <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
      <!-- The component remains logically 'dumb' and iterates over our pure CSS parser output -->
      <template v-for="part in useTitleParser(data.title)" :key="part.id">
        <br v-if="part.type === 'br'" />
        <span v-else-if="part.type === 'highlight'" class="text-primary-500">{{ part.content }}</span>
        <template v-else>{{ part.content }}</template>
      </template>
    </h1>
    <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
      {{ data.description }}
    </p>
  </div>
</template>
