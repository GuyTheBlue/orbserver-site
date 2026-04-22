<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTerminalTheme, type TerminalTheme } from '~/composables/useTerminalTheme'

const { currentTheme, setTheme } = useTerminalTheme()
const isOpen = ref(false)
const isMobile = ref(false)

const themes: { id: TerminalTheme, label: string, color: string }[] = [
  { id: 'cyan', label: 'CYAN', color: '#00f2ff' },
  { id: 'amber', label: 'AMBER', color: '#ffb000' },
  { id: 'pink', label: 'PINK', color: '#ec4899' },
  { id: 'green', label: 'GREEN', color: '#00dc82' }
]

function checkMobile() {
  isMobile.value = window.innerWidth < 640
  if (!isMobile.value) isOpen.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))

function selectTheme(id: TerminalTheme) {
  setTheme(id)
  isOpen.value = false
}

// Close if clicked outside
const container = ref<HTMLElement | null>(null)
if (import.meta.client) {
  window.addEventListener('click', (e) => {
    if (container.value && !container.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  })
}

// Get the color for the currently active theme
const activeColor = computed(() => themes.find(t => t.id === currentTheme.value)?.color || '#00f2ff')
</script>

<template>
  <div 
    ref="container"
    class="relative pointer-events-auto"
  >
    <!-- ── DESKTOP/TABLET: HORIZONTAL DISPLAY ── -->
    <div class="hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-md p-1.5 rounded-lg">
      <button
        v-for="t in themes"
        :key="t.id"
        class="group relative w-7 h-7 rounded-sm overflow-hidden border-none cursor-pointer shrink-0 outline-none focus:outline-none"
        @click="selectTheme(t.id)"
      >
        <div
          class="absolute inset-0 transition-opacity duration-300"
          :style="{ 
            backgroundColor: t.color, 
            opacity: currentTheme === t.id ? 1 : 0.2 
          }"
        />
        <div class="absolute inset-0 pointer-events-none opacity-20 panel-scanlines" />
        <div 
          v-if="currentTheme === t.id"
          class="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"
        />
      </button>
    </div>

    <!-- ── MOBILE (XS): ALIGNED ACCORDION ── -->
    <div class="flex sm:hidden relative items-center justify-end w-8 h-8">
      <!-- 1. THE ANCHOR BLOCK -->
      <button 
        @click.stop="isOpen = !isOpen"
        class="relative w-8 h-8 rounded-sm overflow-hidden border-none cursor-pointer z-10 outline-none focus:outline-none"
      >
        <div class="absolute inset-0" :style="{ backgroundColor: activeColor }" />
        <div class="absolute inset-0 pointer-events-none opacity-20 panel-scanlines" />
      </button>

      <!-- 2. THE PREMIUM OVERLAY (Compensated Offset) -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="isOpen"
          class="absolute top-[-8px] right-[-8px] z-[100] flex flex-col gap-2 p-2 bg-black/70 backdrop-blur-xl rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)]"
        >
          <button
            v-for="t in themes"
            :key="t.id"
            class="relative w-8 h-8 rounded-sm overflow-hidden border-none cursor-pointer shrink-0 outline-none focus:outline-none"
            @click.stop="selectTheme(t.id)"
          >
            <div
              class="absolute inset-0"
              :style="{ 
                backgroundColor: t.color, 
                opacity: currentTheme === t.id ? 1 : 0.5 
              }"
            />
            <div class="absolute inset-0 pointer-events-none opacity-20 panel-scanlines" />
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>
