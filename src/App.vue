<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TreatmentPage from './views/TreatmentPage.vue'
import PatientView from './views/PatientView.vue'

const getPageFromHash = () => {
  const hash = window.location.hash.replace('#', '')
  return hash === 'patients' ? 'patients' : 'treatments'
}

const currentPage = ref(getPageFromHash())

const handleHashChange = () => {
  currentPage.value = getPageFromHash()
}

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
})

const currentComponent = computed(() => (currentPage.value === 'patients' ? PatientView : TreatmentPage))
</script>

<template>
  <component :is="currentComponent" :key="currentPage" />
</template>
