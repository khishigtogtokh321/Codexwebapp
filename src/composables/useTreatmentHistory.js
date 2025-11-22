/**
 * Composable for managing treatment history
 * Handles CRUD operations, search, and filtering
 */

import { ref, computed } from 'vue'

export function useTreatmentHistory(initialTreatments = []) {
  // Treatment history array
  const treatments = ref([...initialTreatments])

  // Search query
  const searchQuery = ref('')

  // Filter options
  const filters = ref({
    status: 'all', // 'all' | 'done' | 'planned'
    dateRange: null, // { start: Date, end: Date }
    doctor: 'all', // 'all' | doctor name
    tooth: 'all', // 'all' | tooth number
  })

  // Sort options
  const sortBy = ref('date') // 'date' | 'tooth' | 'price'
  const sortOrder = ref('desc') // 'asc' | 'desc'

  // Add new treatment
  function addTreatment(treatment) {
    const newTreatment = {
      id: Date.now(), // Simple ID generation
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      ...treatment,
    }
    treatments.value.unshift(newTreatment) // Add to beginning
    return newTreatment
  }

  // Update existing treatment
  function updateTreatment(id, updates) {
    const index = treatments.value.findIndex((t) => t.id === id)
    if (index > -1) {
      treatments.value[index] = { ...treatments.value[index], ...updates }
      return treatments.value[index]
    }
    return null
  }

  // Delete treatment
  function deleteTreatment(id) {
    const index = treatments.value.findIndex((t) => t.id === id)
    if (index > -1) {
      treatments.value.splice(index, 1)
      return true
    }
    return false
  }

  // Get treatment by ID
  function getTreatmentById(id) {
    return treatments.value.find((t) => t.id === id)
  }

  // Computed: Filtered and sorted treatments
  const filteredTreatments = computed(() => {
    let result = [...treatments.value]

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        (t) =>
          t.tooth?.toLowerCase().includes(query) ||
          t.diagnosis?.toLowerCase().includes(query) ||
          t.treatmentType?.toLowerCase().includes(query) ||
          t.doctor?.toLowerCase().includes(query) ||
          t.notes?.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (filters.value.status !== 'all') {
      result = result.filter((t) => t.status === filters.value.status)
    }

    // Apply doctor filter
    if (filters.value.doctor !== 'all') {
      result = result.filter((t) => t.doctor === filters.value.doctor)
    }

    // Apply tooth filter
    if (filters.value.tooth !== 'all') {
      result = result.filter((t) => t.tooth === filters.value.tooth)
    }

    // Apply date range filter
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      result = result.filter((t) => {
        const treatmentDate = new Date(t.date)
        return treatmentDate >= start && treatmentDate <= end
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy.value) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date)
          break
        case 'tooth':
          comparison = (a.tooth || '').localeCompare(b.tooth || '')
          break
        case 'price':
          const priceA = parseFloat(a.price?.replace(/[^\d]/g, '') || 0)
          const priceB = parseFloat(b.price?.replace(/[^\d]/g, '') || 0)
          comparison = priceA - priceB
          break
        default:
          comparison = 0
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })

    return result
  })

  // Computed: Treatment statistics
  const treatmentStats = computed(() => {
    return {
      total: treatments.value.length,
      completed: treatments.value.filter((t) => t.status === 'done').length,
      planned: treatments.value.filter((t) => t.status === 'planned').length,
      totalCost: treatments.value.reduce((sum, t) => {
        const price = parseFloat(t.price?.replace(/[^\d]/g, '') || 0)
        return sum + price
      }, 0),
    }
  })

  // Computed: Unique doctors list
  const uniqueDoctors = computed(() => {
    const doctors = new Set(treatments.value.map((t) => t.doctor).filter(Boolean))
    return Array.from(doctors).sort()
  })

  // Computed: Unique teeth list
  const uniqueTeeth = computed(() => {
    const teeth = new Set(treatments.value.map((t) => t.tooth).filter(Boolean))
    return Array.from(teeth).sort()
  })

  // Set search query
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  // Set filter
  function setFilter(filterType, value) {
    if (filters.value.hasOwnProperty(filterType)) {
      filters.value[filterType] = value
    }
  }

  // Reset filters
  function resetFilters() {
    filters.value = {
      status: 'all',
      dateRange: null,
      doctor: 'all',
      tooth: 'all',
    }
    searchQuery.value = ''
  }

  // Set sort
  function setSort(field, order = 'desc') {
    sortBy.value = field
    sortOrder.value = order
  }

  // Toggle sort order
  function toggleSortOrder() {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }

  // Get treatments for a specific tooth
  function getTreatmentsByTooth(toothNumber) {
    return treatments.value.filter((t) => t.tooth === `#${toothNumber}`)
  }

  // Get treatments by status
  function getTreatmentsByStatus(status) {
    return treatments.value.filter((t) => t.status === status)
  }

  // Get treatments by date range
  function getTreatmentsByDateRange(startDate, endDate) {
    return treatments.value.filter((t) => {
      const treatmentDate = new Date(t.date)
      return treatmentDate >= startDate && treatmentDate <= endDate
    })
  }

  // Clear all treatments
  function clearAllTreatments() {
    treatments.value = []
  }

  // Load treatments (replace all)
  function loadTreatments(newTreatments) {
    treatments.value = [...newTreatments]
  }

  return {
    // State
    treatments,
    searchQuery,
    filters,
    sortBy,
    sortOrder,

    // Computed
    filteredTreatments,
    treatmentStats,
    uniqueDoctors,
    uniqueTeeth,

    // Methods
    addTreatment,
    updateTreatment,
    deleteTreatment,
    getTreatmentById,
    setSearchQuery,
    setFilter,
    resetFilters,
    setSort,
    toggleSortOrder,
    getTreatmentsByTooth,
    getTreatmentsByStatus,
    getTreatmentsByDateRange,
    clearAllTreatments,
    loadTreatments,
  }
}

export default useTreatmentHistory
