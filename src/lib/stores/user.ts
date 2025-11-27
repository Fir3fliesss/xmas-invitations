import { writable, get } from 'svelte/store';
import { STORAGE_KEYS, type StoredRSVPData } from '$lib/constants';
import { browser } from '$app/environment';

// Create writable stores
const rsvpDataStore = writable<StoredRSVPData | null>(null);
const isLoadedStore = writable(false);

// Load from localStorage on init
function load() {
  if (!browser) {
    isLoadedStore.set(true);
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RSVP_DATA);
    if (stored) {
      rsvpDataStore.set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Failed to load RSVP data from localStorage:', error);
  } finally {
    isLoadedStore.set(true);
  }
}

// Save RSVP data
function save(data: StoredRSVPData) {
  if (!browser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.RSVP_DATA, JSON.stringify(data));
    rsvpDataStore.set(data);
  } catch (error) {
    console.error('Failed to save RSVP data to localStorage:', error);
  }
}

// Update attendance status
function updateAttendance(isAttending: boolean, reason?: string) {
  const currentData = get(rsvpDataStore);
  if (!currentData) return;
  
  const updated: StoredRSVPData = {
    ...currentData,
    isAttending,
    reason: isAttending ? undefined : reason,
    updatedAt: new Date().toISOString()
  };
  
  save(updated);
}

// Clear stored data
function clear() {
  if (!browser) return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.RSVP_DATA);
    rsvpDataStore.set(null);
  } catch (error) {
    console.error('Failed to clear RSVP data from localStorage:', error);
  }
}

// Get display name for school
function getSchoolDisplay(data: StoredRSVPData | null): string {
  if (!data) return '';
  if (data.school === 'other') {
    return data.schoolOther || 'Lainnya';
  }
  const schoolLabels: Record<string, string> = {
    'penus': 'SMK Plus Pelita Nusantara',
    'pesat': 'SMA Plus PGRI Cibinong'
  };
  return schoolLabels[data.school] || data.school;
}

// Get display name for class
function getClassDisplay(data: StoredRSVPData | null): string {
  if (!data) return '';
  if (data.class === 'Lainnya') {
    return data.classOther || 'Lainnya';
  }
  return data.class;
}

// Initialize store by loading from localStorage
if (browser) {
  load();
}

// Session state for auto-redirect
export const sessionState = {
  hasAutoRedirected: false
};

export const userStore = {
  subscribe: rsvpDataStore.subscribe,
  isLoaded: isLoadedStore,
  load,
  save,
  updateAttendance,
  clear,
  getSchoolDisplay,
  getClassDisplay,
  getData: () => get(rsvpDataStore),
  hasSubmitted: () => get(rsvpDataStore) !== null
};
