<script setup>
import { ref, computed, watch } from 'vue'
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

const lastSelection = ref([])

watch(
  () => props.selectedTeeth,
  (_newValue, oldValue) => {
    if (Array.isArray(oldValue)) {
      lastSelection.value = [...oldValue]
    }
  },
  { deep: true }
)

const hasSelection = computed(() => props.selectedTeeth.length > 0)
const hasUndo = computed(() => lastSelection.value.length > 0)

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

function undoSelection() {
  if (!hasUndo.value) return

  if (props.multiSelect) {
    emit('teeth-select', [...lastSelection.value])
  } else {
    emit('tooth-select', lastSelection.value[0] || '')
  }
}
</script>

<template>
  <div class="dental-card p-4 md:p-5 space-y-5 tooth-selector">
    <div class="selector-header">
        <h2 class="selector-title">1. Шүд сонгох</h2>
    </div>

    <div class="jaw-section">
      <div class="jaw-label">Дээд эрүү</div>
      <div class="quadrant-row">
        <div class="quadrant">
          <div class="tooth-row tooth-row--reverse">
            <ToothItem
              v-for="tooth in upperRightTeeth"
              :key="tooth"
              :tooth-number="String(tooth)"
              :status="getToothStatus(String(tooth))"
              :is-selected="isSelected(String(tooth))"
              @click="handleToothClick"
            />
          </div>
        </div>

        <div class="midline" aria-hidden="true"></div>

        <div class="quadrant">
          <div class="tooth-row">
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
    </div>

    <div class="jaw-divider" aria-hidden="true"></div>

    <div class="jaw-section">
      <div class="quadrant-row">
        <div class="quadrant">
          <div class="tooth-row tooth-row--reverse">
            <ToothItem
              v-for="tooth in lowerRightTeeth"
              :key="tooth"
              :tooth-number="String(tooth)"
              :status="getToothStatus(String(tooth))"
              :is-selected="isSelected(String(tooth))"
              @click="handleToothClick"
            />
          </div>
        </div>

        <div class="midline" aria-hidden="true"></div>

        <div class="quadrant">
          <div class="tooth-row">
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
      </div>
      <div class="jaw-label jaw-label--bottom">Доод эрүү</div>
    </div>

    <div class="selector-toolbar">
      <div class="selector-actions">
        <button type="button" class="selector-btn" :disabled="!hasSelection" @click="clearSelection">
          Цэвэрлэх
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooth-selector {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border-radius: 16px;
}

.selector-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.selector-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.selector-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.selector-helper {
  color: #64748b;
  margin-top: 0.25rem;
}

.selector-meta {
  display: grid;
  justify-items: end;
  gap: 0.35rem;
}

.selector-count {
  padding: 0.4rem 0.6rem;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-weight: 600;
  color: #0f172a;
}

.selector-hint {
  font-size: 0.85rem;
  color: #94a3b8;
}

.jaw-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.jaw-label {
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  letter-spacing: 0.01em;
}

.jaw-label--bottom {
  margin-top: 0.5rem;
}

.quadrant-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.25rem;
  align-items: center;
}

.quadrant {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quadrant-heading {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  color: #0f172a;
}

.quadrant-code {
  padding: 0.25rem 0.55rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-weight: 700;
  font-size: 0.9rem;
}

.quadrant-name {
  font-size: 0.9rem;
  color: #64748b;
}

.tooth-row {
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 0.5rem;
}

.tooth-row--reverse {
  flex-direction: row-reverse;
}

.midline {
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, rgba(148, 163, 184, 0) 0%, rgba(148, 163, 184, 0.7) 50%, rgba(148, 163, 184, 0) 100%);
}

.jaw-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0) 0%, rgba(148, 163, 184, 0.5) 50%, rgba(148, 163, 184, 0) 100%);
}

.selector-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.selector-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.selector-btn {
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-weight: 600;
  color: #0f172a;
  font-size: 0.95rem;
  transition: all 140ms ease;
}

.selector-btn:hover:enabled {
  border-color: #2563eb;
  color: #1d4ed8;
  box-shadow: 0 10px 30px -20px rgba(37, 99, 235, 0.4);
}

.selector-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-hint {
  color: #94a3b8;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .tooth-selector {
    padding: 1rem;
  }

  .selector-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .selector-meta {
    justify-items: start;
  }

  .quadrant-row {
    grid-template-columns: 1fr;
  }

  .midline {
    display: none;
  }

  .tooth-row {
    justify-content: center;
  }
}
</style>
