<script setup>
import { TOOTH_SURFACES } from '@/utils/toothHelpers'

const props = defineProps({
  selectedSurfaces: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const surfaces = [
  { id: 'B', label: 'B/F', name: TOOTH_SURFACES.B, position: 'top' },
  { id: 'M', label: 'M', name: TOOTH_SURFACES.M, position: 'left' },
  { id: 'D', label: 'D', name: TOOTH_SURFACES.D, position: 'right' },
  { id: 'L', label: 'L/P', name: TOOTH_SURFACES.L, position: 'bottom' },
  { id: 'O', label: 'O/I', name: TOOTH_SURFACES.O, position: 'center' },
]

function isSelected(surfaceId) {
  return props.selectedSurfaces.includes(surfaceId)
}

function handleToggle(surfaceId) {
  if (!props.disabled) {
    emit('toggle', surfaceId)
  }
}
</script>

<template>
  <div class="space-y-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="flex items-center justify-between">
      <label class="text-sm font-semibold text-gray-800">2. Гадаргуу сонгох</label>
    </div>

    <div class="relative mx-auto aspect-square w-[200px] sm:w-[220px]">
      <div class="absolute inset-0 rounded-lg border border-gray-300 bg-gradient-to-br from-slate-50 to-white shadow-inner"></div>
      <div class="absolute inset-[28%] rounded-md border border-gray-200 bg-white shadow-sm"></div>

      <button
        v-for="surface in surfaces"
        :key="surface.id"
        type="button"
        :title="surface.name"
        :aria-pressed="isSelected(surface.id)"
        :aria-label="surface.name"
        :disabled="disabled"
        class="surface-zone"
        :class="[
          `zone-${surface.position}`,
          isSelected(surface.id) ? 'surface-zone--active' : 'surface-zone--idle',
          disabled ? 'cursor-not-allowed opacity-60' : 'hover:shadow-lg',
        ]"
        @click="handleToggle(surface.id)"
      >
        <span class="text-xs font-semibold tracking-wide drop-shadow-sm">{{ surface.label }}</span>
      </button>
    </div>

    <p v-if="selectedSurfaces.length > 0" class="text-xs text-blue-700 font-semibold">
      Сонгосон гадаргуу: {{ selectedSurfaces.join(', ') }}
    </p>
    <p v-else class="text-xs text-gray-500">Гадаргуу дарж сонгоно уу.</p>
  </div>
</template>

<style scoped>
.surface-zone {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  min-height: 36px;
  padding: 6px 10px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  color: #0f172a;
  background: linear-gradient(145deg, #f8fafc, #eef2f7);
  transition: all 160ms ease;
  font-weight: 700;
  letter-spacing: 0.02em;
  z-index: 10;
}

.surface-zone--idle {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.surface-zone--active {
  background: linear-gradient(145deg, #2563eb, #1d4ed8);
  color: #fff;
  border-color: #1d4ed8;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

.zone-top {
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 50px;
}

.zone-bottom {
  bottom: 5px;
  left: 50%;
  width: 90px;
  transform: translateX(-50%);
  height: 50px;
}

.zone-left {
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  height: 90px;
}

.zone-right {
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  height: 90px;
}

.zone-center {
  width: 46%;
  height: 46%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  z-index: 20;
}

.surface-zone:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}
</style>
