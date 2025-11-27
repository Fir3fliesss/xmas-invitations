<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import Countdown from '$lib/components/Countdown.svelte';
  import LocationCard from '$lib/components/LocationCard.svelte';
  import ChristmasLights from '$lib/components/ChristmasLights.svelte';
  import { EVENT_INFO, type StoredRSVPData } from '$lib/constants';
  import { userStore } from '$lib/stores/user';
  import { formatDate } from '$lib/utils/countdown';
  import { CheckCircle, Gift, Calendar, Copy, MessageCircle } from 'lucide-svelte';
  import { browser } from '$app/environment';

  let copied = $state(false);
  let userData = $state<StoredRSVPData | null>(null);
  let isLoading = $state(true);

  onMount(() => {
    console.log('Thank-you page mounted');
    
    // Manual subscription to ensure we get the latest data
    const unsubscribe = userStore.subscribe(value => {
      userData = value;
      console.log('Thank-you: Store updated', value);
      
      // If we have data, we are done loading
      if (value) {
        isLoading = false;
        
        // Verify attendance status
        if (!value.isAttending) {
          console.log('User not attending, redirecting...');
          goto('/not-attending', { replaceState: true });
        }
      }
    });

    // Check isLoaded status from store
    const unsubscribeLoaded = userStore.isLoaded.subscribe(loaded => {
      console.log('Thank-you: Store isLoaded', loaded);
      if (loaded) {
        // If store is loaded but no data, redirect
        // Give a small grace period for the data subscription to fire first
        setTimeout(() => {
           if (!userData) {
             console.log('Thank-you: Store loaded but no data, redirecting home');
             goto('/', { replaceState: true });
           } else {
             isLoading = false;
           }
        }, 100);
      }
    });

    // Safety timeout: If nothing happens in 2 seconds, redirect home
    const safetyTimeout = setTimeout(() => {
      if (isLoading && !userData) {
        console.warn('Thank-you: Safety timeout reached, redirecting home');
        goto('/', { replaceState: true });
      }
    }, 2000);

    return () => {
      unsubscribe();
      unsubscribeLoaded();
      clearTimeout(safetyTimeout);
    };
  });

  function shareWhatsApp() {
    if (!browser) return;

    const websiteUrl = window.location.origin;
    const text = `*⊹ ࣪ ˖ Christmas Celebration ⊹ ࣪ ˖*
-ˋˏ✄┈┈┈┈-ˋˏ✄┈┈┈┈
「 ✦ 🎄 𝐂𝐞𝐥𝐞𝐛𝐫𝐚𝐭𝐞 𝐂𝐡𝐫𝐢𝐬𝐭𝐦𝐚𝐬 🎄 ✦ 」

Shalom temen-temen🙌🏻

Aku sudah konfirmasi hadir di acara perayaan Natal Rohkris dengan tema *"${EVENT_INFO.subtitle}"*

Acara akan dilaksanakan pada:

🗓️ ${formatDate(EVENT_INFO.date)}
🕒 ${EVENT_INFO.startTime} ${EVENT_INFO.timezone} s.d Selesai
💒 ${EVENT_INFO.location.name}

Mari sama-sama kita rayakan kelahiran Yesus Kristus dengan penuh kasih dan sukacita!

˚⋆｡˚ See You There Guys ˚⋆｡˚

*Daftar Sekarang:*
${websiteUrl}

*Lokasi Lengkap:*
${EVENT_INFO.location.mapsUrl}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  async function copyLink() {
    if (!browser) return;
    try {
      await navigator.clipboard.writeText(window.location.origin);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function changeStatus() {
    goto('/rsvp');
  }
</script>

<svelte:head>
  <title>Terima Kasih! - Celebrate Christmas</title>
</svelte:head>

<div class="min-h-screen py-8 px-4">
  {#if userData}
    <!-- Header -->
    <div class="max-w-md mx-auto mb-6">
      <ChristmasLights count={5} />
    </div>

    <!-- Success Card -->
    <div class="max-w-md mx-auto">
    <div class="card-glass p-8 text-center">
      <!-- Success icon -->
      <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle class="w-12 h-12 text-green-400" />
      </div>

      <!-- Greeting -->
      <h1 class="font-display text-3xl font-bold text-white mb-2">
        Halo, {userData?.name}! 🎄
      </h1>
      <p class="text-gold text-xl font-semibold mb-4">
        Terima Kasih!
      </p>
      <p class="text-white/80 leading-relaxed">
        Kami sangat senang kamu akan hadir di acara Natal bersama kami. 
        Sampai jumpa di hari H!
      </p>

      <!-- Countdown -->
      <div class="my-8">
        <Countdown targetDate={EVENT_INFO.date} label="Menuju Acara" />
      </div>

      <!-- Event reminder -->
      <div class="bg-white/10 rounded-lg p-4 text-left space-y-3 mb-6">
        <div class="flex items-center gap-3">
          <Calendar class="w-5 h-5 text-gold" />
          <div>
            <p class="font-semibold text-white">{formatDate(EVENT_INFO.date)}</p>
            <p class="text-sm text-white/70">{EVENT_INFO.startTime} {EVENT_INFO.timezone}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <Gift class="w-5 h-5 text-gold" />
          <p class="text-white/90">
            Jangan lupa bawa hadiah <span class="text-gold font-semibold">(Min. {EVENT_INFO.giftMinimum})</span>
          </p>
        </div>
      </div>

      <!-- Share buttons -->
      <div class="space-y-3">
        <p class="text-sm text-white/60">Bagikan ke temanmu:</p>
        <div class="flex gap-3 justify-center">
          <button
            onclick={shareWhatsApp}
            class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors"
          >
            <MessageCircle class="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            onclick={copyLink}
            class="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-colors"
          >
            <Copy class="w-4 h-4" />
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="mt-6 pt-4 border-t border-white/10">
        <p class="text-sm text-white/60 mb-2">Jika ada pertanyaan hubungi:</p>
        <a
          href={EVENT_INFO.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 text-white/90 hover:text-green-400 transition-colors"
        >
          <MessageCircle class="w-4 h-4" />
          <span>{EVENT_INFO.contact.phone} ({EVENT_INFO.contact.name})</span>
        </a>
      </div>
    </div>

    <!-- Location Card -->
    <div class="mt-6">
      <LocationCard showMap={true} />
    </div>

    <!-- Change status link -->
    <div class="text-center mt-6">
      <button
        onclick={changeStatus}
        class="text-white/60 hover:text-white text-sm underline transition-colors"
      >
        Ubah status kehadiran
      </button>
    </div>

    <!-- Back to home -->
    <div class="text-center mt-4">
      <Button href="/" variant="ghost">
        Kembali ke Beranda
      </Button>
    </div>
    </div>
  {:else}
    <!-- Loading/Redirecting state -->
    <div class="min-h-[50vh] flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-gold"></div>
        <p class="mt-4 text-white/70">Memuat...</p>
      </div>
    </div>
  {/if}
</div>
