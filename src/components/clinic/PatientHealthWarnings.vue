<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  allergies: { type: Array, default: () => [] },   // ["Пенициллин", "Лидокаин"]
  complaints: { type: Array, default: () => [] },  // ["Шүд янгинаж өвдөнө", "Буйл хавдсан"]
  risks: { type: Array, default: () => [] },       // optional: ["Даралт ихсэх", "DM2"]
  defaultExpanded: { type: Boolean, default: true }, 
  // Хэрвээ summary+expand хэв маягаа хадгалах бол ашиглана
  enableCollapse: { type: Boolean, default: false }
});

const open = ref(props.defaultExpanded);

const hasAllergies = computed(() => props.allergies?.length > 0);
const hasComplaints = computed(() => props.complaints?.length > 0);
const hasRisks = computed(() => props.risks?.length > 0);

const toggle = () => {
  if (!props.enableCollapse) return;
  open.value = !open.value;
};
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-2 px-4 py-3 bg-red-50/40 border-b border-red-100">
      <div class="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs">
        !
      </div>
      <div class="flex-1">
        <div class="text-sm font-semibold text-gray-900">
          Эрүүл мэндийн анхааруулга
        </div>
      </div>

      <!-- Optional collapse control -->
      <button
        v-if="enableCollapse"
        @click="toggle"
        class="text-xs text-red-600 hover:text-red-700 font-medium"
      >
        {{ open ? "Хураах" : "Дэлгэрэнгүй" }}
      </button>
    </div>

    <!-- Body -->
    <div v-if="!enableCollapse || open" class="px-4 py-4 space-y-4">
      
      <!-- Харшил -->
      <div>
        <div class="text-[11px] tracking-wide font-semibold text-gray-500 mb-2">
          ХАРШИЛ
        </div>

        <div v-if="hasAllergies" class="flex flex-wrap gap-2">
          <span
            v-for="(a, i) in allergies"
            :key="i"
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1
                   text-xs border border-red-200 bg-red-50 text-red-700"
          >
            <span class="inline-block w-3 h-3 rounded-full border border-red-300 bg-white"></span>
            {{ a }}
          </span>
        </div>

        <div v-else class="text-xs text-gray-400">
          Харшил бүртгэлгүй
        </div>
      </div>

      <div class="h-px bg-gray-100"></div>

      <!-- Эрсдэл (optional section) -->
      <div v-if="hasRisks">
        <!-- <div class="text-[11px] tracking-wide font-semibold text-gray-500 mb-2">
          ЭРСДЭЛ
        </div> -->

        <!-- <div class="flex flex-wrap gap-2">
          <span
            v-for="(r, i) in risks"
            :key="i"
            class="inline-flex items-center rounded-full px-2.5 py-1
                   text-xs border border-amber-200 bg-amber-50 text-amber-700"
          >
            {{ r }}
          </span>
        </div> -->
      </div>

      <div v-if="hasRisks" class="h-px bg-gray-100"></div>

      <!-- Зовиур / Гомдол -->
      <div>
        <!-- <div class="text-[11px] tracking-wide font-semibold text-gray-500 mb-2">
          ЗОВИУР / ГОМДОЛ
        </div> -->

        <div v-if="hasComplaints" class="space-y-2">
          <div
            v-for="(c, i) in complaints"
            :key="i"
            class="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <span class="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span class="text-xs text-gray-800">{{ c }}</span>
          </div>
        </div>
<!-- 
        <div v-else class="text-xs text-gray-400">
          Зовиур өгөгдөөгүй
        </div> -->
      </div>
    </div>

    <!-- Optional compact summary mode (if you still want it somewhere) -->
    <div
      v-else
      class="px-4 py-3 text-xs text-gray-600 flex items-center justify-between"
    >
      <!-- <span>
        Харшил: {{ allergies.length || "0" }}
        · Эрсдэл: {{ risks.length || "0" }}
        · Зовиур: {{ complaints.length || "0" }}
      </span> -->
      <span class="text-red-600 font-medium">Дэлгэрэнгүй</span>
    </div>
  </div>
</template>
