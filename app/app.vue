<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { ref, computed } from 'vue'

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

// ── PWA INSTALL LOGIC ────────────────────────────────────────────────────────
const deferredPrompt = ref<any>(null)
const showInstallBtn = ref(false)
const showInstallGuide = ref(false)

if (import.meta.client) {
  // Register the minimal service worker to enable PWA install prompts
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* Silent fail */
    })
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallBtn.value = true
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
    showInstallBtn.value = false
  })
}

async function installApp() {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    deferredPrompt.value = null
    showInstallBtn.value = false
  }
}
</script>

<template>
  <UApp>
    <!-- Installation Guide Modal (Nuxt UI) -->
    <!-- Installation Guide Modal (Nuxt UI v4 API) -->
    <!-- Installation Guide Modal (Nuxt UI v4 API) -->
    <UModal 
      v-model:open="showInstallGuide" 
      class="bg-[#020a14] border border-hud-accent/40 shadow-[0_0_120px_rgba(0,0,0,1)] ring-1 ring-hud-accent/30 overflow-hidden"
      :ui="{ 
        content: 'p-0 sm:p-0 relative', 
        header: 'p-4 md:p-8', 
        body: 'p-4 md:p-8', 
        footer: 'p-4 md:p-8',
        overlay: 'backdrop-blur-md bg-black/60' 
      }"
    >
      <!-- Broken OS Aesthetic Overlays -->
      <div class="absolute inset-0 opacity-20 scanline-overlay pointer-events-none z-0" />
      <div class="absolute inset-0 opacity-10 grid-overlay pointer-events-none z-0" />

      <template #header>
        <div class="flex items-center justify-between relative z-20">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-hud-accent/10 flex items-center justify-center">
              <UIcon name="i-lucide-monitor-smartphone" class="text-hud-accent w-6 h-6 animate-pulse" />
            </div>
            <h3 class="font-orbitron font-black text-white uppercase tracking-[0.2em]">Install_System</h3>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            class="rounded-full cursor-pointer hover:bg-white/10"
            @click="showInstallGuide = false"
          />
        </div>
      </template>
      
      <template #body>
        <div class="relative z-10 space-y-8 bento-flicker">
          <!-- Broken OS Aesthetic Overlays -->
          <div class="absolute inset-0 opacity-20 scanline-overlay pointer-events-none -m-8" />
          <div class="absolute inset-0 opacity-10 grid-overlay pointer-events-none -m-8" />

          <div class="space-y-4 relative z-10">
            <p class="font-mono text-[10px] text-hud-accent tracking-[0.4em] uppercase">PROCEDURE_01 // ANDROID</p>
            <div class="space-y-3">
              <p class="text-sm text-white/50 leading-relaxed font-mono text-left">
                <span class="text-white font-bold">CHROME:</span> TAP THE MENU <span class="text-white">[⋮]</span> AND SELECT <span class="text-hud-accent font-bold">"INSTALL APP"</span> OR <span class="text-hud-accent font-bold">"ADD TO HOME SCREEN"</span>.
              </p>
              <p class="text-sm text-white/50 leading-relaxed font-mono text-left">
                <span class="text-white font-bold">NATIVE BROWSER:</span> TAP THE MENU <span class="text-white">[≡]</span> AND SELECT <span class="text-hud-accent font-bold">"ADD PAGE TO"</span> > <span class="text-hud-accent font-bold">"HOME SCREEN"</span>.
              </p>
            </div>
          </div>
          
          <div class="space-y-3 border-t border-white/5 pt-8 relative z-10">
            <p class="font-mono text-[10px] text-pink-400 tracking-[0.4em] uppercase">PROCEDURE_02 // IOS_SAFARI</p>
            <p class="text-sm text-white/50 leading-relaxed font-mono text-left">
              TAP THE <span class="text-white font-bold">SHARE ICON</span> (SQUARE + ARROW), SCROLL DOWN, AND SELECT <span class="text-pink-400 font-bold">"ADD TO HOME SCREEN"</span>.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="relative z-20 w-full">
          <UButton 
            block
            color="neutral"
            variant="subtle"
            class="font-mono text-[10px] tracking-[0.5em] uppercase py-4 rounded-2xl cursor-pointer hover:bg-hud-accent/10 border border-white/5"
            @click="showInstallGuide = false"
          >
            CLOSE_TERMINAL [ESC]
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Custom Glassy SPA Navbar -->
    <ClientOnly>
      <header
        class="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b"
        :class="isGlassy ? 'bg-black/50 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pt-4 pb-2' : 'bg-transparent border-transparent pt-6 pb-2'"
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

        <div class="flex flex-col items-center gap-2">
          <p class="font-mono text-[10px] text-hud-accent/60 tracking-[0.4em] uppercase">
            DISTRIBUTION
          </p>
          <button
            @click="showInstallBtn ? installApp() : showInstallGuide = true"
            class="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-hud-accent/20 hover:border-hud-accent/40 transition-all active:scale-95 shadow-lg"
          >
            <UIcon 
              :name="showInstallBtn ? 'i-lucide-download' : 'i-lucide-monitor-smartphone'" 
              class="w-4 h-4 text-hud-accent group-hover:animate-bounce" 
            />
            <span class="font-orbitron text-[10px] text-white tracking-[0.2em] uppercase">
              {{ showInstallBtn ? 'Install App' : 'Get App Info' }}
            </span>
          </button>
          <div class="flex items-center gap-2 opacity-30">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span class="font-mono text-[9px] text-white tracking-widest uppercase">System_Sync_Active</span>
          </div>
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
