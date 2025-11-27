<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ChristmasLights from '$lib/components/ChristmasLights.svelte';
  import Countdown from '$lib/components/Countdown.svelte';
  import LocationCard from '$lib/components/LocationCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import { EVENT_INFO } from '$lib/constants';
  import { userStore } from '$lib/stores/user';
  import { formatDate } from '$lib/utils/countdown';
  import { Calendar, Gift, Music, Flame, Gamepad2, CheckCircle, XCircle } from 'lucide-svelte';
  import type { StoredRSVPData } from '$lib/constants';

  let userData = $state<StoredRSVPData | null>(null);
  let isLoaded = $state(false);

  // Simple check to render immediately
  $effect(() => {
    // Subscribe to isLoaded store
    const unsubscribeLoaded = userStore.isLoaded.subscribe(value => {
      isLoaded = value;
      console.log('isLoaded changed:', value);

      // Auto redirect if user already submitted RSVP
      if (value && userData) {
        console.log('User already submitted, redirecting...');
        if (userData.isAttending) {
          goto('/thank-you');
        } else {
          goto('/not-attending');
        }
      }
    });

    // Subscribe to data store
    const unsubscribe = userStore.subscribe(value => {
      userData = value;
      console.log('userData changed:', value);
    });

    return () => {
      unsubscribe();
      unsubscribeLoaded();
    };
  });

  // Check if user already submitted RSVP
  function goToRSVP() {
    if (userData) {
      // Redirect based on attendance status
      if (userData.isAttending) {
        goto('/thank-you');
      } else {
        goto('/not-attending');
      }
    } else {
      goto('/rsvp');
    }
  }
</script>

<svelte:head>
  <title>Celebrate Christmas - Light Up Christmas With Christ</title>
  <meta name="description" content="Undangan Natal - {EVENT_INFO.title}. {formatDate(EVENT_INFO.date)} di {EVENT_INFO.location.name}" />
</svelte:head>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section class="relative py-8 px-4">
    <!-- Christmas Lights -->
    <div class="max-w-md mx-auto mb-8">
      <ChristmasLights count={7} />
    </div>

    <!-- Main Title -->
    <div class="text-center max-w-2xl mx-auto">
      <h1 class="font-script text-5xl md:text-7xl text-gradient-gold mb-2">
        Celebrate
      </h1>
      <h2 class="font-display text-4xl md:text-6xl font-bold text-white tracking-wider mb-4">
        CHRISTMAS
      </h2>
      <p class="text-gold-light text-lg md:text-xl italic">
        "{EVENT_INFO.subtitle}"
      </p>
      
      <!-- Decorative stars -->
      <div class="flex justify-center gap-2 my-4 text-gold">
        <span>✦</span>
        <span>❄</span>
        <span>✦</span>
        <span>❄</span>
        <span>✦</span>
      </div>
    </div>

    <!-- Bible Verse -->
    <div class="max-w-xl mx-auto text-center my-8 px-4">
      <blockquote class="text-white/90 italic leading-relaxed">
        "{EVENT_INFO.verse.text}"
      </blockquote>
      <cite class="block mt-3 text-gold font-semibold not-italic">
        {EVENT_INFO.verse.reference}
      </cite>
    </div>

    <!-- Countdown -->
    <div class="max-w-lg mx-auto my-10">
      <Countdown targetDate={EVENT_INFO.date} label="Menuju Hari H" />
    </div>

    <!-- Event Details Card -->
    <div class="max-w-md mx-auto my-8">
      <div class="card-glass p-6 space-y-4">
        <!-- Date & Time -->
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0 w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
            <Calendar class="w-6 h-6 text-gold" />
          </div>
          <div>
            <p class="font-semibold text-white">{formatDate(EVENT_INFO.date)}</p>
            <p class="text-sm text-white/70">Open Gate: {EVENT_INFO.openGate} | Mulai: {EVENT_INFO.startTime} {EVENT_INFO.timezone}</p>
          </div>
        </div>

        <!-- Activities -->
        <div class="border-t border-white/10 pt-4">
          <p class="text-sm text-white/70 mb-3">Rangkaian Acara:</p>
          <div class="flex flex-wrap gap-3">
            <span class="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Music class="w-4 h-4 text-gold" />
              Praise & Worship
            </span>
            <span class="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Flame class="w-4 h-4 text-orange-400" />
              Candle Light
            </span>
            <span class="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
              <Gamepad2 class="w-4 h-4 text-green-400" />
              Games
            </span>
          </div>
        </div>

        <!-- Gift reminder -->
        <div class="border-t border-white/10 pt-4">
          <div class="flex items-center gap-3 text-gold-light">
            <Gift class="w-5 h-5" />
            <span>Bring Your Gift (Min. {EVENT_INFO.giftMinimum})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- User Status (if already submitted) -->
    {#if userData}
      <div class="max-w-md mx-auto my-6">
        <div class="card-glass p-4 border border-gold/30">
          <div class="flex items-center gap-3">
            {#if userData.isAttending}
              <CheckCircle class="w-6 h-6 text-green-400" />
              <div>
                <p class="font-semibold text-white">Hai, {userData.name}! 👋</p>
                <p class="text-sm text-white/70">Kamu sudah terdaftar sebagai <span class="text-green-400 font-medium">Hadir</span></p>
              </div>
            {:else}
              <XCircle class="w-6 h-6 text-red-400" />
              <div>
                <p class="font-semibold text-white">Hai, {userData.name}! 👋</p>
                <p class="text-sm text-white/70">Status: <span class="text-red-400 font-medium">Tidak Hadir</span></p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- CTA Button -->
    <div class="text-center my-10">
      <Button variant="primary" size="lg" onclick={goToRSVP}>
        {#if userData}
          Lihat Status Kehadiran
        {:else}
          Konfirmasi Kehadiran
        {/if}
      </Button>
    </div>

    <!-- Location Card -->
    <div class="max-w-md mx-auto my-8">
      <LocationCard showMap={true} />
    </div>

    <!-- Contact & Social Media -->
    <div class="text-center mt-8 space-y-4">
      <!-- Contact -->
      <div class="max-w-md mx-auto">
        <p class="text-white/60 text-sm mb-2">Jika ada pertanyaan hubungi:</p>
        <a
          href={EVENT_INFO.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-white/90 hover:text-gold transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span>{EVENT_INFO.contact.phone}</span>
        </a>
      </div>

      <!-- Instagram -->
      <div>
        <a
          href="https://instagram.com/rohkris_penus"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>{EVENT_INFO.instagram}</span>
        </a>
      </div>
    </div>
  </section>
</div>
