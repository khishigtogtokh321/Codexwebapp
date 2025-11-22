/**
 * Dental treatment type definitions
 * Used for categorizing and selecting treatment procedures
 */

export const treatmentTypes = [
  // Examination and Consultation
  { id: 'exam', label: 'Үзлэг / Examination', category: 'diagnostic' },
  { id: 'consult', label: 'Зөвлөгөө / Consultation', category: 'diagnostic' },
  { id: 'xray', label: 'Рентген зураг / X-Ray', category: 'diagnostic' },
  { id: 'panoramic', label: 'Панорам зураг / Panoramic X-Ray', category: 'diagnostic' },

  // Preventive Care
  { id: 'cleaning', label: 'Шүд цэвэрлэх / Teeth Cleaning', category: 'preventive' },
  { id: 'scaling', label: 'Шүдний чулуу авах / Scaling', category: 'preventive' },
  { id: 'fluoride', label: 'Фторжуулалт / Fluoride Treatment', category: 'preventive' },
  { id: 'sealant', label: 'Фиссур битүүмжлэх / Sealant', category: 'preventive' },

  // Restorative
  { id: 'filling', label: 'Шүдломбодох / Filling', category: 'restorative' },
  { id: 'composite', label: 'Композит / Composite Filling', category: 'restorative' },
  { id: 'amalgam', label: 'Амальгам / Amalgam Filling', category: 'restorative' },
  { id: 'inlay', label: 'Инлэй / Inlay', category: 'restorative' },
  { id: 'onlay', label: 'Онлэй / Onlay', category: 'restorative' },

  // Endodontics
  { id: 'root-canal', label: 'Сувгийн эмчилгээ / Root Canal', category: 'endodontic' },
  { id: 'pulpotomy', label: 'Пульпотоми / Pulpotomy', category: 'endodontic' },
  { id: 'pulpectomy', label: 'Пульпэктоми / Pulpectomy', category: 'endodontic' },
  { id: 'apico', label: 'Апикотоми / Apicoectomy', category: 'endodontic' },

  // Prosthodontics
  { id: 'crown', label: 'Титэм / Crown', category: 'prosthetic' },
  { id: 'bridge', label: 'Гүүр / Bridge', category: 'prosthetic' },
  { id: 'denture', label: 'Хиймэл шүд / Denture', category: 'prosthetic' },
  { id: 'partial-denture', label: 'Хэсэгчилсэн хиймэл шүд / Partial Denture', category: 'prosthetic' },
  { id: 'implant', label: 'Имплант / Implant', category: 'prosthetic' },
  { id: 'veneer', label: 'Винир / Veneer', category: 'prosthetic' },

  // Oral Surgery
  { id: 'extraction', label: 'Шүд авах / Extraction', category: 'surgery' },
  { id: 'surgical-extraction', label: 'Мэс заслын аргаар шүд авах / Surgical Extraction', category: 'surgery' },
  { id: 'wisdom-tooth', label: 'Ухааны шүд авах / Wisdom Tooth Removal', category: 'surgery' },
  { id: 'bone-graft', label: 'Ясны шилжүүлэлт / Bone Graft', category: 'surgery' },
  { id: 'sinus-lift', label: 'Синус өргөх / Sinus Lift', category: 'surgery' },

  // Periodontics
  { id: 'perio-therapy', label: 'Шүдний махбодын эмчилгээ / Periodontal Therapy', category: 'periodontal' },
  { id: 'deep-cleaning', label: 'Гүн цэвэрлэгээ / Deep Cleaning', category: 'periodontal' },
  { id: 'gum-surgery', label: 'Буйлны мэс засал / Gum Surgery', category: 'periodontal' },
  { id: 'graft', label: 'Буйлны шилжүүлэлт / Gum Graft', category: 'periodontal' },

  // Orthodontics
  { id: 'braces', label: 'Шүдний хаалт / Braces', category: 'orthodontic' },
  { id: 'retainer', label: 'Хадгалагч / Retainer', category: 'orthodontic' },
  { id: 'aligners', label: 'Тунгалагцуур / Clear Aligners', category: 'orthodontic' },

  // Cosmetic
  { id: 'whitening', label: 'Шүд цайруулах / Teeth Whitening', category: 'cosmetic' },
  { id: 'bonding', label: 'Бондинг / Bonding', category: 'cosmetic' },
  { id: 'reshaping', label: 'Хэлбэржүүлэх / Reshaping', category: 'cosmetic' },

  // Emergency
  { id: 'emergency', label: 'Яаралтай тусламж / Emergency Treatment', category: 'emergency' },
  { id: 'pain-relief', label: 'Өвдөлт намдаах / Pain Relief', category: 'emergency' },

  // Other
  { id: 'base', label: 'Үндсэн эмчилгээ / Base Treatment', category: 'other' },
  { id: 'other', label: 'Бусад / Other', category: 'other' },
]

// Helper function to get treatment by ID
export const getTreatmentById = (id) => {
  return treatmentTypes.find(t => t.id === id)
}

// Helper function to get treatments by category
export const getTreatmentsByCategory = (category) => {
  return treatmentTypes.filter(t => t.category === category)
}

// Treatment categories
export const treatmentCategories = [
  { id: 'diagnostic', label: 'Оношлогоо / Diagnostic' },
  { id: 'preventive', label: 'Урьдчилан сэргийлэх / Preventive' },
  { id: 'restorative', label: 'Сэргээх / Restorative' },
  { id: 'endodontic', label: 'Эндодонтик / Endodontic' },
  { id: 'prosthetic', label: 'Хиймэл шүд / Prosthetic' },
  { id: 'surgery', label: 'Мэс засал / Surgery' },
  { id: 'periodontal', label: 'Шүдний махбод / Periodontal' },
  { id: 'orthodontic', label: 'Ортодонтик / Orthodontic' },
  { id: 'cosmetic', label: 'Гоо сайхан / Cosmetic' },
  { id: 'emergency', label: 'Яаралтай / Emergency' },
  { id: 'other', label: 'Бусад / Other' },
]

export default treatmentTypes
