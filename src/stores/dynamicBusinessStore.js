/*
 * Dynamic Business Store - Location-Agnostic Business Management
 *
 * Uses the app configuration system to load businesses dynamically
 * based on the current location. Allows easy switching between
 * different cities/regions by just changing the configuration.
 */

import { defineStore } from 'pinia'
import { useAppConfig } from '@/composables/useAppConfig'

export const useDynamicBusinessStore = defineStore('dynamicBusiness', {
  state: () => ({
    loading: false,
    error: null,
    lastUpdated: null,
    initialized: false
  }),

  getters: {
    /**
     * Get businesses by category using dynamic configuration
     */
    getBusinessesByCategory: () => (categoryName) => {
      const { getBusinessesByCategory } = useAppConfig()
      const businesses = getBusinessesByCategory(categoryName)

      console.log(`🔍 Dynamic search for category "${categoryName}":`, businesses.length, 'businesses found')

      return businesses.sort((a, b) => {
        const tierOrder = { signature: 0, premier: 1, curated: 2 }
        return (tierOrder[a.tier] || 3) - (tierOrder[b.tier] || 3)
      })
    },

    /**
     * Get all businesses for current location
     */
    businesses: () => {
      const { getCurrentBusinesses } = useAppConfig()
      return getCurrentBusinesses.value || []
    },

    /**
     * Get businesses by tier
     */
    getBusinessesByTier: () => (tierName) => {
      const { getBusinessesByTier } = useAppConfig()
      return getBusinessesByTier(tierName)
    },

    /**
     * Get business by ID
     */
    getBusinessById: (state) => (businessId) => {
      const { getCurrentBusinesses } = useAppConfig()
      const businesses = getCurrentBusinesses.value || []
      const business = businesses.find(b => b.id === parseInt(businessId))

      if (business) {
        console.log('✅ Business found:', business.name)
      } else {
        console.warn('⚠️ Business not found for ID:', businessId)
        console.warn('Available business IDs:', businesses.map(b => b.id))
      }

      return business
    },

    /**
     * Get featured businesses (signature tier)
     */
    getFeaturedBusinesses: () => {
      const { getBusinessesByTier } = useAppConfig()
      return getBusinessesByTier('signature')
    },

    /**
     * Get categories from configuration
     */
    categories: () => {
      const { getCategories } = useAppConfig()
      return getCategories.value || []
    },

    /**
     * Get available business categories (from actual business data)
     */
    getAvailableCategories: () => {
      const { getCurrentBusinesses } = useAppConfig()
      const businesses = getCurrentBusinesses.value || []
      const categories = [...new Set(businesses.map(b => b.category))]
      return categories.sort()
    },

    /**
     * Search businesses by query
     */
    searchBusinesses: () => (query) => {
      const { getCurrentBusinesses } = useAppConfig()
      const businesses = getCurrentBusinesses.value || []

      if (!query) return businesses

      const searchQuery = query.toLowerCase()
      return businesses.filter(business =>
        business.name.toLowerCase().includes(searchQuery) ||
        business.category.toLowerCase().includes(searchQuery) ||
        (business.subcategory && business.subcategory.toLowerCase().includes(searchQuery)) ||
        (business.description && business.description.toLowerCase().includes(searchQuery)) ||
        (business.tags && business.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
      )
    },

    /**
     * Get businesses with location data for map
     */
    getBusinessesWithLocation: () => {
      const { getCurrentBusinesses } = useAppConfig()
      const businesses = getCurrentBusinesses.value || []
      return businesses.filter(business =>
        business.location && business.location.lat && business.location.lng
      )
    }
  },

  actions: {
    /**
     * Load business data using app configuration
     */
    async loadData() {
      if (this.initialized) return

      this.loading = true
      this.error = null

      try {
        const { initializeApp, getCurrentBusinesses } = useAppConfig()

        // Initialize app configuration
        await initializeApp()

        // Verify we have business data
        const businesses = getCurrentBusinesses.value
        if (!businesses || businesses.length === 0) {
          throw new Error('No business data available for current location')
        }

        this.lastUpdated = new Date().toISOString()
        this.initialized = true

        console.log('✅ Dynamic business store initialized with', businesses.length, 'businesses')
      } catch (error) {
        this.error = error.message
        console.error('❌ Failed to load dynamic business data:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Switch to a different location
     */
    async switchLocation(newLocation) {
      this.loading = true
      this.error = null

      try {
        const { setLocation } = useAppConfig()
        await setLocation(newLocation)

        this.lastUpdated = new Date().toISOString()

        console.log(`✅ Switched to location: ${newLocation}`)
      } catch (error) {
        this.error = error.message
        console.error('❌ Failed to switch location:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Refresh business data for current location
     */
    async refreshData() {
      this.loading = true
      this.error = null

      try {
        const { loadLocationData, currentLocation } = useAppConfig()
        await loadLocationData(currentLocation.value)

        this.lastUpdated = new Date().toISOString()

        console.log('✅ Business data refreshed')
      } catch (error) {
        this.error = error.message
        console.error('❌ Failed to refresh business data:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Get app information
     */
    getAppInfo() {
      const { getAppInfo } = useAppConfig()
      return getAppInfo.value
    },

    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(featureName) {
      const { isFeatureEnabled } = useAppConfig()
      return isFeatureEnabled(featureName)
    }
  }
})