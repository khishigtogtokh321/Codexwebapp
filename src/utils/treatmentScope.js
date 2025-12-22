/**
 * Treatment scope helper (frontend-only).
 * Centralizes GENERAL vs TOOTH determination without changing backend models.
 */

export const TREATMENT_SCOPE = {
  GENERAL: 'GENERAL',
  TOOTH: 'TOOTH',
}

const GENERAL_LABEL_KEYWORDS = [
  'анхан үзлэг',
  'давтан үзлэг',
  'зөвлөгөө',
  'зөвлөмж',
]

const GENERAL_ID_KEYWORDS = ['exam', 'consult', 'follow', 'checkup', 'advice']

export function getTreatmentScope(treatment) {
  if (!treatment) return TREATMENT_SCOPE.TOOTH

  if (typeof treatment.toothRequired === 'boolean') {
    return treatment.toothRequired ? TREATMENT_SCOPE.TOOTH : TREATMENT_SCOPE.GENERAL
  }

  if (typeof treatment.requiresTooth === 'boolean') {
    return treatment.requiresTooth ? TREATMENT_SCOPE.TOOTH : TREATMENT_SCOPE.GENERAL
  }

  if (typeof treatment.scope === 'string') {
    return treatment.scope.toLowerCase() === 'general' ? TREATMENT_SCOPE.GENERAL : TREATMENT_SCOPE.TOOTH
  }

  const label = (treatment.label || '').toLowerCase()
  const id = (treatment.id || '').toLowerCase()

  const matchesLabel = GENERAL_LABEL_KEYWORDS.some((keyword) => label.includes(keyword))
  const matchesId = GENERAL_ID_KEYWORDS.some((keyword) => id.includes(keyword))

  return matchesLabel || matchesId ? TREATMENT_SCOPE.GENERAL : TREATMENT_SCOPE.TOOTH
}

export default getTreatmentScope
