<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Харшил',
  },
  allergies: {
    type: Array,
    default: () => [],
  },
})

const activeAllergies = computed(() => props.allergies.filter((item) => item?.label))
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-2" role="list">
      <div
        v-for="(allergy, index) in activeAllergies"
        :key="`${allergy.label}-${index}`"
        class="inline-flex items-center px-2 py-1 bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 rounded uppercase tracking-wider"
        role="listitem"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></span>
        {{ allergy.label }}
      </div>

      <div v-if="!activeAllergies.length" class="text-xs font-medium text-slate-400 italic">
        No clinical allergies reported
      </div>
    </div>
  </div>
</template>
