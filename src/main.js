/**
 * KSocial - Main Application Entry Point
 *
 * Initializes the Vue 3 SPA with:
 * 1. Pinia state management
 * 2. Vue Router
 * 3. Modular CSS design system
 * 4. Performance monitoring
 * 5. Mobile gesture handling
 * 6. Data preloading
 *
 * Scalability: Adding a new city requires only a new
 * /public/config/locations/{city}/ folder with businesses.json and events.json.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

import { initPerformanceMonitoring } from './utils/performance.js'
import { initMobileGestures } from './utils/gestures.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

import { useBusinessStore } from './stores/businessStore'

const businessStore = useBusinessStore()

businessStore.loadData().then(() => {
  const performanceMonitor = initPerformanceMonitoring()
  const mobileGestures = initMobileGestures(router)

  app.config.globalProperties.$performance = performanceMonitor
  app.config.globalProperties.$gestures = mobileGestures

  app.mount('#app')

  if (import.meta.env.DEV) {
    console.log('KSocial initialized')
    console.log('Mobile optimizations active')
    console.log(`${businessStore.businesses.length} businesses loaded`)
  }
})
