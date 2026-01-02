<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Дахин дуудлага хуваарь',
  },
  recalls: {
    type: Array,
    default: () => [],
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
        <div class="recall-cell recall-cell--header" role="columnheader">Дуудсан огноо</div>
        <div class="recall-cell recall-cell--header" role="columnheader">Төлөвлөсөн огноо</div>
        <div class="recall-cell recall-cell--header" role="columnheader">Тэмдэглэл</div>
      </div>
      <div v-if="recalls.length" class="recall-body" role="rowgroup">
        <div v-for="(recall, index) in recalls" :key="index" class="recall-row" role="row">
          <div class="recall-cell" role="cell">{{ recall.dueDate }}</div>
          <div class="recall-cell" role="cell">{{ recall.plannedDate }}</div>
          <div class="recall-cell recall-cell--note" role="cell">
            {{ recall.note || '-' }}
          </div>
        </div>
      </div>
      <div v-else class="recall-empty" role="row">
        Төлөвлөгдсөн дуудлага байхгүй
      </div>
    </div>
  </div>
</template>
