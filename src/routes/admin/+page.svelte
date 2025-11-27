<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { supabase, type Attendee } from '$lib/supabase';
  import { SCHOOLS, STORAGE_KEYS } from '$lib/constants';
  import { exportToExcel } from '$lib/utils/export-excel';
  import Button from '$lib/components/Button.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import { 
    Users, UserCheck, UserX, Download, Search, 
    Filter, RefreshCw, ChevronDown, Eye, Trash2 
  } from 'lucide-svelte';

  // Data state
  let attendees = $state<Attendee[]>([]);
  let isLoading = $state(true);
  let error = $state('');

  // Filter state
  let searchQuery = $state('');
  let filterSchool = $state('all');
  let filterStatus = $state<'all' | 'attending' | 'not-attending'>('all');
  let sortBy = $state<'name' | 'created_at'>('created_at');
  let sortOrder = $state<'asc' | 'desc'>('desc');

  // Toast state
  let showToast = $state(false);
  let toastMessage = $state('');
  let toastType = $state<'success' | 'error' | 'info'>('info');

  // Computed stats
  let stats = $derived({
    total: attendees.length,
    attending: attendees.filter(a => a.is_attending).length,
    notAttending: attendees.filter(a => !a.is_attending).length
  });

  // Filtered data
  let filteredAttendees = $derived(() => {
    let result = [...attendees];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.school.toLowerCase().includes(query) ||
        a.class.toLowerCase().includes(query)
      );
    }

    // School filter
    if (filterSchool !== 'all') {
      result = result.filter(a => a.school === filterSchool);
    }

    // Status filter
    if (filterStatus === 'attending') {
      result = result.filter(a => a.is_attending);
    } else if (filterStatus === 'not-attending') {
      result = result.filter(a => !a.is_attending);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  });

  onMount(async () => {
    console.log('Admin: Component mounting...');
    
    // Check auth
    if (browser) {
      const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      console.log('Admin: Token check:', { hasToken: !!token });
      if (!token) {
        console.warn('Admin: No token found, redirecting to login');
        goto('/admin/login');
        return;
      }
    }

    // Force small delay to ensure client hydration
    setTimeout(() => {
       fetchData();
    }, 100);
  });

  async function fetchData() {
    isLoading = true;
    error = '';

    try {
      console.log('Admin: Starting fetch data...');
      
      const { data, error: fetchError, count } = await supabase
        .from('attendees')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Admin: Supabase response', { 
        hasData: !!data, 
        dataLength: data?.length, 
        count,
        error: fetchError,
        fullError: fetchError?.message,
        errorDetails: fetchError?.details
      });

      if (data) {
        console.log('Admin: Sample data:', data.slice(0, 3));
        console.table(data.slice(0, 5)); // Show first 5 rows
      } else {
        console.warn('Admin: No data returned:', fetchError);
      }

      if (fetchError) throw fetchError;
      
      if (!data || data.length === 0) {
        console.warn('Admin: Empty data set received');
        // Show warning instead of error
        toastMessage = 'Tidak ada data RSVP yang ditemukan di database';
        toastType = 'info';
        showToast = true;
      }
      
      attendees = data || [];
      
    } catch (err) {
      console.error('Admin: detailed error', err);
      error = `Gagal memuat data: ${err instanceof Error ? err.message : 'Unknown error'}. Silakan refresh halaman.`;
      toastMessage = error;
      toastType = 'error';
      showToast = true;
    } finally {
      isLoading = false;
    }
  }

  function handleExport() {
    if (filteredAttendees().length === 0) {
      toastMessage = 'Tidak ada data untuk diekspor';
      toastType = 'info';
      showToast = true;
      return;
    }

    try {
      exportToExcel(filteredAttendees(), {
        filename: `rsvp-natal-${new Date().toISOString().split('T')[0]}`
      });
      toastMessage = 'Data berhasil diekspor ke Excel!';
      toastType = 'success';
      showToast = true;
    } catch (err) {
      console.error('Export error:', err);
      toastMessage = 'Gagal mengekspor data';
      toastType = 'error';
      showToast = true;
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Yakin ingin menghapus data "${name}"?`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('attendees')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      attendees = attendees.filter(a => a.id !== id);
      toastMessage = `Data "${name}" berhasil dihapus`;
      toastType = 'success';
      showToast = true;
    } catch (err) {
      console.error('Delete error:', err);
      toastMessage = 'Gagal menghapus data';
      toastType = 'error';
      showToast = true;
    }
  }

  function getSchoolLabel(school: string, schoolOther: string | null): string {
    if (school === 'other') return schoolOther || 'Lainnya';
    const found = SCHOOLS.find(s => s.value === school);
    return found?.shortLabel || school;
  }

  function getClassDisplay(cls: string, clsOther: string | null): string {
    if (cls === 'Lainnya') return clsOther || 'Lainnya';
    return cls;
  }

  function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Admin Dashboard - Celebrate Christmas</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-6">
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-xl shadow p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Users class="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Total RSVP</p>
          <p class="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <UserCheck class="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Hadir</p>
          <p class="text-2xl font-bold text-green-600">{stats.attending}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow p-5">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <UserX class="w-6 h-6 text-red-600" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Tidak Hadir</p>
          <p class="text-2xl font-bold text-red-600">{stats.notAttending}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Filters & Actions -->
  <div class="bg-white rounded-xl shadow p-4 mb-6">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="relative flex-1">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari nama, sekolah, atau kelas..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-christmas-red"
        />
      </div>

      <!-- School Filter -->
      <div class="relative">
        <select
          bind:value={filterSchool}
          class="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-christmas-red"
        >
          <option value="all">Semua Sekolah</option>
          {#each SCHOOLS as school}
            <option value={school.value}>{school.shortLabel}</option>
          {/each}
        </select>
        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <!-- Status Filter -->
      <div class="relative">
        <select
          bind:value={filterStatus}
          class="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-christmas-red"
        >
          <option value="all">Semua Status</option>
          <option value="attending">Hadir</option>
          <option value="not-attending">Tidak Hadir</option>
        </select>
        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          onclick={fetchData}
          disabled={isLoading}
          class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw class="w-4 h-4 {isLoading ? 'animate-spin' : ''}" />
          <span class="hidden sm:inline">Refresh</span>
        </button>
        <button
          onclick={handleExport}
          class="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Download class="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Data Table / Cards -->
  <div class="bg-white rounded-xl shadow overflow-hidden">
    {#if isLoading}
      <div class="p-12 text-center">
        <RefreshCw class="w-8 h-8 animate-spin text-christmas-red mx-auto mb-4" />
        <p class="text-gray-500">Memuat data...</p>
      </div>
    {:else if error}
      <div class="p-12 text-center">
        <p class="text-red-500 mb-4">{error}</p>
        <button onclick={fetchData} class="text-christmas-red hover:underline">
          Coba lagi
        </button>
      </div>
    {:else if filteredAttendees().length === 0}
      <div class="p-12 text-center">
        <Users class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">
          {attendees.length === 0 ? 'Belum ada data RSVP' : 'Tidak ada data yang sesuai filter'}
        </p>
      </div>
    {:else}
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th class="w-12">No</th>
              <th>Nama</th>
              <th>Sekolah</th>
              <th>Kelas</th>
              <th class="w-28">Status</th>
              <th>Alasan</th>
              <th class="w-36">Tanggal</th>
              <th class="w-20">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredAttendees() as attendee, i (attendee.id)}
              <tr>
                <td class="text-center text-gray-500">{i + 1}</td>
                <td class="font-medium">{attendee.name}</td>
                <td>{getSchoolLabel(attendee.school, attendee.school_other)}</td>
                <td>{getClassDisplay(attendee.class, attendee.class_other)}</td>
                <td>
                  {#if attendee.is_attending}
                    <span class="badge badge-success">
                      <UserCheck class="w-3 h-3" />
                      Hadir
                    </span>
                  {:else}
                    <span class="badge badge-danger">
                      <UserX class="w-3 h-3" />
                      Tidak Hadir
                    </span>
                  {/if}
                </td>
                <td class="text-gray-500 text-sm max-w-xs truncate">
                  {attendee.reason || '-'}
                </td>
                <td class="text-sm text-gray-500">
                  {formatDate(attendee.created_at)}
                </td>
                <td>
                  <button
                    onclick={() => handleDelete(attendee.id, attendee.name)}
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-gray-100">
        {#each filteredAttendees() as attendee, i (attendee.id)}
          <div class="p-4 space-y-2">
            <div class="flex items-start justify-between">
              <div>
                <p class="font-semibold text-gray-800">{attendee.name}</p>
                <p class="text-sm text-gray-500">
                  {getSchoolLabel(attendee.school, attendee.school_other)} • {getClassDisplay(attendee.class, attendee.class_other)}
                </p>
              </div>
              {#if attendee.is_attending}
                <span class="badge badge-success">
                  <UserCheck class="w-3 h-3" />
                  Hadir
                </span>
              {:else}
                <span class="badge badge-danger">
                  <UserX class="w-3 h-3" />
                  Tidak
                </span>
              {/if}
            </div>
            {#if attendee.reason}
              <p class="text-sm text-gray-500 italic">"{attendee.reason}"</p>
            {/if}
            <div class="flex items-center justify-between pt-2">
              <p class="text-xs text-gray-400">{formatDate(attendee.created_at)}</p>
              <button
                onclick={() => handleDelete(attendee.id, attendee.name)}
                class="text-red-500 text-sm hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Result count -->
  {#if !isLoading && filteredAttendees().length > 0}
    <p class="text-sm text-gray-500 mt-4 text-center">
      Menampilkan {filteredAttendees().length} dari {attendees.length} data
    </p>
  {/if}
</div>

<Toast
  bind:visible={showToast}
  type={toastType}
  message={toastMessage}
/>
