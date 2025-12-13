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

const emit = defineEmits(['surface-toggle', 'status-change', 'treatment-type-select', 'add-treatment', 'cancel'])

const isFormDisabled = computed(() => props.selectedTeeth.length === 0)
const treatmentSelectorDisabled = computed(
  () => props.treatmentDisabled || props.selectedSurfaces.length === 0 || props.selectedStatus === '',
)

const canSubmit = computed(() => {
  return (
    props.selectedTeeth.length > 0 &&
    props.selectedSurfaces.length > 0 &&
    props.selectedTreatmentTypes.length > 0
  )
})

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
    <div class="p-4 border-b border-gray-200 space-y-1.5">
      <h2 class="text-lg font-semibold text-gray-900">Сонголтын самбар</h2>
      <p v-if="selectedTeeth.length" class="text-sm text-gray-700">
        Сонгосон шүд: <span class="font-semibold text-gray-900">{{ selectedTeeth.length }}</span>
      </p>
      <p v-else class="text-sm text-amber-600">
        Эхлээд шүд сонгоно уу.
      </p>
      <div v-if="selectedTeeth.length" class="flex flex-wrap gap-1">
        <span
          v-for="tooth in selectedTeeth"
          :key="tooth"
          class="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-100"
        >
          #{{ tooth }}
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      <SurfaceSelector
        :selected-surfaces="selectedSurfaces"
        :disabled="isFormDisabled"
        @toggle="handleSurfaceToggle"
      />

      <StatusSelector
        :selected-status="selectedStatus"
        :disabled="isFormDisabled"
        @change="handleStatusChange"
      />

      <TreatmentTypeSelector
        :selected-types="selectedTreatmentTypes"
        :disabled="treatmentSelectorDisabled"
        :treatments="treatments"
        @toggle="handleTreatmentTypeSelect"
      />
      <p v-if="treatmentSelectorDisabled" class="text-xs text-slate-500">
        Гадаргуу болон төлөвөө сонгосны дараа эмчилгээний төрлөө тэмдэглэнэ үү.
      </p>
    </div>

    <div class="p-4 border-t border-gray-200 space-y-2">
      <button
        type="button"
        :disabled="!canSubmit"
        :class="[
          'w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200',
          !canSubmit ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md',
        ]"
        @click="handleAddTreatment"
      >
        <span v-if="selectedTeeth.length > 1">
          Эмчилгээ нэмэх ({{ selectedTeeth.length }} шүд)
        </span>
        <span v-else>
          Эмчилгээ нэмэх
        </span>
      </button>
      <button
        type="button"
        :disabled="selectedTeeth.length === 0"
        class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        @click="handleCancel"
      >
        Сонголт цэвэрлэх
      </button>

      <div v-if="selectedTeeth.length > 0 && !canSubmit" class="text-xs text-amber-600 mt-1 space-y-1">
        <p v-if="selectedSurfaces.length === 0">Гадаргуу сонгоно уу.</p>
        <p v-if="selectedTreatmentTypes.length === 0">Эмчилгээний төрөл сонгоно уу.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
