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

const toothClasses = computed(() => {
  const baseClasses =
    'group relative w-9 h-9 border-2 rounded-md cursor-pointer transition-all duration-200 ease-out flex flex-col items-center justify-center text-xs p-0.5 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500'

  const statusClasses = {
    healthy:
      'bg-gradient-to-br from-white to-gray-50 border-gray-300 hover:border-blue-400 hover:from-blue-50 hover:to-white',
    treated: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-500 hover:shadow-blue-200',
    problem: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:border-red-500 hover:shadow-red-200',
    planned:
      'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 hover:border-amber-500 hover:shadow-amber-200',
    missing: 'bg-gray-100 border-gray-400 opacity-50 cursor-not-allowed hover:scale-100 hover:translate-y-0',
  }

  const selectedClass = props.isSelected
    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white shadow-xl scale-110 border-blue-500'
    : ''

  return `${baseClasses} ${statusClasses[props.status]} ${selectedClass}`
})

const tooltipText = computed(() => {
  const statusLabels = {
    healthy: 'Эрүүл',
    treated: 'Эмчилсэн',
    problem: 'Асуудалтай',
    planned: 'Төлөвлөгдсөн',
    missing: 'Алга',
  }
  return `#${props.toothNumber} - ${statusLabels[props.status]}`
})

const badgeClass = computed(() => {
  const badges = {
    treated: 'bg-blue-500',
    problem: 'bg-red-500',
    planned: 'bg-amber-500',
  }
  return badges[props.status] || null
})

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
    <div
      v-if="showBadge"
      :class="badgeClass"
      class="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
    ></div>

    <div class="absolute bottom-full mb-2 hidden group-hover:block z-10 pointer-events-none">
      <div class="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
        {{ tooltipText }}
        <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>

    <span class="text-xs font-bold text-gray-700 transition-transform group-hover:scale-110">
      {{ toothNumber }}
    </span>

    <span v-if="status === 'missing'" class="text-xs text-gray-500 mt-1">-</span>

    <div v-if="isSelected" class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
      <svg class="w-5 h-4 text-blue-600 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.tooth-chip {
  position: relative;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  width: 2.9rem;
  height: 2.9rem;
  min-width: 2.9rem;
  min-height: 2.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.8rem;
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1;
  cursor: pointer;
  transition: all 160ms ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(15, 23, 42, 0.06);
  transition: background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease,
    transform 180ms ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 1px 2px rgba(15, 23, 42, 0.06);
  touch-action: manipulation;

}

.tooth-chip:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 30px -18px rgba(59, 130, 246, 0.35);
  background: linear-gradient(180deg, #ffffff 0%, #f1f5ff 100%);
  box-shadow: 0 12px 30px -20px rgba(59, 130, 246, 0.45);
  transform: translateY(-1px);
}

.tooth-chip:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}


.tooth-chip--selected {
  background: linear-gradient(180deg, #e9f1ff 0%, #e0e7ff 100%);
  border-color: #2563eb;
  box-shadow: 0 10px 30px -18px rgba(37, 99, 235, 0.45), 0 0 0 1px rgba(37, 99, 235, 0.1);
  color: #0f172a;

.tooth-chip:active:not(.tooth-chip--missing) {
  transform: scale(0.98);
}

.tooth-chip--selected {
  background: linear-gradient(180deg, #e9f1ff 0%, #dfe7ff 100%);
  border-color: #2563eb;
  box-shadow: 0 14px 34px -18px rgba(37, 99, 235, 0.5), 0 0 0 1px rgba(37, 99, 235, 0.12);
  color: #0f172a;
  transform: translateY(-1px);

}

.tooth-chip--missing {
  border-style: dashed;
  border-color: #cbd5e1;
  color: #94a3b8;
  background: #f8fafc;
  cursor: not-allowed;
  box-shadow: none;
}

.tooth-chip--missing:hover {
  transform: none;
  box-shadow: none;
  border-color: #cbd5e1;
}

.tooth-chip--treated:not(.tooth-chip--selected) {
  border-color: #60a5fa;
  background: #f3f7ff;
}

.tooth-chip--problem:not(.tooth-chip--selected) {
  border-color: #f87171;
  background: #fff5f5;
}

.tooth-chip--planned:not(.tooth-chip--selected) {
  border-color: #f59e0b;
  background: #fffbeb;
}

.tooth-chip__number {
  transform: translateY(1px);
}

.tooth-chip__missing {
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.75rem;
}

.tooth-chip__check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 10px -6px rgba(37, 99, 235, 0.5);
}

.tooth-chip__status {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: #e2e8f0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.tooth-chip__status--treated {
  background: #3b82f6;
}

.tooth-chip__status--problem {
  background: #ef4444;
}
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

  .group:active {
    animation: wiggle 0.3s ease-in-out;
  }
}
}
</style>
