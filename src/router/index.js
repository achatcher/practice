/**
 * KSocial - Vue Router Configuration
 *
 * Routing structure for the city social hub.
 * Focus: Happy Hours, Food Specials, Events, and local venue discovery.
 *
 * Application Flow:
 * Home → Category/Feature → Venue/Event Listing → Detail
 *
 * Route Hierarchy:
 * 1. Core: Home, Happy Hours, Events, Map
 * 2. Discovery: Category listing → Business detail
 * 3. Utility: Search, Share, Contact
 */

import { createRouter, createWebHistory } from 'vue-router'

// Core views
import HomeView from '@/views/HomeView.vue'
import HappyHoursView from '@/views/CocktailHourView.vue'   // Reused as Happy Hours
import EventsView from '@/views/EventsView.vue'
import MapView from '@/views/MapView.vue'
import SearchView from '@/views/SearchView.vue'

// Discovery flow
import CategoryListingView from '@/views/CategoryListingView.vue'
import BusinessDetailView from '@/views/BusinessDetailView.vue'

// Utility
import ContactView from '@/views/ContactView.vue'
import ShareView from '@/views/ShareView.vue'
import ServicesView from '@/views/ServicesView.vue'
import AdminView from '@/views/AdminView.vue'

const APP_NAME = 'KSocial'

const routes = [
  // ===== HOME =====
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: `${APP_NAME} - Your City's Social Hub`,
      description: 'Happy hours, food specials, and events happening in your city'
    }
  },

  // ===== HAPPY HOURS =====
  // Primary feature: time-sensitive drink & food deals by day
  {
    path: '/happy-hours',
    name: 'HappyHours',
    component: HappyHoursView,
    meta: {
      title: `Happy Hours - ${APP_NAME}`,
      description: "Today's best drink and food deals near you"
    }
  },

  // ===== EVENTS =====
  {
    path: '/events',
    name: 'Events',
    component: EventsView,
    meta: {
      title: `Events - ${APP_NAME}`,
      description: "What's happening around town this week"
    }
  },

  // ===== EXPLORE MAP =====
  {
    path: '/explore',
    name: 'Explore',
    component: MapView,
    meta: {
      title: `Explore - ${APP_NAME}`,
      description: 'Find spots near you on the map'
    }
  },

  // ===== CATEGORY LISTING =====
  // Used for Food Specials, Live Music, Brunch, Sports Bars, Late Night, etc.
  {
    path: '/category/:categoryName',
    name: 'CategoryListing',
    component: CategoryListingView,
    meta: {
      title: `${APP_NAME}`,
      description: 'Browse venues and deals by category'
    }
  },

  // ===== BUSINESS DETAIL =====
  {
    path: '/business/:businessId',
    name: 'BusinessDetail',
    component: BusinessDetailView,
    meta: {
      title: `${APP_NAME}`,
      description: 'Venue details, hours, deals, and contact info'
    }
  },

  // ===== SEARCH =====
  {
    path: '/search',
    name: 'Search',
    component: SearchView,
    meta: {
      title: `Search - ${APP_NAME}`,
      description: 'Search venues, deals, and events'
    }
  },

  // ===== SHARE =====
  {
    path: '/share',
    name: 'Share',
    component: ShareView,
    meta: {
      title: `Share - ${APP_NAME}`,
      description: 'Share KSocial with friends'
    }
  },

  // ===== SERVICES =====
  {
    path: '/services',
    name: 'Services',
    component: ServicesView,
    meta: {
      title: `Services - ${APP_NAME}`,
      description: 'Spas, salons, and wellness services near you'
    }
  },

  // ===== ADMIN =====
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { title: `Admin - ${APP_NAME}` }
  },

  // ===== CONTACT =====
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: {
      title: `Contact - ${APP_NAME}`,
      description: 'Get in touch with the KSocial team'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// Update page title and meta description on each navigation
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else if (to.params.categoryName) {
    document.title = `${to.params.categoryName} - ${APP_NAME}`
  } else {
    document.title = APP_NAME
  }

  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }

  next()
})

router.afterEach((to) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_title: document.title,
      page_location: window.location.href
    })
  }
})

export default router
