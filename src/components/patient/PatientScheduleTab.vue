<script setup>
defineProps({
    label: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <div class="min-w-0 text-sm font-semibold text-slate-600">
        {{ label }}
    </div>
</template>
