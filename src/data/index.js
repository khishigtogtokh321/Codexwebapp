/**
 * Central export file for all data modules
 * Makes imports cleaner: import { diagnoses, treatmentTypes } from '@/data'
 */

export { diagnoses, default as diagnosesData } from './diagnoses.js'
export {
  treatmentTypes,
  treatmentCategories,
  getTreatmentById,
  getTreatmentsByCategory,
} from './treatmentTypes.js'
export {
  mockPatient,
  mockTreatmentHistory,
  mockToothStatuses,
  mockPatientStats,
  getInitialToothStatuses,
  getToothStatusColor,
  getToothStatusBadge,
} from './mockData.js'
