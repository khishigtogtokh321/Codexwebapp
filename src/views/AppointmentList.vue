<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { useDoctorStore } from '@/stores/doctor'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import AppointmentDrawer from '@/components/appointment/AppointmentDrawer.vue'

const appointmentStore = useAppointmentStore()
const doctorStore = useDoctorStore()

const viewMode = ref('schedule') // 'schedule' or 'list'
const selectedDate = ref(new Date().toISOString().split('T')[0])
const isDrawerOpen = ref(false)
const editingApt = ref(null)

const hovered = ref(false)
const pinned = ref(false)

const timeSlots = computed(() => {
  const slots = []
  for (let h = 8; h <= 20; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`)
    slots.push(`${h.toString().padStart(2, '0')}:30`)
  }
  return slots
})

const appointmentsForDate = computed(() => {
  return appointmentStore.appointments.filter(apt => {
    const aptDate = apt.startAt.split('T')[0]
    return aptDate === selectedDate.value && apt.status !== 'cancelled'
  })
})

const getAptStyle = (apt) => {
  const start = new Date(apt.startAt)
  const hour = start.getHours()
  const min = start.getMinutes()
  
  // 8:00 is top 0px. Each 30 min is 64px (4rem)
  const top = ((hour - 8) * 2 + (min >= 30 ? 1 : 0)) * 64
  const height = (apt.duration / 30) * 64
  
  return {
    top: `${top}px`,
    height: `${height}px`,
  }
}

function openNew() {
  editingApt.value = null
  isDrawerOpen.value = true
}

function editApt(apt) {
  editingApt.value = apt
  isDrawerOpen.value = true
}

async function handleSave(id, payload) {
  try {
    if (id) {
      await appointmentStore.updateAppointment(id, payload)
    } else {
      await appointmentStore.addAppointment(payload)
    }
    isDrawerOpen.value = false
  } catch (err) {
    alert(err.message)
  }
}

// Drag & Drop
const draggingApt = ref(null)
const dragInitialY = ref(0)
const dragInitialTop = ref(0)

function onDragStart(event, apt) {
  draggingApt.value = apt
  const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY
  dragInitialY.value = clientY
  
  const start = new Date(apt.startAt)
  dragInitialTop.value = ((start.getHours() - 8) * 2 + (start.getMinutes() >= 30 ? 1 : 0)) * 64
}

function onDragMove(event) {
  if (!draggingApt.value) return
  event.preventDefault()
}

async function onDragEnd(event) {
  if (!draggingApt.value) return
  
  const clientY = event.type === 'touchend' ? event.changedTouches[0].clientY : event.clientY
  const deltaY = clientY - dragInitialY.value
  const newTop = dragInitialTop.value + deltaY
  
  // Snap to 30 min (64px)
  const slotIdx = Math.round(newTop / 64)
  const clampedIdx = Math.max(0, Math.min(slotIdx, (20 - 8) * 2))
  
  const newHour = 8 + Math.floor(clampedIdx / 2)
  const newMin = (clampedIdx % 2) * 30
  
  const newStartAt = new Date(selectedDate.value)
  newStartAt.setHours(newHour, newMin, 0, 0)
  
  const aptId = draggingApt.value.id
  draggingApt.value = null

  try {
    await appointmentStore.rescheduleAppointment(aptId, newStartAt.toISOString())
  } catch (err) {
    alert(err.message)
  }
}

onMounted(() => {
  appointmentStore.fetchAppointments()
  if (!doctorStore.me) {
    doctorStore.fetchMe()
  }
})

function handleNavigate(id) {
  window.location.hash = `#${id}`
}

function getStatusLabel(status) {
  switch(status) {
    case 'planned': return 'Төлөвлөсөн'
    case 'confirmed': return 'Баталгаажсан'
    case 'cancelled': return 'Цуцалсан'
    default: return status
  }
}

function getStatusClass(status) {
  switch(status) {
    case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'planned': return 'bg-blue-100 text-blue-700 border-blue-200'
    default: return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}
</script>

<template>
  <div class="flex min-h-[100dvh] bg-slate-50 overflow-hidden">
    <aside class="relative z-40 hidden flex-shrink-0 lg:block">
      <div class="w-24"></div>
      <div class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
           :class="(hovered || pinned) ? 'w-48' : 'w-24'" 
           @mouseenter="hovered = true"
           @mouseleave="hovered = false">
        <SideNav :is-collapsed="!(hovered || pinned)" :is-pinned="pinned" active-id="appointments"
                 @toggle="pinned = !pinned" @toggle-pin="pinned = !pinned" @navigate="handleNavigate" />
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <TopBar />

      <main class="flex-1 flex flex-col min-h-0 bg-slate-50">
        <div class="flex flex-col gap-4 p-4 lg:p-6 mx-auto w-full max-w-[1400px] h-full overflow-hidden">
          
          <div class="flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div class="space-y-1">
              <h1 class="text-xl font-bold text-slate-900">Цаг товлолт</h1>
              <p class="text-sm text-slate-500">{{ selectedDate }}</p>
            </div>

            <div class="flex items-center gap-2">
              <div class="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
                <button 
                  class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all"
                  :class="viewMode === 'schedule' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'"
                  @click="viewMode = 'schedule'"
                >
                  Хуваарь
                </button>
                <button 
                  class="px-3 py-1.5 text-xs font-semibold rounded-md transition-all"
                  :class="viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'"
                  @click="viewMode = 'list'"
                >
                  Жагсаалт
                </button>
              </div>
              <input v-model="selectedDate" type="date" class="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button class="ui-btn ui-btn--primary px-4 py-2" @click="openNew">
                + Цаг нэмэх
              </button>
            </div>
          </div>

          <!-- Schedule View -->
          <div v-if="viewMode === 'schedule'" class="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
            <div class="flex-1 overflow-y-auto relative p-4 scroll-smooth">
              <div class="relative min-h-[1600px] border-l border-slate-100 ml-16">
                <!-- Time Labels -->
                <div v-for="slot in timeSlots" :key="slot" class="absolute -left-16 w-14 text-right text-[11px] font-medium text-slate-400 select-none"
                     :style="{ top: `${timeSlots.indexOf(slot) * 64 - 8}px` }">
                  {{ slot }}
                </div>

                <!-- Grid Lines -->
                <div v-for="slot in timeSlots" :key="'line-' + slot" class="absolute left-0 right-0 border-t border-slate-50"
                     :style="{ top: `${timeSlots.indexOf(slot) * 64}px` }"></div>

                <!-- Appointments -->
                <div 
                  v-for="apt in appointmentsForDate" 
                  :key="apt.id"
                  class="absolute left-2 right-2 rounded-lg border-l-4 shadow-sm p-3 overflow-hidden cursor-pointer select-none transition-shadow active:shadow-lg active:scale-[0.99]"
                  :class="[
                    getStatusClass(apt.status),
                    draggingApt?.id === apt.id ? 'opacity-50 border-dashed z-50 ring-2 ring-blue-500' : 'z-10'
                  ]"
                  :style="getAptStyle(apt)"
                  @mousedown="onDragStart($event, apt)"
                  @touchstart.passive="onDragStart($event, apt)"
                  @mousemove="onDragMove"
                  @mouseup="onDragEnd"
                  @touchend="onDragEnd"
                  @click.stop="editApt(apt)"
                >
                  <div class="flex justify-between items-start gap-2">
                    <p class="text-sm font-bold truncate">{{ apt.patientName }}</p>
                    <span class="text-[10px] font-bold uppercase opacity-60">{{ apt.duration }}м</span>
                  </div>
                  <p class="text-[11px] mt-1 opacity-80 line-clamp-2">{{ apt.reason }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="apt in appointmentsForDate" :key="apt.id" 
                   class="card bg-white p-4 hover:shadow-md transition-all border border-slate-200 cursor-pointer"
                   @click="editApt(apt)">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-3">
                    <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {{ apt.patientName.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900">{{ apt.patientName }}</p>
                      <p class="text-xs text-slate-500">{{ new Date(apt.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} ({{ apt.duration }} мин)</p>
                    </div>
                  </div>
                  <span class="px-2 py-1 rounded-full text-[10px] font-bold border" :class="getStatusClass(apt.status)">
                    {{ getStatusLabel(apt.status) }}
                  </span>
                </div>
                <p class="text-sm text-slate-600 line-clamp-2">“{{ apt.reason }}”</p>
              </div>
              <div v-if="appointmentsForDate.length === 0" class="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <svg class="h-12 w-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
                <p>Энэ өдөр цаг товлогдоогүй байна.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <AppointmentDrawer 
      :open="isDrawerOpen" 
      :appointment="editingApt"
      @close="isDrawerOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
/* Prevent scrolling the body when dragging on touch */
main { touch-action: none; }
.overflow-y-auto { touch-action: pan-y; }

.card { border-radius: 1rem; }
</style>
