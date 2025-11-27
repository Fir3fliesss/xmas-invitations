<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import Button from '$lib/components/Button.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import ChristmasLights from '$lib/components/ChristmasLights.svelte';
  import { SCHOOLS, getClassesBySchool, EVENT_INFO, type SchoolValue, type StoredRSVPData } from '$lib/constants';
  import { userStore } from '$lib/stores/user';
  import { isRSVPDeadlinePassed } from '$lib/utils/countdown';
  import { supabase } from '$lib/supabase';
  import { ChevronLeft, User, School, BookOpen, CheckCircle2, XCircle } from 'lucide-svelte';
  import { onMount } from 'svelte';

  // Form state
  let name = $state('');
  let school = $state<SchoolValue | ''>('');
  let schoolOther = $state('');
  let selectedClass = $state('');
  let classOther = $state('');
  let isAttending = $state<boolean | null>(null);
  let reason = $state('');
  
  // UI state
  let isSubmitting = $state(false);
  let errorMessage = $state('');
  let showToast = $state(false);
  let toastMessage = $state('');
  let toastType = $state<'success' | 'error' | 'info'>('info');

  // Computed
  let availableClasses = $derived(school ? getClassesBySchool(school as SchoolValue) : []);
  let showSchoolOther = $derived(school === 'other');
  let showClassOther = $derived(selectedClass === 'Lainnya');
  let isDeadlinePassed = $derived(isRSVPDeadlinePassed(EVENT_INFO.rsvpDeadline));

  // Validation
  let isFormValid = $derived(
    name.trim().length >= 2 &&
    school !== '' &&
    (school !== 'other' || schoolOther.trim().length >= 2) &&
    selectedClass !== '' &&
    (selectedClass !== 'Lainnya' || classOther.trim().length >= 1) &&
    isAttending !== null &&
    (isAttending === true || reason.trim().length >= 5)
  );

  // Reset class when school changes
  $effect(() => {
    if (school) {
      selectedClass = '';
      classOther = '';
    }
  });

  let hasChecked = $state(false);

  onMount(() => {
    // Wait for store to load first
    const unsubscribe = userStore.isLoaded.subscribe(loaded => {
      if (loaded && !hasChecked) {
        hasChecked = true;
        const data = userStore.getData();
        console.log('RSVP page - checking user data:', data);
        if (data) {
          if (data.isAttending) {
            console.log('Redirecting to thank-you');
            goto('/thank-you');
          } else {
            console.log('Redirecting to not-attending');
            goto('/not-attending');
          }
        }
      }
    });

    return () => unsubscribe();
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!isFormValid || isSubmitting) return;
    
    isSubmitting = true;
    errorMessage = '';

    try {
      // Determine final school and class values
      const finalSchool = school === 'other' ? 'other' : school;
      const finalSchoolOther = school === 'other' ? schoolOther.trim() : null;
      const finalClass = selectedClass;
      const finalClassOther = selectedClass === 'Lainnya' ? classOther.trim() : null;

      // Check for duplicate (name + school combination)
      const { data: existing } = await supabase
        .from('attendees')
        .select('id')
        .eq('name', name.trim())
        .eq('school', finalSchool)
        .maybeSingle();

      if (existing) {
        errorMessage = 'Kamu sudah pernah mendaftar dengan nama dan sekolah yang sama.';
        showToast = true;
        toastMessage = errorMessage;
        toastType = 'error';
        isSubmitting = false;
        return;
      }

      // Insert to Supabase
      const { data, error } = await supabase
        .from('attendees')
        .insert({
          name: name.trim(),
          school: finalSchool,
          school_other: finalSchoolOther,
          class: finalClass,
          class_other: finalClassOther,
          is_attending: isAttending,
          reason: isAttending ? null : reason.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Save to localStorage
      const rsvpData: StoredRSVPData = {
        id: data.id,
        name: name.trim(),
        school: finalSchool,
        schoolOther: finalSchoolOther || undefined,
        class: finalClass,
        classOther: finalClassOther || undefined,
        isAttending: isAttending!,
        reason: isAttending ? undefined : reason.trim(),
        submittedAt: new Date().toISOString()
      };

      console.log('Saving RSVP data to store:', rsvpData);
      userStore.save(rsvpData);

      // Small delay to ensure store is updated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect based on attendance
      console.log('Redirecting to:', isAttending ? 'thank-you' : 'not-attending');
      if (isAttending) {
        await goto('/thank-you', { replaceState: false });
      } else {
        await goto('/not-attending', { replaceState: false });
      }

    } catch (err) {
      console.error('Error submitting RSVP:', err);
      errorMessage = 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.';
      showToast = true;
      toastMessage = errorMessage;
      toastType = 'error';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Konfirmasi Kehadiran - Celebrate Christmas</title>
</svelte:head>

<div class="min-h-screen py-8 px-4">
  <!-- Back button -->
  <div class="max-w-md mx-auto mb-4">
    <a href="/" class="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors">
      <ChevronLeft class="w-5 h-5" />
      <span>Kembali</span>
    </a>
  </div>

  <!-- Header -->
  <div class="text-center max-w-md mx-auto mb-8">
    <ChristmasLights count={5} />
    <h1 class="font-display text-3xl font-bold text-white mt-6 mb-2">
      Konfirmasi Kehadiran
    </h1>
    <p class="text-white/70">
      Isi formulir di bawah untuk konfirmasi kehadiranmu
    </p>
  </div>

  {#if isDeadlinePassed}
    <!-- Deadline passed message -->
    <div class="max-w-md mx-auto">
      <div class="card-solid p-6 text-center">
        <XCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-christmas-red-dark mb-2">
          Pendaftaran Ditutup
        </h2>
        <p class="text-gray-600">
          Maaf, batas waktu konfirmasi kehadiran sudah berakhir pada 31 Desember 2024.
        </p>
        <div class="mt-6">
          <Button href="/" variant="secondary">Kembali ke Beranda</Button>
        </div>
      </div>
    </div>
  {:else}
    <!-- RSVP Form -->
    <div class="max-w-md mx-auto">
      <form onsubmit={handleSubmit} class="card-solid p-6 space-y-5">
        <!-- Name -->
        <div>
          <label for="name" class="form-label flex items-center gap-2">
            <User class="w-4 h-4" />
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            bind:value={name}
            class="form-input"
            placeholder="Masukkan nama lengkap"
            required
            minlength="2"
          />
        </div>

        <!-- School -->
        <div>
          <label for="school" class="form-label flex items-center gap-2">
            <School class="w-4 h-4" />
            Asal Sekolah
          </label>
          <select
            id="school"
            bind:value={school}
            class="form-select"
            required
          >
            <option value="" disabled>Pilih sekolah</option>
            {#each SCHOOLS as s}
              <option value={s.value}>{s.label}</option>
            {/each}
          </select>
        </div>

        <!-- School Other -->
        {#if showSchoolOther}
          <div class="animate-slideDown">
            <label for="schoolOther" class="form-label">
              Nama Sekolah
            </label>
            <input
              type="text"
              id="schoolOther"
              bind:value={schoolOther}
              class="form-input"
              placeholder="Masukkan nama sekolah"
              required
              minlength="2"
            />
          </div>
        {/if}

        <!-- Class -->
        <div>
          <label for="class" class="form-label flex items-center gap-2">
            <BookOpen class="w-4 h-4" />
            Kelas
          </label>
          <select
            id="class"
            bind:value={selectedClass}
            class="form-select"
            required
            disabled={!school}
          >
            <option value="" disabled>
              {school ? 'Pilih kelas' : 'Pilih sekolah terlebih dahulu'}
            </option>
            {#each availableClasses as cls}
              <option value={cls}>{cls}</option>
            {/each}
          </select>
        </div>

        <!-- Class Other -->
        {#if showClassOther}
          <div class="animate-slideDown">
            <label for="classOther" class="form-label">
              Nama Kelas (Format: Tingkat.Jurusan-Rombel)
            </label>
            <input
              type="text"
              id="classOther"
              bind:value={classOther}
              class="form-input"
              placeholder="Contoh: X.RPL-3"
              required
            />
          </div>
        {/if}

        <!-- Attendance -->
        <div>
          <label class="form-label mb-3">Kehadiran</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="radio-card {isAttending === true ? 'selected' : ''}">
              <input
                type="radio"
                name="attendance"
                value="true"
                checked={isAttending === true}
                onchange={() => isAttending = true}
              />
              <CheckCircle2 class="w-5 h-5 text-green-600" />
              <span class="font-medium text-gray-700">Hadir</span>
            </label>
            <label class="radio-card {isAttending === false ? 'selected' : ''}">
              <input
                type="radio"
                name="attendance"
                value="false"
                checked={isAttending === false}
                onchange={() => isAttending = false}
              />
              <XCircle class="w-5 h-5 text-red-600" />
              <span class="font-medium text-gray-700">Tidak Hadir</span>
            </label>
          </div>
        </div>

        <!-- Reason (if not attending) -->
        {#if isAttending === false}
          <div class="animate-slideDown">
            <label for="reason" class="form-label">
              Alasan Tidak Hadir
            </label>
            <textarea
              id="reason"
              bind:value={reason}
              class="form-textarea"
              placeholder="Tuliskan alasanmu tidak bisa hadir..."
              required
              minlength="5"
            ></textarea>
          </div>
        {/if}

        <!-- Error message -->
        {#if errorMessage}
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        {/if}

        <!-- Submit button -->
        <div class="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            loading={isSubmitting}
            disabled={!isFormValid}
          >
            Kirim Konfirmasi
          </Button>
        </div>
      </form>
    </div>
  {/if}
</div>

<Toast
  bind:visible={showToast}
  type={toastType}
  message={toastMessage}
/>

<style>
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }
</style>
