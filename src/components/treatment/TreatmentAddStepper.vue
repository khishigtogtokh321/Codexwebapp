<script setup>
import { computed, ref } from 'vue'
import SurfaceSelector from './SurfaceSelector.vue'
import DiagnosisList from './DiagnosisList.vue'
import TreatmentTypeSelector from './TreatmentTypeSelector.vue'
import { getTreatmentScope, TREATMENT_SCOPE } from '@/utils/treatmentScope'

const props = defineProps({
  selectedTeeth: {
    type: Array,
    default: () => [],
  },
  selectedSurfaces: {
    type: Array,
    default: () => [],
  },
  selectedDiagnoses: {
    type: Array,
    default: () => [],
  },
  selectedTreatments: {
    type: Array,
    default: () => [],
  },
  treatments: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['surface-toggle', 'diagnosis-toggle', 'treatment-toggle', 'add-treatment'])

const currentStep = ref(1)

const steps = [
  { id: 1, label: 'Гадаргуу сонгох' },
  { id: 2, label: 'Эмчилгээ сонгох' },
]

const hasSelectedTeeth = computed(() => props.selectedTeeth.length > 0)
const hasSelectedTreatments = computed(() => props.selectedTreatments.length > 0)
const surfaceDisabled = computed(() => !hasSelectedTeeth.value)
const diagnosisDisabled = computed(() => !hasSelectedTeeth.value)

const selectedTreatmentItems = computed(() =>
  props.selectedTreatments
    .map((id) => props.treatments.find((t) => t.id === id))
    .filter(Boolean),
)

const requiresToothSelection = computed(() =>
  selectedTreatmentItems.value.some((treatment) => getTreatmentScope(treatment) === TREATMENT_SCOPE.TOOTH),
)

const canAdd = computed(() => hasSelectedTreatments.value && (!requiresToothSelection.value || hasSelectedTeeth.value))

const isLastStep = computed(() => currentStep.value === steps.length)
const isFirstStep = computed(() => currentStep.value === 1)

/**
 * Header progress line width (0%..100%)
 * step=1 -> 0%
 * step=2 -> 100% (2-step flow)
 */
const stepProgressWidth = computed(() => {
  const total = steps.length
  const percent = total <= 1 ? 0 : ((currentStep.value - 1) / (total - 1)) * 100
  return `${percent}%`
})

function goNext() {
  if (currentStep.value < steps.length) currentStep.value += 1
}

function goBack() {
  if (currentStep.value > 1) currentStep.value -= 1
}

function handleAdd() {
  if (canAdd.value) emit('add-treatment')
}
</script>

<template>
  <section class="dental-card flex flex-col overflow-hidden">
    <!-- ✅ Header: Horizontal stepper (зураг дээрх шиг) -->
    <div class="border-b border-gray-200 px-1 py-1 max-w-[300px] w-full item-center mx-auto">
      <div class="rounded-xl bg-white px-2 py-2">
        <div class="relative flex items-start justify-between">
          <!-- baseline line -->
          <div class="absolute left-0 right-0 top-4 h-[2px] bg-gray-200"></div>

          <!-- active progress line -->
          <div
            class="absolute left-0  top-4 h-[2px] bg-blue-600 transition-all duration-300"
            :style="{ width: stepProgressWidth }"
          ></div>

          <!-- steps -->
          <div v-for="step in steps" :key="step.id" class="relative flex flex-col items-center">
            <!-- circle -->
            <div
              class="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold"
              :class="
                step.id <= currentStep
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-400'
              "
            >
              {{ step.id }}
            </div>

            <!-- label -->
            <p
              class="mt-2 text-xs font-semibold"
              :class="step.id === currentStep ? 'text-gray-900' : 'text-gray-500'"
            >
              {{ step.label }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Body (өөрчлөхгүй) -->
    <div class="flex-1 space-y-2 p-2">
      <div v-if="currentStep === 1" class="space-y-2">
        <SurfaceSelector
          :selected-surfaces="selectedSurfaces"
          :disabled="surfaceDisabled"
          :compact="true"
          :embedded="true"
          label="Гадаргуу сонгох"
          @toggle="(surface) => emit('surface-toggle', surface)"
        />
        <!--
        <DiagnosisList
          :selected-diagnoses="selectedDiagnoses"
          :disabled="diagnosisDisabled"
          label="Онош сонгох"
          @toggle="(code) => emit('diagnosis-toggle', code)"
        />
        -->
      </div>

      <div v-else class="space-y-3">
        <TreatmentTypeSelector
          :selected-types="selectedTreatments"
          :treatments="treatments"
          @toggle="(id) => emit('treatment-toggle', id)"
        />
        <!-- <p v-if="!hasSelectedTreatments" class="text-xs text-amber-600">Эмчилгээ сонгоно уу.</p>
        <p v-if="requiresToothSelection && !hasSelectedTeeth" class="text-xs text-amber-600">
          Эхлээд шүд сонгоно уу.
        </p> -->
      </div>
    </div>

    <!-- Footer (өөрчлөхгүй) -->
    <div class="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3">
      <div class="flex items-center gap-2">
        <button
          v-if="!isFirstStep"
          type="button"
          class="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          @click="goBack"
        >
          Буцах
        </button>

        <button
          v-if="!isLastStep"
          type="button"
          class="min-h-[44px] flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          @click="goNext"
        >
          Дараах
        </button>

        <button
          v-else
          type="button"
          :disabled="!canAdd"
          class="min-h-[44px] flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          @click="handleAdd"
        >
          Эмчилгээ нэмэх
        </button>
      </div>
    </div>
  </section>
</template>
