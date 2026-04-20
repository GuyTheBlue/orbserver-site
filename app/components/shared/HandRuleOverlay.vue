<script setup lang="ts">
defineProps<{
  imageUrl: string
}>()

const model = defineModel<boolean>()
</script>

<template>
  <USlideover
    v-model="model"
    title="THE PURE 'HAND RULE' METHOD // NO_TECH_REQUIRED"
    :ui="{
      width: 'max-w-xl md:max-w-2xl',
      background: 'bg-[#020a14]',
      header: 'border-b border-hud-accent/20 bg-hud-accent/5',
      body: 'p-0 h-full overflow-hidden',
      footer: 'hidden'
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full h-full">
        <h3 class="font-orbitron font-black text-hud-accent tracking-[0.2em] uppercase text-sm md:text-md">
          THE PURE 'HAND RULE' METHOD // NO_TECH_REQUIRED
        </h3>
      </div>
    </template>

    <template #body>
      <div class="relative h-full flex flex-col font-mono overflow-y-auto custom-scrollbar bento-flicker">
        <div class="panel-grid-mesh opacity-10" /><div class="panel-scanlines opacity-40" />

        <div class="relative z-10 p-6 md:p-10 space-y-12 pb-20">
          <p class="text-sm text-hud-accent/80 leading-relaxed italic border-b border-hud-accent/10 pb-8">
            When you have no tools, your body becomes the measuring device. The core concept is that at arm's length, certain hand shapes cover a consistent number of degrees in the sky.
          </p>

          <section>
            <h4 class="font-orbitron font-black text-white text-md tracking-wider mb-6 border-l-2 border-hud-accent pl-4 uppercase">
              1. Orient Without a Compass
            </h4>
            <div class="text-[11px] text-white/50 leading-relaxed space-y-4">
              <p>You first need to find your bearing (Azimuth) manually. This is a crucial first step.</p>
              <p>
                <span class="text-hud-accent/70 font-bold uppercase">Sunsets and Sunrises:</span>
                These are your most reliable compasses. If you know where the sun set (West) and where it rose (East), you can establish the four cardinal points.
              </p>
              <p>Standing with the sunset point on your left shoulder means you are facing North (0° Azimuth). South (180° Azimuth) is directly behind you.</p>
            </div>
          </section>

          <section>
            <h4 class="font-orbitron font-black text-white text-md tracking-wider mb-6 border-l-2 border-hud-accent pl-4 uppercase">
              2. The Final Measurement (Altitude)
            </h4>
            <p class="text-[11px] text-white/50 leading-relaxed">
              Once you are facing the correct direction, use your fist to measure the height (Altitude) of the moon. To measure 30° Altitude, you must stack three fists precisely.
            </p>
          </section>

          <!-- Technical Illustration -->
          <div class="space-y-4">
            <div class="relative aspect-square border border-hud-accent/30 rounded-lg overflow-hidden">
              <img
                :src="imageUrl"
                alt="Hand Rule Illustration"
                class="w-full h-full object-cover"
              >
              <div class="absolute inset-0 bg-hud-accent/5 mix-blend-overlay" />
            </div>
            <p class="text-[9px] text-hud-accent/40 text-center uppercase tracking-[0.3em]">
              FIG_01 // LUNAR_ALTITUDE_CALCULATION
            </p>
          </div>

          <section class="bg-hud-accent/5 p-6 border border-hud-accent/20 rounded-lg space-y-8">
            <h5 class="text-[10px] text-hud-accent tracking-[0.4em] uppercase">
              EXECUTION_PROTOCOL
            </h5>
            <div class="space-y-6">
              <div
                v-for="(step, i) in [
                  ['Fully Extend Your Arm', 'Your arm must be straight out. The Hand Rule fails if your elbow is bent.'],
                  ['The Horizon Line', 'Align the bottom of your first fist with the visible horizon.'],
                  ['The Ladder', 'Stack your second hand directly on top of the first (20° Altitude).'],
                  ['The Target', 'The Moon should appear at the top knuckle of the third fist (30° Altitude).']
                ]"
                :key="i"
                class="flex gap-4"
              >
                <span class="font-orbitron font-black text-hud-accent/40 text-lg leading-none">{{ (i+1).toString().padStart(2, '0') }}</span>
                <div>
                  <span class="block text-[11px] text-white uppercase tracking-widest mb-1">{{ step[0] }}</span>
                  <span class="block text-[10px] text-white/40 leading-tight">{{ step[1] }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(var(--hud-accent-rgb), 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--hud-accent-rgb), 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--hud-accent-rgb), 0.5);
}
</style>
