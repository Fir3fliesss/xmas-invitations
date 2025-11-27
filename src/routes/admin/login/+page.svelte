<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';
  import Button from '$lib/components/Button.svelte';
  import { STORAGE_KEYS } from '$lib/constants';
  import { TreePine, Lock, User } from 'lucide-svelte';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let isLoading = $state(false);

  async function handleLogin(e: Event) {
    e.preventDefault();
    
    if (!username || !password) {
      error = 'Username dan password harus diisi';
      return;
    }

    isLoading = true;
    error = '';

    try {
      // Query admin user from database
      const { data: adminUser, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      console.log('Login attempt:', { username, foundUser: !!adminUser, fetchError });

      if (fetchError) {
        console.error('Login fetch error:', fetchError);
        error = 'Terjadi kesalahan saat login';
        isLoading = false;
        return;
      }

      if (!adminUser) {
        error = 'Username atau password salah';
        isLoading = false;
        return;
      }

      // Simple password comparison (in production, use bcrypt/scrypt)
      if (password !== adminUser.password_hash) {
        error = 'Username atau password salah';
        isLoading = false;
        return;
      }

      // Create simple token (in production, use proper JWT)
      const token = btoa(`${username}:${Date.now()}`);
      
      if (browser) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
        goto('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      error = 'Terjadi kesalahan saat login';
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
