<script setup>
import { computed } from 'vue'

const props = defineProps({
  patient: {
    type: Object,
    default: () => ({
      initials: 'BE',
      name: 'Б.Төрболд',
      age: 25,
      gender: 'Эр',
      register: 'УЖ99203405',
      birthDate: '2000-01-01',
      profession: 'Программист',
      phone: '88112233',
      phoneAlt: '99112233',
      email: 'bat.erdene@gmail.com',
      address: 'БЗД, 25-р хороо, Наран зам 89-12',
    }),
  },
})

const chips = computed(() => {
  const p = props.patient || {}
  return [
    p.age ? `${p.age} нас` : null,
    p.gender || null,
  ].filter(Boolean)
})

/** 2 дахь зураг шиг "үндсэн мэдээлэл"-ийг тусад нь table row болгоё */
const identityItems = computed(() => {
  const p = props.patient || {}
  return [
    { label: 'Регистр', value: p.register },
    { label: 'Төрсөн огноо', value: p.birthDate },
    { label: 'Мэргэжил', value: p.profession },
  ].filter(i => i.value)
})

/** Холбоо барих хэсгийг илүү compact болгож салгав */
const contactItems = computed(() => {
  const p = props.patient || {}
  const phoneValue = [p.phone, p.phoneAlt].filter(Boolean).join(' / ')
  return [
    { label: 'Утас', value: phoneValue, icon: 'phone' },
    { label: 'Имэйл', value: p.email, icon: 'mail' },
    { label: 'Хаяг', value: p.address, icon: 'location' },
  ].filter((i) => i.value)
})
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <!-- ===== Header (centered) ===== -->
    <div class="px-5 pt-5 pb-3">
      <div class="flex flex-col items-center text-center">
        <div class="relative">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full
                   bg-gradient-to-br from-blue-500 to-emerald-500
                   text-xl font-semibold text-white shadow-sm"
          >
            {{ patient.initials }}
          </div>
          <span
            class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center
                   rounded-full border-2 border-white bg-emerald-500
                   text-[10px] font-bold text-white shadow"
          >
            A
          </span>
        </div>

        <p class="mt-2 text-lg font-semibold leading-tight text-gray-900">
          {{ patient.name }}
        </p>

        <div class="mt-1.5 flex flex-wrap justify-center gap-1.5">
          <span
            v-for="chip in chips"
            :key="chip"
            class="inline-flex items-center rounded-full
                   border border-blue-100 bg-blue-50
                   px-2.5 py-1 text-[11px] font-semibold text-blue-700"
          >
            {{ chip }}
          </span>
        </div>
      </div>
    </div>

    <!-- divider -->
    <div class="border-t border-gray-100"></div>

    <!-- ===== Identity table-like section ===== -->
    <div class="px-5 py-4">
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <template v-for="item in identityItems" :key="item.label">
          <div class="text-xs font-medium text-gray-500">
            {{ item.label }}
          </div>
          <div class="text-right font-semibold text-gray-900">
            {{ item.value }}
          </div>
        </template>
      </div>
    </div>

    <!-- ===== Contact compact block ===== -->
    <div class="border-t border-gray-100"></div>

    <div class="px-5 py-4">
      <div class="space-y-2.5">
        <div
          v-for="item in contactItems"
          :key="item.label"
          class="flex items-start gap-2"
        >
          <div class="mt-0.5 text-gray-400">
            <!-- phone -->
            <svg
              v-if="item.icon === 'phone'"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M22 16.92v3a2 2 0 0 1-2.18 2
                   19.86 19.86 0 0 1-8.63-3.07
                   19.5 19.5 0 0 1-6-6
                   A19.86 19.86 0 0 1 2.08 4.18
                   2 2 0 0 1 4.06 2h3
                   a2 2 0 0 1 2 1.72
                   12.84 12.84 0 0 0 .7 2.81
                   2 2 0 0 1-.45 2.11
                   L8.09 9.91a16 16 0 0 0 6 6
                   l1.27-1.27a2 2 0 0 1 2.11-.45
                   12.84 12.84 0 0 0 2.81.7
                   A2 2 0 0 1 22 16.92Z"
              />
            </svg>

            <!-- mail -->
            <svg
              v-else-if="item.icon === 'mail'"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            >
              <rect x="4" y="5" width="16" height="14" rx="2" />
              <path d="m4 6 8 7 8-7" />
            </svg>

            <!-- location -->
            <svg
              v-else-if="item.icon === 'location'"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 2a7 7 0 0 0-7 7
                   c0 5.25 7 13 7 13s7-7.75 7-13
                   a7 7 0 0 0-7-7Z"
              />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-[11px] uppercase tracking-wide text-gray-500">
              {{ item.label }}
            </p>
            <p class="text-sm font-medium leading-snug text-gray-900 break-words">
              {{ item.value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
