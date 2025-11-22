/**
 * Composable for managing tooth status
 * Handles tooth status map and updates based on treatments
 */

import { ref, computed } from 'vue'
import { getInitialToothStatuses } from '@/data/mockData'

export function useToothStatus(initialStatuses = null) {
  // Tooth status map { '21': 'treated', '16': 'problem', ... }
  const toothStatuses = ref(initialStatuses || getInitialToothStatuses())

  // Get status for a specific tooth
  function getToothStatus(toothNumber) {
    return toothStatuses.value[toothNumber] || 'healthy'
  }

  // Set status for a specific tooth
  function setToothStatus(toothNumber, status) {
    if (!toothNumber) return
    toothStatuses.value[toothNumber] = status
  }

  // Update tooth status based on treatment
  function updateToothStatusFromTreatment(treatment) {
    if (!treatment.tooth) return

    // Extract tooth number from '#21' format
    const toothNumber = treatment.tooth.replace('#', '')

    // Determine status based on treatment status and type
    if (treatment.status === 'done') {
      // Check if it's an extraction
      if (
        treatment.treatmentType?.toLowerCase().includes('extraction') ||
        treatment.treatmentType?.toLowerCase().includes('шүд авах')
      ) {
        setToothStatus(toothNumber, 'missing')
      } else {
        setToothStatus(toothNumber, 'treated')
      }
    } else if (treatment.status === 'planned') {
      setToothStatus(toothNumber, 'planned')
    }
  }

  // Mark tooth as having a problem
  function markToothAsProblem(toothNumber) {
    setToothStatus(toothNumber, 'problem')
  }

  // Mark tooth as missing
  function markToothAsMissing(toothNumber) {
    setToothStatus(toothNumber, 'missing')
  }

  // Mark tooth as healthy
  function markToothAsHealthy(toothNumber) {
    setToothStatus(toothNumber, 'healthy')
  }

  // Reset all tooth statuses to healthy
  function resetAllStatuses() {
    toothStatuses.value = getInitialToothStatuses()
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
