import { defineStore } from 'pinia'

const RECENT_KEY = 'recentPatients'
const CURRENT_PATIENT_KEY = 'currentPatient'
const MAX_RECENT = 6

const loadFromStorage = (key) => {
    try {
        const stored = window.localStorage.getItem(key)
        return stored ? JSON.parse(stored) : null
    } catch (error) {
        console.error(`Error loading ${key} from storage:`, error)
        return null
    }
}

const saveToStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error(`Error saving ${key} to storage:`, error)
    }
}

export const usePatientStore = defineStore('patient', {
    state: () => ({
        patients: [],
        recentPatients: loadFromStorage(RECENT_KEY) || [],
        currentPatient: loadFromStorage(CURRENT_PATIENT_KEY),
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
            saveToStorage(CURRENT_PATIENT_KEY, patient)
            if (patient) {
                this.addRecentPatient(patient)
            }
        },

        addRecentPatient(patient) {
            if (!patient || !patient.id) return

            // Normalize patient data for recent list if needed
            const normalized = {
                id: patient.id,
                displayName: patient.displayName || patient.name || [patient.lastName, patient.firstName].filter(Boolean).join(' ').trim(),
                cardNo: patient.cardNo || patient.cardNumber || '-',
                phone: patient.phone || '-',
                rd: patient.rd || '-',
                avatar: patient.avatar || '',
            }

            const deduped = this.recentPatients.filter((item) => item.id !== normalized.id)
            this.recentPatients = [normalized, ...deduped].slice(0, MAX_RECENT)
            saveToStorage(RECENT_KEY, this.recentPatients)
        },

        clearCurrentPatient() {
            this.currentPatient = null
            window.localStorage.removeItem(CURRENT_PATIENT_KEY)
        },

        clearError() {
            this.error = null
        }
    }
})
