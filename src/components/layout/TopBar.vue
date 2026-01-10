<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePatientStore } from '@/stores/patient'

const patientStore = usePatientStore()

const props = defineProps({
  // activePatient prop is now managed by patientStore
})

const emit = defineEmits(['patient-selected'])

const rootRef = ref(null)
const inputRef = ref(null)
const searchQuery = ref('')
const results = ref([])
const loading = ref(false)
const errorMessage = ref('')
const isFocused = ref(false)
const selectedPatient = ref(null)
let searchTimeout
let activeSearchId = 0

const defaultAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="%23E5E7EB"/><path d="M32 32c5.523 0 10-4.03 10-9s-4.477-9-10-9-10 4.03-10 9 4.477 9 10 9z" fill="%23CBD5E1"/><path d="M16 48c0-5.523 7.163-10 16-10s16 4.477 16 10v2H16v-2z" fill="%23CBD5E1"/></svg>'

const hasQuery = computed(() => searchQuery.value.trim().length >= 1)
const showRecent = computed(() => !hasQuery.value && patientStore.recentPatients.length > 0)
const showDropdown = computed(() => isFocused.value && (hasQuery.value || showRecent.value))
const limitedResults = computed(() => results.value.slice(0, MAX_RESULTS))
const limitedRecent = computed(() => patientStore.recentPatients)

const activePatientDisplay = computed(() => patientStore.currentPatient)

const activePatientAge = computed(() => {
  const age = activePatientDisplay.value?.age
  return Number.isFinite(age) ? `${age} нас` : null
})

const activePatientCard = computed(() => {
  const card = getPatientCard(activePatientDisplay.value)
  return card !== '-' ? `№ ${card}` : null
})

const activePatientMetaSummary = computed(() => {
  const phone = getPatientPhone(activePatientDisplay.value)
  const rd = getPatientRd(activePatientDisplay.value)
  return phone !== '-' || rd !== '-' ? `${phone} · ${rd}` : null
})

const getDisplayName = (patient) => {
  if (!patient) return '-'
  const fallbackName = [patient.lastName, patient.firstName].filter(Boolean).join(' ').trim()
  return patient.displayName || patient.fullName || patient.name || fallbackName || '-'
}

const getPatientId = (patient) =>
  patient?.id ?? patient?.cardNo ?? patient?.cardNumber ?? patient?.patientId ?? ''

const getPatientCard = (patient) =>
  patient?.cardNo ?? patient?.cardNumber ?? patient?.card ?? patient?.patientId ?? '-'

const getPatientPhone = (patient) => patient?.phone ?? patient?.mobile ?? '-'

const getPatientRd = (patient) => patient?.rd ?? patient?.registerNo ?? '-'

const getPatientMeta = (patient) => {
  const card = getPatientCard(patient)
  const phone = getPatientPhone(patient)
  const rd = getPatientRd(patient)
  return `${card} · ${phone} · ${rd}`
}

const normalizePatient = (patient) => {
  const normalized = {
    id: getPatientId(patient),
    displayName: getDisplayName(patient),
    cardNo: getPatientCard(patient),
    phone: getPatientPhone(patient),
    rd: getPatientRd(patient),
    avatar: patient?.avatar || '',
  }
  return normalized
}

// Recent patients are now managed by patientStore

const fetchPatients = async (query) => {
  const requestId = ++activeSearchId
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await patientService.searchPatients(query)
    if (requestId !== activeSearchId) return
    if (response?.success) {
      results.value = response.data || []
    } else {
      results.value = []
      errorMessage.value = response?.error || 'Өвчтөн хайхад алдаа гарлаа.'
    }
  } catch (error) {
    if (requestId !== activeSearchId) return
    results.value = []
    errorMessage.value = 'Сүлжээний алдаа гарлаа.'
  } finally {
    if (requestId === activeSearchId) {
      loading.value = false
    }
  }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
    inputRef.value?.blur?.()
  }
}

const closeDropdown = () => {
  isFocused.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  errorMessage.value = ''
  loading.value = false
  closeDropdown()
  inputRef.value?.blur?.()
}

const selectPatient = (patient) => {
  const normalized = normalizePatient(patient)
  selectedPatient.value = normalized
  patientStore.setCurrentPatient(patient)
  emit('patient-selected', patient)
  if (normalized.id) {
    window.location.hash = `#patient?pid=${encodeURIComponent(normalized.id)}`
  }
  searchQuery.value = ''
  results.value = []
  errorMessage.value = ''
  loading.value = false
  closeDropdown()
  inputRef.value?.blur?.()
}

