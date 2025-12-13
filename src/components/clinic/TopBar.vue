<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  // breadcrumbs: {
  //   type: Array,
  //   default: () => ['Жагсаалт', 'Эмчилгээний карт'],
  // },
  cardId: {
    type: String,
    default: '2511002',
  },
  placeholder: {
    type: String,
    default: 'Өвчтөн хайх (Нэр, РД, Утас...)',
  },
})

const emit = defineEmits(['search', 'notify', 'settings'])
const search = ref('')

const breadcrumbText = computed(() => props.breadcrumbs.join(' / '))

function handleSearch() {
  emit('search', search.value)
}
</script>

<template>
  <header class="w-full border-b border-gray-200 bg-white shadow-sm">
    <div
      class="mx-auto flex w-full max-w-[1500px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex flex-wrap items-center gap-3 text-sm">
        <!-- <div class="flex items-center gap-2 text-gray-700">
          <span class="font-semibold text-gray-900">{{ breadcrumbText }}</span>
        </div> -->
        <span
          class="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
        >
          Карт №: {{ cardId }}
        </span>
      </div>

      <div class="flex w-full items-center gap-3 lg:w-auto lg:flex-1">
        <div class="relative flex-1 lg:max-w-xl">
          <input
            v-model="search"
            type="text"
            :placeholder="placeholder"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            @input="handleSearch"
          />
          <svg
            class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <circle cx="11" cy="11" r="6" />
            <path stroke-linecap="round" d="M15.5 15.5 19 19" />
          </svg>
        </div>
        
        <!-- <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
            @click="$emit('notify')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14 20a2 2 0 1 1-4 0m8-8c0-3.866-2.239-7-6-7s-6 3.134-6 7c0 2.485-.996 4-2 4h16c-1.004 0-2-1.515-2-4Z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
            @click="$emit('settings')"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.607 2.293.07 2.573-1.065Z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div> -->
      </div>
    </div>
  </header>
</template>
