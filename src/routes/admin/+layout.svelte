<svelte:options runes={true} />

<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { STORAGE_KEYS } from '$lib/constants';
  import CustomLoader from '$lib/components/CustomLoader.svelte';
  import { LogOut, TreePine, Loader2 } from 'lucide-svelte';
  import { page } from '$app/stores';

  let { children } = $props();
  let isAuthenticated = $state(false);
  let isChecking = $state(true);

  onMount(() => {
    checkAuth();
  });

  // Re-check auth when page changes
  $effect(() => {
    if (browser && $page.url.pathname) {
      checkAuth();
    }
  });

  function checkAuth() {
    if (!browser) return;

    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    isAuthenticated = !!token;

    // Don't redirect if we are already on the login page
    const isLoginPage = $page.url.pathname.includes('/admin/login');

    if (!token && !isLoginPage) {
      goto('/admin/login');
    }

    // Small delay to prevent flash
    setTimeout(() => {
      isChecking = false;
    }, 100);
  }

  function logout() {
    if (browser) {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      isAuthenticated = false;
      goto('/admin/login');
    }
  }
</script>

<div class="min-h-screen bg-gray-100 font-sans">
  {#if isChecking}
    <div class="min-h-screen flex flex-col items-center justify-center">
      <CustomLoader message="Memeriksa autentikasi..." />
    </div>
  {:else if isAuthenticated || $page.url.pathname.includes('/admin/login')}
    <!-- Admin Header -->
    {#if isAuthenticated && !$page.url.pathname.includes('/admin/login')}
      <header class="bg-christmas-red text-white shadow-lg sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <TreePine class="w-6 h-6" />
            <h1 class="font-display text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <button
            onclick={logout}
            class="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut class="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>
    {/if}

    <!-- Content -->
    <main>
      {@render children()}
    </main>
  {:else}
    <!-- Fallback redirecting state -->
    <div class="min-h-screen flex items-center justify-center">
      <p class="text-gray-500">Mengalihkan...</p>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background: #f3f4f6 !important;
  }
</style>
