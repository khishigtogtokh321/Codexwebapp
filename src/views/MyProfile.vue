<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useDoctorStore } from '@/stores/doctor'
import TopBar from '@/components/layout/TopBar.vue'

const doctorStore = useDoctorStore()
const form = reactive({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    workingHoursStart: '',
    workingHoursEnd: '',
})

const loading = computed(() => doctorStore.loading)
const isDirty = ref(false)

onMounted(async () => {
    if (!doctorStore.me) {
        await doctorStore.fetchMe()
    }
    syncForm()
})

function syncForm() {
    if (doctorStore.me) {
        Object.assign(form, {
            name: doctorStore.me.name || '',
            email: doctorStore.me.email || '',
            phone: doctorStore.me.phone || '',
            specialization: doctorStore.me.specialization || '',
            workingHoursStart: doctorStore.me.workingHoursStart || '09:00',
            workingHoursEnd: doctorStore.me.workingHoursEnd || '18:00',
        })
    }
}

async function handleSave() {
    if (!form.name || !form.email) return // Basic validation
    
    await doctorStore.updateMe({ ...form })
    isDirty.value = false
}

function handleInput() {
    isDirty.value = true
}

const activePatient = ref(null) // TopBar expectation default
</script>

<template>
    <div class="flex h-screen flex-col bg-slate-50 overflow-hidden">
        <!-- Reusing TopBar for consistency -->
        <TopBar :active-patient="activePatient" />

        <main class="flex-1 overflow-auto p-4 lg:p-6">
            <div class="mx-auto w-full max-w-3xl space-y-6">
                
                <h1 class="text-2xl font-bold text-slate-900">Миний мэдээлэл</h1>

                <!-- Profile Card -->
                <div class="card bg-white p-6 shadow-sm rounded-xl">
                    <div class="flex flex-col gap-6 md:flex-row md:items-start">
                        <!-- Left: Avatar -->
                        <div class="flex flex-col items-center gap-3">
                            <div class="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
                                {{ form.name ? form.name.charAt(0).toUpperCase() : 'D' }}
                            </div>
                            <button type="button" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Зураг солих
                            </button>
                        </div>

                        <!-- Right: Inputs -->
                        <div class="grid flex-1 gap-5 md:grid-cols-2">
                            <div class="col-span-1 md:col-span-2">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Овог нэр <span class="text-red-500">*</span></label>
                                <input 
                                    v-model="form.name"
                                    type="text" 
                                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @input="handleInput"
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">И-мэйл <span class="text-red-500">*</span></label>
                                <input 
                                    v-model="form.email"
                                    type="email" 
                                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @input="handleInput"
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Утас</label>
                                <input 
                                    v-model="form.phone"
                                    type="tel" 
                                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @input="handleInput"
                                >
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Мэргэжил</label>
                                <input 
                                    v-model="form.specialization"
                                    type="text" 
                                    class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    @input="handleInput"
                                >
                            </div>
                            
                             <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Ажлын цаг</label>
                                <div class="flex items-center gap-2">
                                    <input 
                                        v-model="form.workingHoursStart"
                                        type="time" 
                                        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        @input="handleInput"
                                    >
                                    <span class="text-slate-400">-</span>
                                    <input 
                                        v-model="form.workingHoursEnd"
                                        type="time" 
                                        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        @input="handleInput"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                        <button 
                            type="button" 
                            class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            :disabled="!isDirty || loading"
                            @click="syncForm"
                        >
                            Болих
                        </button>
                        <button 
                            type="button" 
                            class="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            :disabled="!isDirty || loading"
                            @click="handleSave"
                        >
                            <span v-if="loading">Хадгалж байна...</span>
                            <span v-else>Хадгалах</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
