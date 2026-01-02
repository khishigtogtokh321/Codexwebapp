<script setup>
import { computed } from 'vue'

const props = defineProps({
  pid: {
    type: [String, Number],
    default: '',
  },
})

const patientId = computed(() => props.pid || '')

function goBack() {
  window.location.hash = '#patients'
}
</script>

<template>
    
  <div class="flex min-h-[100dvh] items-center justify-center bg-slate-50 px-4 py-10">
    <div class="card w-full max-w-2xl space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-500">Өвчтөний карт</p>
          <p class="truncate text-2xl font-bold text-gray-900">PID: {{ patientId || 'Тодорхойгүй' }}</p>
          <p class="text-sm text-gray-600">Дэлгэрэнгүй дэлгэц удахгүй нэмэгдэнэ.</p>
        </div>
        <button type="button" class="ui-btn ui-btn--ghost" @click="goBack">
          ← Буцах
        </button>
      </div>

      <div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-gray-700">
        <p class="font-semibold">Placeholder</p>
        <p class="text-sm text-gray-600">Энд өвчтөний дэлгэрэнгүй мэдээлэл байрлана.</p>
      </div>
    </div>
  </div>
</template>
