<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'

// Safely tracked scrolling coordinates for the dynamic transition
const { y } = useWindowScroll()

// The navbar appears transparent natively, but becomes truly "glassy" once the user scrolls past 50px
const isGlassy = computed(() => y.value > 50)
</script>

<template>
  <UApp>
    <!-- Custom Glassy SPA Navbar (Guarded by ClientOnly to prevent Hydration crashing on refresh) -->
    <ClientOnly>
      <header 
        class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b"
        :class="isGlassy ? 'bg-slate-950/40 backdrop-blur-md border-cyan-400/20 shadow-[0_4px_30px_rgba(0,255,255,0.05)] py-2' : 'bg-transparent border-transparent py-4'"
      >
        <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <NuxtLink to="/">
            <!-- Our massive highly-kerned Orbserver logo -->
            <SharedAppLogo class="w-auto h-8 md:h-10 shrink-0 transition-transform hover:scale-105 drop-shadow-md" />
          </NuxtLink>

          <!-- SPA Anchor Links -->
          <nav class="hidden md:flex items-center gap-8">
            <a href="#stats" class="text-sm font-semibold text-white/70 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all">Telemetry</a>
            <a href="#mission" class="text-sm font-semibold text-white/70 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all">Mission</a>
            
            <UButton
              to="https://github.com/nuxt"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
              color="white"
              variant="ghost"
              class="opacity-80 hover:opacity-100"
            />
          </nav>
        </div>
      </header>
    </ClientOnly>

    <!-- The actual page orchestrator renders natively underneath! -->
    <UMain>
      <NuxtPage />
    </UMain>

    <!-- Deep-themed default footer -->
    <UFooter class="bg-slate-950 border-t border-white/5 relative z-50">
      <template #left>
        <p class="text-sm text-slate-500">
          Built with Nuxt 4 • © {{ new Date().getFullYear() }} Orbserver
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
