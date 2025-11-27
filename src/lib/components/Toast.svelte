<script lang="ts">
  import { X, CheckCircle, AlertCircle, Info } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  interface Props {
    type?: 'success' | 'error' | 'info';
    message: string;
    visible?: boolean;
    onclose?: () => void;
    duration?: number;
  }

  let {
    type = 'info',
    message,
    visible = $bindable(false),
    onclose,
    duration = 5000
  }: Props = $props();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  $effect(() => {
    if (visible && duration > 0) {
      const timeout = setTimeout(() => {
        visible = false;
        onclose?.();
      }, duration);
      return () => clearTimeout(timeout);
    }
  });

  function handleClose() {
    visible = false;
    onclose?.();
  }

  const Icon = icons[type];
</script>

{#if visible}
  <div
    class="fixed bottom-4 right-4 z-[100] max-w-sm"
    transition:fly={{ y: 100, duration: 300 }}
  >
    <div class={`${colors[type]} text-white rounded-lg shadow-lg p-4 flex items-start gap-3`}>
      <Icon class="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p class="flex-1 text-sm">{message}</p>
      <button
        onclick={handleClose}
        class="flex-shrink-0 hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
{/if}
