<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatDate } from '@/utils/formatters'

const props = defineProps({
  treatments: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  patient: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['edit', 'delete'])

const isEditOpen = ref(false)
const editDraft = ref(null)
const expandedRowId = ref(null)

const statusOptions = [
  { value: 'planned', label: getStatusLabel('planned') },
  { value: 'done', label: getStatusLabel('done') },
]

const patientName = computed(() => {
  if (!props.patient) return 'Өвчтөн'
  if (props.patient.name) return props.patient.name
  const name = [props.patient.lastName, props.patient.firstName].filter(Boolean).join(' ').trim()
  return name || 'Өвчтөн'
})

const patientAgeText = computed(() => {
  const age = props.patient?.age
  return Number.isFinite(age) ? `${age}` : '--'
})

const patientCardText = computed(() => {
  return props.patient?.register || props.patient?.cardNumber || props.patient?.cardId || props.patient?.id || '--'
})

const patientTitle = computed(
  () => `${patientName.value} - Нас ${patientAgeText.value} - Карт № ${patientCardText.value}`,
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

function toggleRow(id) {
  expandedRowId.value = expandedRowId.value === id ? null : id
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isEditOpen.value) closeEdit()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body?.classList?.remove('overflow-hidden')
})

watch(isEditOpen, (open) => {
  document.body?.classList?.toggle('overflow-hidden', open)
})
</script>

<template>
  <div class="dental-card overflow-hidden">
    <div class="divide-y divide-gray-200 bg-white">
      <div v-if="loading" class="px-4 py-8 text-center text-gray-500">
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Өгөгдөл ачаалж байна...</span>
        </div>
      </div>

      <div v-else-if="treatments.length === 0" class="px-4 py-10 text-center text-gray-500">
        Эмчилгээний түүх хоосон байна.
      </div>

      <div v-else class="pb-24 md:pb-28">
        <div
          v-for="treatment in treatments"
          :key="treatment.id"
          class="bg-white"
        >
          <div class="flex items-start gap-3 px-4 py-4 md:px-5">
            <button
              type="button"
              class="flex-1 rounded-lg text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="expandedRowId === treatment.id ? 'bg-blue-50/60' : 'hover:bg-gray-50'"
              :aria-expanded="expandedRowId === treatment.id"
              @click="toggleRow(treatment.id)"
            >
              <div class="flex items-start gap-3">
                <span
                  :class="getStatusClass(treatment.status)"
                  class="mt-1 inline-flex h-6 min-w-[64px] items-center justify-center rounded-full px-2 text-[11px] font-semibold"
                >
                  {{ getStatusLabel(treatment.status) }}
                </span>

                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900">
                    <span class="truncate">
                      {{ treatment.tooth || '--' }}
                    </span>
                    <span class="text-gray-400">•</span>
                    <span class="truncate">
                      {{ treatment.surface || '--' }}
                    </span>
                    <span class="text-gray-400">•</span>
                    <span class="line-clamp-1">
                      {{ treatment.treatmentType || '--' }}
                    </span>
                  </div>

                  <p class="text-xs text-gray-600 line-clamp-2">
                    {{ treatment.diagnosis || '--' }}
                  </p>

                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
                    <span>{{ formatDate(treatment.date) }}</span>
                    <span>{{ treatment.doctor || '--' }}</span>
                    <span class="font-semibold text-gray-700">{{ treatment.price || '--' }}</span>
                  </div>
                </div>
              </div>
            </button>

            <div class="pt-1">
              <details class="relative">
                <summary class="list-none">
                  <span
                    class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
                    aria-label="Дэлгэрэнгүй үйлдэл"
                    @click.stop
                  >
                    ⋯
                  </span>
                </summary>
                <div class="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg">
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    @click.stop="openEdit(treatment)"
                  >
                    Засах
                  </button>
                  <button
                    type="button"
                    class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    @click.stop="handleDelete(treatment.id)"
                  >
                    Устгах
                  </button>
                </div>
              </details>
            </div>
          </div>

          <div
            v-if="expandedRowId === treatment.id"
            class="bg-slate-50 px-4 pb-4 md:px-5"
          >
            <div class="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-gray-700 md:grid-cols-2">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Огноо</p>
                <p class="mt-1 font-medium text-gray-900">{{ formatDate(treatment.date) || '--' }}</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Төлөв</p>
                <span
                  :class="getStatusClass(treatment.status)"
                  class="mt-1 inline-flex h-6 items-center rounded-full px-2 text-[11px] font-semibold"
                >
                  {{ getStatusLabel(treatment.status) }}
                </span>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Шүд</p>
                <p class="mt-1 font-medium text-gray-900">{{ treatment.tooth || '--' }}</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Гадаргуу</p>
                <p class="mt-1 font-medium text-gray-900">{{ treatment.surface || '--' }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Эмчилгээ</p>
                <p class="mt-1 font-medium text-gray-900">{{ treatment.treatmentType || '--' }}</p>
              </div>
              <div class="md:col-span-2">
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Онош</p>
                <p class="mt-1 text-gray-700">{{ treatment.diagnosis || '--' }}</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Эмч</p>
                <p class="mt-1 font-medium text-gray-900">{{ treatment.doctor || '--' }}</p>
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Үнэ</p>
                <p class="mt-1 font-medium text-gray-900">{{ treatment.price || '--' }}</p>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                class="min-h-[44px] rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                @click.stop="openEdit(treatment)"
              >
                Засах
              </button>
              <button
                type="button"
                class="min-h-[44px] rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
                @click.stop="handleDelete(treatment.id)"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="treatments.length > 0" class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span>Нийт: {{ treatments.length }} эмчилгээ</span>
        <span class="font-medium">
          Хийгдсэн: {{ treatments.filter((t) => t.status === 'done').length }} |
          Төлөвлөсөн: {{ treatments.filter((t) => t.status === 'planned').length }}
        </span>
      </div>
    </div>
  </div>

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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeEdit"
    >
      <Transition
        enter-active-class="transition duration-200"
        leave-active-class="transition duration-150"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isEditOpen"
          class="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-start justify-between border-b border-gray-200 px-5 py-4">
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-wide text-gray-500">Эмчилгээ засах</p>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ patientTitle }}
              </h3>
            </div>
            <button
              type="button"
              class="h-10 w-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
              @click="closeEdit"
              aria-label="Close"
            >
              <svg class="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form class="max-h-[80dvh] overflow-y-auto px-5 py-4" @submit.prevent="saveEdit">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Огноо</label>
                <input v-model="editDraft.date" type="date" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Шүд</label>
                <input v-model="editDraft.tooth" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Гадаргуу</label>
                <input v-model="editDraft.surface" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Төлөв</label>
                <select v-model="editDraft.status" class="input-field min-h-[44px] text-sm">
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="block text-sm font-medium text-gray-700">Онош</label>
                <textarea v-model="editDraft.diagnosis" rows="3" class="input-field min-h-[88px] text-sm"></textarea>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="block text-sm font-medium text-gray-700">Эмчилгээ</label>
                <input v-model="editDraft.treatmentType" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Эмч</label>
                <input v-model="editDraft.doctor" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Үнэ</label>
                <input v-model="editDraft.price" type="text" class="input-field min-h-[44px] text-sm" />
              </div>
            </div>

            <div class="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="min-h-[44px] rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                @click="closeEdit"
              >
                Цуцлах
              </button>
              <button
                type="submit"
                class="min-h-[44px] rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Хадгалах
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.line-clamp-1,
.line-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
}

.line-clamp-1 {
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
}

details > summary::-webkit-details-marker {
  display: none;
}
</style>
