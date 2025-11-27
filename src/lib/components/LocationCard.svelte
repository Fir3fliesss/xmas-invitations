<script lang="ts">
  import { MapPin, Navigation, Clock } from 'lucide-svelte';
  import { EVENT_INFO } from '$lib/constants';

  let { showMap = true }: { showMap?: boolean } = $props();
</script>

<div class="location-card card-glass p-6">
  <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
    <MapPin class="w-5 h-5 text-gold" />
    Lokasi Acara
  </h3>
  
  <div class="space-y-3">
    <div>
      <p class="font-semibold text-gold-light">{EVENT_INFO.location.name}</p>
      <p class="text-sm text-white/80">{EVENT_INFO.location.address}</p>
    </div>
    
    <div class="flex items-center gap-2 text-sm text-white/80">
      <Clock class="w-4 h-4" />
      <span>Open Gate: {EVENT_INFO.openGate} {EVENT_INFO.timezone}</span>
    </div>
    
    <div class="flex items-center gap-2 text-sm text-white/80">
      <Clock class="w-4 h-4" />
      <span>Mulai: {EVENT_INFO.startTime} {EVENT_INFO.timezone}</span>
    </div>
    
    {#if showMap}
      <div class="map-container mt-4">
        <iframe
          src={EVENT_INFO.location.mapsEmbed}
          width="100%"
          height="200"
          style="border:0; border-radius: 0.5rem;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Lokasi GBI Jl. Tapos Cibinong"
        ></iframe>
      </div>
    {/if}
    
    <a
      href={EVENT_INFO.location.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-light transition-colors"
    >
      <Navigation class="w-4 h-4" />
      <span>Buka di Google Maps</span>
    </a>
  </div>
</div>

<style>
  .location-card {
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  .map-container {
    border-radius: 0.5rem;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
  }
</style>
