/**
 * Dental treatment type definitions with toothRequired flag for workflow filtering
 */

export const treatmentTypes = [
  // General (no tooth)
  { id: 'exam', label: 'Ерөнхий үзлэг', category: 'diagnostic', toothRequired: false },
  { id: 'consult', label: 'Зөвлөгөө', category: 'diagnostic', toothRequired: false },
  { id: 'xray', label: 'Рентген', category: 'diagnostic', toothRequired: false },
  { id: 'panoramic', label: 'Панорам рентген', category: 'diagnostic', toothRequired: false },

  // Preventive (tooth-based)
  { id: 'cleaning', label: 'Шүд цэвэрлэгээ', category: 'preventive', toothRequired: true },
  { id: 'scaling', label: 'Усалгаатай цэвэрлэгээ', category: 'preventive', toothRequired: true },
  { id: 'fluoride', label: 'Фтор түрхлэг', category: 'preventive', toothRequired: true },
  { id: 'prophy-fl', label: 'Prophy/Fl', category: 'preventive', toothRequired: true },
  { id: 'sealant', label: 'Лак/битүүмжлэл', category: 'preventive', toothRequired: true },

  // Restorative
  { id: 'filling', label: 'Ломбдолт', category: 'restorative', toothRequired: true },
  { id: 'composite', label: 'Композит ломбо', category: 'restorative', toothRequired: true },
  { id: 'amalgam', label: 'Амальгам ломбо', category: 'restorative', toothRequired: true },
  { id: 'build-up', label: 'Build up/Pins', category: 'restorative', toothRequired: true },
  { id: 'inlay', label: 'Инлей', category: 'restorative', toothRequired: true },
  { id: 'onlay', label: 'Онлей', category: 'restorative', toothRequired: true },
  { id: 'inlay-onlay', label: 'Inlay/Onlay', category: 'restorative', toothRequired: true },

  // Endodontic
  { id: 'root-canal', label: 'Суваг эмчилгээ', category: 'endodontic', toothRequired: true },
  { id: 'pulpotomy', label: 'Пульпотом', category: 'endodontic', toothRequired: true },
  { id: 'pulpectomy', label: 'Пульпектом', category: 'endodontic', toothRequired: true },
  { id: 'apico', label: 'Апикэктоми', category: 'endodontic', toothRequired: true },

  // Prosthetic
  { id: 'crown', label: 'Титэм', category: 'prosthetic', toothRequired: true },
  { id: 'bridge', label: 'Гүүрэн протез', category: 'prosthetic', toothRequired: true },
  { id: 'bridge-abutment', label: 'Bridge Abutment', category: 'prosthetic', toothRequired: true },
  { id: 'bridge-pontic', label: 'Bridge Pontic', category: 'prosthetic', toothRequired: true },
  { id: 'denture', label: 'Салдаг хиймэл шүд', category: 'prosthetic', toothRequired: true },
  { id: 'partial-denture', label: 'Хэсгийн салдаг хиймэл', category: 'prosthetic', toothRequired: true },
  { id: 'implant', label: 'Имплант', category: 'prosthetic', toothRequired: true },
  { id: 'veneer', label: 'Винир', category: 'prosthetic', toothRequired: true },

  // Surgery
  { id: 'extraction', label: 'Шүд авах', category: 'surgery', toothRequired: true },
  { id: 'surgical-extraction', label: 'Мэс заслын авах', category: 'surgery', toothRequired: true },
  { id: 'wisdom-tooth', label: 'Агт араа авах', category: 'surgery', toothRequired: true },
  { id: 'bone-graft', label: 'Ясны суулгац', category: 'surgery', toothRequired: true },
  { id: 'sinus-lift', label: 'Синус лифт', category: 'surgery', toothRequired: true },

  // Periodontal
  { id: 'perio-therapy', label: 'Буйлны эмчилгээ', category: 'periodontal', toothRequired: true },
  { id: 'deep-cleaning', label: 'Гүн цэвэрлэгээ', category: 'periodontal', toothRequired: true },
  { id: 'period-srp', label: 'Period/SRP', category: 'periodontal', toothRequired: true },
  { id: 'gum-surgery', label: 'Буйлны мэс засал', category: 'periodontal', toothRequired: true },
  { id: 'graft', label: 'Буйл шилжүүлэн суулгалт', category: 'periodontal', toothRequired: true },

  // Orthodontic
  { id: 'braces', label: 'Шүдний аппарат', category: 'orthodontic', toothRequired: true },
  { id: 'retainer', label: 'Ретейнер тохируулга', category: 'orthodontic', toothRequired: true },
  { id: 'aligners', label: 'Илэнгэр/алайнэр', category: 'orthodontic', toothRequired: true },

  // Cosmetic
  { id: 'whitening', label: 'Цайруулалт', category: 'cosmetic', toothRequired: true },
  { id: 'bonding', label: 'Бондинг', category: 'cosmetic', toothRequired: true },
  { id: 'reshaping', label: 'Хэлбэр засах', category: 'cosmetic', toothRequired: true },

  // Emergency
  { id: 'emergency', label: 'Яаралтай эмчилгээ', category: 'emergency', toothRequired: true },
  { id: 'pain-relief', label: 'Өвчин намдаалт', category: 'emergency', toothRequired: true },

  // Other
  { id: 'base', label: 'Суурь эмчилгээ', category: 'other', toothRequired: true },
  { id: 'other', label: 'Бусад', category: 'other', toothRequired: true },
]

export const getTreatmentById = (id) => treatmentTypes.find((t) => t.id === id)

export const getTreatmentsByCategory = (category) => treatmentTypes.filter((t) => t.category === category)

export const treatmentCategories = [
  { id: 'diagnostic', label: 'Оношилгоо' },
  { id: 'preventive', label: 'Урьдчилан сэргийлэх' },
  { id: 'restorative', label: 'Сэргээх' },
  { id: 'endodontic', label: 'Эндодонт' },
  { id: 'prosthetic', label: 'Протез' },
  { id: 'surgery', label: 'Мэс засал' },
  { id: 'periodontal', label: 'Буйл' },
  { id: 'orthodontic', label: 'Шүдний гажиг' },
  { id: 'cosmetic', label: 'Гоо сайхан' },
  { id: 'emergency', label: 'Яаралтай' },
  { id: 'other', label: 'Бусад' },
]

export default treatmentTypes
