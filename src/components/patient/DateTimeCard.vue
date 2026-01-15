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
  <div class="overflow-hidden border border-slate-200 rounded-lg">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-slate-50 border-b border-slate-200">
          <th class="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
          <th class="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</th>
          <th class="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctor</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-for="(item, index) in items" :key="index" class="hover:bg-slate-50/50 transition-colors">
          <td class="px-4 py-2.5 text-xs font-semibold text-slate-700">{{ item.date }}</td>
          <td class="px-4 py-2.5 text-xs font-semibold text-slate-700">{{ item.time }}</td>
          <td class="px-4 py-2.5 text-xs font-medium text-slate-500">{{ item.doctor }}</td>
        </tr>
        <tr v-if="!items.length">
          <td colspan="3" class="px-4 py-4 text-xs font-medium text-slate-400 italic text-center">
            No upcoming appointments
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
