<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  activeId: {
    type: String,
    default: '',
  },
  allowCollapse: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['toggle', 'navigate'])

const iconPaths = {
  dashboard: 'M3 4.5h7.5v15H3v-15zm10.5 0H21v6.75h-7.5V4.5zm0 8.25H21v6.75h-7.5v-6.75zM3 12.75h7.5v6.75H3v-6.75z',
  treatments: 'M4 6.75a2.75 2.75 0 0 1 2.75-2.75h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75zM8.5 8.5h7M8.5 12h4M8.5 15.5h3',
  patients: 'M9.75 7a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0zm10 0a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0zM4 17.25a4.25 4.25 0 0 1 8.5 0V20H4v-2.75zm10 2.75v-2.5a4 4 0 0 1 6-3.46',
  appointments: 'M7 6V4.5M17 6V4.5M6 9.5h12M5.5 7h13A1.5 1.5 0 0 1 20 8.5v10A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7zM10 12h4v4h-4v-4z',
  reports: 'M6 5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5v13l-4.5-2-4.5 2v-13zM9 8.5h6M9 12h6M9 15.5h3',
  settings: 'M12 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5zM4.75 12a7.25 7.25 0 0 1 .07-.99l-1.5-1.17 1.5-2.6 1.76.43a7.3 7.3 0 0 1 1.7-.99l.35-1.8h3l.35 1.8a7.3 7.3 0 0 1 1.7.99l1.76-.43 1.5 2.6-1.5 1.17a7.3 7.3 0 0 1 0 1.98l1.5 1.17-1.5 2.6-1.76-.43a7.3 7.3 0 0 1-1.7.99l-.35 1.8h-3l-.35-1.8a7.3 7.3 0 0 1-1.7-.99l-1.76.43-1.5-2.6 1.5-1.17A7.25 7.25 0 0 1 4.75 12z',
}

const navItems = [
  { id: 'dashboard', label: 'Самбар', icon: 'dashboard', pathHint: 'dashboard' },
  { id: 'treatments', label: 'Эмчилгээ', icon: 'treatments', pathHint: 'treatment' },
  { id: 'patients', label: 'Өвчтөн', icon: 'patients', pathHint: 'patient' },
  { id: 'appointments', label: 'Цаглал', icon: 'appointments', pathHint: 'appointment' },
  { id: 'reports', label: 'Тайлан', icon: 'reports', pathHint: 'report' },
  { id: 'settings', label: 'Тохиргоо', icon: 'settings', pathHint: 'setting' },
]

const internalActiveId = ref('treatments')

const resolvedActive = computed(() => props.activeId || internalActiveId.value)

const highlightClass = computed(
  () => (id) =>
    resolvedActive.value === id
      ? 'bg-blue-600 text-white border-blue-500 font-semibold'
      : 'text-gray-200 border-transparent hover:bg-gray-800 hover:border-blue-500 hover:text-white',
)

const resolveActive = () => {
  if (props.activeId) {
    internalActiveId.value = props.activeId
    return
  }
  const path = window.location.hash.replace('#', '') || window.location.pathname.toLowerCase()
  const match = navItems.find((item) => path.includes(item.pathHint) || path === item.id)
  internalActiveId.value = match?.id || 'dashboard'
}

const handleRouteChange = () => resolveActive()

const handleSelect = (id) => {
  internalActiveId.value = id
  emit('navigate', id)
}

watch(
  () => props.activeId,
  () => {
    resolveActive()
  },
)

onMounted(() => {
  resolveActive()
  window.addEventListener('popstate', handleRouteChange)
  window.addEventListener('hashchange', handleRouteChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleRouteChange)
  window.removeEventListener('hashchange', handleRouteChange)
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-900 text-white transition-all duration-300">
    <div
      class="p-3 sm:p-4 border-b border-gray-800 flex items-center"
      :class="props.isCollapsed ? 'justify-center' : 'justify-between'"
    >
      <div class="flex items-center gap-2">
        <div class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-lg font-bold">A</div>
        <div v-if="!props.isCollapsed">
          <h1 class="text-base font-bold">AshidSoft</h1>
          <p class="text-xs text-gray-400">Dental</p>
        </div>
      </div>

      <button
        v-if="props.allowCollapse"
        type="button"
        class="p-1.5 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="emit('toggle')"
      >
        <svg
          class="h-5 w-5 text-white transition-transform duration-200"
          :class="props.isCollapsed ? 'rotate-180' : ''"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 p-2 space-y-1">
      <button
        v-for="item in navItems"
        :key="item.id"
        :title="props.isCollapsed ? item.label : ''"
        :aria-label="item.label"
        class="w-full flex items-center rounded-lg px-2.5 sm:px-3 py-2 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
        :class="[props.isCollapsed ? 'justify-center' : 'gap-3', highlightClass(item.id)]"
        @click="handleSelect(item.id)"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <path
            v-if="iconPaths[item.icon]"
            :d="iconPaths[item.icon]"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-if="!props.isCollapsed" class="text-sm">{{ item.label }}</span>
      </button>
    </nav>

    <div class="p-3 sm:p-4 border-t border-gray-800" :class="props.isCollapsed ? 'text-center' : ''">
      <div
        class="flex items-center rounded-lg px-3 py-2 hover:bg-gray-800 cursor-pointer transition-all"
        :class="props.isCollapsed ? 'justify-center' : 'gap-3'"
      >
        <div class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-full font-bold">Dr</div>
        <div v-if="!props.isCollapsed">
          <p class="text-sm font-medium">Dr. D</p>
          <p class="text-xs text-gray-400">Шүдний эмч</p>
        </div>
      </div>
    </div>
  </div>
</template>
