<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  dense: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="section-card" :class="{ 'section-card--dense': dense }">
    <header v-if="title || subtitle || $slots.actions" class="section-card__header">
      <div class="section-card__titles">
        <p v-if="title" class="section-card__title">{{ title }}</p>
        <p v-if="subtitle" class="section-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="section-card__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="section-card__body">
      <slot />
    </div>
  </section>
</template>
