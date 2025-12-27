<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div v-if="value" class="info-row">
    <div class="info-row__label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="info-row__value">
      <div class="info-row__content">
        <slot name="icon">
          <svg
            v-if="icon === 'phone'"
            class="info-row__icon"
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
          <svg
            v-else-if="icon === 'mail'"
            class="info-row__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="m4 6 8 7 8-7" />
          </svg>
          <svg
            v-else-if="icon === 'location'"
            class="info-row__icon"
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
        </slot>
        <slot>{{ value }}</slot>
      </div>
    </div>
  </div>
</template>
