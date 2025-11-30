<script setup>
import { computed } from 'vue'

const props = defineProps({
  patient: {
    type: Object,
    default: () => ({
      initials: 'БЭ',
      name: 'Б.Эрдэнэ',
      age: 25,
      gender: 'Эр',
      bloodType: 'O(I) Rh+',
      register: 'УУ99203405',
      birthDate: '2000-01-01',
      profession: 'Программист',
      phone: '88112233',
      phoneAlt: '99112233',
      email: 'bat.erdene@gmail.com',
      address: 'УБ, 25-р хороо, Баянгол дүүрэг, 89-12',
    }),
  },
})

const chips = computed(() => {
  const p = props.patient || {}
  return [
    p.age ? `${p.age} нас` : null,
    p.gender || null,
    p.bloodType || null,
  ].filter(Boolean)
})

const contactItems = computed(() => {
  const p = props.patient || {}
  return [
    {
      label: 'Регистр',
      value: p.register,
      icon: 'id',
    },
    {
      label: 'Төрсөн огноо',
      value: p.birthDate,
      icon: 'calendar',
    },
    {
      label: 'Мэргэжил',
      value: p.profession,
      icon: 'briefcase',
    },
    {
      label: 'Утас',
      value: p.phone,
      icon: 'phone',
    },
    {
      label: 'Нэмэлт утас',
      value: p.phoneAlt,
      icon: 'phone',
    },
    {
      label: 'И-мэйл',
      value: p.email,
      icon: 'mail',
    },
    {
      label: 'Хаяг',
      value: p.address,
      icon: 'location',
    },
  ].filter((item) => item.value)
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 space-y-5">
    <div class="flex items-center gap-4">
      <div
        class="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold text-xl flex items-center justify-center shadow-sm"
      >
        {{ patient.initials }}
      </div>
      <div class="space-y-2">
        <p class="text-xl font-semibold text-gray-900 leading-tight">
          {{ patient.name }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="chip in chips"
            :key="chip"
            class="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 text-xs font-semibold"
          >
            {{ chip }}
          </span>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in contactItems"
        :key="item.label"
        class="flex items-start gap-3 text-sm text-gray-800"
      >
        <div class="mt-0.5 text-gray-400">
          <svg
            v-if="item.icon === 'id'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 9h5M8 12h3" />
            <circle cx="16" cy="13" r="2" />
          </svg>
          <svg
            v-else-if="item.icon === 'calendar'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <rect x="4" y="5" width="16" height="15" rx="2" />
            <path d="M8 3v4m8-4v4M4 9h16" />
          </svg>
          <svg
            v-else-if="item.icon === 'briefcase'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
            <rect x="4" y="6" width="16" height="14" rx="2" />
            <path d="M4 12h16" />
          </svg>
          <svg
            v-else-if="item.icon === 'phone'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
            />
          </svg>
          <svg
            v-else-if="item.icon === 'mail'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="m4 6 8 7 8-7" />
          </svg>
          <svg
            v-else-if="item.icon === 'location'"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
            />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs uppercase tracking-wide text-gray-500">{{ item.label }}</p>
          <p class="font-medium text-gray-900 leading-snug break-words">
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
