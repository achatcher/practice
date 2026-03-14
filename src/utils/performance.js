/**
 * Mobile Performance Utilities
 *
 * Tools for monitoring and optimizing mobile app performance.
 * Includes Core Web Vitals tracking, mobile-specific optimizations, and performance monitoring.
 */

/**
 * Core Web Vitals Monitoring
 * Tracks LCP, FID, and CLS for mobile performance
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null
    }

    this.observers = []
    this.init()
  }

  init() {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    this.measureTTFB()
    this.measureLCP()
    this.measureFID()
    this.measureCLS()
  }

  /**
   * Time to First Byte (TTFB)
   */
  measureTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart
      this.reportMetric('TTFB', this.metrics.ttfb)
    }
  }

  /**
   * Largest Contentful Paint (LCP)
   */
  measureLCP() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.lcp = lastEntry.startTime
      this.reportMetric('LCP', this.metrics.lcp)
    })

    observer.observe({ type: 'largest-contentful-paint', buffered: true })
    this.observers.push(observer)
  }

  /**
   * First Input Delay (FID)
   */
  measureFID() {
    if (!('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime
        this.reportMetric('FID', this.metrics.fid)
      })
    })

    observer.observe({ type: 'first-input', buffered: true })
    this.observers.push(observer)
  }

  /**
   * Cumulative Layout Shift (CLS)
   */
  measureCLS() {
    if (!('PerformanceObserver' in window)) return

    let clsValue = 0
    let sessionValue = 0
    let sessionEntries = []

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()

      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value
            sessionEntries.push(entry)
          } else {
            sessionValue = entry.value
            sessionEntries = [entry]
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue
            this.metrics.cls = clsValue
            this.reportMetric('CLS', this.metrics.cls)
          }
        }
      })
    })

    observer.observe({ type: 'layout-shift', buffered: true })
    this.observers.push(observer)
  }

  /**
   * Report metric to console (can be extended to send to analytics)
   */
  reportMetric(name, value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}: ${Math.round(value * 100) / 100}ms`)
    }

    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(name, value)
  }

  /**
   * Send metrics to analytics service
   * Replace with your preferred analytics implementation
   */
  sendToAnalytics(name, value) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        custom_parameter_1: this.isMobile() ? 'mobile' : 'desktop'
      })
    }
  }

  /**
   * Detect if user is on mobile device
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * Clean up observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  /**
   * Get all collected metrics
   */
  getMetrics() {
    return { ...this.metrics }
  }
}

/**
 * Mobile-specific performance utilities
 */
export const MobilePerformance = {
  /**
   * Check if device has limited resources
   */
  isLowEndDevice() {
    // Check hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      return true
    }

    // Check memory (if available)
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
      return true
    }

    // Check connection speed
    if (navigator.connection) {
      const connection = navigator.connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return true
      }
    }

    return false
  },

  /**
   * Check if user is on a slow network
   */
  isSlowNetwork() {
    if (navigator.connection) {
      const connection = navigator.connection
      return connection.effectiveType === 'slow-2g' ||
             connection.effectiveType === '2g' ||
             connection.effectiveType === '3g'
    }
    return false
  },

  /**
   * Check if device prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },

  /**
   * Check if device prefers reduced data usage
   */
  prefersReducedData() {
    return window.matchMedia('(prefers-reduced-data: reduce)').matches
  },

  /**
   * Get battery level (if available)
   */
  async getBatteryLevel() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery()
        return battery.level
      } catch (error) {
        console.warn('Battery API not available:', error)
        return null
      }
    }
    return null
  },

  /**
   * Check if battery is low
   */
  async isLowBattery(threshold = 0.2) {
    const level = await this.getBatteryLevel()
    return level !== null && level < threshold
  }
}

/**
 * Image loading optimization
 */
export const ImageOptimization = {
  /**
   * Add lazy loading to images
   */
  enableLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading support
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        img.src = img.dataset.src
        img.loading = 'lazy'
        img.removeAttribute('data-src')
      })
    } else {
      // Fallback for older browsers
      this.intersectionObserverLazyLoad()
    }
  },

  /**
   * Intersection Observer fallback for lazy loading
   */
  intersectionObserverLazyLoad() {
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })

    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => {
      observer.observe(img)
    })
  },

  /**
   * Preload critical images
   */
  preloadCriticalImages(imagePaths) {
    imagePaths.forEach(path => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = path
      document.head.appendChild(link)
    })
  }
}

/**
 * Resource prioritization
 */
export const ResourcePrioritization = {
  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    // Preload critical fonts
    this.preloadFonts([
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ])
  },

  /**
   * Preload fonts with font-display: swap
   */
  preloadFonts(fontUrls) {
    fontUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url
      link.onload = function() {
        this.onload = null
        this.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    })
  },

  /**
   * Prefetch non-critical resources
   */
  prefetchResources(urls) {
    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      document.head.appendChild(link)
    })
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  // Start performance monitoring
  const monitor = new PerformanceMonitor()

  // Enable optimizations based on device capabilities
  if (MobilePerformance.isLowEndDevice()) {
    console.log('🔋 Low-end device detected - enabling performance optimizations')
    document.documentElement.classList.add('low-end-device')
  }

  if (MobilePerformance.isSlowNetwork()) {
    console.log('📶 Slow network detected - reducing resource usage')
    document.documentElement.classList.add('slow-network')
  }

  // Enable lazy loading
  ImageOptimization.enableLazyLoading()

  // Preload critical resources
  ResourcePrioritization.preloadCriticalResources()

  return monitor
}

export default {
  PerformanceMonitor,
  MobilePerformance,
  ImageOptimization,
  ResourcePrioritization,
  initPerformanceMonitoring
}