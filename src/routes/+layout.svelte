<script lang="ts">
  import '../app.css';
  import Snowfall from '$lib/components/Snowfall.svelte';
  import { userStore } from '$lib/stores/user';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let { children } = $props();

  onMount(() => {
    console.log('Layout mounted, loading user store...');
    userStore.load();
  });
</script>

<svelte:head>
  <title>Celebrate Christmas - Undangan Natal</title>
  <meta name="description" content="Light Up Christmas With Christ - GBI Jl. Tapos Cibinong. Bergabunglah dalam sukacita Natal bersama kami!" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:title" content="Celebrate Christmas - Undangan Natal" />
  <meta property="og:description" content="Light Up Christmas With Christ - GBI Jl. Tapos Cibinong. Bergabunglah dalam sukacita Natal bersama kami!" />
  <meta property="og:image" content="{$page.url.origin}/poster.jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={$page.url.href} />
  <meta property="twitter:title" content="Celebrate Christmas - Undangan Natal" />
  <meta property="twitter:description" content="Light Up Christmas With Christ - GBI Jl. Tapos Cibinong. Bergabunglah dalam sukacita Natal bersama kami!" />
  <meta property="twitter:image" content="{$page.url.origin}/poster.jpeg" />
</svelte:head>

<div class="min-h-screen relative">
  <!-- Background decorations -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden">
    <!-- Tree silhouettes -->
    <div class="absolute bottom-0 left-0 w-64 h-96 opacity-20">
      <svg viewBox="0 0 100 150" class="w-full h-full fill-current text-black">
        <polygon points="50,0 100,150 0,150" />
      </svg>
    </div>
    <div class="absolute bottom-0 right-0 w-48 h-72 opacity-15">
      <svg viewBox="0 0 100 150" class="w-full h-full fill-current text-black">
        <polygon points="50,0 100,150 0,150" />
      </svg>
    </div>
  </div>

  <!-- Snowfall effect -->
  <Snowfall />

  <!-- Main content -->
  <main class="relative z-10">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="relative z-10 text-center py-6 text-white/60 text-sm">
    <p>Made with ❤️ by Rohkris Penus</p>
    <p class="mt-1">🎄 Merry Christmas 2025 🎄</p>
  </footer>
</div>
