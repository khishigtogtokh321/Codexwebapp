/**
 * Utility functions for tooth-related operations
 * FDI World Dental Federation notation (11-48)
 */

// FDI Tooth numbering system
export const FDI_NOTATION = {
  UPPER_RIGHT: [11, 12, 13, 14, 15, 16, 17, 18],
  UPPER_LEFT: [21, 22, 23, 24, 25, 26, 27, 28],
  LOWER_LEFT: [31, 32, 33, 34, 35, 36, 37, 38],
  LOWER_RIGHT: [41, 42, 43, 44, 45, 46, 47, 48],
}

// Tooth surfaces
export const TOOTH_SURFACES = {
  M: 'Mesial',
  O: 'Occlusal',
  D: 'Distal',
  B: 'Buccal',
  L: 'Lingual',
}

// Tooth status types - Шүдний төлөв байдал
export const TOOTH_STATUS_TYPES = {
  ALL: 'all',                    // Бүгд
  PERMANENT: 'permanent',        // Байнгын шүд
  BABY: 'baby',                  // Сүүн шүд
  MIXED: 'mixed',                // Холимог
  FILLED: 'filled',              // Авхуулсан
  NOT_EXTRACTED: 'not-extracted',// Аваагүй
  EXTRA: 'extra',                // Нэмэлт
  HEALTHY: 'healthy',            // Эрүүл
  TREATED: 'treated',            // Эмчилсэн
  PROBLEM: 'problem',            // Асуудалтай
  PLANNED: 'planned',            // Төлөвлөсөн
  MISSING: 'missing',            // Сохорсон
}

// Tooth status labels
export const TOOTH_STATUS_LABELS = {
  [TOOTH_STATUS_TYPES.ALL]: 'Бүгд',
  [TOOTH_STATUS_TYPES.PERMANENT]: 'Байнгын шүд',
  [TOOTH_STATUS_TYPES.BABY]: 'Сүүн шүд',
  [TOOTH_STATUS_TYPES.MIXED]: 'Холимог',
  [TOOTH_STATUS_TYPES.FILLED]: 'Авхуулсан',
  [TOOTH_STATUS_TYPES.NOT_EXTRACTED]: 'Аваагүй',
  [TOOTH_STATUS_TYPES.EXTRA]: 'Нэмэлт',
  [TOOTH_STATUS_TYPES.HEALTHY]: 'Эрүүл',
  [TOOTH_STATUS_TYPES.TREATED]: 'Эмчилсэн',
  [TOOTH_STATUS_TYPES.PROBLEM]: 'Асуудалтай',
  [TOOTH_STATUS_TYPES.PLANNED]: 'Төлөвлөсөн',
  [TOOTH_STATUS_TYPES.MISSING]: 'Сохорсон',
}

// Baby teeth (Deciduous/Primary teeth) - Сүүн шүд
export const BABY_TEETH = {
  UPPER_RIGHT: [51, 52, 53, 54, 55],
  UPPER_LEFT: [61, 62, 63, 64, 65],
  LOWER_LEFT: [71, 72, 73, 74, 75],
  LOWER_RIGHT: [81, 82, 83, 84, 85],
}

// Get all baby teeth
export function getAllBabyTeeth() {
  return [
    ...BABY_TEETH.UPPER_RIGHT,
    ...BABY_TEETH.UPPER_LEFT,
    ...BABY_TEETH.LOWER_LEFT,
    ...BABY_TEETH.LOWER_RIGHT,
  ]
}

// Check if tooth is baby tooth
export function isBabyTooth(toothNumber) {
  const num = parseInt(toothNumber)
  return num >= 51 && num <= 85
}

// Check if tooth is permanent
export function isPermanentTooth(toothNumber) {
  const num = parseInt(toothNumber)
  return (num >= 11 && num <= 48) || !isBabyTooth(num)
}

// Get all teeth as array
export function getAllTeeth() {
  return [
    ...FDI_NOTATION.UPPER_RIGHT,
    ...FDI_NOTATION.UPPER_LEFT,
    ...FDI_NOTATION.LOWER_LEFT,
    ...FDI_NOTATION.LOWER_RIGHT,
  ]
}

// Get upper teeth
export function getUpperTeeth() {
  return [...FDI_NOTATION.UPPER_RIGHT, ...FDI_NOTATION.UPPER_LEFT]
}

