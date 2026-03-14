/*
 * LEGACY Business Store - DEPRECATED
 *
 * ⚠️ This store is deprecated in favor of the dynamic configuration system.
 * Please use useDynamicBusinessStore and useAppConfig instead.
 *
 * This file is kept for backward compatibility but should not be used
 * for new development. All business data is now managed through:
 * - /public/config/locations/{location}/businesses.json
 * - src/composables/useAppConfig.js
 * - src/stores/dynamicBusinessStore.js
 */

import { defineStore } from 'pinia'
import { useDynamicBusinessStore } from './dynamicBusinessStore'

export const useBusinessStore = defineStore('business', {
  state: () => ({
    // Legacy state - now redirected to dynamic store
    businesses: [],
    categories: [],
    ads: [],
    loading: false,
    lastUpdated: null,
    initialized: false
  }),

  getters: {
    getBusinessesByCategory: (state) => (categoryName) => {
      // Redirect to dynamic store
      const dynamicStore = useDynamicBusinessStore()
      return dynamicStore.getBusinessesByCategory(categoryName)
    },

    getBusinessesBySubcategory: (state) => (categoryName, subcategoryName) => {
      // Redirect to dynamic store for now - could be enhanced
      const dynamicStore = useDynamicBusinessStore()
      return dynamicStore.getBusinessesByCategory(categoryName)
        .filter(b => b.subcategory?.toLowerCase() === subcategoryName.toLowerCase())
    },

    getBusinessById: (state) => (id) => {
      // Redirect to dynamic store
      const dynamicStore = useDynamicBusinessStore()
      return dynamicStore.getBusinessById(id)
    },

    searchBusinesses: (state) => (query) => {
      // Redirect to dynamic store
      const dynamicStore = useDynamicBusinessStore()
      return dynamicStore.searchBusinesses(query)
    },

    /**
     * Gets interstitial advertisement for a specific category
     * Note: This provides basic ad functionality - extend as needed
     */
    getInterstitialAd: (state) => (categoryName) => {
      return state.ads.find(
        ad => ad.type === 'interstitial' &&
              ad.category.toLowerCase() === categoryName.toLowerCase()
      )
    },

    /**
     * Gets banner advertisement for a category and position
     * Note: This provides basic ad functionality - extend as needed
     */
    getBannerAd: (state) => (categoryName, position = 'hero') => {
      return state.ads.find(
        ad => ad.type === 'banner' &&
              ad.category.toLowerCase() === categoryName.toLowerCase() &&
              ad.position === position
      )
    }
  },

  actions: {
    async loadData() {
      console.warn('⚠️ DEPRECATED: useBusinessStore.loadData() is deprecated. Use useDynamicBusinessStore.loadData() instead.')

      // Load legacy ads for backward compatibility
      this.loading = true
      try {
        this.ads = await this.fetchAds()
        this.initialized = true
        this.lastUpdated = new Date()

        // Also initialize the dynamic store
        const dynamicStore = useDynamicBusinessStore()
        await dynamicStore.loadData()

        console.log('✅ Legacy business store loaded (redirects to dynamic store)')
      } catch (error) {
        console.error('❌ Error loading legacy business data:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchBusinesses() {
      // No longer returns hardcoded data - redirects to dynamic store
      console.warn('⚠️ DEPRECATED: fetchBusinesses() no longer returns hardcoded data. Use dynamic configuration system.')
      return []
    },

    async fetchCategories() {
      console.warn('⚠️ DEPRECATED: fetchCategories() is deprecated. Use useAppConfig.getCategories() instead.')
      return []
    },

    async fetchAds() {
      // Simplified ads - extend as needed for location-aware functionality
      return [
        // Basic interstitial ads for major categories
        {
          id: 1,
          type: "interstitial",
          category: "Dining",
          image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&crop=center",
          title: "Premium Dining",
          description: "Discover exceptional dining experiences",
          cta_text: "Explore Dining",
          priority: 1
        },
        {
          id: 2,
          type: "interstitial",
          category: "Cocktail Hour",
          image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop&crop=center",
          title: "Cocktail Hour",
          description: "Craft cocktails and premium spirits",
          cta_text: "Explore Cocktail Hour",
          priority: 1
        },
        {
          id: 3,
          type: "interstitial",
          category: "Shopping",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&crop=center",
          title: "Luxury Shopping",
          description: "Discover premium retail experiences",
          cta_text: "Explore Shopping",
          priority: 1
        }
      ]
    }
  }
})