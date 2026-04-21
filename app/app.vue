<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'

// Safely tracked scrolling coordinates for the dynamic transition
const { y } = useWindowScroll()

// The navbar appears transparent natively, but becomes truly "glassy" once the user scrolls past 50px
const isGlassy = computed(() => y.value > 50)

// ── SEO & SOCIAL METADATA ────────────────────────────────────────────────────
useSeoMeta({
  title: 'ORBSERVER // Lunar Telemetry Dashboard',
  ogTitle: 'ORBSERVER // Lunar Telemetry Dashboard',
  description: 'A high-fidelity, real-time lunar observation and orbital synchronisation dashboard. Uses your latitude.',
  ogDescription: 'A high-fidelity, real-time lunar observation and orbital synchronisation dashboard. Uses your latitude.',
  ogImage: 'https://orbserver.g-squared.co.za/social_orbserver.jpg',
  ogImageAlt: 'ORBSERVER // Lunar Telemetry Dashboard - Real-time orbital visualization',
  ogUrl: 'https://orbserver.g-squared.co.za/',
  ogType: 'website',
  ogSiteName: 'Orbserver',
  twitterCard: 'summary_large_image',
  twitterTitle: 'ORBSERVER // Lunar Telemetry Dashboard',
  twitterDescription: 'A high-fidelity, real-time lunar observation and orbital synchronisation dashboard.',
  twitterImage: 'https://orbserver.g-squared.co.za/social_orbserver.jpg',
  twitterImageAlt: 'ORBSERVER // Lunar Telemetry Dashboard - Real-time orbital visualization',
  themeColor: '#000000',
  author: 'GSQUARED | Guy Meaker'
})
</script>

<template>
  <UApp>
    <!-- Custom Glassy SPA Navbar (Guarded by ClientOnly to prevent Hydration crashing on refresh) -->
    <ClientOnly>
      <header
        class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b"
        :class="isGlassy ? 'bg-black/50 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2' : 'bg-transparent border-transparent py-4'"
      >
        <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <NuxtLink to="/">
            <!-- Our massive highly-kerned Orbserver logo -->
            <SharedAppLogo class="w-auto h-8 md:h-10 shrink-0 transition-transform hover:scale-105 drop-shadow-md" />
          </NuxtLink>
        </div>
      </header>
    </ClientOnly>

    <UMain>
      <NuxtPage />
    </UMain>

    <!-- Narrative Lore: The Umph Anomaly -->
    <SharedStoryBanner />

    <!-- Deep-themed Terminal Footer -->
    <UFooter class="bg-black border-t border-white/5 relative z-50 py-12 overflow-hidden">
      <!-- subtle background scanlines in footer -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-col items-center md:items-start gap-2">
          <p class="font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase">
            SYSTEM // ORBSERVER
          </p>
          <p class="text-[11px] font-mono text-white/40 tracking-wider">
            Built with Nuxt 4 &bull; &copy; {{ new Date().getFullYear() }} <span class="text-white">ORBSERVER-SITE</span>
          </p>
        </div>

        <div class="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <p class="font-mono text-[10px] text-cyan-400/60 tracking-[0.4em] uppercase">
            CREATED BY
          </p>
          <a
            href="https://g-squared.co.za"
            target="_blank"
            class="group flex items-center gap-3 transition-all hover:opacity-100 opacity-60"
          >
            <span class="font-orbitron text-xs text-white tracking-[0.2em] group-hover:text-cyan-400 transition-colors uppercase">gsquared</span>
            <div class="w-2 h-2 rounded-full bg-cyan-400/50 shadow-[0_0_8px_rgba(0,255,255,0.8)] group-hover:animate-ping" />
          </a>
        </div>
      </div>
    </UFooter>
  </UApp>
</template>
