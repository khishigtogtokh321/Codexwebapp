<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HistorySearchBar from '@/components/history/HistorySearchBar.vue'
import { formatDate } from '@/utils/formatters'

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

const emit = defineEmits(['search', 'filter-status', 'edit', 'delete', 'toggle-expand'])

const isEditOpen = ref(false)
const editDraft = ref(null)
const isMobileOrTablet = ref(false)

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
  isEditOpen.value = true
}

function closeEdit() {
  isEditOpen.value = false
  editDraft.value = null
}

function saveEdit() {
  if (!editDraft.value) return
  emit('edit', { ...editDraft.value })
  closeEdit()
}

function getStatusClass(status) {
  return status === 'done'
    ? 'bg-green-100 text-green-800'
    : 'bg-amber-100 text-amber-800'
}

function getStatusLabel(status) {
  return status === 'done' ? 'Хийгдсэн' : 'Төлөвлөсөн'
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
            <th>Төлөв</th>
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
                {{ treatment.status === 'done' ? formatDate(treatment.date) : '' }}
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
                <span
                  :class="getStatusClass(treatment.status)"
                  class="history-grid__status"
                >
                  {{ getStatusLabel(treatment.status) }}
                </span>
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
                  <input v-model="editDraft.surface" type="text" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="M, O, D" />
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

                <!-- Diagnosis -->
                <div class="sm:col-span-2 space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Онош</label>
                  <textarea v-model="editDraft.diagnosis" rows="2" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none" placeholder="Онош оруулах..."></textarea>
                </div>

                <!-- Treatment -->
                <div class="sm:col-span-2 space-y-1">
                  <label class="block text-[12px] font-bold text-slate-500 ml-1">Эмчилгээ</label>
                  <input v-model="editDraft.treatmentType" type="text" class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="Эмчилгээний төрөл..." />
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
