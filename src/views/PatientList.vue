<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TopBar from '@/components/clinic/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'

const cardId = '2511002'

const hovered = ref(false)
const pinned = ref(false)
const drawerOpen = ref(false)
const isLgUp = ref(false)
const desktopExpanded = computed(() => isLgUp.value && (hovered.value || pinned.value))
const drawerTriggerRef = ref(null)
const drawerCloseRef = ref(null)

function toggleNav() {
  pinned.value = !pinned.value
}

function openMobileNav() {
  drawerOpen.value = true
}

function closeMobileNav() {
  drawerOpen.value = false
}

function handleNavigate(id) {
  window.location.hash = `#${id}`
  if (drawerOpen.value) {
    closeMobileNav()
  }
}

const handleEsc = (event) => {
  if (event.key === 'Escape' && drawerOpen.value) {
    closeMobileNav()
  }
}

let mediaQuery

const updateBreakpoint = () => {
  if (typeof window === 'undefined') return
  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(min-width: 1024px)')
  }
  isLgUp.value = mediaQuery?.matches || false
  if (mediaQuery?.matches) {
    drawerOpen.value = false
  }
}

onMounted(() => {
  updateBreakpoint()
  mediaQuery?.addEventListener('change', updateBreakpoint)
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', updateBreakpoint)
  window.removeEventListener('keydown', handleEsc)
})

watch(
  () => drawerOpen.value,
  async (open) => {
    const html = document.documentElement
    const body = document.body
    if (!html || !body) return
    html.classList.toggle('overflow-hidden', open)
    body.classList.toggle('overflow-hidden', open)
    if (open) {
      await nextTick()
      drawerCloseRef.value?.focus?.()
    } else if (!isLgUp.value) {
      drawerTriggerRef.value?.focus?.()
    }
  },
)
</script>

<template>
  <div class="flex min-h-[100dvh] bg-slate-50">
    <aside class="relative z-40 hidden flex-shrink-0 lg:block">
      <div class="w-24"></div>
      <div
        class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
        :class="desktopExpanded ? 'w-48' : 'w-24'"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <SideNav
          :is-collapsed="!desktopExpanded"
          :is-pinned="pinned"
          active-id="patients"
          @toggle="toggleNav"
          @toggle-pin="toggleNav"
          @navigate="handleNavigate"
        />
      </div>
    </aside>

    <div class="flex-1 min-w-0">
      <div class="flex flex-col">
        <div class="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            ref="drawerTriggerRef"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Open navigation"
            @click="openMobileNav"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p class="text-base font-semibold text-gray-900">Patients</p>
        </div>

        <TopBar :card-id="cardId" />

        <main class="flex-1 bg-slate-50">
          <div class="mx-auto w-full max-w-[1500px] px-4 pb-16 pt-6 lg:px-6 lg:pb-12"></div>
        </main>
      </div>
    </div>
  </div>

  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="drawerOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="closeMobileNav"
    ></div>
  </Transition>
  <Transition
    enter-active-class="transform transition-transform duration-300"
    leave-active-class="transform transition-transform duration-300"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-if="drawerOpen"
      class="fixed inset-y-0 left-0 z-50 w-72 max-w-[90vw] bg-white shadow-2xl lg:hidden"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div class="flex items-center gap-2 text-gray-900 font-semibold">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">A</span>
          <span>AshidSoft</span>
        </div>
        <button
          type="button"
          ref="drawerCloseRef"
          class="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Close navigation"
          @click="closeMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <SideNav :is-collapsed="false" :allow-collapse="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
    </div>
  </Transition>
</template>
