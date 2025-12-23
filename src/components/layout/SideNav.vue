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
  isPinned: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'navigate', 'toggle-pin'])

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
  { id: 'appointments', label: 'Цаг товлох', icon: 'appointments', pathHint: 'appointment' },
  { id: 'reports', label: 'Тайлан', icon: 'reports', pathHint: 'report' },
  { id: 'settings', label: 'Тохиргоо', icon: 'settings', pathHint: 'setting' },
] 

const internalActiveId = ref('treatments')

const resolvedActive = computed(() => props.activeId || internalActiveId.value)

const highlightClass = computed(
  () => (id) =>
    resolvedActive.value === id ? 'side-nav__item--active font-semibold' : '',
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
  <div class="side-nav relative flex h-full flex-col overflow-visible rounded-r-2xl shadow-xl transition-all duration-300">
    <div class="side-nav__divider relative flex items-center border-b px-3 py-3 sm:px-4" :class="props.isCollapsed ? 'justify-center' : 'justify-between'">
      <div class="flex items-center gap-2">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg  text-sm font-bold"> <img src="../../assets/images/ashidsoftrm.png" alt="Logo"></div>
        <div v-if="!props.isCollapsed" class="transition-opacity duration-200">
          <h1 class="text-base font-bold leading-tight">AshidSoft</h1>
          <p class="side-nav__muted text-xs">Dental</p>
        </div>
      </div>

      <div v-if="props.allowCollapse" class="flex items-center gap-2" :class="props.isCollapsed ? 'hidden' : ''">
        <button
          type="button"
          class="side-nav__icon-btn side-nav__focus inline-flex h-9 w-9 items-center justify-center rounded-md transition focus:outline-none"
          :aria-pressed="props.isPinned"
          aria-label="Toggle pin"
          @click.stop="emit('toggle-pin')"
        >
          
        </button>

        <button
          type="button"
          class="side-nav__icon-btn side-nav__focus inline-flex h-9 w-9 items-center justify-center rounded-md transition focus:outline-none"
          aria-label="Collapse sidebar"
          @click.stop="emit('toggle')"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
          </svg>
        </button>
      </div>

      <button
        v-if="props.allowCollapse"
        type="button"
        class="side-nav__floating-toggle side-nav__focus absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition focus:outline-none lg:inline-flex"
        :aria-label="props.isPinned ? 'Unpin sidebar' : 'Pin sidebar'"
        :title="props.isPinned ? 'Unpin sidebar' : 'Pin sidebar'"
        @click.stop="emit('toggle-pin')"
      >
        <svg
          class="h-4 w-4 transition-transform duration-200"
          :class="props.isCollapsed ? 'rotate-0' : 'rotate-180'"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 space-y-1 px-2 py-2 sm:px-3">
      <button
        v-for="item in navItems"
        :key="item.id"
        :title="props.isCollapsed ? item.label : ''"
        :aria-label="item.label"
        class="side-nav__item side-nav__focus group/nav-item relative flex w-full items-center rounded-xl px-2.5 py-2 text-left transition-all duration-200 focus:outline-none"
        :class="[
          props.isCollapsed ? 'flex-col gap-1 text-[11px]' : 'gap-3',
          props.isCollapsed ? 'px-2 py-3 text-center' : '',
          highlightClass(item.id),
        ]"
        @click="handleSelect(item.id)"
      >
        <svg
          class="h-5 w-5 shrink-0"
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
        <span
          class="truncate text-sm transition-all duration-200"
          :class="props.isCollapsed ? 'text-[11px] leading-tight' : ''"
        >
          {{ item.label }}
        </span>
      </button>
    </nav>

    <div class="side-nav__divider border-t px-3 py-3 sm:px-4" :class="props.isCollapsed ? 'text-center' : ''">
      <div
        class="side-nav__hoverable flex items-center rounded-xl px-3 py-2 transition-all"
        :class="props.isCollapsed ? 'flex-col gap-1' : 'gap-3'"
      >
        <div class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">Dr</div>
        <div v-if="!props.isCollapsed" class="transition-opacity duration-200">
          <p class="text-sm font-medium">Dr. D</p>
          <p class="side-nav__muted text-xs">Шүдний эмч</p>
        </div>
        <span v-else class="side-nav__muted text-[11px]">Dr. D</span>
      </div>
    </div>
  </div>
</template>
