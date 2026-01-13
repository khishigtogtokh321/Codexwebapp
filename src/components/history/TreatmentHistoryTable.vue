<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import { formatDate } from '@/utils/formatters'
import diagnoses from '@/data/diagnoses'

const props = defineProps({
  treatments: {
    type: Array,
    default: () => [],
  },
  searchQuery: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: Object,
    default: null,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search', 'filter-status', 'edit', 'delete', 'toggle-expand', 'discount'])

const isEditOpen = ref(false)
const editDraft = ref(null)
const isMobileOrTablet = ref(false)

// Edit Modal Dropdown states
const showSurfaceDropdown = ref(false)
const showDiagnosisDropdown = ref(false)
const diagnosisQuery = ref('')
const tempSurfaces = ref([])

// Discount Modal states
const isDiscountOpen = ref(false)
const discountDraft = ref(null)
const discountOptions = [
  { id: 1, name: 'Кассын хөнгөлөлт' },
  { id: 2, name: 'Хөнгөлөлт 3%' },
]

const checkScreenSize = () => {
  isMobileOrTablet.value = window.innerWidth < 1024
}

const statusOptions = [
  { value: 'planned', label: getStatusLabel('planned') },
  { value: 'done', label: getStatusLabel('done') },
]

const patientName = computed(() => {
  if (!props.patient) return 'Patient'
  if (props.patient.name) return props.patient.name
  const name = [props.patient.lastName, props.patient.firstName].filter(Boolean).join(' ').trim()
  return name || 'Patient'
})

const patientAgeText = computed(() => {
  const age = props.patient?.age
  return Number.isFinite(age) ? `${age}` : '--'
})

const patientCardText = computed(() => {
  return props.patient?.register || props.patient?.cardNumber || props.patient?.cardId || props.patient?.id || '--'
})

const patientTitle = computed(() => `${patientName.value} • Age ${patientAgeText.value} • Card ${patientCardText.value}`)

const filteredDiagnoses = computed(() => {
  if (!diagnosisQuery.value) return diagnoses.slice(0, 50)
  const q = diagnosisQuery.value.toLowerCase()
  return diagnoses.filter(d => 
    d.code.toLowerCase().includes(q) || 
    d.name.toLowerCase().includes(q)
  ).slice(0, 50)
})

const surfaceTriggerLabel = computed(() => 
  tempSurfaces.value.length ? tempSurfaces.value.join(', ') : 'Гадаргуу'
)

function normalizeDateInput(value) {
  if (!value) return ''
  if (typeof value === 'string' && value.length >= 10 && value[4] === '-' && value[7] === '-') {
    return value.slice(0, 10)
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

function openEdit(treatment) {
  editDraft.value = {
    ...treatment,
    date: normalizeDateInput(treatment.date),
    status: treatment.status || 'planned',
  }
  
  // Initialize surface array
  tempSurfaces.value = treatment.surface 
    ? String(treatment.surface).split(',').map(s => s.trim()).filter(Boolean)
    : []

  // Initialize diagnosis query
  const diag = treatment.diagnosis
  if (typeof diag === 'object' && diag) {
    diagnosisQuery.value = diag.code || diag.name || ''
  } else {
    diagnosisQuery.value = diag || ''
  }
  
  isEditOpen.value = true
}

function closeEdit() {
  isEditOpen.value = false
  editDraft.value = null
}

function saveEdit() {
  if (!editDraft.value) return
  
  // Sync back surfaces
  editDraft.value.surface = tempSurfaces.value.join(', ')
  
  emit('edit', { ...editDraft.value })
  closeEdit()
}

function handleDiscount(treatment) {
  discountDraft.value = {
    ...treatment,
    discountDate: new Date().toISOString().slice(0, 10),
    treatmentDate: normalizeDateInput(treatment.date),
    treatmentPrice: treatment.price || 0,
    discountAmount: 0,
    doctor: treatment.doctor || 'DP - Practice, Practice',
    note: '',
    selectedDiscountId: null
  }
  isDiscountOpen.value = true
}

function closeDiscount() {
  isDiscountOpen.value = false
  discountDraft.value = null
}

function saveDiscount() {
  if (!discountDraft.value) return
  emit('discount', { ...discountDraft.value })
  closeDiscount()
}

function deleteDiscount() {
  // Emit delete or handle delete logic
  closeDiscount()
}

function toggleSurface(surface) {
  if (tempSurfaces.value.includes(surface)) {
    tempSurfaces.value = tempSurfaces.value.filter(s => s !== surface)
  } else {
    tempSurfaces.value = [...tempSurfaces.value, surface]
  }
}

function selectDiagnosis(item) {
  editDraft.value.diagnosis = item
  diagnosisQuery.value = `${item.code} - ${item.name}`
  showDiagnosisDropdown.value = false
}

function clearDiagnosis() {
  editDraft.value.diagnosis = null
  diagnosisQuery.value = ''
  showDiagnosisDropdown.value = false
}


function toggleSurfaceDropdown() {
  showSurfaceDropdown.value = !showSurfaceDropdown.value
  if (showSurfaceDropdown.value) showDiagnosisDropdown.value = false
}

function toggleDiagnosisDropdown() {
  showDiagnosisDropdown.value = !showDiagnosisDropdown.value
  if (showDiagnosisDropdown.value) showSurfaceDropdown.value = false
}

function openDiagnosisDropdown() {
  showDiagnosisDropdown.value = true
  showSurfaceDropdown.value = false
}

function getStatusClass(status) {
  return status === 'done'
    ? 'bg-green-100 text-green-800'
    : 'bg-amber-100 text-amber-800'
}

function getStatusLabel(status) {
  return status === 'done' ? 'Дууссан' : 'Төлөвлөгөөт'
}

function handleDelete(treatmentId) {
  emit('delete', treatmentId)
}



const handleKeydown = (event) => {
  if (event.key === 'Escape' && isEditOpen.value) closeEdit()
}

function handleRowClick(treatment) {
  if (isMobileOrTablet.value) {
    openEdit(treatment)
  }
}

function handleRowDblClick(treatment) {
  if (!isMobileOrTablet.value) {
    openEdit(treatment)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', checkScreenSize)
  document.body?.classList?.remove('overflow-hidden')
})

watch(isEditOpen, (open) => {
  document.body?.classList?.toggle('overflow-hidden', open)
})
</script>

<template>
  <div class="dental-card history-grid">
    <div class="history-grid__toolbar relative !overflow-visible">
      <!-- Expansion Toggle Button -->
      <button
        type="button"
        class="absolute top-[8px] left-1/2 -translate-x-1/2 z-20 w-[37px] h-[37px] rounded-full bg-white border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:shadow-[0_6px_16px_rgba(37,99,235,0.15)] active:scale-95 transition-all duration-300 group"
        @click="emit('toggle-expand')"
        :title="isExpanded ? 'Collapse' : 'Expand'"
      >
        <svg
          class="w-6 h-6 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          :class="isExpanded ? 'rotate-180' : 'rotate-0'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div class="history-toolbar">
        <h2 class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Эмчилгээний түүх</h2>
        <div class="history-toolbar__controls">
          <HistorySearchBar
            :search-query="searchQuery"
            :status-filter="statusFilter"
            @search="emit('search', $event)"
            @filter-status="emit('filter-status', $event)"
          />
        </div>
      </div>
    </div>
    <div 
      class="history-grid__table-shell transition-all duration-300"
      :class="{ 'is-expanded': isExpanded }"
    >
      <table class="history-grid__table">
        <thead>
          <tr>
            <th>Огноо</th>
            <th>Дууссан</th>
            <th>Онош</th>
            <th>Эмч</th>
            <th>Шүд</th>
            <th>Гадаргуу</th>
            <th>Код</th>
            <th>Тайлбар</th>
            <th class="history-grid__cell--number">Үнэ</th>
            <th>Тэмдэглэл</th>
            <th class="text-center">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <tr v-if="loading" class="history-grid__row">
            <td colspan="12" class="history-grid__cell history-grid__cell--muted">
              <div class="history-grid__loading">
                <svg class="history-grid__spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ачааллаж байна...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="treatments.length === 0" class="history-grid__row">
            <td colspan="12" class="history-grid__cell history-grid__cell--muted">
              Эмчилгээний түүх олдсонгүй
            </td>
          </tr>

          <!-- Treatment Rows -->
          <template v-else>
            <tr
              v-for="(treatment, index) in treatments"
              :key="treatment.id"
              :class="['history-grid__row cursor-pointer select-none', index % 2 === 0 ? 'is-even' : 'is-odd']"
              @click="handleRowClick(treatment)"
              @dblclick="handleRowDblClick(treatment)"
            >
              <td class="history-grid__cell history-grid__cell--date">
                {{ formatDate(treatment.date) }}
              </td>
              <td class="history-grid__cell history-grid__cell--date">
                <span
                  :class="getStatusClass(treatment.status)"
                  class="history-grid__status"
                >
                  {{ getStatusLabel(treatment.status) }}
                </span>
              </td>
              <td class="history-grid__cell">
                <span class="history-grid__ellipsis" :title="treatment.diagnosis">
                  {{ typeof treatment.diagnosis === 'object' ? (treatment.diagnosis.name || treatment.diagnosis.code) : (treatment.diagnosis || '---') }}
                </span>
              </td>
              <td class="history-grid__cell">
                {{ treatment.doctor || '---' }}
              </td>
              <td class="history-grid__cell history-grid__cell--code">
                {{ treatment.tooth }}
              </td>
              <td class="history-grid__cell">
                {{ treatment.surface }}
              </td>
              <td class="history-grid__cell text-xs font-mono">
                {{ treatment.code }}
              </td>
              <td class="history-grid__cell">
                <span class="history-grid__ellipsis" :title="treatment.treatmentType">
                  {{ treatment.treatmentType }}
                </span>
              </td>
              <td class="history-grid__cell history-grid__cell--number">
                {{ Number(treatment.price || 0).toLocaleString() }}₮
              </td>
              <td class="history-grid__cell">
                <span class="history-grid__ellipsis" :title="treatment.note">
                  {{ treatment.note || '' }}
                </span>
              </td>
              <td class="history-grid__cell">
                <div class="flex items-center justify-center gap-1.5" @click.stop>
                  <button
                    type="button"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="Засах"
                    @click="openEdit(treatment)"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all"
                    title="Хөнгөлөлт"
                    @click="handleDiscount(treatment)"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Table Footer with Summary -->
    <div v-if="treatments.length > 0" class="history-grid__footer">
      <div class="history-grid__footer-meta">
        <span>Total: {{ treatments.length }} treatment(s)</span>
        <span class="history-grid__footer-strong">
          Completed: {{ treatments.filter((t) => t.status === 'done').length }} |
          Planned: {{ treatments.filter((t) => t.status === 'planned').length }}
        </span>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isEditOpen && editDraft"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-[8px] p-4 sm:p-6 transition-all duration-300"
        @click.self="closeEdit"
      >
        <Transition
          enter-active-class="transition duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          leave-active-class="transition duration-250 ease-in"
          enter-from-class="opacity-0 scale-90 translate-y-12"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-8"
        >
          <div
            v-if="isEditOpen"
            class="w-full max-w-2xl rounded-[24px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] border border-white/20 overflow-hidden flex flex-col max-h-[92vh]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Modal Header -->
            <div class="relative px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-slate-50/50">
              <div class="flex items-start justify-between">
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"></span>
                    <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">Засах</p>
                  </div>
                  <h3 class="text-lg font-extrabold text-slate-800 tracking-tight leading-tight">
                    {{ patientTitle }}
                  </h3>
                </div>
                <button
                  type="button"
                  class="group relative h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all active:scale-95 flex-shrink-0"
                  @click="closeEdit"
                  aria-label="Close"
                >
                  <svg class="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <form class="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 sm:px-6 sm:py-5" @submit.prevent="saveEdit">
              <div class="grid gap-x-5 gap-y-4 grid-cols-1 sm:grid-cols-2">
                <!-- Date -->
                <div class="space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Огноо</label>
                  <div class="relative group">
                    <input v-model="editDraft.date" type="date" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" />
                  </div>
                </div>

                <!-- Tooth -->
                <div class="space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Шүд</label>
                  <input v-model="editDraft.tooth" type="text" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="#36" />
                </div>

                <!-- Surface -->
                <div class="space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Гадаргуу</label>
                  <div class="relative">
                    <button
                      type="button"
                      class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none flex items-center justify-between"
                      @click="toggleSurfaceDropdown"
                    >
                      <span>{{ surfaceTriggerLabel }}</span>
                      <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
                      </svg>
                    </button>

                    <!-- Surface Dropdown -->
                    <div
                      v-if="showSurfaceDropdown"
                      class="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2"
                    >
                       <div class="treatment-surface-grid">
                        <div></div>
                        <button type="button" class="treatment-surface-button" :class="tempSurfaces.includes('B/F') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('B/F')">B/F</button>
                        <div></div>

                        <button type="button" class="treatment-surface-button" :class="tempSurfaces.includes('M') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('M')">M</button>
                        <button type="button" class="treatment-surface-button" :class="tempSurfaces.includes('O/I') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('O/I')">O/I</button>
                        <button type="button" class="treatment-surface-button" :class="tempSurfaces.includes('D') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('D')">D</button>

                        <div></div>
                        <button type="button" class="treatment-surface-button" :class="tempSurfaces.includes('L/P') ? 'treatment-surface-button--selected' : ''" @click="toggleSurface('L/P')">L/P</button>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Status -->
                <div class="space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Төлөв</label>
                  <select v-model="editDraft.status" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none">
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                
                <!-- Treatment -->
                <div class="sm:col-span-2 space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Эмчилгээ</label>
                  <input v-model="editDraft.treatmentType" type="text" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="Эмчилгээний төрөл..." />
                </div>

                <!-- Diagnosis -->
                <div class="sm:col-span-2 space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Онош</label>
                  <div class="relative">
                    <div class="relative">
                      <input
                        v-model="diagnosisQuery"
                        type="text"
                        class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        placeholder="Онош хайх..."
                        @focus="openDiagnosisDropdown"
                      />
                      <button
                        v-if="diagnosisQuery"
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        @click="clearDiagnosis"
                      >
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>

                    <!-- Diagnosis Dropdown -->
                    <div
                      v-if="showDiagnosisDropdown"
                      class="absolute top-full left-0 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                      <button
                        type="button"
                        class="w-full text-left px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 border-b border-slate-100"
                        @click="clearDiagnosis"
                      >
                        Алгасах
                      </button>
                      <div class="divide-y divide-slate-100">
                        <button
                          v-for="item in filteredDiagnoses"
                          :key="item.code"
                          type="button"
                          class="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors"
                          @click="selectDiagnosis(item)"
                        >
                          <p class="text-sm font-semibold text-slate-800">{{ item.code }}</p>
                          <p class="text-xs text-slate-500">{{ item.name }}</p>
                        </button>
                         <div v-if="filteredDiagnoses.length === 0" class="p-4 text-center text-xs text-slate-400">
                          Онош олдсонгүй
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Doctor -->
                <div class="space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Эмч</label>
                  <input v-model="editDraft.doctor" type="text" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="Эмчийн нэр..." />
                </div>

                <!-- Price -->
                <div class="space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Үнэ</label>
                  <div class="relative">
                    <input v-model="editDraft.price" type="text" class="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-bold focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="0.00" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] italic">₮</span>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between sticky bottom-0 bg-white pt-4 pb-2 border-t border-slate-100/50 gap-4">
                <button
                  type="button"
                  class="h-11 px-5 rounded-xl border border-red-50 bg-red-50/30 text-[13px] font-bold text-red-500 hover:bg-red-50 hover:border-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                  @click="handleDelete(editDraft.id); closeEdit()"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Устгах</span>
                </button>
                
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    class="h-11 px-8 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-500 hover:bg-slate-50 active:scale-95 transition-all text-center"
                    @click="closeEdit"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="submit"
                    class="h-11 px-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all text-center"
                  >
                    Хадгалах
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Discount Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isDiscountOpen && discountDraft"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-[8px] p-4 sm:p-6"
        @click.self="closeDiscount"
      >
        <Transition
          enter-active-class="transition duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          leave-active-class="transition duration-250 ease-in"
          enter-from-class="opacity-0 scale-90 translate-y-12"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-8"
        >
          <div
            v-if="isDiscountOpen"
            class="w-full max-w-3xl rounded-lg bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 class="text-xl font-normal text-gray-800">Хөнгөлөлт</h3>
              <button @click="closeDiscount" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto">
              <div class="flex gap-8">
                <!-- Left Column -->
                <div class="flex-1 space-y-3">
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                    <label class="text-right text-sm text-gray-600">Огноо</label>
                    <input v-model="discountDraft.date" type="date" class="border border-gray-300 rounded px-3 py-1.5 text-sm w-40" />
                  </div>
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                    <label class="text-right text-sm text-gray-600">Хөнгөлөлт огноо</label>
                    <input v-model="discountDraft.discountDate" type="date" class="border border-gray-300 rounded px-3 py-1.5 text-sm w-40" />
                  </div>
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                    <label class="text-right text-sm text-gray-600">(эмчилгээ огноо)</label>
                    <input v-model="discountDraft.treatmentDate" type="date" disabled class="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 bg-gray-50 text-gray-500" />
                  </div>
                   <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                    <label class="text-right text-sm text-gray-600">(эмчилгээ төлбөр)</label>
                    <input :value="Number(discountDraft.treatmentPrice).toLocaleString()" type="text" disabled class="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 bg-gray-50 text-gray-500 text-right" />
                  </div>
                  
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2 mt-6">
                    <label class="text-right text-sm text-gray-600">Хөнгөлөлтийн дүн</label>
                    <input v-model="discountDraft.discountAmount" type="number" class="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 text-right" placeholder="0.00" />
                  </div>

                  <div class="grid grid-cols-[140px_1fr] items-center gap-2 mt-4">
                    <label class="text-right text-sm text-gray-600">Эмчлэгч</label>
                    <div class="flex items-center gap-1 w-full max-w-[240px]">
                      <div class="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 bg-white flex items-center justify-between">
                         <span class="truncate">{{ discountDraft.doctor }}</span>
                         <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <button class="px-2 py-1.5 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 text-xs text-gray-600">...</button>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="w-64 flex flex-col">
                  <label class="text-sm font-semibold text-gray-700 mb-1 pl-1">Хөнгөлөлт</label>
                  <div class="border border-gray-400 h-48 overflow-y-auto bg-white">
                    <div 
                      v-for="opt in discountOptions" 
                      :key="opt.id"
                      class="px-2 py-1 text-sm cursor-pointer hover:bg-blue-50"
                      :class="discountDraft.selectedDiscountId === opt.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'"
                      @click="discountDraft.selectedDiscountId = opt.id"
                    >
                      {{ opt.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Note -->
              <div class="mt-8">
                <label class="block text-sm text-gray-600 mb-1 ml-[140px]">Тэмдэглэл</label>
                <div class="flex">
                  <div class="w-[140px]"></div>
                  <textarea v-model="discountDraft.note" rows="4" class="flex-1 max-w-[400px] border border-gray-400 p-2 text-sm focus:outline-none focus:border-blue-500"></textarea>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button 
                type="button" 
                class="px-6 py-2 border-2 border-amber-400 text-amber-600 font-bold text-sm hover:bg-amber-50 rounded bg-white"
                @click="deleteDiscount"
              >
                <u>У</u>стгах
              </button>
              <div class="flex items-center gap-3">
                 <button 
                  type="button" 
                  class="px-6 py-2 border-2 text-green-600 border-green-600 font-bold text-sm hover:bg-green-50 rounded bg-white flex items-center gap-1"
                  @click="saveDiscount"
                >
                  <span>Тийм</span>
                </button>
                <button 
                  type="button" 
                  class="px-6 py-2 border-2 border-gray-500 text-gray-700 font-bold text-sm hover:bg-gray-100 rounded bg-white"
                  @click="closeDiscount"
                >
                  Цуцлах
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Expanded state height to show ~9 rows + header */
.history-grid__table-shell.is-expanded {
  max-height: calc(9 * 45px + 45px); /* approx 9 rows @ 45px each + header */
  min-height: 400px;
}

@media (min-height: 900px) {
  .history-grid__table-shell.is-expanded {
    max-height: calc(100vh - 300px);
  }
}

/* Enable Horizontal Scroll and avoid squeezing only on Portrait/Small screens */
@media (max-width: 1023px) {
  .history-grid__table {
    min-width: 1000px;
    table-layout: fixed;
  }

  .history-grid__table-shell {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }
}

.history-grid__table {
  width: 100%;
}

.history-grid__cell, 
.history-grid__table thead th {
  padding: 10px 8px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-grid__table-shell {
  overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
