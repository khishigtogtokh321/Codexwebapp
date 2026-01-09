﻿<script setup>
import { reactive, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import ToothChart from '@/components/tooth/ToothChart.vue'
import TreatmentQuickAddDrawer from '@/components/treatment/TreatmentQuickAddDrawer.vue'
import TreatmentHistoryTable from '@/components/history/TreatmentHistoryTable.vue'
import RightTreatmentWizard from '@/components/treatment/RightTreatmentWizard.vue'
import { treatmentTypes, getTreatmentById } from '@/data/treatmentTypes'
import { diagnoses, mockToothStatuses } from '@/data'
import { useToothStatus } from '@/composables/useToothStatus'
import { formatToothNumber } from '@/utils/toothHelpers'
import { getScopeMeta, SCOPE_TYPE } from '@/utils/treatmentScope'
import patientService from '@/services/patientService'
import { useTreatmentStore } from '@/stores/treatment'

const treatmentStore = useTreatmentStore()

const state = reactive({
  selectedTeeth: [],
  selectedSurfaces: [],
  selectedDiagnosis: null,
  selectedCodes: [],
  selectedTreatmentTypeIds: [],
  selectedStatus: 'planned',
})

const searchQuery = ref('')
const statusFilter = ref('all')
const activePatient = ref(patientService.getDefaultPatient())
const hovered = ref(false)
const pinned = ref(false)
const drawerOpen = ref(false)
const isLgUp = ref(false)
const isQuickAddOpen = ref(false)
const drawerTriggerRef = ref(null)
const drawerCloseRef = ref(null)
const isAlertDismissed = ref(false)
const isHistoryExpanded = ref(false)

const desktopExpanded = computed(() => isLgUp.value && (hovered.value || pinned.value))

const { toothStatuses, toothPaintTypes, setToothStatus, updateToothStatusFromTreatment, updateStatusesFromHistory } = useToothStatus(mockToothStatuses)

const selectedTeethList = computed(() => state.selectedTeeth)
const selectedTreatmentItems = computed(() => getSelectedTreatments(state.selectedTreatmentTypeIds))

const availableTreatments = computed(() => treatmentTypes)

const hasSelectedTreatments = computed(
  () => state.selectedCodes.length > 0 || state.selectedTreatmentTypeIds.length > 0,
)
const combinedSelectedItems = computed(() => [
  ...selectedTreatmentItems.value,
  ...state.selectedCodes,
])

const scopeMeta = computed(() => getScopeMeta(combinedSelectedItems.value))
const requiresTooth = computed(
  () => scopeMeta.value.requiresTooth && combinedSelectedItems.value.length > 0,
)
const requiresSurface = computed(
  () => scopeMeta.value.requiresSurface && combinedSelectedItems.value.length > 0,
)
const hasSelectedTooth = computed(() => state.selectedTeeth.length > 0)
const hasSelectedSurface = computed(() => state.selectedSurfaces.length > 0)
const meetsScopeGuard = computed(() => {
  // 1. Хэрэв гадаргуу шаардлагатай бол (Surface scope)
  if (requiresSurface.value) return hasSelectedTooth.value && hasSelectedSurface.value
  // 2. Хэрэв шүд шаардлагатай бол (Tooth scope)
  if (requiresTooth.value) return hasSelectedTooth.value
  // 3. Бусад (Ам, Рентген г.м) бол шууд true
  return true
})
const canAddSelection = computed(() => hasSelectedTreatments.value && meetsScopeGuard.value)

const showAlert = computed(() => {
  return hasSelectedTreatments.value && !meetsScopeGuard.value && !isAlertDismissed.value
})

// Reset dismissal when selection changes
watch(
  () => [combinedSelectedItems.value, state.selectedTeeth, state.selectedSurfaces],
  () => {
    isAlertDismissed.value = false
  },
  { deep: true },
)


const filteredLog = computed(() => {
  let list = treatmentStore.treatments
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (item) =>
        (item.treatmentType || '').toLowerCase().includes(q) || (item.diagnosis || '').toLowerCase().includes(q),
    )
  }
  if (statusFilter.value !== 'all') {
    list = list.filter((item) => item.status === statusFilter.value)
  }
  return list
})

function getDiagnosisLabel(diagnosis) {
  if (!diagnosis) return ''
  if (typeof diagnosis === 'string') {
    const match = diagnoses.find((item) => item.code === diagnosis)
    return match ? `${match.code} · ${match.name}` : diagnosis
  }
  if (!diagnosis.code) return ''
  const labelName = diagnosis.name || diagnosis.nameMn || ''
  return labelName ? `${diagnosis.code} · ${labelName}` : diagnosis.code
}

