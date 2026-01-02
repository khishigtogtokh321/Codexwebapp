<script setup>
const props = defineProps({
    treatments: {
        type: Array,
        default: () => [],
    },
    isPortrait: {
        type: Boolean,
        default: false,
    },
})

const statusClass = (status) => {
    if (status === 'done') return 'badge-soft badge-soft--success'
    if (status === 'planned') return 'badge-soft badge-soft--muted'
    return 'badge-soft badge-soft--warning'
}
</script>

<template>
    <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <div class="ui-table-shell min-h-0 flex-1">
            <div v-if="!isPortrait" class="ui-table-header treatment-table-grid">
                <div class="min-w-0">Огноо</div>
                <div class="min-w-0 text-center">Шүд</div>
                <div class="min-w-0 text-center">Гадаргуу</div>
                <div class="min-w-0">Код</div>
                <div class="min-w-0">Тайлбар</div>
                <div class="min-w-0 text-center">Үнэ</div>
                <div class="min-w-0 text-center">Статус</div>
                <div class="min-w-0 text-right">Эмч</div>
            </div>
            <div :class="['ui-table-scroll', isPortrait ? 'pb-24' : '']">
                <template v-if="isPortrait">
                    <div v-for="treatment in props.treatments" :key="treatment.id" class="treatment-card">
                        <div class="treatment-card__row">
                            <div class="treatment-meta">
                                <span class="treatment-meta__date">{{ treatment.date }}</span>
                                <span class="badge-soft">{{ treatment.tooth }}</span>
                                <span class="badge-soft badge-soft--muted">{{ treatment.surface }}</span>
                            </div>
                            <span :class="statusClass(treatment.status)">
                                {{ treatment.status === 'done' ? 'Дууссан' : 'Төлөвлөсөн' }}
                            </span>
                        </div>
                        <div class="treatment-card__body">
                            <div class="treatment-body__code">{{ treatment.code }}</div>
                            <div class="treatment-body__desc">{{ treatment.description }}</div>
                        </div>
                        <div class="treatment-card__footer">
                            <div class="treatment-price">{{ treatment.price }}</div>
                            <div class="treatment-doctor">{{ treatment.doctor }}</div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="treatment in props.treatments" :key="treatment.id"
                        class="ui-table-row treatment-table-grid">
                        <div class="min-w-0 font-semibold text-slate-900">{{ treatment.date }}</div>
                        <div class="min-w-0 text-center">
                            <span class="badge-soft">{{ treatment.tooth }}</span>
                        </div>
                        <div class="min-w-0 text-center">
                            <span class="badge-soft badge-soft--muted">{{ treatment.surface }}</span>
                        </div>
                        <div class="min-w-0 text-blue-600">{{ treatment.code }}</div>
                        <div class="min-w-0 font-medium text-slate-900">{{ treatment.description }}</div>
                        <div class="min-w-0 text-center font-semibold text-slate-900">{{ treatment.price }}</div>
                        <div class="min-w-0 text-center">
                            <span :class="statusClass(treatment.status)">{{
                                treatment.status === 'done' ? 'Дууссан' : 'Төлөвлөсөн'
                            }}</span>
                        </div>
                        <div class="min-w-0 text-right text-slate-700">{{ treatment.doctor }}</div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
