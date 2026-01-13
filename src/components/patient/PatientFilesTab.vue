<script setup>
import RecallScheduleCard from '@/components/patient/RecallScheduleCard.vue'

defineProps({
    recalls: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
    <RecallScheduleCard 
        class="min-w-0" 
        :recalls="recalls" 
        @add="$emit('add', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
    />
</template>
