const mockPatients = [
  {
    id: 'P-001',
    cardNumber: '2024-001',
    age: 32,
    firstName: 'Анударь',
    lastName: 'Бат-Эрдэнэ',
    phone: '99112233',
    avatar: '',
  },
  {
    id: 'P-002',
    cardNumber: '2024-002',
    age: 41,
    firstName: 'Мөнх-Эрдэнэ',
    lastName: 'Сарангэрэл',
    phone: '88110022',
    avatar: '',
  },
  {
    id: 'P-003',
    cardNumber: '2024-003',
    age: 29,
    firstName: 'Сувдмаа',
    lastName: 'Ганчимэг',
    phone: '99003344',
    avatar: '',
  },
  {
    id: 'P-004',
    cardNumber: '2024-004',
    age: 36,
    firstName: 'Тэмүүлэн',
    lastName: 'Энхжин',
    phone: '95117788',
    avatar: '',
  },
  {
    id: 'P-005',
    cardNumber: '2024-005',
    age: 24,
    firstName: 'Номин',
    lastName: 'Төрмандах',
    phone: '70112233',
    avatar: '',
  },
]

const normalize = (value = '') => value.toString().toLowerCase()

const matchesQuery = (patient, query) => {
  const q = normalize(query)
  return [
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
  ].some((field) => normalize(field).includes(q))
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