watch(searchQuery, (value) => {
  clearTimeout(searchTimeout)
  const trimmed = value.trim()
  if (!trimmed) {
    results.value = []
    loading.value = false
    errorMessage.value = ''
    return
  }
  loading.value = true
  errorMessage.value = ''
  results.value = []
  searchTimeout = window.setTimeout(() => {
    fetchPatients(trimmed)
  }, 120)
})

const handleOutsideClick = (event) => {
  if (!rootRef.value) return
  if (!rootRef.value.contains(event.target)) {
    closeDropdown()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  window.addEventListener('pointerdown', handleOutsideClick)
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  clearTimeout(searchTimeout)
  window.removeEventListener('pointerdown', handleOutsideClick)
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <header class="topbar-shell">
    <div class="topbar-inner !flex-row !items-center !justify-between gap-3 sm:gap-4">
      <!-- Slot for Menu Button on Tablet/Mobile -->
      <slot name="leading"></slot>

      <div ref="rootRef" class="topbar-search !max-w-[420px]">
        <span class="ui-input__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
          </svg>
        </span>
        <input
          ref="inputRef"
          v-model="searchQuery"
          type="search"
          inputmode="search"
          autocomplete="off"
          placeholder="Өвчтөн хайх..."
          class="ui-input !bg-slate-100/50 !backdrop-blur-sm focus:!bg-white focus:!ring-4 focus:!ring-blue-500/10 transition-all !min-h-[40px] !h-10 !text-sm"
          :aria-expanded="showDropdown"
          aria-controls="patient-search-dropdown"
          @focus="handleFocus"
          @keydown="handleKeydown"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="ui-input__clear"
          aria-label="Хайлтыг цэвэрлэх"
          @click="clearSearch"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        <div
          v-if="showDropdown"
          id="patient-search-dropdown"
          class="ui-dropdown"
          role="listbox"
        >
          <div class="ui-dropdown__list">
            <template v-if="showRecent">
              <div class="ui-dropdown__section">Сүүлд сонгосон</div>
              <button
                v-for="patient in limitedRecent"
                :key="patient.id"
                type="button"
                class="ui-row ui-row--interactive"
                role="option"
                @click="selectPatient(patient)"
              >
                <img
                  :src="patient.avatar || defaultAvatar"
                  alt="Өвчтөн"
                  class="ui-row__avatar"
                />
                <div class="ui-row__body">
                  <p class="ui-row__title">{{ getDisplayName(patient) }}</p>
                  <p class="ui-row__meta">{{ getPatientMeta(patient) }}</p>
                </div>
              </button>
            </template>
            <template v-else>
              <div v-if="loading" class="ui-row">
                <svg class="ui-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="3"></circle>
                  <path class="opacity-75" d="M4 12a8 8 0 018-8" stroke-linecap="round" stroke-width="3"></path>
                </svg>
                <span class="ui-row__meta">Уншиж байна...</span>
              </div>
              <div v-else-if="errorMessage" class="ui-row">
                <span class="ui-row__meta ui-row__meta--error">{{ errorMessage }}</span>
              </div>
              <div v-else-if="limitedResults.length === 0" class="ui-row">
                <span class="ui-row__meta">Илэрц олдсонгүй</span>
              </div>
              <button
                v-for="patient in limitedResults"
                :key="getPatientId(patient) || patient.phone"
                type="button"
                class="ui-row ui-row--interactive"
                role="option"
                @click="selectPatient(patient)"
              >
                <img
                  :src="patient.avatar || defaultAvatar"
                  alt="Өвчтөн"
                  class="ui-row__avatar"
                />
                <div class="ui-row__body">
                  <p class="ui-row__title">{{ getDisplayName(patient) }}</p>
                  <p class="ui-row__meta">{{ getPatientMeta(patient) }}</p>
                </div>
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="topbar-patient-wrap !w-auto">
        <div v-if="activePatientDisplay" class="flex items-center gap-2 sm:gap-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-100/80 bg-white/50 shadow-sm group">
          <div class="text-right hidden sm:block">
            <p class="text-[13px] font-bold text-slate-800 leading-tight">
              {{ getDisplayName(activePatientDisplay) }}
            </p>
            <p v-if="activePatientCard" class="text-[10px] text-slate-400 font-medium">
              {{ activePatientCard }}
            </p>
          </div>
          <div class="relative flex-shrink-0">
            <img
              :src="activePatientDisplay?.avatar || defaultAvatar"
              alt="Өвчтөн"
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white shadow-sm ring-1 ring-slate-100 object-cover"
            />
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
        <div v-else class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-400">
          <div class="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 bg-slate-100 flex items-center justify-center">
            <svg class="w-4 h-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
