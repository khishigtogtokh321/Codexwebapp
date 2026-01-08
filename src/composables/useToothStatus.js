/**
 * Composable for managing tooth status
 * Handles tooth status map and updates based on treatments
 */

import { ref, computed } from 'vue'
import { getInitialToothStatuses } from '@/data/mockData'

export function useToothStatus(initialStatuses = null) {
  // Tooth status map { '21': 'treated', '16': 'problem', ... }
  const toothStatuses = ref(initialStatuses || getInitialToothStatuses())
  // Tooth paint type map { '21': 3, ... } (numeric ID from user table)
  const toothPaintTypes = ref({})

  // Priority rule based on clinical importance (Higher number = higher priority)
  const PAINT_TYPE_PRIORITY = {
    1: 10,  // Extraction / Шүд авах (Highest)
    2: 10,  // Implant / Имплант (Highest)
    3: 9,   // RCT / Суваг
    9: 9,   // Bridge / Гүүр
    11: 9,  // Denture / Хиймэл шүд
    7: 8,   // Crown / Бүрээс
    6: 7,   // Filling / Ломбо
    14: 6,  // Veneer / Өнгөлгөө
    13: 5,  // Sealant / Чигжээс
    15: 4,  // Watch / Хяналт
    0: 0,   // None
  }

  // Get status for a specific tooth
  function getToothStatus(toothNumber) {
    return toothStatuses.value[toothNumber] || 'healthy'
  }

  // Set status for a specific tooth with Priority Logic
  function setToothStatus(toothNumber, status, paintTypeId = null) {
    if (!toothNumber) return

    // Priority: treated/missing (2) > planned/problem (1) > healthy (0)
    const STATUS_PRIORITY = { missing: 2, treated: 2, problem: 1, planned: 1, healthy: 0 }
    const currentStatus = toothStatuses.value[toothNumber] || 'healthy'

    const currentRank = STATUS_PRIORITY[currentStatus] || 0
    const newRank = STATUS_PRIORITY[status] || 0

    // Only update if the new status is higher or equal priority
    // EXCEPT if we are explicitly setting it to healthy (to restore a missing tooth)
    if (newRank >= currentRank || status === 'healthy') {
      toothStatuses.value[toothNumber] = status

      // If setting to healthy, clear paint types
      if (status === 'healthy') {
        toothPaintTypes.value[toothNumber] = 0
        return
      }

      // Update paint type ONLY if it's higher priority or the current one is empty
      const currentPaintId = Number(toothPaintTypes.value[toothNumber] || 0)
      const newPaintId = Number(paintTypeId || 0)

      if (newPaintId > 0 && (newPaintId > currentPaintId || currentRank === 0)) {
        toothPaintTypes.value[toothNumber] = newPaintId
      }
    }
  }

  // Update tooth status based on treatment record
  function updateToothStatusFromTreatment(treatment) {
    if (!treatment.tooth) return
    const toothNum = treatment.tooth.replace('#', '')
    const paintId = treatment.paintType || 0

    // Status in record is 'done' or 'planned'
    const status = treatment.status === 'done' ? 'treated' : 'planned'

    // Check if it's an extraction specifically
    if (status === 'treated' && (treatment.treatmentType?.toLowerCase().includes('extraction') || treatment.treatmentType?.toLowerCase().includes('авах'))) {
      setToothStatus(toothNum, 'missing', 1)
    } else {
      setToothStatus(toothNum, status, paintId)
    }
  }

  function markToothAsProblem(toothNumber) {
    setToothStatus(toothNumber, 'problem')
  }

  function markToothAsMissing(toothNumber) {
    setToothStatus(toothNumber, 'missing', 1)
  }

  function markToothAsHealthy(toothNumber) {
    setToothStatus(toothNumber, 'healthy')
  }

  // CRITICAL: Reset must be a clean slate to match history table exactly
  function resetAllStatuses() {
    toothStatuses.value = {}
    toothPaintTypes.value = {}
  }

  // Get tooth status color class
  function getToothColorClass(toothNumber) {
    const status = getToothStatus(toothNumber)
    const colorMap = {
      healthy: 'bg-white border-gray-300',
      treated: 'bg-blue-50 border-blue-300',
      problem: 'bg-red-50 border-red-300',
      planned: 'bg-amber-50 border-amber-300',
      missing: 'bg-gray-100 border-gray-400',
    }
    return colorMap[status] || colorMap.healthy
  }

  // Get tooth status badge color (for status indicator dot)
  function getToothBadgeClass(toothNumber) {
    const status = getToothStatus(toothNumber)
    const badgeMap = {
      treated: 'bg-blue-500',
      problem: 'bg-red-500',
      planned: 'bg-amber-500',
    }
    return badgeMap[status] || null
  }

  // Computed: Statistics
  const toothStats = computed(() => {
    const statuses = Object.values(toothStatuses.value)
    return {
      total: statuses.length,
      healthy: statuses.filter((s) => s === 'healthy').length,
      treated: statuses.filter((s) => s === 'treated').length,
      problem: statuses.filter((s) => s === 'problem').length,
      planned: statuses.filter((s) => s === 'planned').length,
      missing: statuses.filter((s) => s === 'missing').length,
    }
  })

  // Computed: Get teeth by status
  const teethByStatus = computed(() => {
    const result = {
      healthy: [],
      treated: [],
      problem: [],
      planned: [],
      missing: [],
    }

    Object.entries(toothStatuses.value).forEach(([toothNumber, status]) => {
      if (result[status]) {
        result[status].push(toothNumber)
      }
    })

    return result
  })

  // Batch update statuses from treatment history
  function updateStatusesFromHistory(treatments) {
    if (!treatments || !Array.isArray(treatments)) return

    // Reset to healthy first
    resetAllStatuses()

    // Apply each treatment's status
    treatments.forEach((treatment) => {
      updateToothStatusFromTreatment(treatment)
    })
  }

  return {
    // State
    toothStatuses,
    toothPaintTypes,

    // Computed
    toothStats,
    teethByStatus,

    // Methods
    getToothStatus,
    setToothStatus,
    updateToothStatusFromTreatment,
    markToothAsProblem,
    markToothAsMissing,
    markToothAsHealthy,
    resetAllStatuses,
    getToothColorClass,
    getToothBadgeClass,
    updateStatusesFromHistory,
  }
}

export default useToothStatus
