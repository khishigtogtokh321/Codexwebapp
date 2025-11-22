<script setup>
import { computed } from 'vue'

const props = defineProps({
  toothNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'healthy',
    validator: (value) => ['healthy', 'treated', 'problem', 'planned', 'missing'].includes(value),
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

// Compute CSS classes based on status
const toothClasses = computed(() => {
  const baseClasses = 'group relative w-9 h-12 border-2 rounded-lg cursor-pointer transition-all duration-300 ease-out flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-0.5 hover:scale-110'

  const statusClasses = {
    healthy: 'bg-gradient-to-br from-white to-gray-50 border-gray-300 hover:border-blue-400 hover:from-blue-50 hover:to-white',
    treated: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-500 hover:shadow-blue-200',
    problem: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:border-red-500 hover:shadow-red-200',
    planned: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 hover:border-amber-500 hover:shadow-amber-200',
    missing: 'bg-gray-100 border-gray-400 opacity-50 cursor-not-allowed hover:scale-100 hover:translate-y-0',
  }

  const selectedClass = props.isSelected ? 'ring-4 ring-blue-500 ring-opacity-60 shadow-2xl scale-110 border-blue-500' : ''

  return `${baseClasses} ${statusClasses[props.status]} ${selectedClass}`
})

// Tooltip text
const tooltipText = computed(() => {
  const statusLabels = {
    healthy: 'Эрүүл',
    treated: 'Эмчилсэн',
    problem: 'Асуудалтай',
    planned: 'Төлөвлөсөн',
    missing: 'Авхуулсан',
  }
  return `#${props.toothNumber} - ${statusLabels[props.status]}`
})

// Badge color for status indicator
const badgeClass = computed(() => {
  const badges = {
    treated: 'bg-blue-500',
    problem: 'bg-red-500',
    planned: 'bg-amber-500',
  }
  return badges[props.status] || null
})

// Show badge (only for treated, problem, planned)
const showBadge = computed(() => {
  return ['treated', 'problem', 'planned'].includes(props.status)
})

function handleClick() {
  if (props.status !== 'missing') {
    emit('click', props.toothNumber)
  }
}
</script>

<template>
  <div :class="toothClasses" @click="handleClick" :title="tooltipText">
    <!-- Status badge indicator with pulse animation -->
    <div
      v-if="showBadge"
      :class="badgeClass"
      class="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
    ></div>

    <!-- Tooltip on hover -->
    <div class="absolute bottom-full mb-2 hidden group-hover:block z-10 pointer-events-none">
      <div class="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
        {{ tooltipText }}
        <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>

    <!-- Tooth number with subtle animation -->
    <span class="text-xs font-bold text-gray-700 transition-transform group-hover:scale-110">
      {{ toothNumber }}
    </span>

    <!-- Missing indicator -->
    <span v-if="status === 'missing'" class="text-xs text-gray-500 mt-1">✗</span>

    <!-- Selection checkmark -->
    <div v-if="isSelected" class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
      <svg class="w-4 h-4 text-blue-600 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
    </div>
  </div>
</template>

<style scoped>
@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-3deg);
  }
  75% {
    transform: rotate(3deg);
  }
}

.group:active {
  animation: wiggle 0.3s ease-in-out;
}
</style>
