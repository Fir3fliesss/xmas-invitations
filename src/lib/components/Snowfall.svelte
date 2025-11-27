<svelte:options runes={true} />

<script lang="ts">
  import { browser } from '$app/environment';

  interface Snowflake {
    id: number;
    left: number;
    animationDuration: number;
    animationDelay: number;
    fontSize: number;
    opacity: number;
  }

  let snowflakes = $state<Snowflake[]>([]);
  const snowflakeCount = 25; // Keep it light for performance

  // Use $effect for initialization in Svelte 5
  $effect(() => {
    if (!browser) return;

    // Generate snowflakes
    snowflakes = Array.from({ length: snowflakeCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 8 + Math.random() * 12, // 8-20 seconds
      animationDelay: Math.random() * 10,
      fontSize: 0.6 + Math.random() * 0.8, // 0.6-1.4rem
      opacity: 0.4 + Math.random() * 0.4 // 0.4-0.8
    }));
  });
</script>

<div class="snowfall-container" aria-hidden="true">
  {#each snowflakes as flake (flake.id)}
    <span
      class="snowflake"
      style="
        left: {flake.left}%;
        animation-duration: {flake.animationDuration}s;
        animation-delay: {flake.animationDelay}s;
        font-size: {flake.fontSize}rem;
        opacity: {flake.opacity};
      "
    >
      ❄
    </span>
  {/each}
</div>

<style>
  .snowfall-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 50;
  }
</style>
