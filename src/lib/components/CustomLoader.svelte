<script lang="ts">
  let { message = 'Mohon tunggu sebentar...' }: { message?: string } = $props();
</script>

<div class="flex flex-col items-center justify-center gap-4 py-12">
  <!-- Tree SVG with pulse animation -->
  <div class="relative w-24 h-24 animate-pulse">
    <img
      src="/tree.svg"
      alt="Loading..."
      class="w-full h-full object-contain"
    />
  </div>

  <!-- Loading text -->
  <p class="text-gray-700 text-center font-medium animate-pulse">
    {message}
  </p>

  <!-- Animated dots -->
  <div class="flex gap-1">
    <span class="w-2 h-2 bg-christmas-red rounded-full animate-bounce" style="animation-delay: 0s;"></span>
    <span class="w-2 h-2 bg-christmas-red rounded-full animate-bounce" style="animation-delay: 0.1s;"></span>
    <span class="w-2 h-2 bg-christmas-red rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
  </div>
</div>