function getSelectedTreatments(ids) {
  return ids.map((id) => getTreatmentById(id)).filter(Boolean)
}

function selectTooth(teeth) {
  const next = Array.isArray(teeth) ? teeth.filter(Boolean) : teeth ? [teeth] : []
  state.selectedTeeth = [...new Set(next)]
}

function clearSelectedTeeth() {
  selectTooth([])
}

function handleSurfacesUpdate(surfaces = []) {
  state.selectedSurfaces = Array.isArray(surfaces) ? surfaces : []
}

function handleDiagnosisUpdate(diagnosis) {
  state.selectedDiagnosis = diagnosis?.code ? diagnosis : null
}

function handleCodesUpdate(codes = []) {
  state.selectedCodes = Array.isArray(codes) ? codes : []
}

function getSelectedCodeLabels(codes = []) {
  return codes
    .map((codeItem) => [codeItem?.code, codeItem?.nameMn].filter(Boolean).join(' '))
    .filter(Boolean)
}

function getSelectedTreatmentLabels(typeIds = []) {
  return getSelectedTreatments(typeIds)
    .map((treatment) => treatment?.label || treatment?.id)
    .filter(Boolean)
}

function getCombinedTreatmentLabels() {
  const labels = [
    ...getSelectedCodeLabels(state.selectedCodes),
    ...getSelectedTreatmentLabels(state.selectedTreatmentTypeIds),
  ]
  return [...new Set(labels)]
}

function buildDiagnosisText() {
  const diagnosisLabel = getDiagnosisLabel(state.selectedDiagnosis)
  return diagnosisLabel || ''
}

function getToothText(tooth) {
  return tooth ? formatToothNumber(tooth) : ''
}

function resolvePaintType(label, explicitPaintType) {
  if (explicitPaintType) return explicitPaintType
  const match = treatmentTypes.find((t) => t.label === label || t.nameFull === label)
  return match?.paintType || 'other'
}

function buildTreatmentEntry(tooth, treatmentLabel, paintType = null, price = '', code = '') {
  const surfaceText = state.selectedSurfaces.join(', ')
  const status = state.selectedStatus || 'done'
  const toothText = getToothText(tooth)

  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    tooth: toothText,
    surface: surfaceText,
    diagnosis: buildDiagnosisText(),
    treatmentType: treatmentLabel,
    code: code,
    paintType: paintType, // Store paintType for Chart markers
    doctor: '',
    price: price,
    status,
  }
}

function buildTreatmentEntries() {
  const teeth = state.selectedTeeth.length ? state.selectedTeeth : [null]
  const entries = []

  // Get full treatment objects to access paintType
  const selectedTypes = getSelectedTreatments(state.selectedTreatmentTypeIds)
  const selectedCodes = state.selectedCodes // These already have code/nameMn

  teeth.forEach((tooth) => {
    // 1. Process specific codes (Right Wizard)
    selectedCodes.forEach((codeItem) => {
      const label = codeItem.nameMn || codeItem.name || codeItem.code
      // Ensure we get the paintType directly from the code item
      const paintType = codeItem.paintType || resolvePaintType(label)
      const price = codeItem.price || ''
      const code = codeItem.code || ''
      entries.push(buildTreatmentEntry(tooth, label, paintType, price, code))
    })

    // 2. Process treatment types (Quick Add)
    selectedTypes.forEach((t) => {
      // Quick add types might not have explicit price/code in the generic object, 
      // but if we had them mapped we could pass them. For now, pass empty or resolved defaults.
      entries.push(buildTreatmentEntry(tooth, t.label, t.paintType, '', t.id))
    })
  })

  return entries
}

function applyToothStatusUpdates(treatmentLabels = []) {
  if (!state.selectedTeeth.length) return
  const status = state.selectedStatus || 'done'
  state.selectedTeeth.forEach((tooth) => {
    treatmentLabels.forEach((label) => {
      if (!label) return
      updateToothStatusFromTreatment({
        tooth: formatToothNumber(tooth),
        treatmentType: label,
        status,
      })
    })
  })
}

function resetTreatmentDraft() {
  state.selectedTeeth = []
  state.selectedSurfaces = []
  state.selectedDiagnosis = null
  state.selectedCodes = []
  state.selectedTreatmentTypeIds = []
}

function handleAddSelection() {
  if (!canAddSelection.value) return
  
  const entries = buildTreatmentEntries()
  if (!entries.length) return
  
  entries.forEach((entry) => treatmentStore.addTreatment(entry))
  
  // Clear selection after adding
  resetTreatmentDraft()
}

