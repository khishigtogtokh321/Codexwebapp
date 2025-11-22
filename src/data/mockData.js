/**
 * Mock data for development and testing
 * Includes patient information, treatment history, and tooth statuses
 */

// Sample patient data
export const mockPatient = {
  id: '2024-00123',
  name: 'Б. Батбаяр',
  age: 32,
  gender: 'male',
  phone: '99112233',
  email: 'batbayar@example.com',
  address: 'Улаанбаатар, Баянгол дүүрэг',
  avatar: 'BB', // Initials for avatar
  registrationDate: '2023-05-15',
  lastVisit: '2024-11-20',
}

// Sample treatment history
export const mockTreatmentHistory = [
  {
    id: 1,
    date: '2024-11-20',
    tooth: '#21',
    surface: 'M, O',
    diagnosis: 'K02.1 - Дентины цоорлого',
    treatmentType: 'Композит',
    doctor: 'Б. Болд',
    price: '45,000₮',
    status: 'done',
    notes: 'Композит материалаар дүүргэсэн',
  },
  {
    id: 2,
    date: '2024-11-18',
    tooth: '#16',
    surface: 'O, D',
    diagnosis: 'K04.0 - Пульпит',
    treatmentType: 'Сувгийн эмчилгээ',
    doctor: 'Д. Дорж',
    price: '120,000₮',
    status: 'done',
    notes: 'Сувгийн эмчилгээний 1 дэх сесс',
  },
  {
    id: 3,
    date: '2024-11-15',
    tooth: '#22',
    surface: 'M',
    diagnosis: 'K02.0 - Эмалийн цоорлого',
    treatmentType: 'Шүдломбодох',
    doctor: 'Б. Болд',
    price: '35,000₮',
    status: 'done',
    notes: '',
  },
  {
    id: 4,
    date: '2024-11-10',
    tooth: '#36',
    surface: 'M, O, D',
    diagnosis: 'K02.1 - Дентины цоорлого',
    treatmentType: 'Композит',
    doctor: 'С. Сарнай',
    price: '55,000₮',
    status: 'done',
    notes: 'Том хэмжээний цоорлого',
  },
  {
    id: 5,
    date: '2024-11-05',
    tooth: '#46',
    surface: 'O',
    diagnosis: 'K02.1 - Дентины цоорлого',
    treatmentType: 'Композит',
    doctor: 'Б. Болд',
    price: '40,000₮',
    status: 'planned',
    notes: 'Дараагийн уулзалтанд хийх',
  },
  {
    id: 6,
    date: '2024-10-28',
    tooth: '#26',
    surface: 'Missing',
    diagnosis: 'K08.1 - Шүд алдах',
    treatmentType: 'Шүд авах',
    doctor: 'Д. Дорж',
    price: '25,000₮',
    status: 'done',
    notes: 'Эмчлэх боломжгүй шүд',
  },
  {
    id: 7,
    date: '2024-10-20',
    tooth: '#11',
    surface: 'Labial',
    diagnosis: 'K07.3 - Шүдний байрлалын эмгэг',
    treatmentType: 'Винир',
    doctor: 'С. Сарнай',
    price: '250,000₮',
    status: 'done',
    notes: 'Керамик винир',
  },
  {
    id: 8,
    date: '2024-10-15',
    tooth: '#31',
    surface: 'L, B',
    diagnosis: 'K05.1 - Архаг буйлны үрэвсэл',
    treatmentType: 'Гүн цэвэрлэгээ',
    doctor: 'Б. Болд',
    price: '65,000₮',
    status: 'done',
    notes: 'Scaling and root planing',
  },
  {
    id: 9,
    date: '2024-10-01',
    tooth: '#48',
    surface: 'All',
    diagnosis: 'K07.3 - Ухааны шүд',
    treatmentType: 'Мэс заслын аргаар шүд авах',
    doctor: 'Д. Дорж',
    price: '180,000₮',
    status: 'done',
    notes: 'Хэсэгчлэн ургасан ухааны шүд',
  },
  {
    id: 10,
    date: '2024-09-25',
    tooth: 'All',
    surface: 'All',
    diagnosis: 'K05.0 - Буйлны үрэвсэл',
    treatmentType: 'Шүд цэвэрлэх',
    doctor: 'С. Сарнай',
    price: '45,000₮',
    status: 'done',
    notes: 'Жилийн тогтмол цэвэрлэгээ',
  },
]

