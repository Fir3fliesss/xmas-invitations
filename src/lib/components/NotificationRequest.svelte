<script lang="ts">
  import { Bell, X } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  import Button from './Button.svelte';
  import { EVENT_INFO } from '$lib/constants';
  import { calculateCountdown } from '$lib/utils/countdown';

  let visible = $state(false);

  function checkPermission() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      // Check if user has dismissed it recently (session storage)
      const dismissed = sessionStorage.getItem('notification_dismissed');
      if (!dismissed) {
        setTimeout(() => {
          visible = true;
        }, 2000); // Show after 2 seconds
      }
    }
  }

  async function requestPermission() {
    if (!('Notification' in window)) return;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      visible = false;
      // Show a test notification immediately with countdown
      const eventDate = new Date(EVENT_INFO.date);
      const { days } = calculateCountdown(eventDate);

      new Notification('Notifikasi Diaktifkan! 🎄', {
        body: `Acara natal SMK PLUS PELITA NUSANTARA akan di mulai dalam ${days} hari lagi`,
        icon: '/icon1.svg'
      });
    } else {
      visible = false;
    }
  }

  function dismiss() {
    visible = false;
    sessionStorage.setItem('notification_dismissed', 'true');
  }

  $effect(() => {
    checkPermission();
  });
</script>

{#if visible}
  <div
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
    in:fly={{ y: 20, duration: 500 }}
    out:fade
  >
    <div class="card-glass p-4 border border-gold/30 shadow-lg relative overflow-hidden">
      <!-- Background glow -->
      <div class="absolute -top-10 -right-10 w-20 h-20 bg-gold/20 rounded-full blur-2xl"></div>

      <button
        class="absolute top-2 right-2 text-white/50 hover:text-white transition-colors"
        onclick={dismiss}
        aria-label="Tutup"
      >
        <X class="w-4 h-4" />
      </button>

      <div class="flex gap-4">
        <div class="shrink-0 w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
          <Bell class="w-6 h-6 text-gold animate-bounce" />
        </div>

        <div class="flex-1">
          <h3 class="font-bold text-white mb-1">Nyalakan Pengingat? 🔔</h3>
          <p class="text-sm text-white/80 mb-3 leading-relaxed">
            Dapatkan notifikasi H-14, H-7, H-5, dan H-3 sebelum acara dimulai. Jangan sampai terlewat!
          </p>

          <div class="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              class="w-full justify-center py-1.5 text-sm"
              onclick={requestPermission}
            >
              Izinkan
            </Button>
            <button
              class="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors"
              onclick={dismiss}
            >
              Nanti
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
