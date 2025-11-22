/**
 * Utility functions for formatting data
 * Includes date, price, and text formatters
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - 'short' | 'long' | 'full'
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'short') {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return date

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  switch (format) {
    case 'short':
      return `${year}-${month}-${day}`
    case 'long':
      return `${year}/${month}/${day}`
    case 'full':
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return `${monthNames[d.getMonth()]} ${day}, ${year}`
    default:
      return `${year}-${month}-${day}`
  }
}

/**
 * Format date to Mongolian format
 * @param {string|Date} date
 * @returns {string} Formatted date (YYYY оны MM сарын DD)
 */
export function formatDateMongolian(date) {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return date

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  return `${year} оны ${month} сарын ${day}`
}

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string|Date} date
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return date

  const now = new Date()
  const diffMs = now - d
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Format price with currency
 * @param {number|string} price
 * @param {string} currency - Currency symbol (default: ₮)
 * @returns {string} Formatted price
 */
export function formatPrice(price, currency = '₮') {
  if (!price) return `0${currency}`

  // Remove non-numeric characters
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price

  if (isNaN(numericPrice)) return `0${currency}`

  // Format with thousands separator
  return `${numericPrice.toLocaleString('en-US')}${currency}`
}

/**
 * Parse price string to number
 * @param {string} priceString
 * @returns {number}
 */
export function parsePrice(priceString) {
  if (!priceString) return 0
  return parseFloat(priceString.replace(/[^\d.]/g, '')) || 0
}

/**
 * Format phone number
 * @param {string} phone
 * @returns {string} Formatted phone
 */
export function formatPhone(phone) {
  if (!phone) return ''

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')

  // Format as Mongolian phone (XXXX-XXXX or 9XXX-XXXX)
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  }

  return phone
}

/**
 * Format patient ID
 * @param {string} id
 * @returns {string} Formatted ID
 */
export function formatPatientId(id) {
  if (!id) return ''
  return id.toUpperCase()
}

/**
 * Get initials from name
 * @param {string} name
 * @returns {string} Initials (e.g., "Б. Батбаяр" -> "ББ")
 */
export function getInitials(name) {
  if (!name) return ''

  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitalize first letter
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Format diagnosis string (handle multiple codes)
 * @param {string|string[]} diagnoses
 * @returns {string}
 */
export function formatDiagnosis(diagnoses) {
  if (!diagnoses) return ''
  if (Array.isArray(diagnoses)) {
    return diagnoses.join(', ')
  }
  return diagnoses
}

/**
 * Format treatment status
 * @param {string} status
 * @returns {string} Display text
 */
export function formatStatus(status) {
  const statusMap = {
    done: 'Completed',
    planned: 'Planned',
    'in-progress': 'In Progress',
    cancelled: 'Cancelled',
  }
  return statusMap[status] || capitalize(status)
}

/**
 * Format status in Mongolian
 * @param {string} status
 * @returns {string}
 */
export function formatStatusMongolian(status) {
  const statusMap = {
    done: 'Хийгдсэн',
    planned: 'Төлөвлөсөн',
    'in-progress': 'Хийгдэж байгаа',
    cancelled: 'Цуцалсан',
  }
  return statusMap[status] || status
}

/**
 * Format age
 * @param {number} age
 * @returns {string}
 */
export function formatAge(age) {
  if (!age) return ''
  return `${age} years old`
}

/**
 * Format age in Mongolian
 * @param {number} age
 * @returns {string}
 */
export function formatAgeMongolian(age) {
  if (!age) return ''
  return `${age} нас`
}

/**
 * Format tooth surface list
 * @param {string[]} surfaces
 * @returns {string}
 */
export function formatSurfaces(surfaces) {
  if (!surfaces || surfaces.length === 0) return ''
  if (Array.isArray(surfaces)) {
    return surfaces.join(', ')
  }
  return surfaces
}

export default {
  formatDate,
  formatDateMongolian,
  formatRelativeTime,
  formatPrice,
  parsePrice,
  formatPhone,
  formatPatientId,
  getInitials,
  truncate,
  capitalize,
  formatDiagnosis,
  formatStatus,
  formatStatusMongolian,
  formatAge,
  formatAgeMongolian,
  formatSurfaces,
}
