<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TreatmentPage from './views/TreatmentPage.vue'
import PatientList from './views/PatientList.vue'
import PatientDetail from './views/PatientDetail.vue'
import MyProfile from './views/MyProfile.vue'
import AppointmentList from './views/AppointmentList.vue'

const parseHash = () => {
  const raw = window.location.hash.replace('#', '') // e.g. "patient?pid=123"
  const [pathRaw, queryString = ''] = raw.split('?')
  const path = (pathRaw || '').trim()

  const params = new URLSearchParams(queryString)
  const pid = params.get('pid')

  // default behavior: old logic was patients else treatments
  if (path === 'patients') return { page: 'patients', pid: null }
  if (path === 'patient') return { page: 'patient', pid }
  if (path === 'profile') return { page: 'profile', pid: null }
  if (path === 'appointments' || path === 'appointment') return { page: 'appointments', pid: null }
  return { page: 'treatments', pid }
}

const route = ref(parseHash())

const handleHashChange = () => {
  route.value = parseHash()
}

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

const currentComponent = computed(() => {
  if (route.value.page === 'patients') return PatientList
  if (route.value.page === 'patient') return PatientDetail
  if (route.value.page === 'profile') return MyProfile
  if (route.value.page === 'appointments') return AppointmentList
  return TreatmentPage
})

// key-г hash-аар өгвөл pid өөрчлөгдөхөд component reload зөв ажиллана
const componentKey = computed(() => window.location.hash || route.value.page)

// pid-г зөвхөн patient/treatments дээр хэрэглэх боломжтой (хүсвэл TreatmentPage ч pid уншиж болно)
const pid = computed(() => route.value.pid)
</script>

<template>
  <component
    :is="currentComponent"
    :key="componentKey"
    :pid="pid"
  />
</template>
