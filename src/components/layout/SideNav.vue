<script setup>
import { ref } from 'vue'

const activeRoute = ref('treatments')

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
  },
  {
    id: 'treatments',
    label: 'Treatments',
    icon: '🦷',
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: '👥',
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: '📅',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📈',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
  },
]

function handleNavClick(itemId) {
  activeRoute.value = itemId
  // In a real app, this would trigger route navigation
}
</script>

<template>
  <div class="h-full bg-gray-900 text-white flex flex-col">
    <!-- Logo/Header -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <div class="text-3xl">🦷</div>
        <div>
          <h1 class="text-lg font-bold">DentalCare</h1>
          <p class="text-xs text-gray-400">Management System</p>
        </div>
      </div>
    </div>

    <!-- Navigation Items -->
    <nav class="flex-1 p-4 space-y-1">
      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200',
          activeRoute === item.id
            ? 'bg-blue-600 text-white font-medium'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
        @click="handleNavClick(item.id)"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <!-- User Profile / Footer -->
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
          Dr
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">Dr. Болд</p>
          <p class="text-xs text-gray-400">Dentist</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
