// utils/helpers.js

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance.toFixed(1)
}

const toRad = (value) => {
  return (value * Math.PI) / 180
}

/**
 * Get current user location
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  })
}

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if business is open now
 */
export const isOpenNow = (hours) => {
  if (!hours) return null
  
  const now = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = dayNames[now.getDay()]
  const todayHours = hours[today]
  
  if (!todayHours) return false
  
  if (todayHours.toLowerCase() === 'closed') return false
  
  // Parse hours like "11:00 AM - 10:00 PM"
  const timeMatch = todayHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/)
  
  if (!timeMatch) return null
  
  const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = timeMatch
  
  // Convert to 24-hour format
  let openTime = parseInt(openHour)
  if (openPeriod === 'PM' && openTime !== 12) openTime += 12
  if (openPeriod === 'AM' && openTime === 12) openTime = 0
  
  let closeTime = parseInt(closeHour)
  if (closePeriod === 'PM' && closeTime !== 12) closeTime += 12
  if (closePeriod === 'AM' && closeTime === 12) closeTime = 0
  
  const openMinutes = openTime * 60 + parseInt(openMin)
  const closeMinutes = closeTime * 60 + parseInt(closeMin)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  
  return nowMinutes >= openMinutes && nowMinutes <= closeMinutes
}

/**
 * Generate shareable link for business
 */
export const generateShareableLink = (businessId) => {
  const baseUrl = window.location.origin
  return `${baseUrl}/business/${businessId}`
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Format address for Google Maps
 */
export const formatAddressForMaps = (address) => {
  return encodeURIComponent(address.replace(/\s+/g, '+'))
}
