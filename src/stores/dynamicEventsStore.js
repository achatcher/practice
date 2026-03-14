/*
 * Dynamic Events Store - Location-Agnostic Event Management
 *
 * Uses the app configuration system to load events dynamically
 * based on the current location. Supports multi-location deployments.
 */

import { defineStore } from 'pinia'
import { useAppConfig } from '@/composables/useAppConfig'

export const useDynamicEventsStore = defineStore('dynamicEvents', {
  state: () => ({
    loading: false,
    error: null,
    lastUpdated: null,
    initialized: false,
    favorites: []
  }),

  getters: {
    /**
     * Get all events for current location
     */
    events: () => {
      const { getCurrentEvents } = useAppConfig()
      return getCurrentEvents.value || []
    },

    /**
     * Get events by tier
     */
    getEventsByTier: () => (tierName) => {
      const { getEventsByTier } = useAppConfig()
      return getEventsByTier(tierName)
    },

    /**
     * Get featured events (signature and premier tiers)
     */
    getFeaturedEvents: () => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      return events
        .filter(event => event.tier === 'signature' || event.featured)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    /**
     * Get signature event (highest tier)
     */
    getSignatureEvent: () => {
      const { getEventsByTier } = useAppConfig()
      const signatureEvents = getEventsByTier('signature')
      return signatureEvents.length > 0 ? signatureEvents[0] : null
    },

    /**
     * Get upcoming events
     */
    getUpcomingEvents: () => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      const now = new Date()

      return events
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    /**
     * Get events for a specific date
     */
    getEventsForDate: () => (dateString) => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      return events.filter(event => event.date === dateString)
    },

    /**
     * Get events by category
     */
    getEventsByCategory: () => (categoryName) => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      return events.filter(event =>
        event.category.toLowerCase() === categoryName.toLowerCase()
      )
    },

    /**
     * Get this weekend's events
     */
    getEventsThisWeekend: () => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      const now = new Date()
      const dayOfWeek = now.getDay()
      const daysUntilSaturday = (6 - dayOfWeek) % 7
      const saturday = new Date(now)
      saturday.setDate(now.getDate() + daysUntilSaturday)
      const sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)

      const saturdayStr = saturday.toISOString().split('T')[0]
      const sundayStr = sunday.toISOString().split('T')[0]

      return events.filter(event =>
        event.date === saturdayStr || event.date === sundayStr
      )
    },

    /**
     * Get today's events
     */
    getTodaysEvents: () => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      const today = new Date().toISOString().split('T')[0]
      return events.filter(event => event.date === today)
    },

    /**
     * Get available event categories
     */
    categories: () => {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      const categories = [...new Set(events.map(event => event.category))]
      return categories.sort().map((name, index) => ({
        id: index + 1,
        name,
        icon: getCategoryIcon(name)
      }))
    },

    /**
     * Check if event is favorited
     */
    isEventFavorite: (state) => (eventId) => {
      return state.favorites.includes(eventId)
    }
  },

  actions: {
    /**
     * Load events data using app configuration
     */
    async loadEventsData() {
      if (this.initialized) return

      this.loading = true
      this.error = null

      try {
        const { initializeApp, getCurrentEvents } = useAppConfig()

        // Initialize app configuration
        await initializeApp()

        // Verify we have events data
        const events = getCurrentEvents.value
        if (!events) {
          console.warn('⚠️ No events data available for current location')
        }

        this.lastUpdated = new Date().toISOString()
        this.initialized = true

        console.log('✅ Dynamic events store initialized with', (events || []).length, 'events')
      } catch (error) {
        this.error = error.message
        console.error('❌ Failed to load dynamic events data:', error)
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

        console.log(`✅ Events switched to location: ${newLocation}`)
      } catch (error) {
        this.error = error.message
        console.error('❌ Failed to switch events location:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Refresh events data
     */
    async refreshEvents() {
      this.loading = true
      this.error = null

      try {
        const { loadLocationData, currentLocation } = useAppConfig()
        await loadLocationData(currentLocation.value)

        this.lastUpdated = new Date().toISOString()

        console.log('✅ Events data refreshed')
      } catch (error) {
        this.error = error.message
        console.error('❌ Failed to refresh events data:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Add event to favorites
     */
    addToFavorites(eventId) {
      if (!this.favorites.includes(eventId)) {
        this.favorites.push(eventId)
        // Save to localStorage
        localStorage.setItem('event-favorites', JSON.stringify(this.favorites))
        console.log('✅ Event added to favorites:', eventId)
      }
    },

    /**
     * Remove event from favorites
     */
    removeFromFavorites(eventId) {
      const index = this.favorites.indexOf(eventId)
      if (index > -1) {
        this.favorites.splice(index, 1)
        // Save to localStorage
        localStorage.setItem('event-favorites', JSON.stringify(this.favorites))
        console.log('✅ Event removed from favorites:', eventId)
      }
    },

    /**
     * Load favorites from localStorage
     */
    loadFavorites() {
      try {
        const saved = localStorage.getItem('event-favorites')
        if (saved) {
          this.favorites = JSON.parse(saved)
          console.log('✅ Loaded', this.favorites.length, 'favorite events')
        }
      } catch (error) {
        console.error('❌ Failed to load favorite events:', error)
        this.favorites = []
      }
    }
  }
})

/**
 * Helper function to get category icons
 */
function getCategoryIcon(categoryName) {
  const iconMap = {
    'Food & Wine': '🍷',
    'Music & Arts': '🎵',
    'Arts & Culture': '🎨',
    'Sports': '⚽',
    'Business': '💼',
    'Community': '🤝',
    'Entertainment': '🎭',
    'Festival': '🎪',
    'Holiday': '🎄'
  }
  return iconMap[categoryName] || '📅'
}