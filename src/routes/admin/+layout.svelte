<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { STORAGE_KEYS } from '$lib/constants';
  import { LogOut, TreePine } from 'lucide-svelte';
  import { page } from '$app/stores';

  let { children } = $props();
  let isAuthenticated = $state(false);

  onMount(() => {
    // Check if authenticated
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    isAuthenticated = !!token;

    // Redirect to login if not authenticated and not on login page
    if (!token && !$page.url.pathname.includes('/admin/login')) {
      goto('/admin/login');
    }
  });

  function logout() {
    if (browser) {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
      goto('/admin/login');
    }
  }
</script>

<div class="min-h-screen bg-gray-100">
  {#if isAuthenticated || $page.url.pathname.includes('/admin/login')}
    <!-- Admin Header -->
    {#if isAuthenticated}
      <header class="bg-christmas-red text-white shadow-lg">
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
  {/if}
</div>

<style>
  :global(body) {
    background: #f3f4f6 !important;
  }
</style>
