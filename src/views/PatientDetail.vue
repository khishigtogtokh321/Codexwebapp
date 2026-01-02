<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SideNav from '@/components/layout/SideNav.vue'
import TopBar from '@/components/layout/TopBar.vue'
import AllergyCard from '@/components/patient/AllergyCard.vue'
import RecallScheduleCard from '@/components/patient/RecallScheduleCard.vue'
import { mockPatient, mockTreatmentHistory } from '@/data'
import { formatDate } from '@/utils/formatters'

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
const searchTerm = ref('')
const showSafety = ref(true)

let mqLg
let mqPortrait

const patient = computed(() => {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  const idFromHash = hash.match(/pid=([^&]+)/)?.[1]
  const resolvedId = decodeURIComponent(idFromHash || props.pid || mockPatient.id)
  return {
    ...mockPatient,
    id: resolvedId,
    name: mockPatient.name || 'Тодорхойгүй өвчтөн',
    cardNo: mockPatient.id || '2024-042',
    rd: mockPatient.rd || 'УП88010112',
    phone: mockPatient.phone || '9911-2233',
    birthDate: mockPatient.birthDate || '1988.01.01',
    gender: mockPatient.gender === 'male' ? 'Эр' : 'Эм',
    age: mockPatient.age || 36,
    address: mockPatient.address || 'Улаанбаатар, БЗД, 26-р хороо, Хүнну 222',
    email: mockPatient.email || 'bat-erdene@example.mn',
    job: mockPatient.job || 'Программист',
  }
})

const allergies = computed(() => [
  { label: 'Пенициллин' },
  { label: 'Тоос' },
])

const recalls = computed(() => [
  { dueDate: '2026.06.28', plannedDate: '-', note: 'Урдчилан сэргийлэх үзлэг' },
  { dueDate: '2024.12.01', plannedDate: '2024.11.25', note: 'Шүдний өнгө шалгах' },
])

const tabs = ['Эмчилгээ', 'Төлөвлөгөө', 'Цаг товлол', 'Түүх', 'Файл']
const activeTab = ref(tabs[0])

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

const statusClass = (status) => {
  if (status === 'done') return 'badge-soft badge-soft--success'
  if (status === 'planned') return 'badge-soft badge-soft--muted'
  return 'badge-soft badge-soft--warning'
}

function toggleNav() {
  pinned.value = !pinned.value
}

function handleNavigate(id) {
  window.location.hash = `#${id}`
}

