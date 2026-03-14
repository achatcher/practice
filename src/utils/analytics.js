/**
 * Analytics and Performance Monitoring Utilities
 *
 * Provides professional analytics tracking and performance monitoring
 * for the KSocial app. Supports multiple analytics providers and custom events.
 */

class Analytics {
  constructor() {
    this.isInitialized = false
    this.debugMode = import.meta.env.DEV
    this.queue = []
    this.performance = new PerformanceMonitor()
  }

  /**
   * Initialize analytics with configuration
   */
  init(config = {}) {
    this.config = {
      gtag: config.gtag || null,
      facebook: config.facebook || null,
      custom: config.custom || null,
      ...config
    }

    if (this.config.gtag) {
      this.initGoogleAnalytics(this.config.gtag)
    }

    if (this.config.facebook) {
      this.initFacebookPixel(this.config.facebook)
    }

    this.isInitialized = true
    this.flushQueue()

    this.log('Analytics initialized', this.config)
  }

  /**
   * Initialize Google Analytics 4
   */
  initGoogleAnalytics(measurementId) {
    // Load gtag if not already loaded
    if (!window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function() { dataLayer.push(arguments) }
    }

    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    })

    this.log('Google Analytics initialized', measurementId)
  }

  /**
   * Initialize Facebook Pixel
   */
  initFacebookPixel(pixelId) {
    if (!window.fbq) {
      const script = document.createElement('script')
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      `
      document.head.appendChild(script)
    }

    window.fbq('init', pixelId)
    window.fbq('track', 'PageView')

    this.log('Facebook Pixel initialized', pixelId)
  }

  /**
   * Track page views
   */
  pageView(path, title) {
    const event = {
      type: 'page_view',
      path: path || window.location.pathname,
      title: title || document.title,
      timestamp: Date.now()
    }

    if (!this.isInitialized) {
      this.queue.push(event)
      return
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', this.config.gtag, {
        page_path: event.path,
        page_title: event.title
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView')
    }

    this.log('Page view tracked', event)
  }

  /**
   * Track custom events
   */
  track(eventName, properties = {}) {
    const event = {
      type: 'event',
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        page: window.location.pathname,
        user_agent: navigator.userAgent
      }
    }

    if (!this.isInitialized) {
      this.queue.push(event)
      return
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        custom_parameters: properties,
        ...properties
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', eventName, properties)
    }

    this.log('Event tracked', event)
  }

  /**
   * Track business interactions
   */
  trackBusinessInteraction(businessId, action, properties = {}) {
    this.track('business_interaction', {
      business_id: businessId,
      action: action,
      ...properties
    })
  }

  /**
   * Track business lead generation
   */
  trackBusinessLead(business, leadType, properties = {}) {
    this.track('business_lead', {
      business_id: business.id || business.business_id,
      business_name: business.name || business.venue,
      business_tier: business.tier || business.listing_tier,
      business_category: business.category || business.subcategory,
      lead_type: leadType, // 'call', 'directions', 'website', 'modal_view', 'hero_click'
      lead_value: this.getLeadValue(leadType, business.tier),
      placement: properties.placement || 'unknown', // 'hero', 'search', 'category', 'happy_hour'
      ...properties
    })
  }

  /**
   * Track business impression (view without interaction)
   */
  trackBusinessImpression(business, placement, properties = {}) {
    this.track('business_impression', {
      business_id: business.id || business.business_id,
      business_name: business.name || business.venue,
      business_tier: business.tier || business.listing_tier,
      business_category: business.category || business.subcategory,
      placement: placement, // 'hero', 'search_results', 'category_listing', 'happy_hour'
      viewport_position: properties.viewport_position || 'unknown',
      ...properties
    })
  }

  /**
   * Track business modal/detail views
   */
  trackBusinessView(business, viewType = 'modal', properties = {}) {
    this.track('business_view', {
      business_id: business.id || business.business_id,
      business_name: business.name || business.venue,
      business_tier: business.tier || business.listing_tier,
      business_category: business.category || business.subcategory,
      view_type: viewType, // 'modal', 'detail_page', 'quick_view'
      view_duration: properties.view_duration || null,
      ...properties
    })
  }

  /**
   * Get lead value based on action and business tier
   */
  getLeadValue(leadType, tier) {
    const values = {
      signature: { call: 10, directions: 8, website: 5, modal_view: 2, hero_click: 3 },
      premier: { call: 8, directions: 6, website: 4, modal_view: 1.5, hero_click: 2 },
      standard: { call: 5, directions: 3, website: 2, modal_view: 1, hero_click: 1 }
    }

    const tierValues = values[tier] || values.standard
    return tierValues[leadType] || 1
  }

  /**
   * Track search queries
   */
  trackSearch(query, results, category = null) {
    this.track('search', {
      query: query,
      results_count: results,
      category: category
    })
  }

  /**
   * Track event interactions
   */
  trackEventInteraction(eventId, action, properties = {}) {
    this.track('event_interaction', {
      event_id: eventId,
      action: action,
      ...properties
    })
  }

  /**
   * Track app installs
   */
  trackInstall() {
    this.track('app_install', {
      platform: this.getPlatform(),
      install_method: 'pwa'
    })
  }

  /**
   * Track errors
   */
  trackError(error, context = {}) {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      context: context
    })
  }

  /**
   * Track performance metrics
   */
  trackPerformance() {
    const metrics = this.performance.getMetrics()
    this.track('performance', metrics)
  }

  /**
   * Get user platform
   */
  getPlatform() {
    const ua = navigator.userAgent
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
    if (/Android/.test(ua)) return 'android'
    if (/Windows/.test(ua)) return 'windows'
    if (/Macintosh/.test(ua)) return 'mac'
    return 'unknown'
  }

  /**
   * Flush queued events
   */
  flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift()
      if (event.type === 'page_view') {
        this.pageView(event.path, event.title)
      } else if (event.type === 'event') {
        this.track(event.name, event.properties)
      }
    }
  }

  /**
   * Debug logging
   */
  log(message, data) {
    if (this.debugMode) {
      console.log(`[Analytics] ${message}`, data)
    }
  }
}

/**
 * Performance Monitor
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.startTime = Date.now()

    if ('performance' in window) {
      this.observePerformance()
    }
  }

  /**
   * Observe performance metrics
   */
  observePerformance() {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = Math.round(entry.startTime)
            }
          }
        })
        observer.observe({ entryTypes: ['paint'] })
      } catch (e) {
        console.warn('Performance Observer not supported')
      }
    }

    // Page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        if (navigation) {
          this.metrics.dom_load = Math.round(navigation.domContentLoadedEventEnd)
          this.metrics.page_load = Math.round(navigation.loadEventEnd)
        }
      }, 0)
    })
  }

  /**
   * Mark performance timing
   */
  mark(name) {
    if ('performance' in window && performance.mark) {
      performance.mark(name)
    }
    this.metrics[name] = Date.now() - this.startTime
  }

  /**
   * Measure performance between marks
   */
  measure(name, startMark, endMark) {
    if ('performance' in window && performance.measure) {
      performance.measure(name, startMark, endMark)
    }
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      load_time: Date.now() - this.startTime,
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: this.getConnectionInfo()
    }
  }

  /**
   * Get connection information
   */
  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection
      return {
        effective_type: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt
      }
    }
    return null
  }
}

// Create global instance
const analytics = new Analytics()

// Auto-initialize with environment variables if available
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const config = {}

    // Check for analytics IDs in environment or meta tags
    const gtag = import.meta.env.VITE_GTAG_ID
    const facebook = import.meta.env.VITE_FACEBOOK_PIXEL_ID

    if (gtag) config.gtag = gtag
    if (facebook) config.facebook = facebook

    if (Object.keys(config).length > 0) {
      analytics.init(config)
    }
  })
}

export default analytics