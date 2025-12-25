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
})

const emit = defineEmits(['click'])

const toothClasses = computed(() => {
  const base =
    'group relative tooth-item border rounded-md cursor-pointer transition-all duration-200 ease-out flex items-center justify-center p-0.5 bg-white border-gray-300 hover:border-blue-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500'

  const selected = props.isSelected
    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white border-blue-500'
    : ''

  return `${base} ${selected}`
})

const tooltipText = computed(() => `#${props.toothNumber}`)

function handleClick() {
  emit('click', props.toothNumber)
}
</script>

<template>
  <div :class="toothClasses" @click="handleClick" :title="tooltipText">
    <span class="font-bold text-gray-700">
      {{ toothNumber }}
    </span>

    <div
      v-if="isSelected"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
    >
      <svg class="tooth-item__check text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
  aspect-ratio: 3 / 4;
  min-width: 0;
  font-size: clamp(0.6rem, 1.2vw, 0.78rem);
}

.tooth-item__check {
  width: 1.1em;
  height: 0.9em;
}
</style>
