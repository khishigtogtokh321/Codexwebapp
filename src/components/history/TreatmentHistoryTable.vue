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
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Огноо
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Шүд
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Гадаргуу
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Оношлогоо
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Эмчилгээ
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Эмч
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Үнэ
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Төлөв
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Үйлдэл
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Loading State -->
          <tr v-if="loading">
            <td colspan="9" class="px-4 py-8 text-center text-gray-500">
              <div class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Ачааллаж байна...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="treatments.length === 0">
            <td colspan="9" class="px-4 py-8 text-center text-gray-500">
              Эмчилгээний түүх олдсонгүй
            </td>
          </tr>

          <!-- Treatment Rows -->
          <tr
            v-for="(treatment, index) in treatments"
            :key="treatment.id"
            :class="[
              'transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-[1.01] cursor-pointer',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            ]"
          >
            <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
              {{ formatDate(treatment.date) }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
              {{ treatment.tooth }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              {{ treatment.surface }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div class="max-w-xs truncate" :title="treatment.diagnosis">
                {{ treatment.diagnosis }}
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              {{ treatment.treatmentType }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
              {{ treatment.doctor }}
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
              {{ treatment.price }}
            </td>
            <td class="px-4 py-3 text-sm whitespace-nowrap">
              <span
                :class="getStatusClass(treatment.status)"
                class="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm"
              >
                {{ getStatusLabel(treatment.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  @click.stop="openEdit(treatment)"
                  title="Засах"
                >
                  Засах
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  @click.stop="handleDelete(treatment.id)"
                  title="Устгах"
                >
                  Устгах
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer with Summary -->
    <div v-if="treatments.length > 0" class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      <div class="flex justify-between items-center">
        <span>Total: {{ treatments.length }} treatment(s)</span>
        <span class="font-medium">
          Completed: {{ treatments.filter((t) => t.status === 'done').length }} |
          Planned: {{ treatments.filter((t) => t.status === 'planned').length }}
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
              <p class="text-xs uppercase tracking-wide text-gray-500">Edit treatment</p>
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
                <label class="block text-sm font-medium text-gray-700">Date</label>
                <input v-model="editDraft.date" type="date" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Tooth</label>
                <input v-model="editDraft.tooth" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Surface</label>
                <input v-model="editDraft.surface" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select v-model="editDraft.status" class="input-field min-h-[44px] text-sm">
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="block text-sm font-medium text-gray-700">Diagnosis</label>
                <textarea v-model="editDraft.diagnosis" rows="3" class="input-field min-h-[88px] text-sm"></textarea>
              </div>

              <div class="md:col-span-2 space-y-2">
                <label class="block text-sm font-medium text-gray-700">Treatment</label>
                <input v-model="editDraft.treatmentType" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Doctor</label>
                <input v-model="editDraft.doctor" type="text" class="input-field min-h-[44px] text-sm" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <input v-model="editDraft.price" type="text" class="input-field min-h-[44px] text-sm" />
              </div>
            </div>

            <div class="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="min-h-[44px] rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                @click="closeEdit"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="min-h-[44px] rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Additional styles if needed */
</style>