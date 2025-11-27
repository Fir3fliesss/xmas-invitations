<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Button from '$lib/components/Button.svelte';
  import { STORAGE_KEYS } from '$lib/constants';
  import { TreePine, Lock, User } from 'lucide-svelte';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let isLoading = $state(false);

  // Simple hardcoded credentials (in production, use proper auth)
  // TODO: Replace with your actual admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'natal2025';

  async function handleLogin(e: Event) {
    e.preventDefault();
    
    if (!username || !password) {
      error = 'Username dan password harus diisi';
      return;
    }

    isLoading = true;
    error = '';

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create simple token (in production, use proper JWT)
      const token = btoa(`${username}:${Date.now()}`);
      
      if (browser) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
        goto('/admin');
      }
    } else {
      error = 'Username atau password salah';
    }

    isLoading = false;
  }
</script>

<svelte:head>
  <title>Admin Login - Celebrate Christmas</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-christmas-red-dark to-christmas-red">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <TreePine class="w-8 h-8 text-white" />
      </div>
      <h1 class="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
      <p class="text-white/70 mt-1">Celebrate Christmas</p>
    </div>

    <!-- Login Form -->
    <form onsubmit={handleLogin} class="bg-white rounded-xl shadow-xl p-6 space-y-5">
      <div>
        <label for="username" class="form-label flex items-center gap-2">
          <User class="w-4 h-4" />
          Username
        </label>
        <input
          type="text"
          id="username"
          bind:value={username}
          class="form-input"
          placeholder="Masukkan username"
          autocomplete="username"
        />
      </div>

      <div>
        <label for="password" class="form-label flex items-center gap-2">
          <Lock class="w-4 h-4" />
          Password
        </label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="form-input"
          placeholder="Masukkan password"
          autocomplete="current-password"
        />
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      {/if}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        class="w-full"
        loading={isLoading}
      >
        Login
      </Button>
    </form>

    <!-- Back link -->
    <div class="text-center mt-6">
      <a href="/" class="text-white/70 hover:text-white transition-colors">
        ← Kembali ke website
      </a>
    </div>
  </div>
</div>
