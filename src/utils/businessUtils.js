/**
 * Business Utilities
 *
 * Reusable utility functions for business logic
 * that are used across multiple components and views.
 */

import { BUSINESS_TIERS, TIER_LABELS } from '@/utils/constants'

// ===== TIER UTILITIES =====

/**
 * Get tier label for display
 */
export const getTierLabel = (tier) => {
  return TIER_LABELS[tier] || ''
}

/**
 * Filter businesses by tier
 */
export const filterBusinessesByTier = (businesses, tier) => {
  return businesses.filter(business =>
    business.tier === tier || business.listing_tier === tier
  )
}

/**
 * Get hero business from a list (prioritizes signature, then premier)
 */
export const getHeroBusiness = (businesses, fallbackImage = null) => {
  // Try signature tier first
  const signatureBusinesses = filterBusinessesByTier(businesses, BUSINESS_TIERS.SIGNATURE)
  if (signatureBusinesses.length > 0) {
    return {
      ...signatureBusinesses[0],
      image: signatureBusinesses[0].heroImage || signatureBusinesses[0].logo || fallbackImage
    }
  }

  // Try premier tier next
  const premierBusinesses = filterBusinessesByTier(businesses, BUSINESS_TIERS.PREMIER)
  if (premierBusinesses.length > 0) {
    return {
      ...premierBusinesses[0],
      image: premierBusinesses[0].heroImage || premierBusinesses[0].logo || fallbackImage
    }
  }

  // Fallback to first business
  if (businesses.length > 0) {
    return {
      ...businesses[0],
      image: businesses[0].heroImage || businesses[0].logo || fallbackImage
    }
  }

  return null
}

// ===== TIME UTILITIES =====

/**
 * Convert 24-hour time string to minutes since midnight
 */
export const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Get current time in minutes since midnight
 */
export const getCurrentTimeInMinutes = () => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

/**
 * Format 24-hour time to 12-hour format
 */
export const formatTime12Hour = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHours}:${displayMinutes} ${ampm}`
}

/**
 * Format time for short display (just hour)
 */
export const formatTimeShort = (timeString) => {
  const [hours] = timeString.split(':').map(Number)
  const displayHours = hours % 12 || 12
  return displayHours.toString()
}

/**
 * Convert 12-hour time to 24-hour format
 */
export const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(/\s*(AM|PM)/i)
  let [hours, minutes] = time.split(':')

  if (hours === '12') {
    hours = '00'
  }

  if (modifier.toUpperCase() === 'PM' && hours !== '00') {
    hours = parseInt(hours, 10) + 12
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`
}

// ===== BUSINESS STATUS UTILITIES =====

/**
 * Check if a business/special is currently active
 */
export const isCurrentlyActive = (item) => {
  if (!item.startTime || !item.endTime) return false

  const now = getCurrentTimeInMinutes()
  const start = timeToMinutes(item.startTime)
  const end = timeToMinutes(item.endTime)
  return now >= start && now <= end
}

/**
 * Check if a business/special is upcoming
 */
export const isUpcoming = (item) => {
  if (!item.startTime) return false

  const now = getCurrentTimeInMinutes()
  const start = timeToMinutes(item.startTime)
  return start > now
}

/**
 * Check if a business/special has ended
 */
export const hasEnded = (item) => {
  if (!item.endTime) return false

  const now = getCurrentTimeInMinutes()
  const end = timeToMinutes(item.endTime)
  return now > end
}

/**
 * Get status text for a business/special
 */
export const getSpecialStatus = (special) => {
  if (isCurrentlyActive(special)) return 'Active Now'
  if (isUpcoming(special)) return 'Upcoming'
  return 'Ended'
}

/**
 * Get time remaining for an active special
 */
export const getTimeRemaining = (endTime) => {
  const now = getCurrentTimeInMinutes()
  const end = timeToMinutes(endTime)
  const remaining = end - now

  if (remaining <= 0) return 'Ending Soon'

  const hours = Math.floor(remaining / 60)
  const minutes = remaining % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m left`
  }
  return `${minutes}m left`
}

// ===== HAPPY HOUR UTILITIES =====

/**
 * Parse happy hour schedule from text format
 */
export const parseHappyHourSchedule = (schedule) => {
  if (!schedule) return { startTime: "17:00", endTime: "19:00" }

  // Extract time range from schedule string
  const timeMatch = schedule.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i)

  if (timeMatch) {
    const startTime12 = timeMatch[1].trim()
    const endTime12 = timeMatch[2].trim()

    return {
      startTime: convertTo24Hour(startTime12),
      endTime: convertTo24Hour(endTime12)
    }
  }

  // Fallback
  return { startTime: "17:00", endTime: "19:00" }
}

/**
 * Determine special type from deals text
 */
export const getSpecialTypeFromDeals = (dealsText) => {
  const deals = dealsText.toLowerCase()

  // Check for beer-related specials first
  if (deals.includes('beer') || deals.includes('draft') || deals.includes('brewery') || deals.includes('well drinks')) {
    return 'Beer'
  }
  // Check for food-related specials
  else if (deals.includes('appetizer') || deals.includes('wings') || deals.includes('food') || deals.includes('small plates') || deals.includes('antipasti') || deals.includes('pizza')) {
    return 'Food'
  }
  // Default to cocktails for all drink-related specials
  else {
    return 'Cocktails'
  }
}

// ===== DATE UTILITIES =====

/**
 * Get current date string formatted for display
 */
export const getCurrentDateString = () => {
  const today = new Date()
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get current day name (lowercase)
 */
export const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}