<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Дахин дуудах хуваарь',
  },
  recalls: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add', 'save', 'edit', 'delete'])

const isModalOpen = ref(false)
const isEditing = ref(false)
const draft = ref({
  type: '',
  frequency: { year: 0, month: 6, week: 0, day: 0 },
  permanent: false,
  untilDate: '',
  previousDate: '',
  calculatedDate: '',
  dueDate: '',
  plannedDate: '',
  status: '',
  note: ''
})

const recallTypes = [
  'Урьдчилан сэргийлэх үзлэг',
  'Шүдний өнгө шалгах',
  'Бусад'
]

const statusOptions = [
  'Хоосон',
  'Төлөвлөсөн',
  'Дууссан',
  'Цуцалсан'
]

function openAdd() {
  isEditing.value = false
  draft.value = {
    type: '',
    frequency: { year: 0, month: 6, week: 0, day: 0 },
    permanent: false,
    untilDate: '',
    previousDate: new Date().toISOString().slice(0, 10),
    calculatedDate: '',
    dueDate: '',
    plannedDate: '',
    status: 'Хоосон',
    note: ''
  }
  isModalOpen.value = true
}

function openEdit(recall) {
  isEditing.value = true
  // Parse frequency string back to object if possible, or just mock for now as we don't have the parser logic yet
  // For simplicity, we'll keep the frequency object reset or try to parse simple cases like "6с"
  // A robust parser would be needed for complex strings.
  // Assuming the user just wants to see the modal open with data for now.
  
  // Simple parser for demo:
  let freqObj = { year: 0, month: 0, week: 0, day: 0 }
  if (recall.frequency) {
     const parts = recall.frequency.split(' ')
     parts.forEach(p => {
       if (p.includes('ж')) freqObj.year = parseInt(p)
       if (p.includes('с')) freqObj.month = parseInt(p)
       if (p.includes('д-7')) freqObj.week = parseInt(p)
       if (p.includes('ө')) freqObj.day = parseInt(p)
     })
  }

  draft.value = {
    ...recall,
    frequency: freqObj,
    // Ensure all fields exist
    permanent: recall.permanent || false,
    untilDate: recall.untilDate || '',
    previousDate: recall.previousDate || '',
    calculatedDate: recall.calculatedDate || '',
    dueDate: recall.dueDate || '',
    plannedDate: recall.plannedDate || '',
    status: recall.status || 'Хоосон',
    note: recall.note || ''
  }
  isModalOpen.value = true
}

function handleSave() {
  // Format frequency string for display (e.g., "6с")
  let freqStr = ''
  const { year, month, week, day } = draft.value.frequency
  if (year > 0) freqStr += `${year}ж `
  if (month > 0) freqStr += `${month}с `
  if (week > 0) freqStr += `${week}д-7 `
  if (day > 0) freqStr += `${day}ө `
  
  const payload = {
    ...draft.value,
    frequency: freqStr.trim()
  }

  if (isEditing.value) {
    emit('edit', payload)
  } else {
    emit('add', payload)
  }
  isModalOpen.value = false
}

function handleDelete() {
  if (isEditing.value) {
    emit('delete', draft.value)
    closeModal()
  }
}

function closeModal() {
  isModalOpen.value = false
}
</script>