function openQuickAdd() {
  isQuickAddOpen.value = true
}

function closeQuickAdd() {
  isQuickAddOpen.value = false
}

function toggleQuickAddTreatment(typeId) {
  const treatment = getTreatmentById(typeId)
  if (!treatment) return
  const next = state.selectedTreatmentTypeIds.includes(typeId)
    ? state.selectedTreatmentTypeIds.filter((id) => id !== typeId)
    : [...state.selectedTreatmentTypeIds, typeId]
  state.selectedTreatmentTypeIds = next
}


function handleSearch(query) {
  searchQuery.value = query
}

function handleFilterStatus(status) {
  statusFilter.value = status || 'all'
}

function handleEditTreatment(updated) {
  if (!updated?.id) return
  treatmentStore.updateTreatment(updated.id, updated)
}

function handleDeleteTreatment(treatmentId) {
  treatmentStore.deleteTreatment(treatmentId)
}

function handleStatusChange(status) {
  state.selectedStatus = status
}

function handleSetStatus({ toothNumber, status }) {
  setToothStatus(toothNumber, status)
}

function toggleHistoryExpansion() {
  isHistoryExpanded.value = !isHistoryExpanded.value
}

function handlePatientSelected(patient) {
  activePatient.value = patient || activePatient.value
}

function toggleSidebar() {
  pinned.value = !pinned.value
}

function openMobileNav() {
  drawerOpen.value = true
}

function closeMobileNav() {
  drawerOpen.value = false
}

function handleNavigate(id) {
  window.location.hash = `#${id}`
  if (drawerOpen.value) {
    closeMobileNav()
  }
}

const handleEsc = (event) => {
  if (event.key === 'Escape' && drawerOpen.value) {
    closeMobileNav()
  }
}

let mediaQuery

const updateBreakpoint = () => {
  if (typeof window === 'undefined') return
  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(min-width: 1024px)')
  }
  isLgUp.value = mediaQuery?.matches || false
  if (mediaQuery?.matches) {
    drawerOpen.value = false
  }
}

onMounted(() => {
  updateBreakpoint()
  mediaQuery?.addEventListener('change', updateBreakpoint)
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateBreakpoint)
  window.removeEventListener('keydown', handleEsc)
})

watch(
  () => treatmentStore.treatments,
  (newList) => {
    // Update Tooth Chart markers based on history table contents
    updateStatusesFromHistory(newList)
  },
  { deep: true, immediate: true },
)

