<script setup>
import { computed } from 'vue'

const props = defineProps({
  toothNumber: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'healthy',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  paintType: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['click'])

// Simplified color map for fallback dots and highlight borders
const PAINT_COLORS = {
  1: '#ef4444', // Extraction (Red)
  2: '#ef4444', // Implant (Red)
  3: '#a855f7', // RCT (Purple)
  6: '#3b82f6', // Filling (Blue)
  7: '#3b82f6', // Crown (Blue)
  9: '#f97316', // Bridge (Orange)
  11: '#14b8a6', // Denture (Teal)
  13: '#14b8a6', // Sealant (Teal)
  14: '#f97316', // Veneer (Orange)
  15: '#64748b', // Watch (Slate)
}

const toothClasses = computed(() => {
  const base =
    'group relative tooth-item border rounded-md cursor-pointer transition-all duration-200 ease-out flex flex-col items-center justify-center p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500'

  const statusColors = {
    healthy: 'bg-white border-gray-300 hover:border-blue-400',
    treated: 'bg-white border-gray-300', // Hide blue marker
    problem: 'bg-red-50 border-red-400',
    planned: 'bg-white border-gray-300', // Hide amber marker
    missing: 'bg-transparent border-gray-200 border-dashed opacity-100', // Slot placeholder
  }

  const statusClass = statusColors[props.status] || statusColors.healthy
  const selectedClass = props.isSelected
    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white z-10 is-selected'
    : ''
  const activeClass = props.isActive ? '' : 'opacity-30 grayscale pointer-events-none'

  return `${base} ${statusClass} ${selectedClass} ${activeClass}`
})

const markerColor = computed(() => PAINT_COLORS[props.paintType] || '#94a3b8')

const numberColorClass = computed(() => {
  if (props.status === 'missing') return 'text-gray-400 opacity-10' // Faded for missing
  if (props.status === 'healthy') return 'text-gray-800'
  if (props.paintType && props.paintType !== 0) return 'text-gray-800'
  return 'text-blue-600'
})

function handleClick() {
  emit('click', props.toothNumber)
}
</script>

<template>
  <div :class="toothClasses" @click="handleClick">
    <span :class="['font-extrabold tooth-number z-10', numberColorClass]">
      {{ toothNumber }}
    </span>

    <!-- TOOTH IMAGE PLACEHOLDER (Original tooth) - HIDE IF MISSING -->
    <!-- <div v-if="status !== 'missing'" class="absolute inset-x-0 bottom-0 top-6 px-1.5 flex items-center justify-center pointer-events-none">
       <div class="w-full h-full bg-slate-100/30 rounded-t-lg border-x border-t border-slate-200/50"></div>
    </div> -->

    <!-- TREATMENT VISUALS (SVG / SHAPES) - ONLY SHOW IF ACTIVE AND NOT MISSING -->
    <div v-if="isActive && status !== 'missing'" class="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <!-- 1: Extraction / Шүд авах (Large Red X) -->
      <svg v-if="paintType === 1" class="w-full h-full text-red-500 opacity-80" viewBox="0 0 100 100">
        <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
      </svg>

      <!-- paintType === 2 : Implant (solid green screw) -->
        <div v-if="paintType === 2" class="absolute bottom-1 w-full flex justify-center pointer-events-none">
          <svg class="w-5 h-6" viewBox="0 0 24 24" aria-hidden="true">
            <!-- body -->
            <defs>
              <!-- ridge stripes like the screenshot -->
              <pattern id="implantRidges" width="6" height="4" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="6" height="4" fill="#22c55e"/>
                <rect x="0" y="3" width="6" height="1" fill="#16a34a"/>
              </pattern>
            </defs>

            <!-- main cylinder -->
            <rect x="9" y="3" width="6" height="16" rx="2" fill="url(#implantRidges)"/>
            <!-- slight highlight strip -->
            <rect x="10" y="4" width="1" height="14" rx="0.5" fill="#86efac" opacity="0.9"/>

            <!-- bottom tip -->
            <path d="M9 19h6v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" fill="#16a34a"/>
          </svg>
        </div>

      <!-- 3: RCT / Суваг (Vertical dashed line) -->
      <svg v-if="paintType === 3" class="w-full h-full text-purple-500 opacity-60" viewBox="0 0 100 100">
        <path d="M50 20 L50 80" stroke="currentColor" stroke-width="8" stroke-dasharray="10 5" stroke-linecap="round" />
      </svg>

      <!-- 7: Crown / Бүрээс (Border overlay) -->
      <div v-if="paintType === 7" class="absolute inset-0 border-[6px] border-blue-400/40 rounded-sm"></div>

      <!-- Fallback Dot for others (Filling, etc.) -->
      <div
        v-if="paintType && ![1, 2, 3, 7].includes(Number(paintType))"
        class="absolute top-1 right-1 w-3 h-3 rounded-full shadow-md"
        :style="{ 
          background: status === 'planned' ? 'white' : markerColor,
          border: `2px solid ${markerColor}`
        }"
      ></div>
    </div>

    <!-- SELECTION CHECKMARK -->
    <div
      v-if="isSelected"
      class="absolute bottom-1 left-1 pointer-events-none z-20"
    >
      <svg class="tooth-item__check text-blue-600 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.tooth-item {
  width: 100%;
  aspect-ratio: 0.85;
  min-width: 0;
  font-size: clamp(0.6rem, 1.2vw, 0.78rem);
}

.tooth-number {
  line-height: 1;
  text-shadow: 0 0 2px white, 0 0 4px white;
  opacity: 0.8;
  transition: all 0.2s ease-in-out;
}

.tooth-item:hover .tooth-number,
.tooth-item.is-selected .tooth-number {
  opacity: 1;
  transform: scale(1.1);
}
</style>
