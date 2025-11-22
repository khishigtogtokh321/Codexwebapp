<script setup>
import { ref, computed } from 'vue'
import ToothItem from './ToothItem.vue'
import { FDI_NOTATION, TOOTH_STATUS_LABELS } from '@/utils/toothHelpers'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
  toothStatuses: {
    type: Object,
    required: true,
  },
  multiSelect: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['tooth-select', 'teeth-select', 'select-all', 'clear-selection'])

// Tooth type filter
const toothTypeFilter = ref('all')

// Upper teeth arrays (reversed for proper display)
const upperRightTeeth = computed(() => [...FDI_NOTATION.UPPER_RIGHT].reverse())
const upperLeftTeeth = computed(() => FDI_NOTATION.UPPER_LEFT)

// Lower teeth arrays (reversed for proper display)
const lowerRightTeeth = computed(() => [...FDI_NOTATION.LOWER_RIGHT].reverse())
const lowerLeftTeeth = computed(() => FDI_NOTATION.LOWER_LEFT)

// All teeth
const allTeeth = computed(() => [
  ...FDI_NOTATION.UPPER_RIGHT,
  ...FDI_NOTATION.UPPER_LEFT,
  ...FDI_NOTATION.LOWER_LEFT,
  ...FDI_NOTATION.LOWER_RIGHT,
])

function handleToothClick(toothNumber) {
  if (props.multiSelect) {
    // Multi-select mode
    const currentSelection = [...props.selectedTeeth]
    const index = currentSelection.indexOf(toothNumber)

    if (index > -1) {
      // Deselect
      currentSelection.splice(index, 1)
    } else {
      // Select
      currentSelection.push(toothNumber)
    }

    emit('teeth-select', currentSelection)
  } else {
    // Single select mode
    emit('tooth-select', toothNumber)
  }
}

function getToothStatus(toothNumber) {
  return props.toothStatuses[toothNumber] || 'healthy'
}

function isSelected(toothNumber) {
  if (props.multiSelect) {
    return props.selectedTeeth.includes(toothNumber)
  }
  return props.selectedTeeth.length === 1 && props.selectedTeeth[0] === toothNumber
}

function selectAll() {
  emit('select-all', allTeeth.value.map(String))
}

function clearSelection() {
  emit('clear-selection')
}

function selectByStatus(status) {
  const teeth = allTeeth.value.filter(tooth => getToothStatus(String(tooth)) === status)
  emit('teeth-select', teeth.map(String))
}

function selectByStatusNot(status) {
  const teeth = allTeeth.value.filter(tooth => getToothStatus(String(tooth)) !== status)
  emit('teeth-select', teeth.map(String))
}

function selectByType(type) {
  let teeth = []

  if (type === 'permanent') {
    // Байнгийн шүд: 11-18, 21-28, 31-38, 41-48
    teeth = allTeeth.value
  } else if (type === 'primary') {
    // Сүүн шүд: 51-55, 61-65, 71-75, 81-85
    teeth = [
      51, 52, 53, 54, 55,
      61, 62, 63, 64, 65,
      71, 72, 73, 74, 75,
      81, 82, 83, 84, 85
    ]
  } else if (type === 'mixed') {
    // Холимог: байнгийн болон сүүн шүд хоёулаа
    teeth = [
      ...allTeeth.value,
      51, 52, 53, 54, 55,
      61, 62, 63, 64, 65,
      71, 72, 73, 74, 75,
      81, 82, 83, 84, 85
    ]
  } else if (type === 'additional') {
    // Нэмэлт шүд (супернумерари)
    teeth = []
  }

  emit('teeth-select', teeth.map(String))
}
</script>

<template>
  <div class="dental-card p-4 md:p-6">
    <!-- Header with Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Шүдний диаграмм</h2>

      <div class="flex flex-wrap gap-2">
        <button
          v-if="multiSelect"
          type="button"
          class="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          @click="selectAll"
        >
          Бүгдийг сонгох
        </button>
        <button
          v-if="selectedTeeth.length > 0"
          type="button"
          class="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          @click="clearSelection"
        >
          Цэвэрлэх ({{ selectedTeeth.length }})
        </button>
      </div>
    </div>

    <!-- Tooth Type Filters -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
        @click="selectAll"
      >
        Бүгд
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
        @click="selectByType('permanent')"
      >
        Байнгийн
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded hover:bg-green-100"
        @click="selectByType('primary')"
      >
        Сүүн
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
        @click="selectByType('mixed')"
      >
        Холимог
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded hover:bg-red-100"
        @click="selectByStatus('missing')"
      >
        Авхуулсан
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 rounded hover:bg-amber-100"
        @click="selectByStatusNot('missing')"
      >
        Аваагүй
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
        @click="selectByType('additional')"
      >
        Нэмэлт
      </button>
    </div>

    <!-- Upper Teeth -->
    <div class="mb-6 md:mb-8">
      <div class="text-xs text-gray-500 mb-2 text-center font-medium">Дээд эрүү</div>
      <div class="flex justify-center gap-1 flex-wrap sm:flex-nowrap">
        <!-- Upper Right (18-11) -->
        <div class="flex gap-1">
          <ToothItem
            v-for="tooth in upperRightTeeth"
            :key="tooth"
            :tooth-number="String(tooth)"
            :status="getToothStatus(String(tooth))"
            :is-selected="isSelected(String(tooth))"
            @click="handleToothClick"
          />
        </div>

        <!-- Midline separator -->
        <div class="w-0.5 bg-gray-400 mx-1 sm:mx-2 self-stretch"></div>

        <!-- Upper Left (21-28) -->
        <div class="flex gap-1">
          <ToothItem
            v-for="tooth in upperLeftTeeth"
            :key="tooth"
            :tooth-number="String(tooth)"
            :status="getToothStatus(String(tooth))"
            :is-selected="isSelected(String(tooth))"
            @click="handleToothClick"
          />
        </div>
      </div>
    </div>

    <!-- Jaw separator -->
    <div class="h-6 md:h-8 flex items-center justify-center my-4">
      <div class="w-full h-px bg-gray-300"></div>
    </div>

    <!-- Lower Teeth -->
    <div class="mt-6 md:mt-8">
      <div class="flex justify-center gap-1 flex-wrap sm:flex-nowrap">
        <!-- Lower Right (48-41) -->
        <div class="flex gap-1">
          <ToothItem
            v-for="tooth in lowerRightTeeth"
            :key="tooth"
            :tooth-number="String(tooth)"
            :status="getToothStatus(String(tooth))"
            :is-selected="isSelected(String(tooth))"
            @click="handleToothClick"
          />
        </div>

        <!-- Midline separator -->
        <div class="w-0.5 bg-gray-400 mx-1 sm:mx-2 self-stretch"></div>

        <!-- Lower Left (31-38) -->
        <div class="flex gap-1">
          <ToothItem
            v-for="tooth in lowerLeftTeeth"
            :key="tooth"
            :tooth-number="String(tooth)"
            :status="getToothStatus(String(tooth))"
            :is-selected="isSelected(String(tooth))"
            @click="handleToothClick"
          />
        </div>
      </div>
      <div class="text-xs text-gray-500 mt-2 text-center font-medium">Доод эрүү</div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .dental-card {
    padding: 1rem;
  }
}
</style>
