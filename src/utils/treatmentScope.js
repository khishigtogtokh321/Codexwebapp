/**
 * Treatment scope helper (frontend-only).
 * Centralizes GENERAL vs TOOTH determination without changing backend models.
 */

export const TREATMENT_SCOPE = {
  GENERAL: 'GENERAL',
  TOOTH: 'TOOTH',
}

export const SCOPE_TYPE = {
  NONE: 0,
  TOOTH: 1,
  SURFACE: 2,
}

export const COVERAGE_SCOPE = {
  SURFACE: 'SURFACE',
  TOOTH: 'TOOTH',
  MULTI_TOOTH: 'MULTI_TOOTH',
  QUADRANT: 'QUADRANT',
  SEXTANT: 'SEXTANT',
  ARCH: 'ARCH',
  FULL_MOUTH: 'FULL_MOUTH',
}

const COVERAGE_SCOPE_TO_SCOPE_TYPE = {
  [COVERAGE_SCOPE.SURFACE]: SCOPE_TYPE.SURFACE,
  [COVERAGE_SCOPE.TOOTH]: SCOPE_TYPE.TOOTH,
  [COVERAGE_SCOPE.MULTI_TOOTH]: SCOPE_TYPE.TOOTH,
  [COVERAGE_SCOPE.QUADRANT]: SCOPE_TYPE.NONE,
  [COVERAGE_SCOPE.SEXTANT]: SCOPE_TYPE.NONE,
  [COVERAGE_SCOPE.ARCH]: SCOPE_TYPE.NONE,
  [COVERAGE_SCOPE.FULL_MOUTH]: SCOPE_TYPE.NONE,
}

const GENERAL_LABEL_KEYWORDS = [
  'анхан үзлэг',
  'давтан үзлэг',
  'зөвлөгөө',
  'зөвлөмж',
]

const GENERAL_ID_KEYWORDS = ['exam', 'consult', 'follow', 'checkup', 'advice']

function clampScopeType(value) {
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return SCOPE_TYPE.TOOTH
  return Math.min(Math.max(numericValue, SCOPE_TYPE.NONE), SCOPE_TYPE.SURFACE)
}

function getScopeTypeFromCoverage(coverageScope) {
  const key = typeof coverageScope === 'string' ? coverageScope.toUpperCase() : null
  if (!key) return null
  return COVERAGE_SCOPE_TO_SCOPE_TYPE[key] ?? null
}

export function resolveScopeType(treatment) {
  if (!treatment) return SCOPE_TYPE.TOOTH

  if (Number.isInteger(treatment.scopeType)) {
    return clampScopeType(treatment.scopeType)
  }

  const coverageScopeType = getScopeTypeFromCoverage(treatment.coverageScope)
  if (coverageScopeType !== null) {
    return coverageScopeType
  }

  if (typeof treatment.surfaceRequired === 'boolean') {
    return treatment.surfaceRequired ? SCOPE_TYPE.SURFACE : SCOPE_TYPE.TOOTH
  }

  if (typeof treatment.toothRequired === 'boolean') {
    return treatment.toothRequired ? SCOPE_TYPE.TOOTH : SCOPE_TYPE.NONE
  }

  if (typeof treatment.requiresTooth === 'boolean') {
    return treatment.requiresTooth ? SCOPE_TYPE.TOOTH : SCOPE_TYPE.NONE
  }

  if (typeof treatment.scope === 'string') {
    return treatment.scope.toLowerCase() === 'general' ? SCOPE_TYPE.NONE : SCOPE_TYPE.TOOTH
  }

  const label = (treatment.label || '').toLowerCase()
  const id = (treatment.id || '').toLowerCase()
  const matchesLabel = GENERAL_LABEL_KEYWORDS.some((keyword) => label.includes(keyword))
  const matchesId = GENERAL_ID_KEYWORDS.some((keyword) => id.includes(keyword))

  if (matchesLabel || matchesId) return SCOPE_TYPE.NONE

  return SCOPE_TYPE.TOOTH
}

export function getScopeMeta(items = []) {
  const scopedItems = Array.isArray(items) ? items : []
  let scopeType = SCOPE_TYPE.NONE

  scopedItems.forEach((item) => {
    scopeType = Math.max(scopeType, resolveScopeType(item))
  })

  return {
    scopeType,
    requiresTooth: scopeType > SCOPE_TYPE.NONE,
    requiresSurface: scopeType > SCOPE_TYPE.TOOTH,
  }
}

export function applyScopeDefaults(treatment) {
  if (!treatment) return treatment

  const scopeType = resolveScopeType(treatment)
  const hasSurfaceRequirement = scopeType === SCOPE_TYPE.SURFACE
  const hasToothRequirement = scopeType !== SCOPE_TYPE.NONE
  const fallbackCoverageScope = hasSurfaceRequirement
    ? COVERAGE_SCOPE.SURFACE
    : hasToothRequirement
      ? COVERAGE_SCOPE.TOOTH
      : COVERAGE_SCOPE.FULL_MOUTH

  return {
    ...treatment,
    scopeType,
    coverageScope: treatment.coverageScope || fallbackCoverageScope,
    scope: treatment.scope || (scopeType === SCOPE_TYPE.NONE ? 'general' : 'tooth'),
    toothRequired: typeof treatment.toothRequired === 'boolean' ? treatment.toothRequired : hasToothRequirement,
    requiresTooth:
      typeof treatment.requiresTooth === 'boolean' ? treatment.requiresTooth : hasToothRequirement,
    surfaceRequired:
      typeof treatment.surfaceRequired === 'boolean' ? treatment.surfaceRequired : hasSurfaceRequirement,
  }
}

export function getTreatmentScope(treatment) {
  const scopeType = resolveScopeType(treatment)
  if (scopeType === SCOPE_TYPE.NONE) return TREATMENT_SCOPE.GENERAL
  return TREATMENT_SCOPE.TOOTH
}

export default getTreatmentScope
