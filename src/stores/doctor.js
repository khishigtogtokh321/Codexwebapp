import { defineStore } from 'pinia'

export const useDoctorStore = defineStore('doctor', {
    state: () => ({
        me: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchMe() {
            this.loading = true
            this.error = null
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 300))

                if (!this.me) {
                    this.me = {
                        id: 'dr-001',
                        name: 'Dr. D',
                        email: 'dr.d@ashidsoft.mn',
                        phone: '9911-2233',
                        specialization: 'Шүдний их эмч',
                        workingHoursStart: '09:00',
                        workingHoursEnd: '18:00',
                        avatar: '' // Placeholder
                    }
                }
            } catch (error) {
                this.error = error.message
                console.error('Error fetching doctor profile:', error)
            } finally {
                this.loading = false
            }
        },

        async updateMe(updates) {
            this.loading = true
            this.error = null
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 600))

                this.me = { ...this.me, ...updates }
            } catch (error) {
                this.error = error.message
                console.error('Error updating doctor profile:', error)
            } finally {
                this.loading = false
            }
        }
    }
})