// Get lower teeth
export function getLowerTeeth() {
  return [...FDI_NOTATION.LOWER_LEFT, ...FDI_NOTATION.LOWER_RIGHT]
}

// Check if tooth is upper
export function isUpperTooth(toothNumber) {
  const num = parseInt(toothNumber)
  return num >= 11 && num <= 28
}

// Check if tooth is lower
export function isLowerTooth(toothNumber) {
  const num = parseInt(toothNumber)
  return num >= 31 && num <= 48
}

// Get quadrant (1-4)
export function getQuadrant(toothNumber) {
  const num = parseInt(toothNumber)
  return Math.floor(num / 10)
}

// Get tooth position in quadrant (1-8)
export function getPositionInQuadrant(toothNumber) {
  const num = parseInt(toothNumber)
  return num % 10
}

// Get tooth name
export function getToothName(toothNumber) {
  const position = getPositionInQuadrant(toothNumber)
  const names = {
    1: 'Central Incisor',
    2: 'Lateral Incisor',
    3: 'Canine',
    4: 'First Premolar',
    5: 'Second Premolar',
    6: 'First Molar',
    7: 'Second Molar',
    8: 'Third Molar (Wisdom)',
  }
  return names[position] || 'Unknown'
}

// Get quadrant name
export function getQuadrantName(quadrant) {
  const names = {
    1: 'Upper Right',
    2: 'Upper Left',
    3: 'Lower Left',
    4: 'Lower Right',
  }
  return names[quadrant] || 'Unknown'
}

// Format tooth number with hash
export function formatToothNumber(toothNumber) {
  return `#${toothNumber}`
}

// Parse tooth number (remove hash)
export function parseToothNumber(toothString) {
  return toothString.replace('#', '')
}

// Validate tooth number
export function isValidToothNumber(toothNumber) {
  const num = parseInt(toothNumber)
  return getAllTeeth().includes(num)
}

// Get tooth type (incisor, canine, premolar, molar)
export function getToothType(toothNumber) {
  const position = getPositionInQuadrant(toothNumber)
  if (position <= 2) return 'incisor'
  if (position === 3) return 'canine'
  if (position <= 5) return 'premolar'
  return 'molar'
}

// Check if tooth is wisdom tooth
export function isWisdomTooth(toothNumber) {
  return getPositionInQuadrant(toothNumber) === 8
}

// Get neighboring teeth
export function getNeighboringTeeth(toothNumber) {
  const num = parseInt(toothNumber)
  const quadrant = getQuadrant(num)
  const position = getPositionInQuadrant(num)

  const neighbors = []

  // Previous tooth in same quadrant
  if (position > 1) {
    neighbors.push(quadrant * 10 + (position - 1))
  }

  // Next tooth in same quadrant
  if (position < 8) {
    neighbors.push(quadrant * 10 + (position + 1))
  }

  return neighbors
}

// Get opposite tooth (upper <-> lower)
export function getOppositeTooth(toothNumber) {
  const num = parseInt(toothNumber)
  const quadrant = getQuadrant(num)
  const position = getPositionInQuadrant(num)

  // Map quadrants: 1<->4, 2<->3
  const oppositeQuadrant = {
    1: 4,
    2: 3,
    3: 2,
    4: 1,
  }[quadrant]

  return oppositeQuadrant * 10 + position
}

// Surfaces to array
export function surfacesToArray(surfacesString) {
  if (!surfacesString) return []
  return surfacesString
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length === 1)
}

// Array to surfaces string
export function arrayToSurfaces(surfacesArray) {
  return surfacesArray.join(', ')
}

// Validate surface
export function isValidSurface(surface) {
  return Object.keys(TOOTH_SURFACES).includes(surface.toUpperCase())
}

// Get surface full name
export function getSurfaceName(surface) {
  return TOOTH_SURFACES[surface.toUpperCase()] || surface
}

export default {
  FDI_NOTATION,
  TOOTH_SURFACES,
  getAllTeeth,
  getUpperTeeth,
  getLowerTeeth,
  isUpperTooth,
  isLowerTooth,
  getQuadrant,
  getPositionInQuadrant,
  getToothName,
  getQuadrantName,
  formatToothNumber,
  parseToothNumber,
  isValidToothNumber,
  getToothType,
  isWisdomTooth,
  getNeighboringTeeth,
  getOppositeTooth,
  surfacesToArray,
  arrayToSurfaces,
  isValidSurface,
  getSurfaceName,
}
