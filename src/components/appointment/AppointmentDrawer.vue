<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useDoctorStore } from '@/stores/doctor'

const props = defineProps({
  open: { type: Boolean, default: false },
  appointment: { type: Object, default: null },
  preselectedPatientId: { type: String, default: '' },
})

const emit = defineEmits(['close', 'save'])

const patientStore = usePatientStore()
const doctorStore = useDoctorStore()

const form = reactive({
  patientId: '',
  patientName: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  duration: 30,
  reason: '',
  status: 'planned',
})

const error = ref('')
const loading = ref(false)
const searchInput = ref('')
const showDropdown = ref(false)

const filteredPatients = computed(() => {
  if (!searchInput.value) return []
  const query = searchInput.value.toLowerCase()
  return patientStore.patients.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.phone.includes(query) ||
    p.cardNo.includes(query)
  ).slice(0, 5)
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    if (props.appointment) {
      const start = new Date(props.appointment.startAt)
      form.patientId = props.appointment.patientId
      form.patientName = props.appointment.patientName
      form.date = start.toISOString().split('T')[0]
      form.time = start.toTimeString().slice(0, 5)
      form.duration = props.appointment.duration
      form.reason = props.appointment.reason
      form.status = props.appointment.status
      searchInput.value = props.appointment.patientName
    } else {
      resetForm()
      if (props.preselectedPatientId) {
        const p = patientStore.getPatientById(props.preselectedPatientId)
        if (p) {
          selectPatient(p)
        }
      }
    }
    error.value = ''
  }
})

function resetForm() {
  form.patientId = ''
  form.patientName = ''
  form.date = new Date().toISOString().split('T')[0]
  form.time = '09:00'
  form.duration = 30
  form.reason = ''
  form.status = 'planned'
  searchInput.value = ''
}

function selectPatient(patient) {
  form.patientId = patient.id
  form.patientName = patient.name
  searchInput.value = patient.name
  showDropdown.value = false
}

async function handleSave() {
  if (!form.patientId || !form.date || !form.time) {
    error.value = 'Шаардлагатай талбаруудыг бөглөнө үү.'
    return
  }

  const startAt = new Date(`${form.date}T${form.time}`).toISOString()
  const payload = {
    patientId: form.patientId,
    patientName: form.patientName,
    doctorId: doctorStore.me?.id || 'dr-001',
    startAt,
    duration: parseInt(form.duration),
    reason: form.reason,
    status: form.status,
  }

  loading.value = true
  error.value = ''
  try {
    emit('save', props.appointment?.id, payload)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (patientStore.patients.length === 0) {
    patientStore.fetchPatients()
  }
})
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/20" @click="emit('close')"></div>
  </transition>

  <transition name="slide">
    <aside v-if="open" class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ appointment ? 'Цаг засах' : 'Шинэ цаг товлох' }}
        </h2>
        <button type="button" class="rounded-full p-2 text-gray-500 hover:bg-gray-100" @click="emit('close')">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-5">
        <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          {{ error }}
        </div>

        <div class="relative">
          <label class="block text-sm font-medium text-slate-700 mb-1">Өвчтөн хайх <span class="text-red-500">*</span></label>
          <input 
            v-model="searchInput"
            type="text"
            placeholder="Нэр, утас эсвэл карт №..."
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @focus="showDropdown = true"
            @input="showDropdown = true"
          >
          <div v-if="showDropdown && filteredPatients.length" class="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
            <button 
              v-for="p in filteredPatients" 
              :key="p.id"
              class="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 border-b last:border-0 border-slate-100"
              @click="selectPatient(p)"
            >
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                {{ p.name.charAt(0) }}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-900 truncate">{{ p.name }}</p>
                <p class="text-xs text-slate-500">{{ p.phone }} · {{ p.cardNo }}</p>
              </div>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Огноо <span class="text-red-500">*</span></label>
            <input v-model="form.date" type="date" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Цаг <span class="text-red-500">*</span></label>
            <input v-model="form.time" type="time" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Үргэлжлэх хугацаа (мин)</label>
          <select v-model="form.duration" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option :value="15">15 минут</option>
            <option :value="30">30 минут</option>
            <option :value="45">45 минут</option>
            <option :value="60">60 минут</option>
            <option :value="90">90 минут</option>
            <option :value="120">120 минут</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Шалтгаан / Тэмдэглэл</label>
          <textarea v-model="form.reason" rows="3" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ямар зорилгоор ирж байгаа..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Төлөв</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="s in ['planned', 'confirmed', 'cancelled']" 
              :key="s"
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              :class="form.status === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
              @click="form.status = s"
            >
              {{ s === 'planned' ? 'Төлөвлөсөн' : s === 'confirmed' ? 'Баталгаажсан' : 'Цуцалсан' }}
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200 p-4 bg-slate-50">
        <div class="flex gap-3">
          <button type="button" class="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50" @click="emit('close')">
            Болих
          </button>
          <button 
            type="button" 
            class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            :disabled="loading"
            @click="handleSave"
          >
            {{ loading ? 'Хадгалж байна...' : 'Хадгалах' }}
          </button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease-out; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
