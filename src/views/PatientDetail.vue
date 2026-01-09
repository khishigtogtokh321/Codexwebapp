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
import { mockPatient, mockTreatmentHistory } from '@/data'
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

let mqLg
let mqPortrait

const patient = computed(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const idFromHash = hash.match(/pid=([^&]+)/)?.[1]
    const resolvedId = decodeURIComponent(idFromHash || props.pid || mockPatient.id)
    
    // Try to get patient from store first
    const storePatient = patientStore.getPatientById(resolvedId)
    
    // Fallback to mock patient with resolved ID
    const p = storePatient || {
        ...mockPatient,
        id: resolvedId,
        name: mockPatient.name || 'Тодорхойгүй өвчтөн',
        cardNo: mockPatient.id || '2024-042',
        rd: mockPatient.rd || 'УБ88010112',
        phone: mockPatient.phone || '9911-2233',
        birthDate: mockPatient.birthDate || '1988.01.01',
        gender: mockPatient.gender === 'male' ? 'Эр' : 'Эм',
        age: mockPatient.age || 36,
        address: mockPatient.address || 'Улаанбаатар, БЗД, 26-р хороо, Хүннү 222',
        email: mockPatient.email || 'bat-erdene@example.mn',
        job: mockPatient.job || 'Программист',
    }

    // Sync with global store if not already set or different
    if (patientStore.currentPatient?.id !== p.id) {
        patientStore.setCurrentPatient(p)
    }

    return p
})

const allergies = computed(() => [
    { label: 'Пенициллин' },
    { label: 'Тоос' },
])

const recalls = computed(() => [
    { dueDate: '2026.06.28', plannedDate: '-', note: 'Урьдчилан сэргийлэх үзлэг' },
    { dueDate: '2024.12.01', plannedDate: '2024.11.25', note: 'Шүдний өнгө шалгах' },
])

