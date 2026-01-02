<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'

defineProps({
    isPortrait: {
        type: Boolean,
        default: false,
    },
})

const planItems = ref([
    {
        id: 1,
        date: '2025-11-23',
        title: 'Ирэхтэй санал болгосон эмчилгээний төлөвлөгөө',
        status: 'saved',
        doctor: '',
        note: '',
    },
    {
        id: 2,
        date: '2025-12-06',
        title: 'Санал болгосон эмчилгээний төлөвлөгөө',
        status: 'saved',
        doctor: '',
        note: '',
    },
    {
        id: 3,
        date: '2025-12-15',
        title: 'Санал болгосон эмчилгээний төлөвлөгөө',
        status: 'saved',
        doctor: '',
        note: '',
    },
])

const statusClass = (status) => {
    if (status === 'saved') return 'badge-soft badge-soft--muted'
    return 'badge-soft'
}

const showEditModal = ref(false)
const activePlanId = ref(null)
const showUndo = ref(false)
const undoState = ref(null)
let undoTimer
const editForm = reactive({
    date: '',
    title: '',
    note: '',
})

const openEdit = (plan) => {
    activePlanId.value = plan.id
    editForm.date = plan.date
    editForm.title = plan.title
    editForm.note = plan.note || ''
    showEditModal.value = true
}

const closeEdit = () => {
    showEditModal.value = false
    activePlanId.value = null
}

const handleSave = () => {
    const index = planItems.value.findIndex((plan) => plan.id === activePlanId.value)
    if (index === -1) {
        closeEdit()
        return
    }
    planItems.value[index] = {
        ...planItems.value[index],
        date: editForm.date,
        title: editForm.title,
        note: editForm.note,
    }
    closeEdit()
}

const handleDelete = () => {
    const index = planItems.value.findIndex((plan) => plan.id === activePlanId.value)
    if (index === -1) {
        closeEdit()
        return
    }
    const [removed] = planItems.value.splice(index, 1)
    undoState.value = { item: removed, index }
    showUndo.value = true
    if (undoTimer) clearTimeout(undoTimer)
    undoTimer = setTimeout(() => {
        showUndo.value = false
        undoState.value = null
    }, 6000)
    closeEdit()
}

const handleUndo = () => {
    if (!undoState.value) return
    const insertIndex = Math.min(Math.max(undoState.value.index, 0), planItems.value.length)
    planItems.value.splice(insertIndex, 0, undoState.value.item)
    showUndo.value = false
    undoState.value = null
    if (undoTimer) clearTimeout(undoTimer)
}

onBeforeUnmount(() => {
    if (undoTimer) clearTimeout(undoTimer)
})
</script>

<template>
    <div :class="['flex min-h-0 min-w-0 flex-col gap-4', isPortrait ? '' : 'flex-1']">
        <div v-if="showUndo" class="ui-toast">
            <div class="ui-toast__text">
                <span class="ui-toast__label">Төлөвлөгөө устгагдлаа</span>
                <span class="ui-toast__title">{{ undoState.item.title }}</span>
            </div>
            <div class="ui-toast__actions">
                <button type="button" class="ui-btn ui-btn--ghost" @click="handleUndo">Буцаах</button>
            </div>
        </div>
        <div :class="['ui-table-shell', 'ui-table-shell--shadowed', isPortrait ? '' : 'min-h-0 flex-1']">
            <div v-if="!isPortrait" class="ui-table-header plan-table-grid">
                <div class="min-w-0">Огноо</div>
                <div class="min-w-0">Гарчиг</div>
                <div class="min-w-0 text-center">Статус</div>
                <div class="min-w-0 text-right">Эмч</div>
                <div class="min-w-0 text-right">Үйлдэл</div>
            </div>
            <div :class="['ui-table-scroll', isPortrait ? 'pb-24 flex-none overflow-visible' : '']">
                <template v-if="isPortrait">
                    <div v-for="plan in planItems" :key="plan.id" class="treatment-card">
                        <div class="treatment-card__row">
                            <div class="treatment-meta">
                                <span class="treatment-meta__date">{{ plan.date }}</span>
                            </div>
                            <span :class="statusClass(plan.status)">Хадгалсан</span>
                        </div>
                        <div class="treatment-card__body">
                            <div class="treatment-body__desc">{{ plan.title }}</div>
                        </div>
                        <div class="ui-table-actions">
                            <button type="button" class="ui-btn ui-btn--secondary">Хадгалах</button>
                            <button type="button" class="ui-btn ui-btn--ghost" @click="openEdit(plan)">Edit</button>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="plan in planItems" :key="plan.id" class="ui-table-row plan-table-grid">
                        <div class="min-w-0 font-semibold text-slate-900">{{ plan.date }}</div>
                        <div class="min-w-0 font-medium text-slate-900">{{ plan.title }}</div>
                        <div class="min-w-0 text-center">
                            <span :class="statusClass(plan.status)">Хадгалсан</span>
                        </div>
                        <div class="min-w-0 text-right text-slate-700">{{ plan.doctor }}</div>
                        <div class="min-w-0 ui-table-actions">
                            <button type="button" class="ui-btn ui-btn--secondary">Хадгалах</button>
                            <button type="button" class="ui-btn ui-btn--ghost" @click="openEdit(plan)">Edit</button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <div v-if="showEditModal" class="ui-modal" role="dialog" aria-modal="true" aria-labelledby="plan-modal-title"
        @click.self="closeEdit">
        <div class="ui-modal__panel">
            <div class="ui-modal__header">
                <h2 id="plan-modal-title" class="ui-modal__title">Эмчилгээний төлөвлөгөө</h2>
                <button type="button" class="ui-modal__close" aria-label="Хаах" @click="closeEdit">✕</button>
            </div>
            <div class="ui-modal__body">
                <div class="ui-form">
                    <div class="ui-field">
                        <label class="ui-field__label" for="plan-date">Огноо</label>
                        <input id="plan-date" v-model="editForm.date" type="text" class="ui-field__input" />
                    </div>
                    <div class="ui-field">
                        <label class="ui-field__label" for="plan-title">Гарчиг</label>
                        <input id="plan-title" v-model="editForm.title" type="text" class="ui-field__input" />
                    </div>
                    <div class="ui-field ui-field--textarea">
                        <label class="ui-field__label" for="plan-note">Тэмдэглэл</label>
                        <textarea id="plan-note" v-model="editForm.note" class="ui-field__textarea"
                            rows="6"></textarea>
                    </div>
                </div>
            </div>
            <div class="ui-modal__footer">
                <button type="button" class="ui-btn ui-btn--secondary" @click="handleDelete">Устгах</button>
                <div class="ui-modal__actions">
                    <button type="button" class="ui-btn ui-btn--primary" @click="handleSave">Тийм</button>
                    <button type="button" class="ui-btn ui-btn--secondary" @click="closeEdit">Цуцлах</button>
                </div>
            </div>
        </div>
    </div>
</template>
