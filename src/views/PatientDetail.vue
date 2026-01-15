<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SideNav from '@/components/layout/SideNav.vue'
import TopBar from '@/components/layout/TopBar.vue'
import AllergyCard from '@/components/patient/AllergyCard.vue'
import DateTimeCard from '@/components/patient/DateTimeCard.vue'
import PatientFilesTab from '@/components/patient/PatientFilesTab.vue'
import PatientHistoryTab from '@/components/patient/PatientHistoryTab.vue'
import PatientPlanTab from '@/components/patient/PatientPlanTab.vue'
import PatientScheduleTab from '@/components/patient/PatientScheduleTab.vue'
import PatientTreatmentTab from '@/components/patient/PatientTreatmentTab.vue'
import { mockPatients, mockTreatmentHistory } from '@/data'
import { formatDate } from '@/utils/formatters'
import { usePatientStore } from '@/stores/patient'

const patientStore = usePatientStore()

const props = defineProps({
    pid: {
        type: [String, Number],
        default: '',
    },
})

const hovered = ref(false)
const pinned = ref(false)
const isLgUp = ref(true)
const isPortrait = ref(false)
const showSafety = ref(true)
const showProfileDetails = ref(false)
const isMobileNavOpen = ref(false)

function openMobileNav() {
    isMobileNavOpen.value = true
}

let mqLg
let mqPortrait

const patient = computed(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const idFromHash = hash.match(/pid=([^&]+)/)?.[1]
    const resolvedId = decodeURIComponent(idFromHash || props.pid || mockPatients[0].id)
    
    // Try to get patient from store
    const storePatient = patientStore.getPatientById(resolvedId) || patientStore.patients.find(p => p.cardNo === resolvedId)
    
    const p = storePatient || {
        ...mockPatients[0],
        id: resolvedId,
        name: 'Тодорхойгүй өвчтөн',
    }

    // Sync currentPatient in store
    if (patientStore.currentPatient?.id !== p.id) {
        patientStore.setCurrentPatient(p)
    }

    return p
})

const allergies = computed(() => [
    { label: 'Пенициллин' },
    { label: 'Тоос' },
])

const recalls = computed(() => patientStore.recalls)

const primaryTabs = [
    { key: 'recall', label: 'Дахин дуудах', component: PatientFilesTab },
    { key: 'treatment', label: 'Эмчилгээ', component: PatientTreatmentTab },
    { key: 'plan', label: 'Төлөвлөгөө', component: PatientPlanTab },
    { key: 'history', label: 'Түүх', component: PatientHistoryTab },
]

const activeTab = ref(primaryTabs[0].key)
const activeTabConfig = computed(() => primaryTabs.find((tab) => tab.key === activeTab.value) || primaryTabs[0])

const treatments = computed(() =>
    mockTreatmentHistory.map((item, idx) => ({
        id: item.id || idx,
        date: formatDate(item.date, 'short').replace(/-/g, '.'),
        tooth: item.tooth?.replace('#', '') || '',
        surface: item.surface?.replace(/, /g, '') || '',
        code: item.diagnosis?.split(' - ')[0] || 'D1110',
        description: item.treatmentType || item.diagnosis || '',
        price: item.price || '80,000₮',
        status: item.status || 'planned',
        doctor: item.doctor || 'Д. Гантулга',
    })),
)

const activeTabProps = computed(() => {
    if (activeTabConfig.value.key === 'treatment') {
        return {
            treatments: treatments.value,
            isPortrait: isPortrait.value,
        }
    }
    if (activeTabConfig.value.key === 'plan') {
        return {
            isPortrait: isPortrait.value,
        }
    }
    if (activeTabConfig.value.key === 'recall') {
        return {
            recalls: recalls.value,
        }
    }
    return {
        label: activeTabConfig.value.label,
    }
})

function handleRecallAdd(recall) {
    patientStore.addRecall(recall)
}

function handleRecallEdit(recall) {
    patientStore.updateRecall(recall)
}

function handleRecallDelete(recall) {
    patientStore.deleteRecall(recall)
}

function toggleNav() {
    pinned.value = !pinned.value
}

function handleNavigate(id) {
    isMobileNavOpen.value = false
    window.location.hash = `#${id}`
}

function closeMobileNav() {
    isMobileNavOpen.value = false
}

const updateBreakpoints = () => {
    if (typeof window === 'undefined') return
    if (!mqLg) mqLg = window.matchMedia('(min-width: 1024px)')
    if (!mqPortrait) mqPortrait = window.matchMedia('(max-width: 1023px)')
    isLgUp.value = mqLg?.matches || false
    isPortrait.value = mqPortrait?.matches || false
}

