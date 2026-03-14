// utils/constants.js
// Constants that use the centralized app configuration

// Default values — fallback if app-config.json has not loaded yet
const DEFAULT_CENTER = { lat: 42.2917, lng: -85.5872 } // Kalamazoo, MI
const DEFAULT_ZOOM_LEVEL = 14

// Read app configuration from localStorage cache (faster than async fetch)
const getCachedAppConfig = () => {
  try {
    const cached = localStorage.getItem('app-config')
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

// Location-aware center coordinate (falls back to Kalamazoo)
export const getLocationCenter = () => {
  const config = getCachedAppConfig()
  return config?.app?.location?.coordinates || DEFAULT_CENTER
}

export const getDefaultZoom = () => {
  const config = getCachedAppConfig()
  return config?.pages?.map?.defaultZoom || DEFAULT_ZOOM_LEVEL
}

export const DEFAULT_ZOOM = DEFAULT_ZOOM_LEVEL

export const AD_TYPES = {
  INTERSTITIAL: 'interstitial',
  BANNER: 'banner',
  INLINE: 'inline'
}

export const BADGE_TYPES = {
  NEW: 'New',
  FEATURED: 'Featured',
  POPULAR: 'Popular',
  DEAL: 'Deal'
}

// KSocial uses two tiers: featured (paid top placement) and standard (default)
export const BUSINESS_TIERS = {
  FEATURED: 'featured',
  STANDARD: 'standard',
  // Legacy names kept for inherited component compatibility
  SIGNATURE: 'featured',
  PREMIER: 'standard',
  CURATED: 'standard'
}

export const TIER_LABELS = {
  featured: 'FEATURED',
  standard: '',
  // Legacy
  signature: 'FEATURED',
  premier: '',
  curated: ''
}

// KSocial venue categories (must match category ids in app-config.json)
export const BUSINESS_CATEGORIES = {
  HAPPY_HOURS: 'happy-hours',
  FOOD_SPECIALS: 'food-specials',
  LIVE_MUSIC: 'live-music',
  BRUNCH: 'brunch',
  SPORTS_BARS: 'sports-bars',
  LATE_NIGHT: 'late-night'
}

// Brand colors — these match the CSS variables in variables.css
export const COLORS = {
  PRIMARY: '#FF6B35',
  PRIMARY_DARK: '#E55A25',
  BACKGROUND: '#0D0D1A',
  TEXT_WHITE: '#FFFFFF',
  TEXT_MUTED: 'rgba(255, 255, 255, 0.6)',
  ACTIVE_NOW: '#10B981',
  STARTING_SOON: '#F59E0B',
  ENDED: '#6B7280'
}