const filteredTreatments = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return treatments.value
  return treatments.value.filter(
    (item) =>
      item.description.toLowerCase().includes(term) ||
      item.code.toLowerCase().includes(term) ||
      item.doctor.toLowerCase().includes(term),
  )
})

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
      <div
        class="absolute inset-y-0 left-0 transition-all duration-300 ease-in-out"
        :class="isLgUp && (hovered || pinned) ? 'w-48' : 'w-24'"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <SideNav
          :is-collapsed="!(isLgUp && (hovered || pinned))"
          :is-pinned="pinned"
          active-id="patients"
          @toggle="toggleNav"
          @toggle-pin="toggleNav"
          @navigate="handleNavigate"
        />
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <TopBar :active-patient="patient" />

      <div class="flex flex-1 min-h-0 overflow-hidden">
        <div class="flex min-w-0 flex-1 flex-col gap-4 px-4 pb-16 pt-4 lg:pb-6 lg:px-6">
          <div class="lg:hidden">
            <div class="card card--soft flex flex-col gap-6">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600"
                >
                  {{ patient.name.slice(0, 2).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="text-lg font-bold text-slate-900">{{ patient.name }}</p>
                  <p class="text-sm font-semibold text-blue-600">Өвчтөний карт</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-slate-700">
                <div class="text-slate-500">Карт №</div>
                <div class="font-semibold text-slate-900">{{ patient.cardNo }}</div>
                <div class="text-slate-500">РД</div>
                <div class="font-semibold text-slate-900">{{ patient.rd }}</div>
                <div class="text-slate-500">Утас</div>
                <div class="font-semibold text-slate-900">{{ patient.phone }}</div>
                <div class="text-slate-500">Төрсөн огноо</div>
                <div class="font-semibold text-slate-900">{{ patient.birthDate }}</div>
                <div class="text-slate-500">Нас</div>
                <div class="font-semibold text-slate-900">{{ patient.age }}</div>
                <div class="text-slate-500">Хүйс</div>
                <div class="font-semibold text-slate-900">{{ patient.gender }}</div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Хаяг</p>
                  <p class="font-semibold text-slate-900">{{ patient.address }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">И-мэйл</p>
                  <p class="font-semibold text-slate-900">{{ patient.email }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Мэргэжил</p>
                  <p class="font-semibold text-slate-900">{{ patient.job }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex min-w-0 flex-1 gap-6 lg:flex-row lg:gap-6">
            <div class="hidden w-full max-w-sm flex-shrink-0 lg:block">
              <div class="card card--soft flex flex-col gap-6">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600"
                >
                  {{ patient.name.slice(0, 2).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="text-lg font-bold text-slate-900">{{ patient.name }}</p>
                  <p class="text-sm font-semibold text-blue-600">Өвчтөний карт</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-slate-700">
                <div class="text-slate-500">Карт №</div>
                <div class="font-semibold text-slate-900">{{ patient.cardNo }}</div>
                <div class="text-slate-500">РД</div>
                <div class="font-semibold text-slate-900">{{ patient.rd }}</div>
                <div class="text-slate-500">Утас</div>
                <div class="font-semibold text-slate-900">{{ patient.phone }}</div>
                <div class="text-slate-500">Төрсөн огноо</div>
                <div class="font-semibold text-slate-900">{{ patient.birthDate }}</div>
                <div class="text-slate-500">Нас</div>
                <div class="font-semibold text-slate-900">{{ patient.age }}</div>
                <div class="text-slate-500">Хүйс</div>
                <div class="font-semibold text-slate-900">{{ patient.gender }}</div>
                <div class="text-slate-500">Хаяг</div>
                <div class="font-semibold text-slate-900">{{ patient.address }}</div>
                <div class="text-slate-500">И-мэйл</div>
                <div class="font-semibold text-slate-900">{{ patient.email }}</div>
                <div class="text-slate-500">Мэргэжил</div>
                <div class="font-semibold text-slate-900">{{ patient.job }}</div>
              </div>

              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Харшил</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(allergy, index) in allergies" :key="index" class="pill pill--alert">
                    {{ allergy.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>

            <div class="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <template v-if="isPortrait">
                  <div class="card card--soft card--dense flex flex-col gap-3">
                    <button
                      type="button"
                      class="safety-toggle"
                      :aria-expanded="showSafety"
                      @click="showSafety = !showSafety"
                    >
                      <span class="card__title">Аюулгүй байдал &amp; Дахин дуудлага</span>
                      <span class="pill pill--soft">{{ showSafety ? 'Хураах' : 'Нээх' }}</span>
                    </button>
                    <div v-if="showSafety" class="space-y-3">
                      <AllergyCard :allergies="allergies" />
                      <RecallScheduleCard :recalls="recalls" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <AllergyCard :allergies="allergies" />
                  <RecallScheduleCard :recalls="recalls" />
                </template>
              </div>

              <div class="card card--soft flex min-h-0 flex-1 flex-col gap-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div :class="['ui-tabs', isPortrait ? 'ui-tabs--segmented' : '']">
                    <button
                      v-for="tab in tabs"
                      :key="tab"
                      type="button"
                      :class="['ui-tab', tab === activeTab ? 'ui-tab--active' : '']"
                      @click="activeTab = tab"
                    >
                      {{ tab }}
                    </button>
                  </div>
                  <button type="button" class="ui-btn ui-btn--primary min-h-[48px] px-4 lg:min-h-[56px]">
                    + Эмчилгээ эхлүүлэх
                  </button>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="relative w-full max-w-md">
                    <input v-model="searchTerm" type="search" class="ui-input" placeholder="Хайх..." />
                  </div>
                  <span class="text-sm font-semibold text-slate-600">Нийт: {{ filteredTreatments.length }} бичлэг</span>
                </div>

                <div class="flex min-h-0 flex-1 overflow-hidden">
                <div class="ui-table-shell">
                    <div v-if="!isPortrait" class="ui-table-header treatment-table-grid">
                      <div class="min-w-0">Огноо</div>
                      <div class="min-w-0 text-center">Шүд</div>
                      <div class="min-w-0 text-center">Гадаргуу</div>
                      <div class="min-w-0">Код</div>
                      <div class="min-w-0">Тайлбар</div>
                      <div class="min-w-0 text-center">Үнэ</div>
                      <div class="min-w-0 text-center">Статус</div>
                      <div class="min-w-0 text-right">Эмч</div>
                    </div>
                    <div :class="['ui-table-scroll', isPortrait ? 'pb-24' : '']">
                      <template v-if="isPortrait">
                        <div
                          v-for="treatment in filteredTreatments"
                          :key="treatment.id"
                          class="treatment-card"
                        >
                          <div class="treatment-card__row">
                            <div class="treatment-meta">
                              <span class="treatment-meta__date">{{ treatment.date }}</span>
                              <span class="badge-soft">{{ treatment.tooth }}</span>
                              <span class="badge-soft badge-soft--muted">{{ treatment.surface }}</span>
                            </div>
                            <span :class="statusClass(treatment.status)">
                              {{ treatment.status === 'done' ? 'Дууссан' : 'Төлөвлөсөн' }}
                            </span>
                          </div>
                          <div class="treatment-card__body">
                            <div class="treatment-body__code">{{ treatment.code }}</div>
                            <div class="treatment-body__desc">{{ treatment.description }}</div>
                          </div>
                          <div class="treatment-card__footer">
                            <div class="treatment-price">{{ treatment.price }}</div>
                            <div class="treatment-doctor">{{ treatment.doctor }}</div>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          v-for="treatment in filteredTreatments"
                          :key="treatment.id"
                          class="ui-table-row treatment-table-grid"
                        >
                          <div class="min-w-0 font-semibold text-slate-900">{{ treatment.date }}</div>
                          <div class="min-w-0 text-center">
                            <span class="badge-soft">{{ treatment.tooth }}</span>
                          </div>
                          <div class="min-w-0 text-center">
                            <span class="badge-soft badge-soft--muted">{{ treatment.surface }}</span>
                          </div>
                          <div class="min-w-0 text-blue-600">{{ treatment.code }}</div>
                          <div class="min-w-0 font-medium text-slate-900">{{ treatment.description }}</div>
                          <div class="min-w-0 text-center font-semibold text-slate-900">{{ treatment.price }}</div>
                          <div class="min-w-0 text-center">
                            <span :class="statusClass(treatment.status)">{{ treatment.status === 'done' ? 'Дууссан' : 'Төлөвлөсөн' }}</span>
                          </div>
                          <div class="min-w-0 text-right text-slate-700">{{ treatment.doctor }}</div>
                        </div>
                      </template>
                    </div>
                  </div>
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