watch(
  () => drawerOpen.value,
  async (open) => {
    const html = document.documentElement
    const body = document.body
    if (!html || !body) return
    html.classList.toggle('overflow-hidden', open)
    body.classList.toggle('overflow-hidden', open)
    if (open) {
      await nextTick()
      drawerCloseRef.value?.focus?.()
    } else if (!isLgUp.value) {
      drawerTriggerRef.value?.focus?.()
    }
  },
)
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden">

    <aside class="relative z-40 hidden flex-shrink-0 lg:block">
      <div class="w-24"></div>
      <div
        class="absolute top-0 h-full left-0 transition-all duration-300 ease-in-out"
        :class="desktopExpanded ? 'w-48' : 'w-24'"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <SideNav
          :is-collapsed="!desktopExpanded"
          :is-pinned="pinned"
          active-id="treatments"
          @toggle="toggleSidebar"
          @toggle-pin="toggleSidebar"
          @navigate="handleNavigate"
        />
      </div>
    </aside>

    <div class="relative flex flex-1 flex-col overflow-hidden">
      <div class="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
        <button
          type="button"
          ref="drawerTriggerRef"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Open navigation"
          @click="openMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p class="text-sm font-semibold text-gray-800">Эмчилгээ</p>
      </div>

      <TopBar :active-patient="activePatient" @patient-selected="handlePatientSelected" />
      <main class="flex-1 overflow-y-auto bg-gray-100">
        <div class="p-4 md:p-6 space-y-4 [perspective:1200px]">
      

          <Transition
            enter-active-class="transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            enter-from-class="opacity-0 -translate-y-16 scale-95 [transform:rotateX(12deg)_translateZ(0)]"
            enter-to-class="opacity-100 translate-y-0 scale-100 [transform:rotateX(0deg)_translateZ(0)]"
            leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            leave-from-class="opacity-100 translate-y-0 scale-100 [transform:rotateX(0deg)_translateZ(0)]"
            leave-to-class="opacity-0 -translate-y-16 scale-95 [transform:rotateX(12deg)_translateZ(0)]"
          >
            <div v-if="!isHistoryExpanded" class="grid gap-4 lg:grid-cols-12 items-start lg:items-stretch">
              <div class="space-y-4 lg:col-span-7 min-w-0">
                <ToothChart
                  class="h-auto lg:h-full"
                  :selected-teeth="selectedTeethList"
                  :tooth-statuses="toothStatuses"
                  :tooth-paint-types="toothPaintTypes"
                  :multi-select="true"
                  @teeth-select="selectTooth"
                  @select-all="selectTooth"
                  @clear-selection="clearSelectedTeeth"
                  @set-status="handleSetStatus"
                />
              </div>

              <div class="lg:col-span-5 lg:pl-2 min-w-0 relative">
                <!-- Floating Validation Alert -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform -translate-y-2 opacity-0"
                  enter-to-class="transform translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform translate-y-0 opacity-100"
                  leave-to-class="transform -translate-y-2 opacity-0"
                >
                  <div 
                    v-if="showAlert" 
                    class="absolute -top-4 -left-90  z-50 bg-red-50 border border-red-100 rounded-xl p-3 shadow-xl flex items-start gap-3"
                  >
                    <div class="mt-0.5 flex-shrink-0">
                      <div class="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1">
                      <p class="text-[13px] font-bold text-red-700 leading-tight mb-1">
                        Гүйцэтгэлийг үргэлжлүүлэхийн тулд:
                      </p>
                      <ul class="text-[12px] text-red-600 list-disc list-inside space-y-0.5 leading-tight">
                        <li v-if="requiresTooth && !hasSelectedTooth">Шүд сонгоно уу</li>
                        <li v-if="requiresSurface && !hasSelectedSurface">Гадаргуу сонгоно уу</li>
                      </ul>
                    </div>
                    <button 
                      type="button" 
                      class="ml-2 text-red-400 hover:text-red-500 transition-colors p-1"
                      @click="isAlertDismissed = true"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                </Transition>

                <RightTreatmentWizard
                  class="lg:h-full"
                  :selected-surfaces="state.selectedSurfaces"
                  :selected-diagnosis="state.selectedDiagnosis"
                  :selected-codes="state.selectedCodes"
                  :selected-status="state.selectedStatus"
                  :can-add="canAddSelection"
                  :requires-tooth="requiresTooth"
                  :requires-surface="requiresSurface"
                  @update:surfaces="handleSurfacesUpdate"
                  @update:diagnosis="handleDiagnosisUpdate"
                  @update:code="handleCodesUpdate"
                  @update:status="handleStatusChange"
                  @add="handleAddSelection"
                />
              </div>
            </div>
          </Transition>

          <div :class="['transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]', isHistoryExpanded ? 'h-full' : '']">
            <TreatmentHistoryTable
              :treatments="filteredLog"
              :loading="false"
              :patient="activePatient"
              :search-query="searchQuery"
              :status-filter="statusFilter"
              :is-expanded="isHistoryExpanded"
              @search="handleSearch"
              @filter-status="handleFilterStatus"
              @edit="handleEditTreatment"
              @delete="handleDeleteTreatment"
              @toggle-expand="toggleHistoryExpansion"
            />
          </div>
        </div>
      </main>
    </div>

    <button
      type="button"
      class="fixed bottom-6 right-6 z-40 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      @click="openQuickAdd"
    >
      + Эмчилгээ нэмэх
    </button>

    <TreatmentQuickAddDrawer
      :open="isQuickAddOpen"
      :selected-teeth="selectedTeethList"
      :selected-surfaces="state.selectedSurfaces"
      :selected-treatments="state.selectedTreatmentTypeIds"
      :treatments="availableTreatments"
      @close="closeQuickAdd"
      @treatment-toggle="toggleQuickAddTreatment"
    />

    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="drawerOpen"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        @click="closeMobileNav"
      ></div>
    </Transition>
    <Transition
      enter-active-class="transform transition-transform duration-300"
      leave-active-class="transform transition-transform duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="drawerOpen"
        class="fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] bg-gray-900 shadow-2xl transition-transform duration-300 lg:hidden"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div class="flex items-center gap-2 text-white font-semibold">
            <span class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-lg">A</span>
            <span>AshidSoft</span>
          </div>
          <button
            type="button"
            ref="drawerCloseRef"
            class="p-2 rounded-md text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close navigation"
            @click="closeMobileNav"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SideNav
          :is-collapsed="false"
          :allow-collapse="false"
          active-id="treatments"
          @navigate="handleNavigate"
        />
      </div>
    </Transition>
  </div>
</template>
