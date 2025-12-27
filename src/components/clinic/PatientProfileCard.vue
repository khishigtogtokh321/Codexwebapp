<script setup>
import { computed } from 'vue'
import InfoRow from './InfoRow.vue'
import SectionCard from './SectionCard.vue'

const props = defineProps({
  patient: {
    type: Object,
    default: () => ({
      initials: 'BE',
      name: 'Б.Төрболд',
      age: 25,
      gender: 'Эр',
      bloodType: 'O(I) Rh+',
      register: 'УЖ99203405',
      birthDate: '2000-01-01',
      profession: 'Программист',
      phone: '88112233',
      phoneAlt: '99112233',
      email: 'bat.erdene@gmail.com',
      address: 'БЗД, 25-р хороо, Наран зам 89-12',
    }),
  },
  allergies: {
    type: Array,
    default: () => [],
  },
  complaints: {
    type: Array,
    default: () => [],
  },
  risks: {
    type: Array,
    default: () => [],
  },
})

const chips = computed(() => {
  const p = props.patient || {}
  return [p.age ? `${p.age} нас` : null, p.gender || null].filter(Boolean)
})

const identityItems = computed(() => {
  const p = props.patient || {}
  return [
    { label: 'Регистр', value: p.register },
    { label: 'Төрсөн огноо', value: p.birthDate },
    { label: 'Мэргэжил', value: p.profession },
    { label: 'Цусны бүлэг', value: p.bloodType },
  ].filter((i) => i.value)
})

const contactItems = computed(() => {
  const p = props.patient || {}
  const phoneValue = [p.phone, p.phoneAlt].filter(Boolean).join(' / ')
  return [
    { label: 'Утас', value: phoneValue, icon: 'phone' },
    { label: 'Имэйл', value: p.email, icon: 'mail' },
    { label: 'Хаяг', value: p.address, icon: 'location' },
  ].filter((i) => i.value)
})

const hasAllergies = computed(() => props.allergies?.length > 0)
const hasComplaints = computed(() => props.complaints?.length > 0)
const hasRisks = computed(() => props.risks?.length > 0)
</script>

<template>
  <SectionCard dense>
    <template #actions>
      <div class="flex flex-wrap items-center gap-1.5">
        <span v-for="chip in chips" :key="chip" class="pill pill--soft">
          {{ chip }}
        </span>
      </div>
    </template>

    <div class="flex items-start gap-3 md:gap-4">
      <div class="patient-avatar">
        <span>{{ patient.initials }}</span>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-lg font-semibold leading-tight text-gray-900 md:text-xl">
          {{ patient.name }}
        </p>
        <p class="text-sm text-gray-500">Эмчилгээний картын үндсэн мэдээлэл</p>
      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <InfoRow v-for="item in identityItems" :key="item.label" :label="item.label" :value="item.value" />
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <InfoRow
        v-for="item in contactItems"
        :key="item.label"
        :label="item.label"
        :value="item.value"
        :icon="item.icon"
      />
    </div>

    <div class="summary-block space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wide text-rose-600">Эрүүл мэндийн анхааруулга</p>
        <span v-if="hasAllergies" class="pill pill--alert">{{ allergies.length }}</span>
      </div>
      <div v-if="hasAllergies" class="flex flex-wrap gap-1.5">
        <span
          v-for="(item, index) in allergies"
          :key="item + index"
          class="pill pill--badge"
        >
          {{ item }}
        </span>
      </div>
      <div v-if="hasComplaints" class="space-y-1.5">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Зовиур</p>
        <ul class="space-y-1.5 text-sm text-gray-800">
          <li v-for="(complaint, index) in complaints" :key="complaint + index" class="flex items-start gap-2">
            <span class="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            <span class="leading-tight">{{ complaint }}</span>
          </li>
        </ul>
      </div>
      <div v-if="hasRisks" class="space-y-1.5">
        <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Эрсдэл</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(risk, index) in risks"
            :key="risk + index"
            class="pill pill--muted"
          >
            {{ risk }}
          </span>
        </div>
      </div>
    </div>
  </SectionCard>
</template>
