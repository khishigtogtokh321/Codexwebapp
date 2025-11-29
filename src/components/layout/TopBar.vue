<template>
  <header class="w-full border-b border-gray-200 bg-white shadow-sm">
    <div
      class="mx-auto flex w-full max-w-screen-2xl flex-col items-stretch gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6"
    >
      <div class="relative flex-1 md:max-w-2xl">
        <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 10-10.61-10.6 7.5 7.5 0 0010.6 10.6z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          inputmode="search"
          autocomplete="off"
          placeholder="Өвчтөн хайх... (овог, нэр, утас)"
          class="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <div
          v-if="showDropdown"
          class="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <div class="divide-y divide-gray-100">
            <div v-if="loading" class="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
              <svg class="h-4 w-4 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="3"></circle>
                <path class="opacity-75" d="M4 12a8 8 0 018-8" stroke-linecap="round" stroke-width="3"></path>
              </svg>
              Хайж байна...
            </div>
            <div v-else-if="errorMessage" class="px-4 py-3 text-sm text-red-600">
              {{ errorMessage }}
            </div>
            <template v-else>
              <div v-if="results.length === 0" class="px-4 py-3 text-sm text-gray-500">
                Үр дүн олдсонгүй
              </div>
              <button
                v-for="patient in results"
                :key="patient.id || patient.phone || `${patient.lastName}-${patient.firstName}`"
                type="button"
                class="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-blue-50"
                @mousedown.prevent
                @click="selectPatient(patient)"
              >
                <img
                  :src="patient.avatar || defaultAvatar"
                  alt="Өвчтөн"
                  class="h-10 w-10 rounded-full border border-gray-100 object-cover"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-gray-900">
                    {{ fullName(patient) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ patient.phone || 'Утасны дугаар байхгүй' }}
                  </p>
                </div>
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="flex w-full items-center justify-between md:w-auto md:justify-end">
        <div class="flex min-w-[220px] items-center gap-3   px-4 py-2.5 ">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-gray-900">
              {{ fullName(activePatientDisplay) }}
            </p>
            <p class="text-xs text-gray-500">
              {{ phoneText(activePatientDisplay) }}
            </p>
          </div>
          <img
            :src="activePatientDisplay?.avatar || defaultAvatar"
            alt="Идэвхтэй өвчтөн"
            class="h-10 w-10 rounded-full border border-gray-100 object-cover"
          />
        
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import patientService from '@/services/patientService'

const props = defineProps({
  activePatient: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['patient-selected'])

const searchQuery = ref('')
const results = ref([])
const loading = ref(false)
const errorMessage = ref('')
const showDropdown = ref(false)
const selectedPatient = ref(null)
let searchTimeout
let hideTimeout
let skipNextSearch = false

const defaultAvatar =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="32" fill="%23E5E7EB"/><path d="M32 32c5.523 0 10-4.03 10-9s-4.477-9-10-9-10 4.03-10 9 4.477 9 10 9z" fill="%23CBD5E1"/><path d="M16 48c0-5.523 7.163-10 16-10s16 4.477 16 10v2H16v-2z" fill="%23CBD5E1"/></svg>'

const activePatientDisplay = computed(() => selectedPatient.value || props.activePatient)

const fetchPatients = async (query) => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await patientService.searchPatients(query)
    if (response?.success) {
      results.value = response.data || []
    } else {
      results.value = []
      errorMessage.value = response?.error || 'Хайлтын үед алдаа гарлаа.'
    }
  } catch (error) {
    results.value = []
    errorMessage.value = 'Сервертэй холбогдож чадсангүй.'
  } finally {
    loading.value = false
  }
}

watch(searchQuery, (value) => {
  clearTimeout(searchTimeout)
  if (skipNextSearch) {
    skipNextSearch = false
    return
  }
  const trimmed = value.trim()
  if (trimmed.length < 2) {
    results.value = []
    loading.value = false
    showDropdown.value = false
    errorMessage.value = ''
    return
  }
  showDropdown.value = true
  searchTimeout = window.setTimeout(() => {
    fetchPatients(trimmed)
  }, 280)
})

const handleFocus = () => {
  const trimmed = searchQuery.value.trim()
  if (trimmed.length >= 2) {
    showDropdown.value = true
    if (!results.value.length) {
      fetchPatients(trimmed)
    }
  }
}

const handleBlur = () => {
  clearTimeout(hideTimeout)
  hideTimeout = window.setTimeout(() => {
    showDropdown.value = false
  }, 120)
}

const selectPatient = (patient) => {
  selectedPatient.value = patient
  emit('patient-selected', patient)
  skipNextSearch = true
  searchQuery.value = fullName(patient)
  results.value = []
  loading.value = false
  showDropdown.value = false
}

const fullName = (patient) => {
  if (!patient) return 'Өвчтөн сонгоогүй'
  const name = [patient.lastName, patient.firstName].filter(Boolean).join(' ').trim()
  return name || 'Өвчтөн сонгоогүй'
}

const phoneText = (patient) => {
  if (!patient) return 'Утасны дугаар байхгүй'
  return patient.phone || 'Утасны дугаар байхгүй'
}

onBeforeUnmount(() => {
  clearTimeout(searchTimeout)
  clearTimeout(hideTimeout)
})
</script>
