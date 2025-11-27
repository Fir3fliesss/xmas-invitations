<script lang="ts">
  import { onMount } from 'svelte';
  import { Music, Volume2, VolumeX } from 'lucide-svelte';
  
  let audio: HTMLAudioElement;
  let isPlaying = false;
  let hasInteracted = false;
  let isMuted = false;

  onMount(() => {
    // Try to play automatically
    playAudio();

    // Add listener for first interaction if autoplay fails
    const handleInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        if (!isPlaying) {
          playAudio();
        }
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  });

  async function playAudio() {
    if (!audio) return;
    
    try {
      await audio.play();
      isPlaying = true;
    } catch (err) {
      console.log('Autoplay blocked, waiting for interaction');
      isPlaying = false;
    }
  }

  function togglePlay() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      playAudio();
    }
  }
</script>

<div class="fixed bottom-4 right-4 z-50">
  <button
    class="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-full text-gold shadow-lg hover:bg-white/20 transition-all duration-300 {isPlaying ? 'animate-pulse-slow' : ''}"
    onclick={togglePlay}
    aria-label={isPlaying ? "Pause music" : "Play music"}
  >
    {#if isPlaying}
      <Music class="w-6 h-6" />
    {:else}
      <VolumeX class="w-6 h-6 opacity-70" />
    {/if}
  </button>

  <audio
    bind:this={audio}
    src="/song.mp3"
    loop
    preload="auto"
  ></audio>
</div>

<style>
  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .7;
    }
  }
</style>
