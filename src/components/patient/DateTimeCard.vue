<script setup>
defineProps({
    title: {
        type: String,
        default: 'Товолсон цаг'
    },
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
   <div class="card card--soft">
    <div class="card__header">
      <div class="card__title">{{ title }}</div>
    </div>
    <div class="recall-table" role="table">
         <div class="recall-row recall-row--head" role="row">
            <div class="recall-cell recall-cell--header" role="columnheader">Огноо</div>
            <div class="recall-cell recall-cell--header" role="columnheader">Цаг</div>
            <div class="recall-cell recall-cell--header" role="columnheader">Эмч</div>
        </div>
        <div v-if="items.length" class="recall-body" role="rowgroup">
        <div v-for="(item, index) in items" :key="index" class="recall-row" role="row">
            <div class="recall-cell" role="cell">{{ item.date }}</div>
            <div class="recall-cell" role="cell">{{ item.time }}</div>
            <div class="recall-cell recall-cell--note" role="cell">
                {{ item.doctor }}
            </div>
            </div>
        </div>
        <div v-else class="recall-empty" role="row">
            Мэдээлэл алга.
        </div>

        
    </div>
    </div>
</template>
