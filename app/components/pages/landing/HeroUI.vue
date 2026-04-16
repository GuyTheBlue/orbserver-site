<script setup lang="ts">
// Dummy real-time stats logic
const stats = [
  { label: 'Distance', value: '384,400 km' },
  { label: 'Illumination', value: '98.4%' },
  { label: 'Phase', value: 'Waning Gibbous' }
]
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    
    <!-- Left Typography -->
    <div class="absolute bottom-[20%] left-[5%] md:left-[10%] max-w-xl text-left pointer-events-auto">
      <h1 class="text-6xl md:text-8xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none">
        know thy <br/> moon.
      </h1>
      <p class="mt-6 text-xl md:text-2xl text-teal-100 font-light tracking-wide uppercase drop-shadow">
        Real-time stats. Real-time facts.
      </p>
    </div>

    <!-- Right Side Super-Tech Panels -->
    <!-- Pulling them up nicely to top-[15%] and shrinking gaps to fit perfectly natively -->
    <div class="absolute top-[15%] right-[5%] lg:right-[8%] flex flex-col gap-4 lg:gap-6 pointer-events-auto">
      <div 
        v-for="(stat, i) in stats" 
        :key="stat.label"
        class="group relative bg-[#020b14]/40 backdrop-blur-xl border-y border-white/5 border-l-2 border-r border-l-cyan-400 border-r-white/5 p-4 md:p-5 lg:p-6 rounded-r-lg shadow-[inset_0_0_20px_rgba(0,255,255,0.02),0_10px_30px_rgba(0,0,0,0.5)] animate-floating
               w-44 md:w-56 lg:w-64 transition-all hover:bg-[#020b14]/60 hover:border-l-cyan-300 overflow-hidden"
        :style="{ animationDelay: `${i * 0.3}s` }"
      >
        <!-- Sexy sweeping light effect inside the glass -->
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Minimal tech scanning line graphic -->
        <div class="absolute top-0 left-0 w-12 h-[1px] bg-cyan-400/80"></div>
        <div class="absolute bottom-0 right-0 w-6 h-[1px] bg-cyan-400/40"></div>
        
        <p class="text-[9px] md:text-[10px] text-cyan-300/80 font-mono uppercase tracking-[0.35em] mb-1 leading-none">{{ stat.label }}</p>
        <p class="text-2xl md:text-3xl lg:text-4xl text-white font-bold tracking-tight drop-shadow-sm leading-none">{{ stat.value }}</p>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.animate-floating {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
</style>
