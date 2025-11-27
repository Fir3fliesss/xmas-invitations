<script lang="ts">
  import { onMount } from 'svelte';

  let scrollY = $state(0);
  let innerHeight = $state(0);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:window bind:scrollY bind:innerHeight />

<div class="parallax-wrapper fixed inset-0 pointer-events-none z-0 overflow-hidden">
  <!-- Side Left Decoration -->
  <div 
    class="absolute left-0 top-0 w-[150px] md:w-[300px] opacity-60 transition-transform duration-100 ease-out will-change-transform"
    style="transform: translate3d(0, {scrollY * 0.1}px, 0);"
  >
    <img src="/side-left.svg" alt="Decoration Left" class="w-full h-auto" />
  </div>

  <!-- Christmas Tree (Bottom Right) -->
  <div 
    class="absolute -right-10 md:right-0 bottom-0 w-[200px] md:w-[400px] opacity-80 transition-transform duration-100 ease-out will-change-transform"
    style="transform: translate3d(0, {-scrollY * 0.05}px, 0);"
  >
    <img src="/tree.svg" alt="Christmas Tree" class="w-full h-auto" />
  </div>

  <!-- Icon 1 (Floating top right) -->
  <div 
    class="absolute right-[10%] top-[15%] w-16 md:w-24 opacity-50 animate-pulse"
    style="transform: translate3d(0, {scrollY * 0.3}px, 0) rotate(15deg);"
  >
    <img src="/icon1.svg" alt="Decoration 1" class="w-full h-auto" />
  </div>

  <!-- Icon 2 (Floating mid left) -->
  <div 
    class="absolute left-[5%] top-[45%] w-20 md:w-28 opacity-50"
    style="transform: translate3d(0, {scrollY * 0.2}px, 0) rotate(-10deg);"
  >
     <div class="animate-bounce" style="animation-duration: 4s;">
       <img src="/icon2.svg" alt="Decoration 2" class="w-full h-auto" />
     </div>
  </div>
  
  <!-- Extra Icon 1 instance (Bottom left) -->
  <div 
    class="absolute left-[15%] bottom-[15%] w-12 md:w-20 opacity-30 hidden md:block"
    style="transform: translate3d(0, {-scrollY * 0.15}px, 0) rotate(45deg);"
  >
    <img src="/icon1.svg" alt="Decoration 1" class="w-full h-auto" />
  </div>
</div>
