import { mockPatients } from '@/data/mockData'

const normalize = (value = '') => value.toString().toLowerCase()

const matchesQuery = (patient, query) => {
  const q = normalize(query)
  return [
    patient.name,
    patient.firstName,
    patient.lastName,
    patient.phone,
    patient.cardNumber,
    patient.cardNo,
    patient.card,
    patient.patientId,
    patient.id,
    patient.rd,
    patient.registerNo,
  ].some((field) => normalize(field || '').includes(q))
}

const searchPatients = (query) =>
  new Promise((resolve) => {
    const trimmed = (query || '').trim()
    if (trimmed.length < 1) {
      resolve({ success: true, data: [] })
      return
    }

    window.setTimeout(() => {
      const data = mockPatients.filter((patient) => matchesQuery(patient, trimmed))
      resolve({ success: true, data })
    }, 240)
  })

const getDefaultPatient = () => {
  const first = mockPatients[0]
  return first ? { ...first } : null
}

export default {
  searchPatients,
  getDefaultPatient,
}
