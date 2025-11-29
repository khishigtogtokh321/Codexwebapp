<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <div
      class="hidden md:block flex-shrink-0 bg-gray-900 transition-all duration-300"
      :class="isCollapsed ? 'w-20' : 'w-64'"
    >
      <SideNav :is-collapsed="isCollapsed" active-id="patients" @toggle="toggleSidebar" @navigate="handleNavigate" />
    </div>

    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="md:hidden flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-white">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="openMobileNav"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <p class="text-sm font-semibold text-gray-800">Өвчтөн</p>
      </div>

      <TopBar :active-patient="activePatient" @patient-selected="handlePatientSelected" />

      <div class="flex-1 overflow-y-auto">
        <div class="p-4 xl:p-6 space-y-4">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_260px]">
            <section class="bg-white rounded-xl shadow-sm p-4 xl:p-6 max-w-[280px] w-full mx-auto lg:mx-0">
              <div class="flex flex-col items-center text-center space-y-3">
                <div
                  class="rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold
                         w-[64px] h-[64px] lg:w-[72px] lg:h-[72px] xl:w-[96px] xl:h-[96px]"
                >
                  BE
                </div>
                <div class="space-y-1">
                  <p class="text-xl font-semibold text-gray-900">D`Dø¥,-D-¥?D'¥?D«¥? D-D«¥.</p>
                  <p class="text-sm text-gray-500">bat.erdene@example.com</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-xl shadow-sm p-4 xl:p-6 space-y-4">
              <h2 class="text-lg font-semibold text-gray-900">O"Dý¥Ø¥,OcD«D,D1 D¬¥?D'¥?¥?D¯¥?D¯</h2>
              <div class="grid grid-cols-2 gap-x-10 gap-y-3 text-sm lg:text-sm xl:text-base">
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">DO_D1¥?</p>
                  <p class="font-medium text-gray-800">D-¥?</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">Dœ¥,Dø¥?</p>
                  <p class="font-medium text-gray-800">+976 9911-2233</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">D›Oc¥?¥?OcD« OcD'Oc¥?</p>
                  <p class="font-medium text-gray-800">1992-01-10</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">D?¥?D¬¥?D¯¥, ¥Ÿ¥,Dø¥?</p>
                  <p class="font-medium text-gray-800">+976 9911-8899</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">DDø¥?D3</p>
                  <p class="font-medium text-gray-800">D`D-D", 14-¥? ¥.D_¥?D_D_, DœD¯DøDøD«DñDøDø¥,Dø¥?</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">DÿD"</p>
                  <p class="font-medium text-gray-800">DœD"92010123</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">DsDø¥?¥, ƒ,-</p>
                  <p class="font-medium text-gray-800">AS-10245</p>
                </div>
                <div class="space-y-1">
                  <p class="text-xs tracking-wide text-gray-400 uppercase">D~-D¬¥?D1D¯</p>
                  <p class="font-medium text-gray-800">bat.erdene@example.com</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-xl shadow-sm p-4 xl:p-6 max-w-[260px] w-full mx-auto lg:mx-0 space-y-3">
              <h2 class="text-lg font-semibold text-gray-900">D›D_DýD¯D_¥?D_D« ¥+DøD3</h2>
              <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 space-y-1">
                <p class="font-semibold text-gray-900">2025-12-05 Aú 10:30</p>
                <p class="text-gray-700">D"¥?. D-D«¥.¥,O_Dý¥^D,D«</p>
                <p class="text-gray-600">D"O_D'D«D,D1 ¥?D¬¥ØD,D¯D3¥?¥?</p>
              </div>
            </section>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
            <section class="bg-white rounded-xl shadow-sm p-4 xl:p-6 space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">D-D¬¥ØD,D¯D3¥?¥?D«D,D1 ¥,OcD¯OcDýD¯OcD3OcOc</h2>
                <span class="text-sm text-gray-500">D-D¬¥ØD,D¯D3¥?¥?D«D,D1 ¥,O_O_¥.</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 space-y-1">
                  <p class="font-semibold text-gray-900">DzD'D_D_D3D,D1D« ¥,OcD¯OcDýD¯OcD3OcOc</p>
                  <ul class="list-disc list-inside space-y-1 text-gray-700">
                    <li>D"O_D' #24 ¥?¥ŸDýD3D,D1D« ¥?D¬¥ØD,D¯D3¥?¥?</li>
                    <li>D"O_D' #36 D¯D_D¬DñD_ ¥?D_D¯D,¥.</li>
                  </ul>
                </div>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 space-y-1">
                  <p class="font-semibold text-gray-900">D-D¬¥ØD,D¯D3¥?¥?D«D,D1 ¥,O_O_¥.</p>
                  <ul class="list-disc list-inside space-y-1 text-gray-700">
                    <li>2025-11-20 ƒ?" D"O_D' #14 D¯D_D¬DñD_ ¥,DøDý¥O¥?DøD«</li>
                    <li>2025-11-10 ƒ?" D"O_D' #36 ¥?¥ŸDýD3D,D1D« ¥?D¬¥ØD,D¯D3¥?¥? ¥?¥.D¯O_O_D¯¥?¥?D«</li>
                  </ul>
                </div>
              </div>
              <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 space-y-1">
                <p class="font-semibold text-gray-900">D"Dø¥?DøDøD3D,D1D« ¥Ÿ¥ŸD¯DúDøD¯¥,</p>
                <p>2025-12-10 Aú 14:00 ƒ?" D"¥?. DoOcD«¥.DñDø¥,</p>
              </div>
            </section>

            <section class="bg-white rounded-xl shadow-sm p-4 xl:p-6 space-y-4">
              <h2 class="text-lg font-semibold text-gray-900">O"D«OcOcD'¥?D,D1D« ¥+DøD3</h2>
              <div class="space-y-3">
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 space-y-1">
                  <p class="font-semibold text-gray-900">09:00 ƒ?" D"O_D'D«D,D1 ¥+¥?Dý¥?¥?D¯¥?D3¥?¥?</p>
                  <p class="text-gray-700">D"¥?. D-D«¥.¥,O_Dý¥^D,D«</p>
                </div>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 space-y-1">
                  <p class="font-semibold text-gray-900">11:30 ƒ?" D"DøD3DøD¯D'Dø¥. O_DúD¯¥?D3</p>
                  <p class="text-gray-700">D"¥?. DoOcD«¥.DñDø¥,</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="isMobileNavOpen" class="fixed inset-0 z-40 bg-black/50 md:hidden" @click="closeMobileNav"></div>
    </transition>
    <transition name="slide">
      <div v-if="isMobileNavOpen" class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl md:hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div class="flex items-center gap-2 text-white font-semibold">
            <span class="bg-blue-600 w-8 h-8 flex items-center justify-center rounded-lg">A</span>
            <span>AshidSoft</span>
          </div>
          <button
            type="button"
            class="p-2 rounded-md text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="closeMobileNav"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SideNav :is-collapsed="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideNav from '@/components/layout/SideNav.vue'
import patientService from '@/services/patientService'

const activePatient = ref(patientService.getDefaultPatient())
const isCollapsed = ref(false)
const isMobileNavOpen = ref(false)

const handlePatientSelected = (patient) => {
  activePatient.value = patient || activePatient.value
}

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const openMobileNav = () => {
  isMobileNavOpen.value = true
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
}

const handleNavigate = (id) => {
  window.location.hash = `#${id}`
  if (isMobileNavOpen.value) {
    closeMobileNav()
  }
}
</script>
