<script setup>
import { ref, computed, watch } from 'vue'
import ToothItem from './ToothItem.vue'
import { getDentitionLayout } from '@/utils/toothHelpers'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
  toothStatuses: {
    type: Object,
    required: true,
  },
  toothPaintTypes: {
    type: Object,
    default: () => ({}),
  },
  multiSelect: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['tooth-select', 'teeth-select', 'select-all', 'clear-selection'])

const dentitionFilter = ref('permanent') // 'permanent' | 'primary' | 'mixed'

const currentLayout = computed(() => getDentitionLayout(dentitionFilter.value))

const upperRightTeeth = computed(() => currentLayout.value.UPPER_RIGHT.filter((s) => s.isActive))
const upperLeftTeeth = computed(() => currentLayout.value.UPPER_LEFT.filter((s) => s.isActive))
const lowerRightTeeth = computed(() => currentLayout.value.LOWER_RIGHT.filter((s) => s.isActive))
const lowerLeftTeeth = computed(() => currentLayout.value.LOWER_LEFT.filter((s) => s.isActive))

const allActiveTeeth = computed(() => {
  return [
    ...currentLayout.value.UPPER_RIGHT,
    ...currentLayout.value.UPPER_LEFT,
    ...currentLayout.value.LOWER_LEFT,
    ...currentLayout.value.LOWER_RIGHT,
  ]
    .filter((t) => t.isActive)
    .map((t) => t.toothNumber)
})

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

function getToothPaintType(toothNumber) {
  return props.toothPaintTypes[toothNumber] || null
}

function isSelected(toothNumber) {
  if (props.multiSelect) {
    return props.selectedTeeth.includes(toothNumber)
  }
  return props.selectedTeeth.length === 1 && props.selectedTeeth[0] === toothNumber
}

function selectAll() {
  emit('select-all', allActiveTeeth.value)
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
  <div class="dental-card p-4 md:p-4 space-y-4 tooth-selector">
    <div class="selector-header">
        <h1 class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">1. Шүд сонгох</h1>
    </div>

    <div class="jaw-section">
      <!-- <div class="jaw-label">Дээд эрүү</div> -->
      <div class="quadrant-row">
        <div class="quadrant">
          <div class="tooth-row tooth-row--reverse">
            <ToothItem
              v-for="slot in upperRightTeeth"
              :key="slot.toothNumber"
              :tooth-number="slot.toothNumber"
              :status="getToothStatus(slot.toothNumber)"
              :paint-type="getToothPaintType(slot.toothNumber)"
              :is-selected="isSelected(slot.toothNumber)"
              @click="handleToothClick"
            />
          </div>
        </div>

        <div class="midline" aria-hidden="true"></div>

        <div class="quadrant">
          <div class="tooth-row">
            <ToothItem
              v-for="slot in upperLeftTeeth"
              :key="slot.toothNumber"
              :tooth-number="slot.toothNumber"
              :status="getToothStatus(slot.toothNumber)"
              :paint-type="getToothPaintType(slot.toothNumber)"
              :is-selected="isSelected(slot.toothNumber)"
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
              v-for="slot in lowerRightTeeth"
              :key="slot.toothNumber"
              :tooth-number="slot.toothNumber"
              :status="getToothStatus(slot.toothNumber)"
              :paint-type="getToothPaintType(slot.toothNumber)"
              :is-selected="isSelected(slot.toothNumber)"
              @click="handleToothClick"
            />
          </div>
        </div>

        <div class="midline" aria-hidden="true"></div>

        <div class="quadrant">
          <div class="tooth-row">
            <ToothItem
              v-for="slot in lowerLeftTeeth"
              :key="slot.toothNumber"
              :tooth-number="slot.toothNumber"
              :status="getToothStatus(slot.toothNumber)"
              :paint-type="getToothPaintType(slot.toothNumber)"
              :is-selected="isSelected(slot.toothNumber)"
              @click="handleToothClick"
            />
          </div>
        </div>
      </div>
      <!-- <div class="jaw-label jaw-label--bottom">Доод эрүү</div> -->
    </div>

    <div class="selector-toolbar">
      <div class="selector-actions">
        <button type="button" class="selector-btn" @click="selectAll">
          Бүгд
        </button>
        <button
          type="button"
          :class="['selector-btn', { active: dentitionFilter === 'permanent' }]"
          @click="dentitionFilter = 'permanent'"
        >
          Байнгийн
        </button>
        <button
          type="button"
          :class="['selector-btn', { active: dentitionFilter === 'primary' }]"
          @click="dentitionFilter = 'primary'"
        >
          Сүүн
        </button>
        <button
          type="button"
          :class="['selector-btn', { active: dentitionFilter === 'mixed' }]"
          @click="dentitionFilter = 'mixed'"
        >
          Холимог
        </button>
        <button type="button" class="selector-btn" disabled>Авхуулсан</button>
        <button type="button" class="selector-btn" disabled>Аваагүй</button>
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
  gap: 1.3rem;
  padding-top: 5px;
  padding-left: 5px;
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

/* .jaw-label {
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  letter-spacing: 0.01em;
} */

/* .jaw-label--bottom {
  margin-top: 0.5rem;
} */

.quadrant-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 1.25rem;
  align-items: center;
}

.quadrant {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
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
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: clamp(0.25rem, 1.2vw, 0.5rem);
  align-items: center;
  min-width: 0;
}

.tooth-row--reverse {
  direction: rtl;
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
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.selector-actions {
  display: flex;
  gap: 0.2rem;
  flex-wrap: wrap;
}

.selector-btn {
  padding: 0.35rem 0.65rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-weight: 600;
  color: #0f172a;
  font-size: 0.88rem;
  transition: all 140ms ease;
}

.selector-btn:hover:enabled,
.selector-btn.active {
  border-color: #2563eb;
  background: #eff6ff;
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
    width: 100%;
  }
}
</style>
