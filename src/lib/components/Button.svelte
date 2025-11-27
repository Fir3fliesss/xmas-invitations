<script lang="ts">
  import { LoaderCircle } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    href?: string;
    class?: string;
    children: Snippet;
    onclick?: () => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    href,
    class: className = '',
    children,
    onclick
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent text-white hover:bg-white/10'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
</script>

{#if href}
  <a {href} class={classes}>
    {@render children()}
  </a>
{:else}
  <button
    {type}
    class={classes}
    disabled={disabled || loading}
    {onclick}
  >
    {#if loading}
      <LoaderCircle class="w-5 h-5 animate-spin" />
      <span>Loading...</span>
    {:else}
      {@render children()}
    {/if}
  </button>
{/if}
