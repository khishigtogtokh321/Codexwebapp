<script setup>
defineProps({
    items: {
        type: Array,
        default: () => [
            { date: '2024.11.25', time: '10:30', doctor: 'Д. Гантулга' },
            { date: '2024.12.02', time: '14:00', doctor: 'Б. Эрдэнэ' },
            { date: '2024.12.18', time: '09:15', doctor: 'Ц. Мөнх' },
        ],
    },
})
</script>

<template>
    <div  > 
    <div class="ui-table-shell">
        <div class="ui-table-header date-time-table-grid">
            <div class="min-w-0">Огноо</div>
            <div class="min-w-0 text-center">Цаг</div>
            <div class="min-w-0 text-right">Эмч</div>
        </div>
        <div class="ui-table-scroll date-time-table-scroll">
            <template v-if="items.length">
                <div
                    v-for="(item, index) in items"
                    :key="`${item.date}-${item.time}-${index}`"
                    class="ui-table-row date-time-table-grid"
                >
                    <div class="min-w-0 font-semibold text-slate-900">{{ item.date }}</div>
                    <div class="min-w-0 text-center font-semibold text-slate-900">{{ item.time }}</div>
                    <div class="min-w-0 text-right text-slate-700">{{ item.doctor }}</div>
                </div>
            </template>
            <div v-else class="ui-table-row">
                <div class="min-w-0 text-sm text-slate-500">Мэдээлэл алга.</div>
            </div>
        </div>
    </div>
    </div>
</template>