// Tooth status map (based on FDI notation)
// Status: 'healthy' | 'treated' | 'problem' | 'planned' | 'missing'
export const mockToothStatuses = {
  // Upper right (10s)
  '11': 'treated',
  '12': 'healthy',
  '13': 'healthy',
  '14': 'healthy',
  '15': 'healthy',
  '16': 'treated', // Root canal treatment
  '17': 'healthy',
  '18': 'healthy',

  // Upper left (20s)
  '21': 'treated', // Composite filling
  '22': 'treated', // Filling
  '23': 'healthy',
  '24': 'healthy',
  '25': 'healthy',
  '26': 'missing', // Extracted
  '27': 'healthy',
  '28': 'healthy',

  // Lower left (30s)
  '31': 'treated', // Deep cleaning
  '32': 'healthy',
  '33': 'healthy',
  '34': 'healthy',
  '35': 'healthy',
  '36': 'treated', // Composite filling
  '37': 'healthy',
  '38': 'healthy',

  // Lower right (40s)
  '41': 'healthy',
  '42': 'healthy',
  '43': 'healthy',
  '44': 'healthy',
  '45': 'healthy',
  '46': 'planned', // Planned composite
  '47': 'healthy',
  '48': 'missing', // Wisdom tooth removed
}

// Patient statistics
export const mockPatientStats = {
  totalTreatments: mockTreatmentHistory.length,
  completedTreatments: mockTreatmentHistory.filter(t => t.status === 'done').length,
  plannedTreatments: mockTreatmentHistory.filter(t => t.status === 'planned').length,
  totalTeeth: 32,
  healthyTeeth: Object.values(mockToothStatuses).filter(s => s === 'healthy').length,
  treatedTeeth: Object.values(mockToothStatuses).filter(s => s === 'treated').length,
  problemTeeth: Object.values(mockToothStatuses).filter(s => s === 'problem').length,
  missingTeeth: Object.values(mockToothStatuses).filter(s => s === 'missing').length,
}

// Helper function to get initial tooth statuses (all healthy)
export const getInitialToothStatuses = () => {
  const statuses = {}
  // Generate all tooth numbers using FDI notation
  for (let quadrant = 1; quadrant <= 4; quadrant++) {
    for (let tooth = 1; tooth <= 8; tooth++) {
      const toothNumber = `${quadrant}${tooth}`
      statuses[toothNumber] = 'healthy'
    }
  }
  return statuses
}

// Helper function to get tooth status color
export const getToothStatusColor = (status) => {
  const colors = {
    healthy: 'bg-white border-gray-300',
    treated: 'bg-blue-50 border-blue-300',
    problem: 'bg-red-50 border-red-300',
    planned: 'bg-amber-50 border-amber-300',
    missing: 'bg-gray-100 border-gray-400',
  }
  return colors[status] || colors.healthy
}

// Helper function to get tooth status badge color
export const getToothStatusBadge = (status) => {
  const badges = {
    treated: 'bg-blue-500',
    problem: 'bg-red-500',
    planned: 'bg-amber-500',
  }
  return badges[status] || null
}

export default {
  patient: mockPatient,
  treatments: mockTreatmentHistory,
  toothStatuses: mockToothStatuses,
  stats: mockPatientStats,
  getInitialToothStatuses,
  getToothStatusColor,
  getToothStatusBadge,
}
