/**
 * Composable for managing treatment form state
 * Handles selected tooth, surfaces, status, and treatment type
 */

import { ref, computed } from 'vue'

export function useTreatmentState() {
  // Selected teeth (array of tooth numbers like ['21', '16'])
  const selectedTeeth = ref([])

  // Selected tooth surfaces (array of 'M', 'O', 'D', 'B', 'L')
  const selectedSurfaces = ref([])

  // Treatment status ('planned' | 'done')
  const selectedStatus = ref('planned')

  // Selected treatment type (e.g., 'filling', 'root-canal')
  const selectedTreatmentType = ref('')

  // Additional notes
  const notes = ref('')

  // Computed: Check if form is valid for submission
  const isFormValid = computed(() => {
    return (
      selectedTeeth.value.length > 0 &&
      selectedSurfaces.value.length > 0 &&
      selectedTreatmentType.value !== ''
    )
  })

  // Computed: Get surfaces as comma-separated string
  const surfacesString = computed(() => {
    return selectedSurfaces.value.join(', ')
  })

  // Computed: Get teeth as comma-separated string
  const teethString = computed(() => {
    return selectedTeeth.value.map(t => `#${t}`).join(', ')
  })

  // Methods
  function selectTeeth(teeth) {
    selectedTeeth.value = Array.isArray(teeth) ? teeth : [teeth]
  }

  function selectTooth(toothNumber) {
    selectedTeeth.value = [toothNumber]
  }

  function clearTeethSelection() {
    selectedTeeth.value = []
  }

  function toggleSurface(surface) {
    const index = selectedSurfaces.value.indexOf(surface)
    if (index > -1) {
      selectedSurfaces.value.splice(index, 1)
    } else {
      selectedSurfaces.value.push(surface)
    }
  }

  function setStatus(status) {
    selectedStatus.value = status
  }

  function selectTreatmentType(typeId) {
    selectedTreatmentType.value = typeId
  }

  function setNotes(value) {
    notes.value = value
  }

  // Reset form to initial state
  function resetForm() {
    selectedTeeth.value = []
    selectedSurfaces.value = []
    selectedStatus.value = 'planned'
    selectedTreatmentType.value = ''
    notes.value = ''
  }

  // Reset only selection (keep teeth selected)
  function resetSelection() {
    selectedSurfaces.value = []
    selectedStatus.value = 'planned'
    selectedTreatmentType.value = ''
    notes.value = ''
  }

  // Get current form data as object
  function getFormData() {
    return {
      teeth: selectedTeeth.value,
      surfaces: selectedSurfaces.value,
      status: selectedStatus.value,
      treatmentType: selectedTreatmentType.value,
      notes: notes.value,
    }
  }

  // Load form data (useful for editing)
  function loadFormData(data) {
    if (data.teeth) selectedTeeth.value = [...data.teeth]
    if (data.surfaces) selectedSurfaces.value = [...data.surfaces]
    if (data.status) selectedStatus.value = data.status
    if (data.treatmentType) selectedTreatmentType.value = data.treatmentType
    if (data.notes) notes.value = data.notes
  }

  return {
    // State
    selectedTeeth,
    selectedSurfaces,
    selectedStatus,
    selectedTreatmentType,
    notes,

    // Computed
    isFormValid,
    surfacesString,
    teethString,

    // Methods
    selectTeeth,
    selectTooth,
    clearTeethSelection,
    toggleSurface,
    setStatus,
    selectTreatmentType,
    setNotes,
    resetForm,
    resetSelection,
    getFormData,
    loadFormData,
  }
}

export default useTreatmentState
