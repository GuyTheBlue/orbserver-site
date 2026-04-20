<template>
  <div class="fixed bottom-4 right-4 z-[9999] bg-black/80 text-cyan-400 font-mono text-sm px-4 py-2 rounded-lg border border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.2)] pointer-events-none backdrop-blur-sm">
    <span class="block sm:hidden">XS (Mobile / &lt; 640px)</span>
    <span class="hidden sm:block md:hidden">SM (640px - 767px)</span>
    <span class="hidden md:block lg:hidden">MD (Tablet / 768px - 1023px)</span>
    <span class="hidden lg:block xl:hidden">LG (Desktop / 1024px - 1279px)</span>
    <span class="hidden xl:block 2xl:hidden">XL (Widescreen / 1280px - 1535px)</span>
    <span class="hidden 2xl:block">2XL (Ultrawide / >= 1536px)</span>
  </div>
</template>