const primaryTabs = [
    { key: 'treatment', label: 'Эмчилгээ', component: PatientTreatmentTab },
    { key: 'plan', label: 'Эмчилгээний төлөвлөгөө', component: PatientPlanTab },
    { key: 'schedule', label: 'Цаг товлох', component: PatientScheduleTab },
    { key: 'recall', label: 'Дахин дуудах хуваарь', component: PatientFilesTab },
    { key: 'files', label: 'Файл', component: PatientHistoryTab },
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

function toggleNav() {
    pinned.value = !pinned.value
}

function handleNavigate(id) {
    window.location.hash = `#${id}`
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
    <div class="flex h-[100dvh] min-h-[100dvh] bg-slate-50 overflow-hidden">
        <aside class="relative z-40 hidden flex-shrink-0 lg:block">
            <div class="w-24"></div>
            <div class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
                :class="isLgUp && (hovered || pinned) ? 'w-48' : 'w-24'" @mouseenter="hovered = true"
                @mouseleave="hovered = false">
                <SideNav :is-collapsed="!(isLgUp && (hovered || pinned))" :is-pinned="pinned" active-id="patients"
                    @toggle="toggleNav" @toggle-pin="toggleNav" @navigate="handleNavigate" />
            </div>
        </aside>

        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <TopBar />

            <div :class="['flex flex-1 min-h-0', isPortrait ? 'overflow-y-auto' : 'overflow-hidden']">
                <div
                    :class="[
                        'flex min-h-0 min-w-0 flex-col gap-4 px-4 pb-16 pt-4 lg:pb-6 lg:px-6 mx-auto w-full max-w-[1430px]',
                        isPortrait ? '' : 'flex-1',
                    ]">
                    <div class="lg:hidden">
                        <div class="card card--soft patient-summary">
                            <div class="patient-summary__header">
                                <div class="patient-summary__avatar">
                                    {{ patient.name.slice(0, 2).toUpperCase() }}
                                </div>
                                <div class="patient-summary__meta">
                                    <p class="text-lg font-bold text-slate-900">{{ patient.name }}</p>
                                    <p class="text-sm font-semibold text-blue-600">Өвчтөний мэдээлэл</p>
                                </div>
                            </div>

                            <div class="profile-grid">
                                <div class="profile-field">
                                    <span class="profile-label">Карт №</span>
                                    <span class="profile-value">{{ patient.cardNo }}</span>
                                </div>
                                <div class="profile-field">
                                    <span class="profile-label">РД</span>
                                    <span class="profile-value">{{ patient.rd }}</span>
                                </div>
                                <div class="profile-field">
                                    <span class="profile-label">Утас</span>
                                    <span class="profile-value">{{ patient.phone }}</span>
                                </div>
                                <div class="profile-field">
                                    <span class="profile-label">Нас / Хүйс</span>
                                    <span class="profile-value">{{ patient.age }} · {{ patient.gender }}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                class="patient-summary__toggle"
                                aria-controls="patient-summary-details"
                                :aria-expanded="showProfileDetails"
                                @click="showProfileDetails = !showProfileDetails">
                                <span class="patient-summary__toggle-label">More details</span>
                                <span class="pill pill--muted">{{ showProfileDetails ? 'Hide' : 'Show' }}</span>
                            </button>

                            <div v-if="showProfileDetails" id="patient-summary-details" class="profile-secondary patient-summary__details">
                                <div class="profile-field">
                                    <span class="profile-label">Төрсөн өдөр</span>
                                    <span class="profile-value">{{ patient.birthDate }}</span>
                                </div>
                                <div class="profile-field">
                                    <span class="profile-label">Хаяг</span>
                                    <span class="profile-value">{{ patient.address }}</span>
                                </div>
                                <div class="profile-field">
                                    <span class="profile-label">И-мэйл</span>
                                    <span class="profile-value">{{ patient.email }}</span>
                                </div>
                                <div class="profile-field">
                                    <span class="profile-label">Мэргэжил</span>
                                    <span class="profile-value">{{ patient.job }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        :class="[
                            'flex min-h-0 min-w-0 flex-col gap-6 lg:grid lg:grid-cols-[clamp(18rem,26vw,22rem)_minmax(0,1fr)]',
                            isPortrait ? '' : 'flex-1',
                        ]">
                        <div class="hidden w-full min-w-0 max-w-sm flex-shrink-0 lg:block">
                            <div class="card card--soft flex flex-col gap-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600">
                                        {{ patient.name.slice(0, 2).toUpperCase() }}
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-lg font-bold text-slate-900">{{ patient.name }}</p>
                                        <p class="text-sm font-semibold text-blue-600">Өвчтөний мэдээлэл</p>
                                    </div>
                                </div>

                                <div class="profile-grid">
                                    <div class="profile-field">
                                        <span class="profile-label">Карт №</span>
                                        <span class="profile-value">{{ patient.cardNo }}</span>
                                    </div>
                                    <div class="profile-field">
                                        <span class="profile-label">РД</span>
                                        <span class="profile-value">{{ patient.rd }}</span>
                                    </div>
                                    <div class="profile-field">
                                        <span class="profile-label">Утас</span>
                                        <span class="profile-value">{{ patient.phone }}</span>
                                    </div>
                                    <div class="profile-field">
                                        <span class="profile-label">Нас / Хүйс</span>
                                        <span class="profile-value">{{ patient.age }} · {{ patient.gender }}</span>
                                    </div>
                                </div>

                                <div class="profile-secondary">
                                    <div class="profile-field">
                                        <span class="profile-label">Төрсөн өдөр</span>
                                        <span class="profile-value">{{ patient.birthDate }}</span>
                                    </div>
                                    <div class="profile-field">
                                        <span class="profile-label">Хаяг</span>
                                        <span class="profile-value">{{ patient.address }}</span>
                                    </div>
                                    <div class="profile-field">
                                        <span class="profile-label">И-мэйл</span>
                                        <span class="profile-value">{{ patient.email }}</span>
                                    </div>
                                    <div class="profile-field">
                                        <span class="profile-label">Мэргэжил</span>
                                        <span class="profile-value">{{ patient.job }}</span>
                                    </div>
                                </div>
                                <div class="card__footer">
                                    <button type="button" class="ui-btn ui-btn--primary w-full">
                                        + Эмчилгээ эхлүүлэх
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            :class="[
                                'flex min-h-0 min-w-0 flex-col gap-4',
                                isPortrait ? 'overflow-visible' : 'flex-1 overflow-hidden',
                            ]">
                            <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                                <template v-if="isPortrait">
                                    <div class="card card--soft card--dense flex flex-col gap-3">
                                        <button type="button" class="safety-toggle" :aria-expanded="showSafety"
                                            @click="showSafety = !showSafety">
                                            <span class="card__title">Аюулгүй байдал &amp; Дахин дуудлага</span>
                                            <span class="pill pill--soft">{{ showSafety ? 'Хаах' : 'Нээх' }}</span>
                                        </button>
                                        <div v-if="showSafety" class="space-y-3">
                                            <AllergyCard class="min-w-0" :allergies="allergies" />
                                            <DateTimeCard class="min-w-0" />
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <AllergyCard class="min-w-0" :allergies="allergies" />
                                    <DateTimeCard class="min-w-0" />
                                </template>
                            </div>

                            <div class="card card--soft flex min-h-0 flex-1 flex-col gap-4">
                                <div class="flex flex-wrap items-center justify-between gap-3">
                                    <div :class="['ui-tabs ui-tabs--underline', isPortrait ? 'w-full' : '']">
                                        <button v-for="tab in primaryTabs" :key="tab.key" type="button"
                                            :class="['ui-tab', tab.key === activeTab ? 'ui-tab--active' : '']"
                                            @click="activeTab = tab.key">
                                            {{ tab.label }}
                                        </button>
                                    </div>
                                </div>
                                <div
                                    :class="[
                                        'flex min-h-0 min-w-0 flex-col',
                                        isPortrait ? 'overflow-visible' : 'flex-1 overflow-hidden',
                                    ]">
                                    <component :is="activeTabConfig.component" v-bind="activeTabProps" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isPortrait" class="action-bar">
                    <div class="action-bar__content">
                        <span class="action-bar__meta">Эмчилгээний ерөнхий төлөв</span>
                        <button type="button" class="ui-btn ui-btn--primary action-bar__cta">
                            + Эмчилгээ эхлүүлэх
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
