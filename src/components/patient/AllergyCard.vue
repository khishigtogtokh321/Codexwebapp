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
  <div class="card card--soft">
    <div class="card__header">
      <div class="card__title-wrap">
        <span class="card__title">{{ title }}</span>
        <span v-if="activeAllergies.length" class="pill pill--badge">{{ activeAllergies.length }}</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-2" role="list">
      <span
        v-for="(allergy, index) in activeAllergies"
        :key="`${allergy.label}-${index}`"
        class="pill pill--alert"
        role="listitem"
      >
        {{ allergy.label }}
      </span>

      <span v-if="!activeAllergies.length" class="text-sm text-slate-500">Харшлын мэдээлэл байхгүй</span>
    </div>
  </div>
</template>
