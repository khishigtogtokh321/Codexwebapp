<script setup>
const props = defineProps({
  patient: {
    type: Object,
    default: () => ({}),
  },
  cardId: {
    type: String,
    default: '',
  },
  allergies: {
    type: Array,
    default: () => [],
  },
})

const chips = (patient) =>
  [patient?.age ? `${patient.age} нас` : null, patient?.gender || null, patient?.bloodType || null].filter(Boolean)
</script>

<template>
  <!-- <div class="patient-header">
    <div class="patient-header__primary">
      <div class="patient-avatar">
        <span>{{ patient?.initials || '—' }}</span>
      </div>
      <div class="patient-header__meta">
        <p class="patient-header__name">{{ patient?.name }}</p>
        <div class="patient-header__chips">
          <span v-if="cardId" class="pill pill--muted">Карт № {{ cardId }}</span>
          <span v-for="chip in chips(patient)" :key="chip" class="pill pill--soft">
            {{ chip }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="allergies?.length" class="patient-header__alerts">
      <span class="pill pill--alert">Харшил</span>
      <span v-for="(item, index) in allergies" :key="item + index" class="pill pill--badge">
        {{ item }}
      </span>
    </div>
  </div> -->
</template>
