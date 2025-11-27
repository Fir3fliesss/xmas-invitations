<script lang="ts">
  // Removed transition to prevent stuck state
</script>

<div
  class="fixed inset-0 z-50 bg-[#8B1538] flex flex-col items-center justify-center text-white p-4"
>
  <div class="text-center space-y-6 animate-pulse">
    <div class="text-8xl mb-4 filter drop-shadow-lg animate-bounce">
      🎄
    </div>
    
    <div class="space-y-2">
      <h2 class="text-2xl md:text-3xl font-display font-bold tracking-widest text-gold">
        CELEBRATE CHRISTMAS
      </h2>
      <p class="text-white/80 font-script text-xl md:text-2xl">
        Sedang menyiapkan undangan...
      </p>
    </div>

    <div class="mt-8 w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
      <div class="h-full bg-gold w-1/2 animate-[shimmer_1.5s_infinite] rounded-full"></div>
    </div>
  </div>
</div>

<style>
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
</style>
