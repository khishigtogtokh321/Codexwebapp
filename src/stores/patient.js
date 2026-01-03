import { defineStore } from 'pinia'

export const usePatientStore = defineStore('patient', {
    state: () => ({
        patients: [],
        currentPatient: null,
        loading: false,
        error: null
    }),

    getters: {
        getPatientById: (state) => (id) => {
            return state.patients.find(patient => patient.id === id)
        },

        totalPatients: (state) => state.patients.length,

        hasPatients: (state) => state.patients.length > 0
    },

    actions: {
        async fetchPatients() {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/patients')
                // this.patients = await response.json()
                this.patients = []
            } catch (error) {
                this.error = error.message
                console.error('Error fetching patients:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchPatientById(id) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/patients/${id}`)
                // this.currentPatient = await response.json()
                this.currentPatient = this.getPatientById(id)
            } catch (error) {
                this.error = error.message
                console.error('Error fetching patient:', error)
            } finally {
                this.loading = false
            }
        },

        async addPatient(patient) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch('/api/patients', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(patient)
                // })
                // const newPatient = await response.json()
                // this.patients.push(newPatient)
                this.patients.push(patient)
            } catch (error) {
                this.error = error.message
                console.error('Error adding patient:', error)
            } finally {
                this.loading = false
            }
        },

        async updatePatient(id, updates) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // const response = await fetch(`/api/patients/${id}`, {
                //   method: 'PUT',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(updates)
                // })
                // const updatedPatient = await response.json()
                const index = this.patients.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.patients[index] = { ...this.patients[index], ...updates }
                }
            } catch (error) {
                this.error = error.message
                console.error('Error updating patient:', error)
            } finally {
                this.loading = false
            }
        },

        async deletePatient(id) {
            this.loading = true
            this.error = null
            try {
                // TODO: Replace with actual API call
                // await fetch(`/api/patients/${id}`, { method: 'DELETE' })
                this.patients = this.patients.filter(p => p.id !== id)
            } catch (error) {
                this.error = error.message
                console.error('Error deleting patient:', error)
            } finally {
                this.loading = false
            }
        },

        setCurrentPatient(patient) {
            this.currentPatient = patient
        },

        clearCurrentPatient() {
            this.currentPatient = null
        },

        clearError() {
            this.error = null
        }
    }
})
