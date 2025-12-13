<script setup>
import { ref, computed } from 'vue'
import ToothItem from './ToothItem.vue'
import { FDI_NOTATION } from '@/utils/toothHelpers'

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

const upperRightTeeth = computed(() => [...FDI_NOTATION.UPPER_RIGHT].reverse())
const upperLeftTeeth = computed(() => FDI_NOTATION.UPPER_LEFT)
const lowerRightTeeth = computed(() => [...FDI_NOTATION.LOWER_RIGHT].reverse())
const lowerLeftTeeth = computed(() => FDI_NOTATION.LOWER_LEFT)

const allTeeth = computed(() => [
  ...FDI_NOTATION.UPPER_RIGHT,
  ...FDI_NOTATION.UPPER_LEFT,
  ...FDI_NOTATION.LOWER_LEFT,
  ...FDI_NOTATION.LOWER_RIGHT,
])

function handleToothClick(toothNumber) {
  if (props.multiSelect) {
    const currentSelection = [...props.selectedTeeth]
    const index = currentSelection.indexOf(toothNumber)

    if (index > -1) {
      currentSelection.splice(index, 1)
    } else {
      currentSelection.push(toothNumber)
    }

    emit('teeth-select', currentSelection)
  } else {
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

function selectByType(type) {
  let teeth = []

  if (type === 'permanent') {
    teeth = allTeeth.value
  } else if (type === 'primary') {
    teeth = [
      51, 52, 53, 54, 55,
      61, 62, 63, 64, 65,
      71, 72, 73, 74, 75,
      81, 82, 83, 84, 85
    ]
  } else if (type === 'mixed') {
    teeth = [
      ...allTeeth.value,
      51, 52, 53, 54, 55,
      61, 62, 63, 64, 65,
      71, 72, 73, 74, 75,
      81, 82, 83, 84, 85
    ]
  } else if (type === 'additional') {
    teeth = []
  }

  emit('teeth-select', teeth.map(String))
}
</script>

<template>
  <div class="dental-card p-4 md:p-5 space-y-3">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 class="text-base md:text-lg font-semibold text-gray-900">Шүдний зураглал</h2>
        <p class="text-xs text-slate-500">Сонгоод үргэлжлүүлнэ үү</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-if="multiSelect"
          type="button"
          class="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          @click="selectAll"
        >
          Бүх шүд
        </button>
        <button
          v-if="selectedTeeth.length > 0"
          type="button"
          class="px-3 py-1.5 text-xs font-semibold bg-white text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          @click="clearSelection"
        >
          Сонголт цэвэрлэх ({{ selectedTeeth.length }})
        </button>
      </div>
    </div>

    <div class="mb-2.5 flex flex-wrap gap-2">
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        @click="selectByType('primary')"
      >
        Сүүн
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        @click="selectByType('mixed')"
      >
        Холимог
      </button>
      <button
        type="button"
        class="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 border border-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        @click="selectByType('additional')"
      >
        Нэмэлт
      </button>
    </div>

    <div class="mb-3 md:mb-4">
      <div class="text-xs text-gray-500 mb-1 text-center font-medium">Дээд эрүү</div>
      <div class="flex justify-center gap-0.5 flex-wrap sm:flex-nowrap">
        <div class="flex gap-0.5">
          <ToothItem
            v-for="tooth in upperRightTeeth"
            :key="tooth"
            :tooth-number="String(tooth)"
            :status="getToothStatus(String(tooth))"
            :is-selected="isSelected(String(tooth))"
            @click="handleToothClick"
          />
        </div>

        <div class="w-0.5 bg-gray-300 mx-1 sm:mx-1.5 self-stretch"></div>

        <div class="flex gap-0.5">
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

    <div class="h-3 md:h-4 flex items-center justify-center my-2.5">
      <div class="w-full h-px bg-gray-300"></div>
    </div>

    <div class="mt-3 md:mt-4">
      <div class="flex justify-center gap-0.5 flex-wrap sm:flex-nowrap">
        <div class="flex gap-0.5">
          <ToothItem
            v-for="tooth in lowerRightTeeth"
            :key="tooth"
            :tooth-number="String(tooth)"
            :status="getToothStatus(String(tooth))"
            :is-selected="isSelected(String(tooth))"
            @click="handleToothClick"
          />
        </div>

        <div class="w-0.5 bg-gray-300 mx-1 sm:mx-1.5 self-stretch"></div>

        <div class="flex gap-0.5">
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
      <div class="text-xs text-gray-500 mt-1 text-center font-medium">Доод эрүү</div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .dental-card {
    padding: 1rem;
  }
}
</style>
