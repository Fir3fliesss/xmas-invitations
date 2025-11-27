<script lang="ts">
  let { count = 7 }: { count?: number } = $props();
</script>

<div class="lights-container">
  <!-- Wire -->
  <svg class="wire" viewBox="0 0 100 10" preserveAspectRatio="none">
    <path
      d="M 0 5 Q 7 2, 14 5 T 28 5 T 42 5 T 56 5 T 70 5 T 84 5 T 100 5"
      fill="none"
      stroke="#2d2d2d"
      stroke-width="0.8"
    />
  </svg>
  
  <!-- Light bulbs -->
  <div class="christmas-lights">
    {#each Array(count) as _, i}
      <div class="light-wrapper">
        <div class="light-cap"></div>
        <div class="light-bulb" style="animation-delay: {i * 0.15}s"></div>
      </div>
    {/each}
  </div>
</div>

<style>
  .lights-container {
    position: relative;
    width: 100%;
    padding: 0.5rem 0;
  }

  .wire {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
  }

  .christmas-lights {
    display: flex;
    justify-content: space-around;
    padding-top: 8px;
  }

  .light-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .light-cap {
    width: 8px;
    height: 6px;
    background: #333;
    border-radius: 2px 2px 0 0;
  }

  .light-bulb {
    width: 14px;
    height: 20px;
    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
    animation: christmas-glow 1.2s ease-in-out infinite alternate;
  }

  .light-bulb:nth-child(1),
  .light-wrapper:nth-child(1) .light-bulb { background: #ff6b6b; }
  .light-wrapper:nth-child(2) .light-bulb { background: #4ecdc4; }
  .light-wrapper:nth-child(3) .light-bulb { background: #ffe66d; }
  .light-wrapper:nth-child(4) .light-bulb { background: #a8e6cf; }
  .light-wrapper:nth-child(5) .light-bulb { background: #ff6b6b; }
  .light-wrapper:nth-child(6) .light-bulb { background: #4ecdc4; }
  .light-wrapper:nth-child(7) .light-bulb { background: #ffe66d; }

  @keyframes christmas-glow {
    0% {
      filter: brightness(0.6);
      box-shadow: 0 0 3px currentColor;
    }
    100% {
      filter: brightness(1.2);
      box-shadow: 0 0 8px currentColor, 0 0 15px currentColor;
    }
  }
</style>
