/**
 * Dental treatment type definitions with canonical fields and backward-compatible flags.
 */

import { applyScopeDefaults, COVERAGE_SCOPE } from '@/utils/treatmentScope'

function createTreatment({
  id,
  code,
  nameFull,
  nameShort,
  category,
  coverageScope,
  defaultPrice = 0,
  isActive = true,
  paintType = 'default',
  toothRequired,
}) {
  const displayName = nameShort || nameFull || id
  const treatment = {
    id,
    code: code || id?.toUpperCase?.() || id,
    nameFull: nameFull || displayName,
    nameShort: nameShort || displayName,
    category,
    defaultPrice,
    isActive,
    paintType,
    coverageScope,
    label: displayName,
    toothRequired,
  }

  return applyScopeDefaults(treatment)
}

const baseTreatmentTypes = [
  // General (no tooth)
  createTreatment({
    id: 'exam',
    code: 'D0120',
    nameFull: 'Ерөнхий үзлэг',
    nameShort: 'Ерөнхий үзлэг',
    category: 'diagnostic',
    coverageScope: COVERAGE_SCOPE.FULL_MOUTH,
    toothRequired: false,
  }),
  createTreatment({
    id: 'consult',
    code: 'D0140',
    nameFull: 'Зөвлөгөө',
    nameShort: 'Зөвлөгөө',
    category: 'diagnostic',
    coverageScope: COVERAGE_SCOPE.FULL_MOUTH,
    toothRequired: false,
  }),
  createTreatment({
    id: 'xray',
    code: 'D0210',
    nameFull: 'Рентген',
    nameShort: 'Рентген',
    category: 'diagnostic',
    coverageScope: COVERAGE_SCOPE.FULL_MOUTH,
    toothRequired: false,
  }),
  createTreatment({
    id: 'panoramic',
    code: 'D0220',
    nameFull: 'Панорам рентген',
    nameShort: 'Панорам рентген',
    category: 'diagnostic',
    coverageScope: COVERAGE_SCOPE.FULL_MOUTH,
    toothRequired: false,
  }),

  // Preventive (tooth-based)
  createTreatment({
    id: 'cleaning',
    code: 'D1110',
    nameFull: 'Шүд цэвэрлэгээ',
    nameShort: 'Шүд цэвэрлэгээ',
    category: 'preventive',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'scaling',
    code: 'D4341',
    nameFull: 'Усалгаатай цэвэрлэгээ',
    nameShort: 'Усалгаатай цэвэрлэгээ',
    category: 'preventive',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'fluoride',
    code: 'D1206',
    nameFull: 'Фтор түрхлэг',
    nameShort: 'Фтор түрхлэг',
    category: 'preventive',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'sealant',
    code: 'D1351',
    nameFull: 'Лак/битүүмжлэл',
    nameShort: 'Лак/битүүмжлэл',
    category: 'preventive',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),

  // Restorative
  createTreatment({
    id: 'filling',
    code: 'D2390',
    nameFull: 'Ломбдолт',
    nameShort: 'Ломбдолт',
    category: 'restorative',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),
  createTreatment({
    id: 'composite',
    code: 'D2391',
    nameFull: 'Композит ломбо',
    nameShort: 'Композит ломбо',
    category: 'restorative',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),
  createTreatment({
    id: 'amalgam',
    code: 'D2140',
    nameFull: 'Амальгам ломбо',
    nameShort: 'Амальгам ломбо',
    category: 'restorative',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),
  createTreatment({
    id: 'inlay',
    code: 'D2650',
    nameFull: 'Инлей',
    nameShort: 'Инлей',
    category: 'restorative',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),
  createTreatment({
    id: 'onlay',
    code: 'D2660',
    nameFull: 'Онлей',
    nameShort: 'Онлей',
    category: 'restorative',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),

  // Endodontic
  createTreatment({
    id: 'root-canal',
    code: 'D3220',
    nameFull: 'Суваг эмчилгээ',
    nameShort: 'Суваг эмчилгээ',
    category: 'endodontic',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'pulpotomy',
    code: 'D3221',
    nameFull: 'Пульпотом',
    nameShort: 'Пульпотом',
    category: 'endodontic',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'pulpectomy',
    code: 'D3222',
    nameFull: 'Пульпектом',
    nameShort: 'Пульпектом',
    category: 'endodontic',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'apico',
    code: 'D3330',
    nameFull: 'Апикэктоми',
    nameShort: 'Апикэктоми',
    category: 'endodontic',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),

  // Prosthetic
  createTreatment({
    id: 'crown',
    code: 'D2750',
    nameFull: 'Титэм',
    nameShort: 'Титэм',
    category: 'prosthetic',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'bridge',
    code: 'D6750',
    nameFull: 'Гүүрэн протез',
    nameShort: 'Гүүрэн протез',
    category: 'prosthetic',
    coverageScope: COVERAGE_SCOPE.MULTI_TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'denture',
    code: 'D5110',
    nameFull: 'Салдаг хиймэл шүд',
    nameShort: 'Салдаг хиймэл шүд',
    category: 'prosthetic',
    coverageScope: COVERAGE_SCOPE.ARCH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'partial-denture',
    code: 'D5213',
    nameFull: 'Хэсгийн салдаг хиймэл',
    nameShort: 'Хэсгийн салдаг хиймэл',
    category: 'prosthetic',
    coverageScope: COVERAGE_SCOPE.ARCH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'implant',
    code: 'D6010',
    nameFull: 'Имплант',
    nameShort: 'Имплант',
    category: 'prosthetic',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'veneer',
    code: 'D2960',
    nameFull: 'Винир',
    nameShort: 'Винир',
    category: 'prosthetic',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),

  // Surgery
  createTreatment({
    id: 'extraction',
    code: 'D7140',
    nameFull: 'Шүд авах',
    nameShort: 'Шүд авах',
    category: 'surgery',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'surgical-extraction',
    code: 'D7210',
    nameFull: 'Мэс заслын авах',
    nameShort: 'Мэс заслын авах',
    category: 'surgery',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'wisdom-tooth',
    code: 'D7250',
    nameFull: 'Агт араа авах',
    nameShort: 'Агт араа авах',
    category: 'surgery',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'bone-graft',
    code: 'D7953',
    nameFull: 'Ясны суулгац',
    nameShort: 'Ясны суулгац',
    category: 'surgery',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'sinus-lift',
    code: 'D7951',
    nameFull: 'Синус лифт',
    nameShort: 'Синус лифт',
    category: 'surgery',
    coverageScope: COVERAGE_SCOPE.QUADRANT,
    toothRequired: true,
  }),

  // Periodontal
  createTreatment({
    id: 'perio-therapy',
    code: 'D4341',
    nameFull: 'Буйлны эмчилгээ',
    nameShort: 'Буйлны эмчилгээ',
    category: 'periodontal',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'deep-cleaning',
    code: 'D4342',
    nameFull: 'Гүн цэвэрлэгээ',
    nameShort: 'Гүн цэвэрлэгээ',
    category: 'periodontal',
    coverageScope: COVERAGE_SCOPE.SEXTANT,
    toothRequired: true,
  }),
  createTreatment({
    id: 'gum-surgery',
    code: 'D4240',
    nameFull: 'Буйлны мэс засал',
    nameShort: 'Буйлны мэс засал',
    category: 'periodontal',
    coverageScope: COVERAGE_SCOPE.QUADRANT,
    toothRequired: true,
  }),
  createTreatment({
    id: 'graft',
    code: 'D4270',
    nameFull: 'Буйл шилжүүлэн суулгалт',
    nameShort: 'Буйл шилжүүлэн суулгалт',
    category: 'periodontal',
    coverageScope: COVERAGE_SCOPE.QUADRANT,
    toothRequired: true,
  }),

  // Orthodontic
  createTreatment({
    id: 'braces',
    code: 'D8080',
    nameFull: 'Шүдний аппарат',
    nameShort: 'Шүдний аппарат',
    category: 'orthodontic',
    coverageScope: COVERAGE_SCOPE.MULTI_TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'retainer',
    code: 'D8680',
    nameFull: 'Ретейнер тохируулга',
    nameShort: 'Ретейнер тохируулга',
    category: 'orthodontic',
    coverageScope: COVERAGE_SCOPE.MULTI_TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'aligners',
    code: 'D8090',
    nameFull: 'Илэнгэр/алайнэр',
    nameShort: 'Илэнгэр/алайнэр',
    category: 'orthodontic',
    coverageScope: COVERAGE_SCOPE.MULTI_TOOTH,
    toothRequired: true,
  }),

  // Cosmetic
  createTreatment({
    id: 'whitening',
    code: 'D9975',
    nameFull: 'Цайруулалт',
    nameShort: 'Цайруулалт',
    category: 'cosmetic',
    coverageScope: COVERAGE_SCOPE.FULL_MOUTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'bonding',
    code: 'D9976',
    nameFull: 'Бондинг',
    nameShort: 'Бондинг',
    category: 'cosmetic',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),
  createTreatment({
    id: 'reshaping',
    code: 'D9972',
    nameFull: 'Хэлбэр засах',
    nameShort: 'Хэлбэр засах',
    category: 'cosmetic',
    coverageScope: COVERAGE_SCOPE.SURFACE,
    toothRequired: true,
  }),

  // Emergency
  createTreatment({
    id: 'emergency',
    code: 'D0145',
    nameFull: 'Яаралтай эмчилгээ',
    nameShort: 'Яаралтай эмчилгээ',
    category: 'emergency',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'pain-relief',
    code: 'D9110',
    nameFull: 'Өвчин намдаалт',
    nameShort: 'Өвчин намдаалт',
    category: 'emergency',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),

  // Other
  createTreatment({
    id: 'base',
    code: 'D9999',
    nameFull: 'Суурь эмчилгээ',
    nameShort: 'Суурь эмчилгээ',
    category: 'other',
    coverageScope: COVERAGE_SCOPE.TOOTH,
    toothRequired: true,
  }),
  createTreatment({
    id: 'other',
    code: 'D0000',
    nameFull: 'Бусад',
    nameShort: 'Бусад',
    category: 'other',
    coverageScope: COVERAGE_SCOPE.FULL_MOUTH,
    toothRequired: true,
  }),
]

export const treatmentTypes = baseTreatmentTypes

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
