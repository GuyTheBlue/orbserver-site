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
      :ui="{ 
        content: 'p-0 sm:p-0 bg-transparent shadow-none ring-0 border-0 max-w-4xl w-full',
        overlay: 'backdrop-blur-md bg-black/60' 
      }"
    >
      <template #content>
        <div class="bg-[#020a14] border border-hud-accent/40 shadow-[0_0_120px_rgba(0,0,0,1)] ring-1 ring-hud-accent/30 overflow-hidden relative rounded-xl flex flex-col max-h-[90vh]">
          <!-- Broken OS Aesthetic Overlays -->
          <div class="absolute inset-0 opacity-20 scanline-overlay pointer-events-none z-0" />
          <div class="absolute inset-0 opacity-10 grid-overlay pointer-events-none z-0" />

          <!-- Header -->
          <div class="p-4 md:p-8 border-b border-white/5 relative z-20 bg-[#020a14]/80 backdrop-blur-sm">
            <div class="flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-hud-accent/10 flex items-center justify-center">
                    <UIcon name="i-lucide-monitor-smartphone" class="text-hud-accent w-6 h-6 animate-pulse" />
                  </div>
                  <h3 class="font-orbitron font-black text-hud-accent tracking-[0.1em] sm:tracking-[0.2em] uppercase text-xl md:text-3xl leading-tight">
                    INSTALL_SYSTEM // PWA_PROTOCOL
                  </h3>
                </div>
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  class="rounded-full text-hud-accent cursor-pointer hover:bg-white/10"
                  @click="showInstallGuide = false"
                />
              </div>

              <!-- Platform Deployment Notice -->
              <div class="p-4 border-l-2 border-amber-500 bg-amber-500/5 font-mono text-[10px] sm:text-xs tracking-wider text-amber-500/80 leading-relaxed uppercase">
                <span class="text-amber-500 font-bold mr-2">[NOTICE]:</span>
                The following installation instructions are specifically for <span class="text-white font-bold">mobile phone devices</span>. Desktop installation is supported via standard browser PWA protocols.
              </div>

              <UButton
                block
                color="neutral"
                variant="subtle"
                class="py-4 border border-hud-accent/40 text-hud-accent font-orbitron text-xs sm:text-sm tracking-[0.4em] uppercase font-bold cursor-pointer hover:bg-hud-accent/10"
                @click="showInstallGuide = false"
              >
                CLOSE INSTALL OVERLAY
              </UButton>
            </div>
          </div>
          
          <!-- Body -->
          <div class="p-6 md:p-12 relative z-10 space-y-12 bento-flicker bg-black/40 flex-1 overflow-y-auto custom-scrollbar">
            <div class="space-y-6 relative z-10">
              <div class="flex items-center gap-4 mb-4">
                <div class="h-6 w-1 bg-hud-accent" />
                <h4 class="font-orbitron font-black text-white text-lg sm:text-xl tracking-wider uppercase">
                  PROCEDURE_01 // ANDROID_DEVICES
                </h4>
              </div>
              <div class="space-y-4 p-6 border border-hud-accent/20 bg-hud-accent/5 rounded-xl">
                <p class="text-base sm:text-xl text-white/70 leading-relaxed font-mono">
                  <span class="text-hud-accent font-bold">CHROME:</span> TAP THE MENU <span class="text-white">[⋮]</span> AND SELECT <span class="text-hud-accent font-bold">"INSTALL APP"</span> OR <span class="text-hud-accent font-bold">"ADD TO HOME SCREEN"</span>.
                </p>
                <div class="h-[1px] w-full bg-white/5" />
                <p class="text-base sm:text-xl text-white/70 leading-relaxed font-mono">
                  <span class="text-hud-accent font-bold">NATIVE BROWSER:</span> TAP THE MENU <span class="text-white">[≡]</span> AND SELECT <span class="text-hud-accent font-bold">"ADD PAGE TO"</span> > <span class="text-hud-accent font-bold">"HOME SCREEN"</span>.
                </p>
              </div>
            </div>
            
            <div class="space-y-6 relative z-10 border-t border-white/5 pt-12 pb-12">
              <div class="flex items-center gap-4 mb-4">
                <div class="h-6 w-1 bg-pink-500" />
                <h4 class="font-orbitron font-black text-white text-lg sm:text-xl tracking-wider uppercase">
                  PROCEDURE_02 // IOS_SAFARI
                </h4>
              </div>
              <div class="p-6 border border-pink-500/20 bg-pink-500/5 rounded-xl">
                <p class="text-base sm:text-xl text-white/70 leading-relaxed font-mono">
                  TAP THE <span class="text-white font-bold">SHARE ICON</span> (SQUARE + ARROW), SCROLL DOWN, AND SELECT <span class="text-pink-500 font-bold">"ADD TO HOME SCREEN"</span>.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 md:p-8 border-t border-white/5 relative z-20 bg-[#020a14]">
            <UButton 
              block
              color="neutral"
              variant="ghost"
              class="font-mono text-[10px] tracking-[0.5em] uppercase py-4 cursor-pointer hover:text-hud-accent"
              @click="showInstallGuide = false"
            >
              TERMINATE_OVERLAY [ESC]
            </UButton>
          </div>
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
    <UFooter class="bg-black border-t border-white/5 relative z-50 py-24 md:py-32 overflow-hidden">
      <!-- Soft Static Accent Scanlines -->
      <div 
        class="absolute inset-0 opacity-[0.05] pointer-events-none z-[1]" 
        :style="{ background: `repeating-linear-gradient(0deg, rgba(var(--hud-accent-rgb), 0.3) 0px, rgba(var(--hud-accent-rgb), 0.3) 1px, transparent 1px, transparent 6px)` }"
      />

      <!-- Animated Accent Sweep -->
      <div class="absolute inset-0 z-[2] pointer-events-none overflow-hidden opacity-20">
        <div 
          class="absolute inset-x-0 h-[120px] animate-scanline-sweep"
          :style="{ background: `linear-gradient(to bottom, transparent, var(--hud-accent), transparent)` }"
        />
      </div>

      <!-- Digital Artifacts (Erratic & Sticky) -->
      <div class="absolute inset-0 z-[3] pointer-events-none overflow-hidden opacity-20">
        <!-- Rapid Jitter (Calmed) -->
        <div class="absolute inset-x-0 h-[1px] bg-white/40 animate-erratic-line" style="top: 20%" />
        
        <!-- Sticky Persistence Line (Sticks then Fades) -->
        <div 
          class="absolute inset-x-0 h-[1px] animate-sticky-line" 
          :style="{ backgroundColor: 'var(--hud-accent)', top: '45%' }" 
        />
        <div 
          class="absolute inset-x-0 h-[1px] animate-sticky-line" 
          :style="{ backgroundColor: 'var(--hud-accent)', top: '75%', animationDelay: '-4s' }" 
        />
      </div>


      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-col items-center md:items-start gap-3">
          <p class="font-mono text-[9px] text-white/20 tracking-[0.8em] uppercase">
            SYSTEM // ORBSERVER
          </p>
          <p class="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">
            Built with Nuxt 4 &bull; &copy; {{ new Date().getFullYear() }} <span class="text-white">ORBSERVER-SITE</span>
          </p>
        </div>

        <div class="flex flex-col items-center gap-4">
          <p class="font-mono text-[9px] text-hud-accent/40 tracking-[0.8em] uppercase">
            DEPLOYMENT
          </p>
          <button
            @click="showInstallBtn ? installApp() : showInstallGuide = true"
            class="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-hud-accent/10 hover:border-hud-accent/30 transition-all active:scale-95"
          >
            <UIcon 
              :name="showInstallBtn ? 'i-lucide-download' : 'i-lucide-monitor-smartphone'" 
              class="w-4 h-4 text-hud-accent group-hover:animate-pulse" 
            />
            <span class="font-orbitron text-[9px] text-white tracking-[0.4em] uppercase">
              {{ showInstallBtn ? 'Install App' : 'Get App Info' }}
            </span>
          </button>
          <div class="flex items-center gap-2 opacity-20">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span class="font-mono text-[8px] text-white tracking-[0.4em] uppercase">System_Sync_Active</span>
          </div>
        </div>

        <div class="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <p class="font-mono text-[9px] text-cyan-400/30 tracking-[0.8em] uppercase">
            CREATED BY
          </p>
          <a
            href="https://g-squared.co.za"
            target="_blank"
            class="group flex items-center gap-3 transition-all hover:opacity-100 opacity-40"
          >
            <span class="font-orbitron text-[10px] text-white tracking-[0.3em] group-hover:text-cyan-400 transition-colors uppercase">gsquared</span>
            <div class="w-2 h-2 rounded-full bg-cyan-400/50 shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
          </a>
        </div>
      </div>
    </UFooter>
  </UApp>
</template>
