<script setup>
import { computed } from 'vue'
import SurfaceSelector from './SurfaceSelector.vue'
import StatusSelector from './StatusSelector.vue'
import TreatmentTypeSelector from './TreatmentTypeSelector.vue'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
  selectedSurfaces: {
    type: Array,
    default: () => [],
  },
  selectedStatus: {
    type: String,
    default: 'planned',
  },
  selectedTreatmentTypes: {
    type: Array,
    default: () => [],
  },
  treatments: {
    type: Array,
    default: () => [],
  },
  treatmentDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'surface-toggle',
  'status-change',
  'treatment-type-select',
  'add-treatment',
  'cancel',
])

const isFormDisabled = computed(() => props.selectedTeeth.length === 0)

const canSubmit = computed(() => {
  return (
    props.selectedTeeth.length > 0 &&
    props.selectedSurfaces.length > 0 &&
    props.selectedTreatmentTypes.length > 0
  )
})

const treatmentSelectorDisabled = computed(() => props.treatmentDisabled)

function handleSurfaceToggle(surface) {
  emit('surface-toggle', surface)
}

function handleStatusChange(status) {
  emit('status-change', status)
}

function handleTreatmentTypeSelect(typeId) {
  emit('treatment-type-select', typeId)
}

function handleAddTreatment() {
  if (canSubmit.value) {
    emit('add-treatment')
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="dental-card h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">Эмчилгээ бүртгэл</h2>
      <div v-if="selectedTeeth.length > 0" class="mt-2">
        <p class="text-sm font-medium text-gray-700">
          Сонгосон шүд: {{ selectedTeeth.length }}
        </p>
        <div class="flex flex-wrap gap-1 mt-1">
          <span
            v-for="tooth in selectedTeeth"
            :key="tooth"
            class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
          >
            #{{ tooth }}
          </span>
        </div>
      </div>
      <p v-else class="text-sm text-amber-600 mt-1">
        Эхлээд шүд сонгоно уу
      </p>
    </div>

    <!-- Form Content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      <!-- Surface Selector -->
      <SurfaceSelector
        :selected-surfaces="selectedSurfaces"
        :disabled="isFormDisabled"
        @toggle="handleSurfaceToggle"
      />

      <!-- Status Selector -->
      <StatusSelector
        :selected-status="selectedStatus"
        :disabled="isFormDisabled"
        @change="handleStatusChange"
      />

      <!-- Treatment Type Selector -->
      <TreatmentTypeSelector
        :selected-types="selectedTreatmentTypes"
        :disabled="treatmentSelectorDisabled"
        :treatments="treatments"
        @toggle="handleTreatmentTypeSelect"
      />
    </div>

    <!-- Action Buttons -->
    <div class="p-4 border-t border-gray-200 space-y-2">
      <button
        type="button"
        :disabled="!canSubmit"
        :class="[
          'w-full btn-success transition-all duration-200',
          !canSubmit ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105',
        ]"
        @click="handleAddTreatment"
      >
        <span v-if="selectedTeeth.length > 1">
          Эмчилгээг нэмэх ({{ selectedTeeth.length }} шүд)
        </span>
        <span v-else>
          Эмчилгээг нэмэх
        </span>
      </button>
      <button
        type="button"
        :disabled="selectedTeeth.length === 0"
        class="w-full btn-secondary transition-all duration-200 hover:shadow-md"
        @click="handleCancel"
      >
        Цуцлах
      </button>

      <!-- Validation Messages -->
      <div v-if="selectedTeeth.length > 0 && !canSubmit" class="text-xs text-amber-600 mt-2 space-y-1">
        <p v-if="selectedSurfaces.length === 0">Гадаргуу сонгоно уу.</p>
        <p v-if="selectedTreatmentTypes.length === 0">Дор хаяж нэг эмчилгээний төрөл сонгоно уу.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
