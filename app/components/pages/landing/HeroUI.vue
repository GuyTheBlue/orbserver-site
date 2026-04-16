<script setup lang="ts">
// Dummy real-time stats logic
const stats = [
  { label: 'Distance', value: '384,400 km', scatter: -10 },
  { label: 'Illumination', value: '98.4%', scatter: 15 },
  { label: 'Phase', value: 'Waning Gibbous', scatter: -5 },
  { label: 'Gravity', value: '1.62 m/s²', scatter: 22 },
  { label: 'Orbital Spd', value: '3,683 km/h', scatter: -18 }
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

    <!-- Dynamic Super-Tech Panels -->
    <div class="absolute top-[15%] sm:top-[15%] xl:top-[10%] left-2 right-2 sm:left-auto sm:right-[5%] lg:right-[8%] pointer-events-auto h-[70vh] sm:h-auto z-[70]">
      <!-- XS runs absolute weaving natively. SM runs flex-col cleanly stacked! -->
      <div class="w-full h-full sm:flex sm:flex-col sm:gap-3 lg:gap-5">
        <div 
          v-for="(stat, i) in stats" 
          :key="stat.label"
          class="group bg-[#020b14]/40 backdrop-blur-xl border-y border-white/5 border-r p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 shadow-[inset_0_0_20px_rgba(0,255,255,0.02),0_10px_30px_rgba(0,0,0,0.5)] animate-floating
                 w-36 sm:w-40 md:w-48 lg:w-56 xl:w-72 transition-all hover:bg-[#020b14]/60 hover:border-l-cyan-300 overflow-hidden
                 border-l-cyan-400 border-l-[1px] sm:border-l-2 border-r-white/5 rounded-r-lg"
          :class="[
            i === 0 ? 'max-sm:absolute max-sm:top-[8%] max-sm:right-[6%]' :
            i === 1 ? 'max-sm:absolute max-sm:top-[28%] max-sm:right-[2%]' :
            i === 2 ? 'max-sm:absolute max-sm:top-[50%] max-sm:right-[15%]' :
            i === 3 ? 'max-sm:absolute max-sm:top-[2%] max-sm:left-[15%] max-sm:border-r-cyan-400 max-sm:border-r-[1px] max-sm:border-l-white/5 max-sm:rounded-l-lg max-sm:rounded-r-none' :
            'max-sm:absolute max-sm:top-[22%] max-sm:left-[5%] max-sm:border-r-cyan-400 max-sm:border-r-[1px] max-sm:border-l-white/5 max-sm:rounded-l-lg max-sm:rounded-r-none'
          ]"
          :style="{ animationDelay: `${i * 0.3}s`, '--scatter-x': `${stat.scatter}px` }"
        >
          <!-- Sexy sweeping light effect inside the glass -->
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"></div>
          
          <!-- Majestic Custom Hexagon Cluster floating freely inside the glass bounds -->
          <svg 
            class="absolute w-16 md:w-20 lg:w-28 h-auto text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.6)] transition-all duration-700 z-30 pointer-events-none mix-blend-screen" 
            viewBox="0 0 100 150" 
            :style="{ 
              top: `${20 + ((i * 43) % 60)}%`,
              left: `${-10 + ((i * 37) % 120)}%`,
              transform: `translate(-50%, -50%) scale(${1 + (i % 2) * 0.4}) rotate(${(i * 55) - 90}deg)`,
              maskImage: 'radial-gradient(circle at center, black 10%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 72%)'
            }"
          >
            <!-- Core Structure (2 Large interlocking) -->
            <polygon points="30,40 50,28 70,40 70,64 50,76 30,64" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="1.5" />
            <polygon points="30,88 50,76 70,88 70,112 50,124 30,112" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" />
            
            <!-- Structural Flankers (4 Small Linked Hubs) -->
            <polygon points="10,28 20,22 30,28 30,40 20,46 10,40" fill="none" stroke="currentColor" stroke-width="1" />
            <polygon points="70,28 80,22 90,28 90,40 80,46 70,40" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1" />
            <polygon points="10,76 20,70 30,76 30,88 20,94 10,88" fill="none" stroke="currentColor" stroke-width="1" />
            <polygon points="70,76 80,70 90,76 90,88 80,94 70,88" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
          
          <!-- Minimal tech scanning line graphic -->
          <div class="absolute top-0 left-0 w-8 sm:w-12 h-[1px] bg-cyan-400/80" :class="(i === 3 || i === 4) ? 'max-sm:right-0 max-sm:left-auto' : ''"></div>
          <div class="absolute bottom-0 right-0 w-4 sm:w-6 h-[1px] bg-cyan-400/40" :class="(i === 3 || i === 4) ? 'max-sm:left-0 max-sm:right-auto' : ''"></div>
          
          <p class="text-[5px] sm:text-[8px] md:text-[9px] xl:text-[10px] text-cyan-300/80 font-mono uppercase tracking-[0.2em] sm:tracking-[0.35em] mb-1 sm:mb-1 leading-none" 
             :class="(i === 3 || i === 4) ? 'max-sm:text-right' : ''">{{ stat.label }}</p>
          <p class="text-[10px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-bold tracking-tight drop-shadow-sm leading-none" 
             :class="(i === 3 || i === 4) ? 'max-sm:text-right' : ''">{{ stat.value }}</p>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.animate-floating {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translate(var(--scatter-x, 0px), 0px) rotate(0deg); }
  50% { transform: translate(calc(var(--scatter-x, 0px) - 6px), -10px) rotate(1deg); }
  100% { transform: translate(var(--scatter-x, 0px), 0px) rotate(0deg); }
}
</style>
