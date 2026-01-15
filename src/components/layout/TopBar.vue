<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePatientStore } from '@/stores/patient'
import patientService from '@/services/patientService'

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
const isOverlayOpen = ref(false)
const selectedPatient = ref(null)
const searchOverlayInputRef = ref(null)
let searchTimeout
let activeSearchId = 0

const MAX_RESULTS = 5

const defaultAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="%23E5E7EB"/><path d="M32 32c5.523 0 10-4.03 10-9s-4.477-9-10-9-10 4.03-10 9 4.477 9 10 9z" fill="%23CBD5E1"/><path d="M16 48c0-5.523 7.163-10 16-10s16 4.477 16 10v2H16v-2z" fill="%23CBD5E1"/></svg>'

const activeDoctor = ref({
  name: 'Б. Бат-Эрдэнэ',
  specialist: 'Шүдний их эмч',
  avatar: ''
})

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
  return card !== '-' ? card : null
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

const openOverlay = () => {
  isOverlayOpen.value = true
  setTimeout(() => {
    searchOverlayInputRef.value?.focus()
  }, 100)
}

const closeOverlay = () => {
  isOverlayOpen.value = false
  searchQuery.value = ''
  results.value = []
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
  closeOverlay()
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
    <div class="topbar-inner flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
      
      <!-- 1. LEFT: Menu, Patient Info & Search -->
      <div class="flex items-center flex-1 min-w-0">
        <div class="flex items-center gap-4 mr-5">
          <slot name="leading"></slot>
          
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform -translate-y-1 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-1 opacity-0"
          >
            <div v-if="activePatientDisplay" class="flex flex-col min-w-[120px]">
              <span class="text-[14px] font-bold text-slate-800 tracking-tight leading-tight truncate">
                {{ getDisplayName(activePatientDisplay) }}
              </span>
              <span v-if="activePatientCard" class="text-[11px] text-slate-500 font-medium">
              № {{ activePatientCard }}
              </span>
            </div>
          </Transition>
        </div>

        <!-- SEARCH: Desktop View -->
        <div ref="rootRef" class="topbar-search hidden lg:block">
          <span class="ui-input__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
            </svg>
          </span>
          <input
            ref="inputRef"
            v-model="searchQuery"
            type="search"
            inputmode="search"
            autocomplete="off"
            placeholder="Өвчтөн хайх "
            class="ui-input ui-input--search"
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

        <!-- SEARCH: Mobile/Tablet Trigger Icon -->
        <div class="lg:hidden flex items-center">
          <button 
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            @click="openOverlay"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- SEARCH OVERLAY (Mobile/Tablet) -->
      <Teleport to="body">
        <Transition name="search-overlay">
          <div v-if="isOverlayOpen" class="search-overlay-shell">
            <div class="search-overlay-backdrop" @click="closeOverlay"></div>
            
            <div class="search-overlay-content">
              <div class="search-overlay-header">
                <div class="search-overlay-input-wrap">
                  <svg class="search-overlay-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
                  </svg>
                  <input
                    ref="searchOverlayInputRef"
                    v-model="searchQuery"
                    type="search"
                    placeholder="Өвчтөн хайх..."
                    class="search-overlay-input"
                    @keydown.esc="closeOverlay"
                  />
                  <button v-if="searchQuery" type="button" class="search-overlay-clear" @click="searchQuery = ''">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button type="button" class="search-overlay-close" @click="closeOverlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="search-overlay-results scrollbar-hide">
                <div class="ui-dropdown__list p-0">
                  <template v-if="showRecent">
                    <div class="ui-dropdown__section px-4 pt-4">Сүүлд сонгосон</div>
                    <button
                      v-for="patient in limitedRecent"
                      :key="patient.id"
                      type="button"
                      class="ui-row ui-row--interactive py-4 px-4"
                      @click="selectPatient(patient)"
                    >
                      <img :src="patient.avatar || defaultAvatar" class="ui-row__avatar w-12 h-12" />
                      <div class="ui-row__body">
                        <p class="ui-row__title text-base font-bold">{{ getDisplayName(patient) }}</p>
                        <p class="ui-row__meta">{{ getPatientMeta(patient) }}</p>
                      </div>
                    </button>
                  </template>
                  
                  <template v-else>
                    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3">
                      <svg class="ui-spinner w-8 h-8 text-blue-500" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none"></circle>
                        <path class="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-linecap="round" stroke-width="3"></path>
                      </svg>
                      <span class="text-slate-500 font-medium">Уншиж байна...</span>
                    </div>
                    
                    <div v-else-if="errorMessage" class="p-8 text-center text-red-500">
                      {{ errorMessage }}
                    </div>
                    
                    <div v-else-if="limitedResults.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400">
                      <svg class="w-16 h-16 mb-4 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
                      </svg>
                      <p class="text-lg font-medium">Илэрц олдсонгүй</p>
                      <p class="text-sm">Өөр нэрээр хайж үзнэ үү</p>
                    </div>

                    <button
                      v-for="patient in limitedResults"
                      :key="getPatientId(patient)"
                      type="button"
                      class="ui-row ui-row--interactive py-4 px-4"
                      @click="selectPatient(patient)"
                    >
                      <img :src="patient.avatar || defaultAvatar" class="ui-row__avatar w-12 h-12" />
                      <div class="ui-row__body">
                        <p class="ui-row__title text-base font-bold">{{ getDisplayName(patient) }}</p>
                        <p class="ui-row__meta">{{ getPatientMeta(patient) }}</p>
                      </div>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- 2. SPACER/CENTER: Empty now -->
      <div class="hidden md:block md:flex-1"></div>

      <!-- 3. RIGHT: Doctor Profile -->
      <div class="topbar-user-wrap flex-1 flex justify-end">
        <div class="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
          <div class="flex flex-col items-end hidden sm:flex">
            <span class="text-[11px] font-bold text-slate-900 leading-none mb-1">
              {{ activeDoctor.name }}
            </span>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none">
              {{ activeDoctor.specialist }}
            </span>
          </div>
          <div class="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
            {{ activeDoctor.name.slice(0, 1) }}
          </div>
        </div>
      </div>

    </div>
  </header>
</template>

<style scoped>
.topbar-center {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
