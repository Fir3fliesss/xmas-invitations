<svelte:options runes={true} />

<script lang="ts">
  import { calculateCountdown, type CountdownTime } from '$lib/utils/countdown';

  let { targetDate, label = 'Menuju Acara' }: { targetDate: Date; label?: string } = $props();

  let countdown = $state<CountdownTime>(calculateCountdown(targetDate));

  // Use $effect for lifecycle management in Svelte 5
  $effect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      countdown = calculateCountdown(targetDate);
    }, 1000);

    // Cleanup function - called when effect is destroyed
    return () => {
      clearInterval(interval);
    };
  });

  function padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }
</script>

<div class="countdown-wrapper">
  {#if label}
    <p class="countdown-label-text">{label}</p>
  {/if}
  
  {#if countdown.isExpired}
    <div class="countdown-expired">
      <span class="text-2xl">🎄</span>
      <p class="font-semibold">Acara Sudah Berlangsung!</p>
    </div>
  {:else}
    <div class="countdown-container">
      <div class="countdown-item">
        <span class="countdown-value">{padZero(countdown.days)}</span>
        <span class="countdown-label">Hari</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">{padZero(countdown.hours)}</span>
        <span class="countdown-label">Jam</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">{padZero(countdown.minutes)}</span>
        <span class="countdown-label">Menit</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-value">{padZero(countdown.seconds)}</span>
        <span class="countdown-label">Detik</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .countdown-wrapper {
    text-align: center;
  }

  .countdown-label-text {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }

  .countdown-expired {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
  }
</style>
