<script setup>
import { computed } from 'vue'
import SectionCard from './SectionCard.vue'

const props = defineProps({
  plans: {
    type: Array,
    default: () => [
      { id: 1, date: '2025-11-23', title: ' ---- ', status: 'saved', doctor: 'Др. Ану' },
      { id: 2, date: '2025-11-28', title: ' ---- ', status: 'saved', doctor: 'Др. Төрболд' },
    ],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add', 'save', 'row-click'])

const statusPillClass = computed(() => 'pill pill--muted text-xs')

const statusLabel = (status) => {
  if (status === 'saved') return 'Хадгалсан'
  if (status === 'draft') return 'Ноорог'
  return status || ''
}

function handleRowClick(plan) {
  emit('row-click', plan)
}
</script>

<template>
  <SectionCard title="Төлөвлөгөө" dense>
    <template #actions>
      <div v-if="showActions" class="flex items-center gap-2">
        <button type="button" class="btn btn--ghost" @click="$emit('add')">
          <span class="text-base leading-none">+</span>
          Нэмэх
        </button>
        <button type="button" class="btn btn--primary" @click="$emit('save')">
          Хадгалах
        </button>
      </div>
    </template>

    <div class="table-shell">
      <div class="table-shell__scroll">
        <table class="table">
          <thead>
            <tr>
              <th class="text-left">Огноо</th>
              <th class="text-left">Гарчиг</th>
              <th class="text-left">Төлөв</th>
              <th class="text-left">Эмч</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center text-gray-500">Уншиж байна...</td>
            </tr>
            <tr v-else-if="plans.length === 0">
              <td colspan="4" class="text-center text-gray-500">Төлөвлөгөө хоосон байна</td>
            </tr>
            <tr
              v-else
              v-for="plan in plans"
              :key="plan.id || plan.name"
              class="cursor-pointer"
              @click="handleRowClick(plan)"
            >
              <td class="whitespace-nowrap font-semibold">{{ plan.date }}</td>
              <td class="font-semibold">{{ plan.title }}</td>
              <td>
                <span :class="statusPillClass">{{ statusLabel(plan.status) }}</span>
              </td>
              <td class="whitespace-nowrap font-semibold">{{ plan.doctor }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SectionCard>
</template>
