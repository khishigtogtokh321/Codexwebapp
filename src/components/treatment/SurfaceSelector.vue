<script setup>
const props = defineProps({
  selectedSurfaces: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

function isSelected(surfaceId) {
  return props.selectedSurfaces.includes(surfaceId)
}

function handleToggle(surfaceId) {
  if (!props.disabled) {
    emit('toggle', surfaceId)
  }
}

function surfaceButtonClass(surfaceId) {
  return [
    'h-10 w-full text-xs font-semibold rounded-md border transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500',
    isSelected(surfaceId) ? 'bg-blue-100 text-blue-700 border-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300',
    props.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-500',
  ]
}
</script>

<template>
  <div
    class="w-full max-w-[360px] space-y-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
    :class="disabled ? 'opacity-90' : ''"
  >
    <div class="flex items-center justify-between">
      <label class="text-sm font-semibold text-gray-800">2. Гадаргуу сонгох</label>
      <span class="text-xs text-slate-500">MOD/BFL</span>
    </div>

    <div class="grid grid-cols-3 gap-2 w-[150px] sm:w-[170px] mx-auto">
      <div></div>
      <button
        type="button"
        :disabled="disabled"
        :class="surfaceButtonClass('B')"
        @click="handleToggle('B')"
      >
        B/F
      </button>
      <div></div>

      <button
        type="button"
        :disabled="disabled"
        :class="surfaceButtonClass('M')"
        @click="handleToggle('M')"
      >
        M
      </button>
      <button
        type="button"
        :disabled="disabled"
        :class="surfaceButtonClass('O')"
        @click="handleToggle('O')"
      >
        O/I
      </button>
      <button
        type="button"
        :disabled="disabled"
        :class="surfaceButtonClass('D')"
        @click="handleToggle('D')"
      >
        D
      </button>

      <div></div>
      <button
        type="button"
        :disabled="disabled"
        :class="surfaceButtonClass('L')"
        @click="handleToggle('L')"
      >
        L/P
      </button>
      <div></div>
    </div>

    <p v-if="selectedSurfaces.length > 0" class="text-xs text-blue-700 font-semibold">
      Сонгосон гадаргуу: {{ selectedSurfaces.join(', ') }}
    </p>
    <p v-else-if="disabled" class="text-xs text-slate-500">Эхлээд шүд сонгоно уу.</p>
    <p v-else class="text-xs text-gray-500">Гадаргуугаа сонгоно уу.</p>
  </div>
</template>

<style scoped>
</style>
