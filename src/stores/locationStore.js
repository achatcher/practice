// stores/locationStore.js
import { defineStore } from 'pinia'
import { getCurrentLocation, calculateDistance } from '@/utils/helpers'

export const useLocationStore = defineStore('location', {
  state: () => ({
    userLocation: null,
    permissionGranted: false,
    loading: false,
    error: null
  }),

  getters: {
    hasLocation: (state) => state.userLocation !== null,
    
    // Calculate distance from user to a business
    distanceTo: (state) => (businessLat, businessLng) => {
      if (!state.userLocation) return null
      return calculateDistance(
        state.userLocation.lat,
        state.userLocation.lng,
        businessLat,
        businessLng
      )
    }
  },

  actions: {
    async requestLocation() {
      this.loading = true
      this.error = null
      
      try {
        const location = await getCurrentLocation()
        this.userLocation = location
        this.permissionGranted = true
        return location
      } catch (error) {
        this.error = error.message
        this.permissionGranted = false
        // Fallback to default center (Kalamazoo, MI)
        this.userLocation = { lat: 42.2917, lng: -85.5872 }
        throw error
      } finally {
        this.loading = false
      }
    },

    setLocation(lat, lng) {
      this.userLocation = { lat, lng }
    },

    clearLocation() {
      this.userLocation = null
      this.permissionGranted = false
      this.error = null
    }
  }
})
