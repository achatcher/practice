/*
 * Events Store - KSocial
 *
 * Provides event filtering getters and favorites management.
 * Event data is sourced from useAppConfig().getCurrentEvents
 * (loaded from /public/config/locations/{city}/events.json)
 */

import { defineStore } from 'pinia'
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'

export const useEventsStore = defineStore('events', {
  state: () => ({
    favorites: [],
    loading: false,
    initialized: false
  }),

  getters: {
    events() {
      const { getCurrentEvents } = useAppConfig()
      return getCurrentEvents.value || []
    },

    categories() {
      const { getCurrentEvents } = useAppConfig()
      const events = getCurrentEvents.value || []
      const seen = new Set()
      return events
        .map(e => e.category)
        .filter(c => c && !seen.has(c) && seen.add(c))
        .map((name, i) => ({ id: i + 1, name }))
    },

    getUpcomingEvents() {
      const now = new Date()
      const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      return this.events
        .filter(e => {
          const d = new Date(e.date)
          return d >= now && d <= thirtyDaysOut
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    getEventsThisWeekend() {
      const now = new Date()
      const friday = new Date(now)
      friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7)
      friday.setHours(0, 0, 0, 0)
      const sunday = new Date(friday)
      sunday.setDate(friday.getDate() + 2)
      sunday.setHours(23, 59, 59, 999)
      return this.events
        .filter(e => {
          const d = new Date(e.date)
          return d >= friday && d <= sunday
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    getTodaysEvents() {
      const todayStr = new Date().toDateString()
      return this.events
        .filter(e => new Date(e.date).toDateString() === todayStr)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    },

    getFeaturedEvents() {
      return this.events
        .filter(e => e.featured || e.tier === 'featured')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
    },

    isEventFavorite: (state) => (eventId) => {
      return state.favorites.includes(eventId)
    }
  },

  actions: {
    // Called from main.js and components — initializes app config data
    async loadEventsData() {
      if (this.initialized) return
      this.loading = true
      try {
        const { initializeApp } = useAppConfig()
        await initializeApp()
        this.initialized = true
      } catch (err) {
        console.warn('Events data load failed:', err.message)
      } finally {
        this.loading = false
      }
    },

    async refreshEvents() {
      this.initialized = false
      await this.loadEventsData()
    },

    getEventsForDate(dateString) {
      return this.events.filter(e => {
        if (e.date === dateString) return true
        if (e.endDate) {
          return new Date(dateString) >= new Date(e.date) && new Date(dateString) <= new Date(e.endDate)
        }
        return false
      }).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    },

    addToFavorites(eventId) {
      if (!this.favorites.includes(eventId)) {
        this.favorites.push(eventId)
        analytics.track('event_favorited', { eventId })
      }
    },

    removeFromFavorites(eventId) {
      const index = this.favorites.indexOf(eventId)
      if (index > -1) this.favorites.splice(index, 1)
    }
  }
})
