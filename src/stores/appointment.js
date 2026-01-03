import { defineStore } from 'pinia'
import { useDoctorStore } from './doctor'

export const useAppointmentStore = defineStore('appointment', {
    state: () => ({
        appointments: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchAppointments() {
            this.loading = true
            this.error = null
            try {
                // Mocking an API call
                await new Promise((resolve) => setTimeout(resolve, 300))

                // Initial mock data if empty
                if (this.appointments.length === 0) {
                    const doctorStore = useDoctorStore()
                    const me = doctorStore.me || { id: 'dr-001' }

                    const today = new Date()
                    const formatDate = (date, hours, minutes) => {
                        const d = new Date(date)
                        d.setHours(hours, minutes, 0, 0)
                        return d.toISOString()
                    }

                    this.appointments = [
                        {
                            id: 'apt-001',
                            patientId: 'P-001',
                            patientName: 'Анударь Бат-Эрдэнэ',
                            doctorId: me.id,
                            startAt: formatDate(today, 9, 0),
                            duration: 60,
                            reason: 'Шүдний цэвэрлэгээ',
                            status: 'confirmed',
                        },
                        {
                            id: 'apt-002',
                            patientId: 'P-002',
                            patientName: 'Мөнх-Эрдэнэ Сарангэрэл',
                            doctorId: me.id,
                            startAt: formatDate(today, 10, 30),
                            duration: 30,
                            reason: 'Үзлэг',
                            status: 'planned',
                        },
                        {
                            id: 'apt-003',
                            patientId: 'P-003',
                            patientName: 'Сувдмаа Ганчимэг',
                            doctorId: me.id,
                            startAt: formatDate(today, 14, 0),
                            duration: 90,
                            reason: 'Сувгийн эмчилгээ',
                            status: 'planned',
                        },
                    ]
                }
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        checkConflict(doctorId, startAt, duration, excludeId = null) {
            const start = new Date(startAt).getTime()
            const end = start + duration * 60000

            return this.appointments.some((apt) => {
                if (apt.id === excludeId) return false
                if (apt.doctorId !== doctorId) return false
                if (apt.status === 'cancelled') return false

                const aptStart = new Date(apt.startAt).getTime()
                const aptEnd = aptStart + apt.duration * 60000

                // Overlap logic: (StartA < EndB) and (EndA > StartB)
                return start < aptEnd && end > aptStart
            })
        },

        async addAppointment(payload) {
            if (this.checkConflict(payload.doctorId, payload.startAt, payload.duration)) {
                throw new Error('Уучлаарай, энэ цагт өөр цаг товлогдсон байна.')
            }

            this.loading = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))
                const newApt = {
                    id: `apt-${Math.random().toString(36).substr(2, 9)}`,
                    ...payload,
                    status: payload.status || 'planned',
                }
                this.appointments.push(newApt)
                return newApt
            } finally {
                this.loading = false
            }
        },

        async updateAppointment(id, updates) {
            const index = this.appointments.findIndex((a) => a.id === id)
            if (index === -1) return

            const current = this.appointments[index]
            const merged = { ...current, ...updates }

            if (updates.startAt || updates.duration) {
                if (this.checkConflict(merged.doctorId, merged.startAt, merged.duration, id)) {
                    throw new Error('Уучлаарай, шинээр товлох цаг өөр цагтай давхцаж байна.')
                }
            }

            this.loading = true
            try {
                await new Promise((resolve) => setTimeout(resolve, 500))
                this.appointments[index] = merged
            } finally {
                this.loading = false
            }
        },

        async cancelAppointment(id) {
            await this.updateAppointment(id, { status: 'cancelled' })
        },

        async rescheduleAppointment(id, newStartAt) {
            await this.updateAppointment(id, { startAt: newStartAt })
        },
    },
})