onMounted(() => {
    updateBreakpoints()
    mqLg?.addEventListener('change', updateBreakpoints)
    mqPortrait?.addEventListener('change', updateBreakpoints)
})

onBeforeUnmount(() => {
    mqLg?.removeEventListener('change', updateBreakpoints)
    mqPortrait?.removeEventListener('change', updateBreakpoints)
})
</script>

<template>
    <div class="flex h-[100dvh] min-h-[100dvh] bg-white overflow-hidden text-slate-900">
        <!-- Sidebar Navigation -->
        <aside class="relative z-40 hidden flex-shrink-0 lg:block border-r border-slate-200">
            <div class="w-24"></div>
            <div class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
                :class="isLgUp && (hovered || pinned) ? 'w-48' : 'w-24'" @mouseenter="hovered = true"
                @mouseleave="hovered = false">
                <SideNav :is-collapsed="!(isLgUp && (hovered || pinned))" :is-pinned="pinned" active-id="patients"
                    @toggle="toggleNav" @toggle-pin="toggleNav" @navigate="handleNavigate" />
            </div>
        </aside>

        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50/30">
           <TopBar>
                <template #leading>
                    <div class="lg:hidden flex items-center gap-2">
                        <button
                            type="button"
                            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                            aria-label="Open navigation"
                            @click="isMobileNavOpen = true"
                        >
                            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                            </svg>
                        </button>
                    </div>
                </template>
            </TopBar>

            <main :class="['flex flex-1 min-h-0', isPortrait ? 'overflow-y-auto' : 'overflow-hidden']">
                <div
                    :class="[
                        'flex min-h-0 min-w-0 flex-col gap-6 px-4 pb-20 pt-6 lg:pb-8 lg:px-8 mx-auto w-full max-w-[1600px]',
                        isPortrait ? '' : 'flex-1',
                    ]">
                    
                    <!-- MOBILE: Header Summary -->
                    <div class="lg:hidden">
                        <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                            <div class="flex items-start gap-4 mb-5">
                                <div class="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-lg font-semibold border border-slate-200">
                                    {{ patient.name.slice(0, 1).toUpperCase() }}
                                </div>
                                <div class="min-w-0">
                                    <h1 class="text-xl font-bold text-slate-900 leading-tight">{{ patient.name }}</h1>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">ID: {{ patient.cardNo }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">РД</span>
                                    <p class="text-sm font-semibold text-slate-700">{{ patient.rd }}</p>
                                </div>
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Нас / Хүйс</span>
                                    <p class="text-sm font-semibold text-slate-700">{{ patient.age }} / {{ patient.gender }}</p>
                                </div>
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Утас</span>
                                    <p class="text-sm font-semibold text-slate-700">{{ patient.phone }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        :class="[
                            'flex min-h-0 min-w-0 flex-col gap-6 lg:grid lg:grid-cols-[280px_1fr]',
                            isPortrait ? '' : 'flex-1',
                        ]">
                        <!-- DESKTOP: Clinical Sidebar Profile -->
                        <div class="hidden lg:flex flex-col min-h-0 space-y-6">
                            <div class="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col p-6 space-y-6">
                                <div class="flex flex-col items-center text-center">
                                    <div class="w-20 h-20 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 text-2xl font-bold border border-slate-100 mb-4">
                                        {{ patient.name.slice(0, 1).toUpperCase() }}
                                    </div>
                                    <h1 class="text-xl font-bold text-slate-900 tracking-tight leading-tight px-2">{{ patient.name }}</h1>
                                    <p class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-[0.1em]">Patient Profile</p>
                                </div>

                                <div class="space-y-5 pt-2">
                                    <div class="space-y-4">
                                        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 pb-2">Identification</h3>
                                        <div class="grid gap-3">
                                            <div class="flex justify-between items-baseline gap-2">
                                                <span class="text-xs text-slate-400 font-medium">Card №</span>
                                                <span class="text-sm font-semibold text-slate-700">{{ patient.cardNo }}</span>
                                            </div>
                                            <div class="flex justify-between items-baseline gap-2">
                                                <span class="text-xs text-slate-400 font-medium">Reg. Number</span>
                                                <span class="text-sm font-semibold text-slate-700">{{ patient.rd }}</span>
                                            </div>
                                            <div class="flex justify-between items-baseline gap-2">
                                                <span class="text-xs text-slate-400 font-medium">Demographics</span>
                                                <span class="text-sm font-semibold text-slate-700">{{ patient.age }}y, {{ patient.gender }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-4">
                                        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 pb-2">Contact</h3>
                                        <div class="grid gap-3">
                                            <div class="flex flex-col">
                                                <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Phone</span>
                                                <span class="text-sm font-semibold text-slate-900">{{ patient.phone }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Email</span>
                                                <span class="text-sm font-semibold text-slate-700 truncate">{{ patient.email }}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Address</span>
                                                <span class="text-sm font-medium text-slate-600 leading-normal">{{ patient.address }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-4 pt-2">
                                        <button type="button" class="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            NEW TREATMENT
                                        </button>
                                        <button type="button" class="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                            EDIT PROFILE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            :class="[
                                'flex min-h-0 min-w-0 flex-col gap-6',
                                isPortrait ? 'overflow-visible' : 'flex-1 overflow-hidden',
                            ]">
                            <!-- CLINICAL ALERTS & STATUS -->
                            <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,1.2fr)]">
                                <template v-if="isPortrait">
                                    <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                                        <button type="button" 
                                            class="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                            @click="showSafety = !showSafety">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <span class="text-xs font-bold text-slate-800 uppercase tracking-widest">Clinical Alerts</span>
                                            </div>
                                            <svg :class="['w-4 h-4 text-slate-400 transition-transform', showSafety ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <Transition
                                            enter-active-class="transition-all duration-300 ease-out"
                                            enter-from-class="max-h-0 opacity-0"
                                            enter-to-class="max-h-[500px] opacity-100"
                                            leave-active-class="transition-all duration-200 ease-in"
                                            leave-from-class="max-h-[500px] opacity-100"
                                            leave-to-class="max-h-0 opacity-0">
                                            <div v-if="showSafety" class="p-4 space-y-4 border-t border-slate-100 bg-white">
                                                <DateTimeCard />
                                                <AllergyCard :allergies="allergies" />
                                            </div>
                                        </Transition>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Next Appointment</h3>
                                        </div>
                                        <DateTimeCard />
                                    </div>
                                    <div class="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <h3 class="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                Clinical Alerts
                                            </h3>
                                        </div>
                                        <AllergyCard :allergies="allergies" />
                                    </div>
                                </template>
                            </div>

                            <!-- MAIN CLINICAL CONTENT -->
                            <div class="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
                                <div class="px-6 border-b border-slate-200 bg-white">
                                    <div class="flex items-center justify-between">
                                        <nav class="flex gap-8" aria-label="Tabs">
                                            <button 
                                                v-for="tab in primaryTabs" 
                                                :key="tab.key" 
                                                type="button"
                                                :class="[
                                                    'relative py-4 text-[11px] font-bold uppercase tracking-widest transition-all outline-none',
                                                    tab.key === activeTab 
                                                        ? 'text-slate-900 border-b-2 border-slate-900' 
                                                        : 'text-slate-400 hover:text-slate-600'
                                                ]"
                                                @click="activeTab = tab.key">
                                                {{ tab.label }}
                                            </button>
                                        </nav>
                                        <div v-if="!isPortrait" class="flex items-center gap-4">
                                            <div class="flex items-center gap-2 text-slate-400">
                                                <span class="text-[10px] font-bold uppercase tracking-wider">Status:</span>
                                                <span class="text-[10px] font-bold text-green-600 uppercase tracking-wider">Active</span>
                                            </div>
                                            <button class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    :class="[
                                        'flex-1 min-h-0 overflow-y-auto lg:p-6 scrollbar-hide bg-white',
                                        isPortrait ? 'p-4' : '',
                                    ]">
                                    <component 
                                        :is="activeTabConfig.component" 
                                        v-bind="activeTabProps"
                                        @add="handleRecallAdd" 
                                        @edit="handleRecallEdit" 
                                        @delete="handleRecallDelete" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PORTRAIT/MOBILE: Bottom Action Bar -->
                <div v-if="isPortrait" class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-lg">
                    <div class="max-w-md mx-auto flex items-center justify-between gap-4">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</span>
                            <span class="text-sm font-bold text-slate-800">Active Care</span>
                        </div>
                        <button type="button" class="h-12 px-6 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            NEW TREATMENT
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- MOBILE NAVIGATION DRAWER -->
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            leave-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="isMobileNavOpen" class="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden" @click="closeMobileNav"></div>
        </Transition>

        <Transition
            enter-active-class="transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
            leave-active-class="transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full">
            <div v-if="isMobileNavOpen" class="fixed inset-y-0 left-0 z-[70] w-72 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col">
                <div class="flex items-center justify-between p-5 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">A</div>
                        <span class="font-bold text-slate-900">HospitalOS</span>
                    </div>
                    <button type="button" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" @click="closeMobileNav">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto">
                    <SideNav :is-collapsed="false" :allow-collapse="false" active-id="patients" @toggle="closeMobileNav" @navigate="handleNavigate" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
