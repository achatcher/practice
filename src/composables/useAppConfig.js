import { ref, computed, reactive } from 'vue'

// S3 base URL
const S3_BASE = import.meta.env.VITE_S3_BASE_URL || 'https://kzoosocial-config.s3.us-east-1.amazonaws.com'

// Global app configuration state
const appConfig = ref(null)
const currentLocation = ref('kalamazoo') // Default location for KSocial
const isLoading = ref(false)
const error = ref(null)

// Cached data for different locations
const locationCache = reactive({})

/**
 * Composable for managing dynamic app configuration.
 * Drives the entire app from JSON config files — adding a new city
 * only requires adding a new locations/{city}/ folder with two JSON files.
 */
export function useAppConfig() {

  /**
   * Load the master app configuration from /public/config/app-config.json
   */
  const loadAppConfig = async () => {
    if (appConfig.value) return appConfig.value

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${S3_BASE}/app-config.json`)
      if (!response.ok) {
        throw new Error(`Failed to load app config: ${response.status}`)
      }

      const config = await response.json()
      appConfig.value = config

      console.log('App configuration loaded:', config.app.name)
      return config
    } catch (err) {
      error.value = `Failed to load app configuration: ${err.message}`
      console.error('App config error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load location-specific data (businesses, events) from:
   * /public/config/locations/{location}/businesses.json
   * /public/config/locations/{location}/events.json
   *
   * Adding a new city = add a new folder with these two files.
   */
  const loadLocationData = async (location = currentLocation.value, forceReload = false) => {
    if (locationCache[location] && !forceReload) {
      return locationCache[location]
    }

    isLoading.value = true
    error.value = null

    try {
      const timestamp = forceReload ? `?t=${Date.now()}` : ''

      const [businessesResponse, eventsResponse] = await Promise.all([
        fetch(`${S3_BASE}/locations/${location}/businesses.json${timestamp}`),
        fetch(`${S3_BASE}/locations/${location}/events.json${timestamp}`)
      ])

      if (!businessesResponse.ok || !eventsResponse.ok) {
        throw new Error(`Failed to load location data for ${location}`)
      }

      const [businessesData, eventsData] = await Promise.all([
        businessesResponse.json(),
        eventsResponse.json()
      ])

      // Support flat array or tier-based business structures
      let businesses = []
      if (Array.isArray(businessesData.businesses)) {
        businesses = businessesData.businesses
      } else if (businessesData.businesses && typeof businessesData.businesses === 'object') {
        // Tier-based structure: flatten featured + standard tiers
        const tiers = ['featured', 'standard']
        businesses = tiers.reduce((acc, tier) => {
          if (businessesData.businesses[tier] && Array.isArray(businessesData.businesses[tier])) {
            return acc.concat(businessesData.businesses[tier])
          }
          return acc
        }, [])
        console.log(`Flattened tier-based structure: ${businesses.length} businesses`)
      }

      const locationData = {
        businesses,
        events: eventsData.events || [],
        lastUpdated: Math.max(
          new Date(businessesData.lastUpdated || 0).getTime(),
          new Date(eventsData.lastUpdated || 0).getTime()
        )
      }

      locationCache[location] = locationData

      console.log(`Location data loaded for ${location}:`, {
        businesses: locationData.businesses.length,
        events: locationData.events.length
      })

      return locationData
    } catch (err) {
      error.value = `Failed to load location data: ${err.message}`
      console.error('Location data error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Switch to a different city/location
   */
  const setLocation = async (newLocation, forceReload = false) => {
    if (newLocation === currentLocation.value && locationCache[newLocation] && !forceReload) {
      return
    }

    currentLocation.value = newLocation
    await loadLocationData(newLocation, forceReload)
  }

  /**
   * Force refresh current location data (clears cache)
   */
  const forceRefreshLocation = async () => {
    delete locationCache[currentLocation.value]
    await loadLocationData(currentLocation.value, true)
  }

  // ================================================================
  // COMPUTED GETTERS
  // ================================================================

  const getAppInfo = computed(() => {
    if (!appConfig.value) return null
    return appConfig.value.app
  })

  const getCategories = computed(() => {
    if (!appConfig.value) return []
    return appConfig.value.navigation.categories.sort((a, b) => a.order - b.order)
  })

  const getFeaturedCategories = computed(() => {
    return getCategories.value.filter(cat => cat.featured)
  })

  const getCategoryById = (categoryId) => {
    return getCategories.value.find(cat => cat.id === categoryId)
  }

  const getNavTabs = computed(() => {
    if (!appConfig.value) return []
    return appConfig.value.navigation.tabs || []
  })

  const getPageConfig = (pageName) => {
    if (!appConfig.value) return null
    return appConfig.value.pages[pageName] || null
  }

  const getTierConfig = (tierName) => {
    if (!appConfig.value) return null
    return appConfig.value.tiers[tierName] || null
  }

  const getFilters = computed(() => {
    if (!appConfig.value) return {}
    return appConfig.value.filters || {}
  })

  const getCurrentBusinesses = computed(() => {
    const data = locationCache[currentLocation.value]
    return data ? data.businesses : []
  })

  const getCurrentEvents = computed(() => {
    const data = locationCache[currentLocation.value]
    return data ? data.events : []
  })

  const getBusinessesByCategory = (categoryName) => {
    return getCurrentBusinesses.value.filter(business => {
      const category = getCategoryById(categoryName.toLowerCase().replace(/\s+/g, '-'))
      const mappedCategory = category?.mappedCategory || categoryName
      return business.category === mappedCategory
    })
  }

  const getBusinessesByTier = (tierName) => {
    return getCurrentBusinesses.value.filter(business => business.tier === tierName)
  }

  const getBusinessesByTierOrganized = computed(() => {
    const businesses = getCurrentBusinesses.value
    return {
      featured: businesses.filter(b => b.tier === 'featured'),
      standard: businesses.filter(b => b.tier === 'standard')
    }
  })

  const getTierStatistics = computed(() => {
    const organized = getBusinessesByTierOrganized.value
    return {
      featured: {
        count: organized.featured.length,
        businesses: organized.featured
      },
      standard: {
        count: organized.standard.length,
        businesses: organized.standard
      },
      total: getCurrentBusinesses.value.length
    }
  })

  const getEventsByTier = (tierName) => {
    return getCurrentEvents.value.filter(event => event.tier === tierName)
  }

  const isFeatureEnabled = (featureName) => {
    if (!appConfig.value) return false
    return appConfig.value.features[featureName] || false
  }

  const getBranding = computed(() => {
    if (!appConfig.value) return null
    return appConfig.value.app.branding
  })

  const getConfig = computed(() => {
    if (!appConfig.value) return null
    return appConfig.value.app
  })

  /**
   * Initialize the app — loads config then location data.
   * Called once on app startup.
   */
  const initializeApp = async (location = 'kalamazoo') => {
    // Skip if already initialized for this location
    if (appConfig.value && locationCache[location]) return true

    try {
      await loadAppConfig()
      await setLocation(location)
      return true
    } catch (err) {
      console.error('KSocial initialization failed:', err)
      return false
    }
  }

  return {
    // State
    appConfig: computed(() => appConfig.value),
    currentLocation: computed(() => currentLocation.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Methods
    loadAppConfig,
    loadLocationData,
    setLocation,
    forceRefreshLocation,
    initializeApp,

    // Getters
    getAppInfo,
    getCategories,
    getFeaturedCategories,
    getCategoryById,
    getNavTabs,
    getPageConfig,
    getTierConfig,
    getFilters,
    getCurrentBusinesses,
    getCurrentEvents,
    getBusinessesByCategory,
    getBusinessesByTier,
    getBusinessesByTierOrganized,
    getTierStatistics,
    getEventsByTier,
    isFeatureEnabled,
    getBranding,
    getConfig
  }
}
