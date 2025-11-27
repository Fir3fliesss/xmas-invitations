<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import Countdown from '$lib/components/Countdown.svelte';
  import LocationCard from '$lib/components/LocationCard.svelte';
  import ChristmasLights from '$lib/components/ChristmasLights.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import { EVENT_INFO, type StoredRSVPData } from '$lib/constants';
  import { userStore } from '$lib/stores/user';
  import { supabase } from '$lib/supabase';
  import { formatDate } from '$lib/utils/countdown';
  import { XCircle, Heart, Calendar, ArrowRight, MessageCircle } from 'lucide-svelte';
  

  let isUpdating = $state(false);
  let showToast = $state(false);
  let toastMessage = $state('');
  let toastType = $state<'success' | 'error'>('success');
  // Get user data immediately on initialization
  let userData = $state<StoredRSVPData | null>(userStore.getData());

  onMount(() => {
    console.log('Not-attending page - user data:', userData);

    // Redirect if no RSVP data or is attending
    if (!userData) {
      console.log('No user data, redirecting to /rsvp');
      goto('/rsvp');
      return;
    }
    if (userData.isAttending) {
      console.log('User attending, redirecting to /thank-you');
      goto('/thank-you');
    }
  });

  async function changeToAttending() {
    if (!userData?.id || isUpdating) return;
    
    isUpdating = true;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('attendees')
        .update({
          is_attending: true,
          reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (error) throw error;

      // Update localStorage
      userStore.updateAttendance(true);

      // Show success message and redirect
      toastMessage = 'Yeay! Status berhasil diubah menjadi Hadir! 🎉';
      toastType = 'success';
      showToast = true;

      setTimeout(() => {
        goto('/thank-you');
      }, 1500);

    } catch (err) {
      console.error('Error updating attendance:', err);
      toastMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      toastType = 'error';
      showToast = true;
    } finally {
      isUpdating = false;
    }
  }
</script>

<svelte:head>
  <title>Sayang Sekali... - Celebrate Christmas</title>
</svelte:head>

<div class="min-h-screen py-8 px-4">
  {#if userData}
    <!-- Header -->
    <div class="max-w-md mx-auto mb-6">
      <ChristmasLights count={5} />
    </div>

    <!-- Main Card -->
    <div class="max-w-md mx-auto">
    <div class="card-glass p-8 text-center">
      <!-- Icon -->
      <div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle class="w-12 h-12 text-red-400" />
      </div>

      <!-- Greeting -->
      <h1 class="font-display text-3xl font-bold text-white mb-2">
        Halo, {userData?.name}...
      </h1>
      <p class="text-white/80 text-lg mb-4">
        Sayang sekali kamu belum bisa hadir 😢
      </p>

      <!-- Reason -->
      {#if userData?.reason}
        <div class="bg-white/10 rounded-lg p-4 mb-6 text-left">
          <p class="text-sm text-white/60 mb-1">Alasanmu:</p>
          <p class="text-white/90 italic">"{userData.reason}"</p>
        </div>
      {/if}

      <!-- Encouragement message -->
      <div class="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
        <Heart class="w-8 h-8 text-gold mx-auto mb-2" />
        <p class="text-white leading-relaxed">
          Tapi pintu selalu terbuka untukmu! Kami masih sangat berharap kamu bisa datang dan merayakan Natal bersama.
        </p>
      </div>

      <!-- Event info -->
      <div class="bg-white/10 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-center gap-3">
          <Calendar class="w-5 h-5 text-gold" />
          <div>
            <p class="font-semibold text-white">{formatDate(EVENT_INFO.date)}</p>
            <p class="text-sm text-white/70">{EVENT_INFO.startTime} {EVENT_INFO.timezone}</p>
          </div>
        </div>
      </div>

      <!-- Countdown -->
      <div class="mb-8">
        <Countdown targetDate={EVENT_INFO.date} label="Masih Ada Waktu!" />
      </div>

      <!-- Change to attending button - PROMINENT -->
      <div class="space-y-4">
        <Button
          variant="primary"
          size="lg"
          class="w-full"
          onclick={changeToAttending}
          loading={isUpdating}
        >
          <Heart class="w-5 h-5" />
          Saya Jadi Hadir!
          <ArrowRight class="w-5 h-5" />
        </Button>
        
        <p class="text-sm text-white/50">
          Klik tombol di atas untuk mengubah status kehadiranmu
        </p>
        
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
    </div>

    <!-- Location Card -->
    <div class="mt-6">
      <LocationCard showMap={false} />
    </div>

    <!-- Back to home -->
    <div class="text-center mt-6">
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

<Toast
  bind:visible={showToast}
  type={toastType}
  message={toastMessage}
/>