<template>
  <div class="dental-card history-grid h-full flex flex-col">
    <div class="history-grid__toolbar flex items-center justify-between">
      <h2 class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{{ title }}</h2>
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm hover:shadow"
        @click="openAdd"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Нэмэх</span>
      </button>
    </div>
    
    <div class="history-grid__table-shell flex-1">
      <table class="history-grid__table">
        <thead>
          <tr>
            <th>Төрөл</th>
            <th>Өмнөх огноо</th>
            <th>Дуудах огноо</th>
            <th>Төлөвлөсөн огноо</th>
            <th>Давтамж</th>
            <th>Төлөв</th>
            <th>Тэмдэглэл</th>
            <th class="w-[80px] text-center">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(recall, index) in recalls" :key="index" class="history-grid__row">
            <td class="history-grid__cell">{{ recall.type }}</td>
            <td class="history-grid__cell history-grid__cell--date">{{ recall.previousDate }}</td>
            <td class="history-grid__cell history-grid__cell--date">{{ recall.dueDate }}</td>
            <td class="history-grid__cell history-grid__cell--date">{{ recall.plannedDate }}</td>
            <td class="history-grid__cell">{{ recall.frequency }}</td>
            <td class="history-grid__cell">{{ recall.status }}</td>
            <td class="history-grid__cell">{{ recall.note }}</td>
            <td class="history-grid__cell">
              <div class="flex items-center justify-center gap-1.5" @click.stop>
                <button
                  type="button"
                  class="p-1 px-2 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                  title="Засах"
                  @click="openEdit(recall)"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-1 px-2 rounded hover:bg-red-50 text-red-500 transition-colors"
                  title="Устгах"
                  @click="emit('delete', recall)"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
           <tr v-if="recalls.length === 0" class="history-grid__row">
            <td colspan="8" class="history-grid__cell history-grid__cell--muted">
              Төлөвлөгдсөн дуудлага байхгүй
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Recall Modal -->
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
          v-if="isModalOpen"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-[4px] p-4"
          @click.self="closeModal"
        >
          <div
            class="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4">
              <h3 class="text-xl font-normal text-slate-700">Дахин дуудах</h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 pb-6 overflow-y-auto">
              <div class="space-y-4">
                <!-- Type -->
                <div class="grid grid-cols-[140px_1fr] items-center gap-4">
                  <label class="text-right text-sm text-slate-600">Төрөл</label>
                  <select v-model="draft.type" class="w-full max-w-sm border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500">
                    <option value="" disabled selected>Сонгоно уу</option>
                    <option v-for="t in recallTypes" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>

                <div class="flex gap-4">
                   <!-- Frequency Group -->
                   <div class="flex-1 border border-slate-200 rounded p-3">
                     <p class="text-xs font-bold text-slate-500 mb-2 text-center">Дахин дуудах давтамж</p>
                     <div class="space-y-2">
                       <div class="grid grid-cols-[60px_1fr] items-center gap-2">
                         <label class="text-right text-sm text-slate-600">Жил</label>
                         <input v-model.number="draft.frequency.year" type="number" class="border border-slate-300 rounded px-2 py-1 text-sm w-full text-center" />
                       </div>
                       <div class="grid grid-cols-[60px_1fr] items-center gap-2">
                         <label class="text-right text-sm text-slate-600">Сар</label>
                         <input v-model.number="draft.frequency.month" type="number" class="border border-slate-300 rounded px-2 py-1 text-sm w-full text-center" />
                       </div>
                       <div class="grid grid-cols-[60px_1fr] items-center gap-2">
                         <label class="text-right text-sm text-slate-600">7 хоног</label>
                         <input v-model.number="draft.frequency.week" type="number" class="border border-slate-300 rounded px-2 py-1 text-sm w-full text-center" />
                       </div>
                        <div class="grid grid-cols-[60px_1fr] items-center gap-2">
                         <label class="text-right text-sm text-slate-600">Өдөр</label>
                         <input v-model.number="draft.frequency.day" type="number" class="border border-slate-300 rounded px-2 py-1 text-sm w-full text-center" />
                       </div>
                     </div>
                   </div>

                   <!-- Deactivate Group -->
                   <div class="flex-1 border border-slate-200 rounded p-3">
                      <p class="text-xs font-bold text-slate-500 mb-2">Идэвхгүй болгох</p>
                      <div class="flex items-center gap-2 mb-4">
                        <label class="text-sm text-slate-600">Байнгын</label>
                        <input v-model="draft.permanent" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      </div>
                      <div class="space-y-1">
                        <label class="block text-sm text-slate-600">Заасан огноо хүртэл</label>
                        <input v-model="draft.untilDate" type="date" class="border border-slate-300 rounded px-2 py-1 text-sm w-full" :disabled="draft.permanent" />
                      </div>
                   </div>
                </div>

                <!-- Dates & Status Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                     <label class="text-right text-sm text-slate-600">Өмнөх огноо</label>
                     <input v-model="draft.previousDate" type="date" class="border border-slate-300 rounded px-3 py-1.5 text-sm w-full bg-slate-50" />
                  </div>
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                     <label class="text-right text-sm text-slate-600">Тооцоолсон огноо</label>
                     <input v-model="draft.calculatedDate" type="date" class="border border-slate-300 rounded px-3 py-1.5 text-sm w-full bg-slate-50" disabled />
                  </div>
                   <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                     <label class="text-right text-sm text-slate-600">Дуудах огноо</label>
                     <input v-model="draft.dueDate" type="date" class="border border-slate-300 rounded px-3 py-1.5 text-sm w-full" />
                  </div>
                   <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                     <label class="text-right text-sm text-slate-600">Төлөвлөсөн огноо</label>
                     <input v-model="draft.plannedDate" type="date" class="border border-slate-300 rounded px-3 py-1.5 text-sm w-full bg-slate-50" />
                  </div>
                  <div class="grid grid-cols-[140px_1fr] items-center gap-2">
                    <label class="text-right text-sm text-slate-600">Төлөв</label>
                    <select v-model="draft.status" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500">
                      <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                </div>

                <!-- Note -->
                <div class="grid grid-cols-[180px_1fr] gap-4">
                  <label class="text-right text-sm text-slate-600 pt-1">Тэмдэглэл</label>
                  <textarea v-model="draft.note" rows="4" class="w-full border border-slate-400 p-2 text-sm focus:outline-none focus:border-blue-500 type-writer-effect"></textarea>
                </div>

              </div>
            </div>

            <!-- Footer -->
             <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button 
                v-if="isEditing"
                type="button" 
                class="px-6 py-2 border-2 border-amber-500 text-amber-600 font-bold text-sm hover:bg-amber-50 rounded bg-white"
                @click="handleDelete"
              >
                <u>У</u>стгах
              </button>
              <div v-else></div> <!-- Spacer -->

              <div class="flex items-center gap-3">
                 <button 
                  type="button" 
                  class="px-8 py-2 border-2 text-green-600 border-green-600 font-bold text-sm hover:bg-green-50 rounded bg-white flex items-center gap-1"
                  @click="handleSave"
                >
                  <span>Тийм</span>
                </button>
                <button 
                  type="button" 
                  class="px-6 py-2 border-2 border-slate-500 text-slate-700 font-bold text-sm hover:bg-slate-100 rounded bg-white"
                  @click="closeModal"
                >
                  Цуцлах
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
