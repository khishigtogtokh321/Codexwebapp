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
  7: '#3b82f6', // Crown (Blue)
}

const toothClasses = computed(() => {
  const base =
    'group relative tooth-item border rounded-md cursor-pointer transition-all duration-200 ease-out flex flex-col items-center justify-center p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500'

  const statusColors = {
    healthy: 'bg-white border-gray-300 hover:border-blue-400',
    treated: 'bg-white border-gray-300', // Hide blue marker
    problem: 'bg-red-50 border-red-400',
    planned: 'bg-white border-gray-300', // Hide amber marker
    missing: 'bg-transparent border-transparent opacity-100', // Slot placeholder
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
  if (props.status === 'missing') return 'text-slate-400' // Clean number for missing
  
  // If there's a clinical marker (paintType), fade the number so the marker is clearer
  if (props.paintType && props.paintType !== 0) return 'invisible' 
  
  if (props.status === 'healthy') return 'text-gray-800'
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


    <!-- TREATMENT VISUALS (SVG / SHAPES) - ONLY SHOW IF ACTIVE AND NOT MISSING -->
    <div v-if="isActive && status !== 'missing'" class="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      <!-- 1: Extraction / Шүд авах (Large Red X) -->
      <svg v-if="paintType === 1" class="w-full h-full text-red-500 opacity-80" viewBox="0 0 100 100">
        <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" stroke-width="10" stroke-linecap="round" />
      </svg>

      <!-- paintType === 2 : Implant (solid green screw) -->
        
          <svg
            v-if="paintType === 2"
            class="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern :id="`implantRidges-${toothNumber}`" width="10" height="6" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="10" height="6" fill="#22c55e"/>
                <rect x="0" y="4.5" width="10" height="1.5" fill="#16a34a"/>
              </pattern>
            </defs>

            <!-- main body (fills most of tile) -->
            <rect x="38" y="14" width="24" height="62" rx="8" :fill="`url(#implantRidges-${toothNumber})`"/>

            <!-- highlight -->
            <rect x="42" y="18" width="4" height="54" rx="2" fill="#86efac" opacity="0.9"/>

            <!-- bottom tip -->
            <path d="M38 74h24v10c0 6-4 10-10 10h-4c-6 0-10-4-10-10V74z" fill="#16a34a"/>
          </svg>

     

      <!-- 3: RCT / Суваг (Vertical dashed line) -->
      <svg v-if="paintType === 3" class="w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
        <!-- 1 canal (default) -->
        <path
          v-if="!(toothNumber % 10 >= 6)"
          d="M50 18 C48 35, 48 55, 46 82 C45 90, 46 95, 48 98"
          stroke="#22c55e"
          stroke-width="6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- 2 canals (molars/premolars-ish) -->
        <g v-else>
          <path
            d="M44 18 C42 34, 42 56, 40 82 C39 90, 40 95, 42 98"
            stroke="#22c55e"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M56 18 C58 34, 58 56, 60 82 C61 90, 60 95, 58 98"
            stroke="#22c55e"
            stroke-width="6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>


      <!-- 6: Filling / Ломбо (Blue center blob) -->
      
        <svg
          v-if="paintType === 6"
          class="w-full h-full"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <!-- unique ids to avoid collisions across many teeth -->
            <radialGradient :id="`fillGrad-${toothNumber}`" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stop-color="#93c5fd" stop-opacity="0.95" />
              <stop offset="55%" stop-color="#3b82f6" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.95" />
            </radialGradient>

            <filter :id="`fillShadow-${toothNumber}`" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0b1220" flood-opacity="0.25" />
            </filter>
          </defs>
          <g transform="translate(50 50) scale(1.45) translate(-50 -50)">
          <!-- blob (slightly off-center looks more natural like the app) -->
          <path
            d="M32 48
              C34 36, 46 30, 56 34
              C66 38, 74 46, 70 58
              C66 72, 52 76, 42 70
              C34 66, 30 58, 32 48 Z"
            :fill="`url(#fillGrad-${toothNumber})`"
            :filter="`url(#fillShadow-${toothNumber})`"
          />

          <!-- highlight -->
          <ellipse cx="48" cy="42" rx="10" ry="6" fill="#ffffff" opacity="0.25" />
          </g>
        </svg>


      <!-- 7: Crown / Бүрээс (Border overlay) -->
      <div v-if="paintType === 7" class="absolute inset-0 border-[6px] border-blue-400/40 rounded-sm"></div>

      <!-- 9: Filled Square (Orange) -->
      <svg v-if="paintType === 9" class="w-full h-full text-orange-500" viewBox="0 0 100 100" aria-hidden="true">
        <rect x="10" y="10" width="80" height="80" fill="currentColor" />
      </svg>

      <!-- 11: Filled Square (Teal, opacity 30%) -->
      <svg v-if="paintType === 11" class="w-full h-full text-teal-500 opacity-30" viewBox="0 0 100 100" aria-hidden="true">
        <rect x="10" y="10" width="80" height="80" fill="currentColor" />
      </svg>

      <!-- 13: Sealant / Чигжээс (Teal fissure lines) -->
      <svg
        v-if="paintType === 13"
        class="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <text
          x="50"
          y="56"
          text-anchor="middle"
          dominant-baseline="middle"
          font-size="92"
          font-weight="700"
          fill="#facc15"
          stroke="#ca8a04"
          stroke-width="3"
          paint-order="stroke"
          style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;"
        >
          S
        </text>
      </svg>
      <!-- 14: Veneer / Өнгөлгөө (Upper/Lower separate crown marker) -->
     <svg
        v-if="paintType === 14"
        class="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <!-- V (both upper & lower) -->
        <path
          d="M34 30 L50 74 L66 30"
          stroke="#22c55e"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />

        <!-- highlight -->
        <path
          d="M36 34 L50 70 L64 34"
          stroke="#bbf7d0"
          stroke-width="3"
          opacity="0.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>





      <!-- 15: Watch / Хяналт (Slate Eye) -->
      <div v-if="paintType === 15" class="absolute top-1 right-1 w-1/2 h-1/2 flex items-center justify-center pointer-events-none">
         <svg class="w-full h-full text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
         </svg>
      </div>

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
