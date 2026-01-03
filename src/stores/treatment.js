import { defineStore } from 'pinia'

export const useTreatmentStore = defineStore('treatment', {
    state: () => ({
        treatments: [],
        currentTreatment: null,
        loading: false,
        error: null
    }),

    getters: {
        getTreatmentById: (state) => (id) => {
            return state.treatments.find(treatment => treatment.id === id)
        },

        getTreatmentsByPatientId: (state) => (patientId) => {
            return state.treatments.filter(treatment => treatment.patientId === patientId)
        },

        totalTreatments: (state) => state.treatments.length,

        hasTreatments: (state) => state.treatments.length > 0
    },

    actions: {
        async fetchTreatments() {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/treatments')
                // this.treatments = await response.json()
                this.treatments = []
            } catch (error) {
                this.error = error.message
                console.error('Error fetching treatments:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchTreatmentsByPatientId(patientId) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/patients/${patientId}/treatments`)
                // const treatments = await response.json()
                const treatments = this.getTreatmentsByPatientId(patientId)
                return treatments
            } catch (error) {
                this.error = error.message
                console.error('Error fetching treatments:', error)
                return []
            } finally {
                this.loading = false
            }
        },

        async fetchTreatmentById(id) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/treatments/${id}`)
                // this.currentTreatment = await response.json()
                this.currentTreatment = this.getTreatmentById(id)
            } catch (error) {
                this.error = error.message
                console.error('Error fetching treatment:', error)
            } finally {
                this.loading = false
            }
        },

        async addTreatment(treatment) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/treatments', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(treatment)
                // })
                // const newTreatment = await response.json()
                // this.treatments.push(newTreatment)
                this.treatments.push(treatment)
            } catch (error) {
                this.error = error.message
                console.error('Error adding treatment:', error)
            } finally {
                this.loading = false
            }
        },

        async updateTreatment(id, updates) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/treatments/${id}`, {
                //   method: 'PUT',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(updates)
                // })
                // const updatedTreatment = await response.json()
                const index = this.treatments.findIndex(t => t.id === id)
                if (index !== -1) {
                    this.treatments[index] = { ...this.treatments[index], ...updates }
                }
            } catch (error) {
                this.error = error.message
                console.error('Error updating treatment:', error)
            } finally {
                this.loading = false
            }
        },

        async deleteTreatment(id) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // await fetch(`/api/treatments/${id}`, { method: 'DELETE' })
                this.treatments = this.treatments.filter(t => t.id !== id)
            } catch (error) {
                this.error = error.message
                console.error('Error deleting treatment:', error)
            } finally {
                this.loading = false
            }
        },

        setCurrentTreatment(treatment) {
            this.currentTreatment = treatment
        },

        clearCurrentTreatment() {
            this.currentTreatment = null
        },

        clearError() {
            this.error = null
        }
    }
})
