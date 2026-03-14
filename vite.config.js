/**
 * KSocial - Vite Configuration
 *
 * Complete build configuration for a mobile-optimized, app store ready PWA.
 * This configuration provides:
 *
 * 1. Vue 3 Single File Component support
 * 2. Progressive Web App (PWA) functionality with service worker
 * 3. Mobile-first performance optimizations
 * 4. Code splitting for optimal loading
 * 5. App store readiness (iOS & Android)
 *
 * Key Features:
 * - Intelligent caching strategies for offline functionality
 * - Comprehensive PWA manifest for native app installation
 * - Bundle optimization for mobile networks
 * - Development server with hot module replacement
 * - Production builds optimized for Core Web Vitals
 *
 * Performance Optimizations:
 * - CSS code splitting for faster initial loads
 * - Vendor chunk separation for better caching
 * - Tree shaking to eliminate unused code
 * - Minification with Terser for smaller bundles
 * - Browser compatibility for modern mobile devices
 */

// ===== BUILD TOOL IMPORTS =====
import { defineConfig } from 'vite'        // Vite configuration factory
import vue from '@vitejs/plugin-vue'       // Vue 3 Single File Component support
import { VitePWA } from 'vite-plugin-pwa'  // Progressive Web App plugin
import path from 'path'                    // Node.js path utilities

/**
 * Vite Configuration Export
 *
 * Exports a complete configuration object for Vite build tool
 * with plugins, optimizations, and development server settings.
 */
export default defineConfig({
  // ===== PLUGIN CONFIGURATION =====
  plugins: [
    // Vue 3 plugin for Single File Component support
    vue(),

    /**
     * Progressive Web App (PWA) Plugin Configuration
     *
     * Provides complete PWA functionality including:
     * - Service worker generation for offline functionality
     * - Web app manifest for native app installation
     * - Caching strategies for optimal performance
     * - App store readiness for iOS and Android submission
     */
    VitePWA({
      // ===== SERVICE WORKER CONFIGURATION =====
      /**
       * Register Type: Auto Update
       * Automatically updates the service worker when new versions are available
       * Provides seamless updates without user intervention
       */
      registerType: 'autoUpdate',

      /**
       * Workbox Configuration
       * Advanced service worker generation with Google Workbox
       * Provides intelligent caching strategies for different resource types
       */
      workbox: {
        /**
         * Global Patterns for Precaching
         * These file types are cached immediately when the app is installed
         * Ensures core functionality works offline from first visit
         */
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp}'],

        /**
         * Runtime Caching Strategies
         * Defines how different types of resources should be cached and served
         * Optimized for mobile networks and offline functionality
         */
        runtimeCaching: [
          /**
           * Unsplash Images Caching
           * Cache strategy for high-quality business and category images
           * Uses CacheFirst for fast loading with 30-day expiration
           */
          {
            urlPattern: /^https:\/\/images\.unsplash\.com/,
            handler: 'CacheFirst',        // Serve from cache first, fetch if not available
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 100,          // Store up to 100 images
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days cache duration
              }
            }
          },

          /**
           * External Images Caching
           * General strategy for other external images (business logos, etc.)
           * Shorter cache duration for more frequent updates
           */
          {
            urlPattern: /^https:\/\/.*\.(jpg|jpeg|png|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images',
              expiration: {
                maxEntries: 50,           // Smaller cache for external images
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days cache duration
              }
            }
          }
        ]
      },
      // ===== ADDITIONAL PWA ASSETS =====
      /**
       * Include Assets
       * Additional assets to include in the PWA bundle
       * These are referenced by the manifest and used by different platforms
       */
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],

      // ===== DEVELOPMENT OPTIONS =====
      /**
       * Development PWA Options
       * Enables PWA functionality during development for testing
       * Allows testing of offline functionality and service worker behavior
       */
      devOptions: {
        enabled: true    // Enable PWA features in development mode
      },

      /**
       * Web App Manifest Configuration
       *
       * Defines how the app appears when installed on devices
       * Critical for app store submission and native app experience
       * Follows W3C Web App Manifest specification
       */
      manifest: {
        // ===== APP IDENTITY =====
        /**
         * App Name (Full)
         * Complete app name shown in app stores and installation prompts
         * Should be descriptive and include key branding elements
         */
        name: 'KSocial - Kalamazoo\'s Social Hub',

        /**
         * Short Name
         * Abbreviated name for home screen icons and limited space
         * Maximum 12 characters recommended for all platforms
         */
        short_name: 'KSocial',

        /**
         * App Description
         * Detailed description for app stores and search engines
         * Should include key features and target audience information
         */
        description: 'Kalamazoo\'s social hub - happy hours, food specials, live music, and events all in one place',

        // ===== VISUAL BRANDING =====
        /**
         * Theme Color
         * Brand color shown in browser UI and splash screens
         * Uses KSocial orange (#FF6B35) from the brand palette
         */
        theme_color: '#FF6B35',

        /**
         * Background Color
         * Background color for splash screen and app loading
         * Uses rich black (#1A1A2E) for luxury aesthetic
         */
        background_color: '#1A1A2E',

        // ===== DISPLAY CONFIGURATION =====
        /**
         * Display Mode: Standalone
         * Makes app feel like a native mobile application
         * Hides browser UI elements for immersive experience
         */
        display: 'standalone',

        /**
         * Orientation: Portrait
         * Optimizes for mobile portrait usage
         * Matches luxury mobile app design patterns
         */
        orientation: 'portrait',

        /**
         * Start URL
         * Default page when app is launched from home screen
         * Uses root path for consistent entry point
         */
        start_url: '/',

        /**
         * Scope
         * Defines which pages are part of the PWA experience
         * Root scope includes all app pages
         */
        scope: '/',

        // ===== APP STORE CATEGORIES =====
        /**
         * Categories
         * Helps app stores categorize the application
         * Important for discoverability and proper classification
         */
        categories: ['lifestyle', 'travel', 'entertainment', 'business'],

        // ===== APP ICONS CONFIGURATION =====
        /**
         * Icons Array
         * Defines all icon sizes for different platforms and use cases
         * Critical for app store submission and home screen installation
         */
        icons: [
          /**
           * Small Icon (64x64)
           * Used for notifications and small UI elements
           */
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },

          /**
           * Medium Icon (192x192)
           * Standard PWA icon size for most platforms
           * Used in installation prompts and app listings
           */
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },

          /**
           * Large Icon (512x512)
           * High-resolution icon for splash screens and app stores
           * Required for PWA compliance and optimal quality
           */
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },

          /**
           * Maskable Icon (512x512)
           * Special icon format for adaptive theming on Android
           * Allows the icon to adapt to different shapes and themes
           */
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'    // Supports adaptive icon themes
          }
        ]
      }
    })
  ],

  // ===== DEVELOPMENT CONFIGURATION =====
  /**
   * Path Resolution Configuration
   * Sets up import aliases for cleaner, more maintainable code
   * Allows using '@' as shorthand for './src' directory
   *
   * Example usage in components:
   * import BusinessCard from '@/components/Business/BusinessCard.vue'
   * import { useBusinessStore } from '@/stores/businessStore'
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')    // '@' maps to './src' directory
    }
  },

  /**
   * Development Server Configuration
   * Optimized for mobile development with hot module replacement
   * Automatically opens browser for immediate development feedback
   */
  server: {
    port: 3000,        // Consistent development port
    open: true         // Auto-open browser when starting dev server
  },

  // ===== PRODUCTION BUILD CONFIGURATION =====
  /**
   * Build Configuration for Mobile Performance
   * Optimizes the application for mobile devices and app store submission
   * Focuses on bundle size, loading speed, and Core Web Vitals performance
   */
  build: {
    /**
     * Browser Targets
     * Defines minimum browser versions for compatibility
     * Balances modern features with device support for luxury mobile experience
     */
    target: ['es2015', 'chrome58', 'firefox57', 'safari11', 'edge79'],

    /**
     * CSS Code Splitting
     * Separates CSS into individual chunks for faster loading
     * Reduces initial bundle size and improves First Contentful Paint
     */
    cssCodeSplit: true,

    /**
     * Source Maps Configuration
     * Disabled in production for smaller bundle sizes
     * Can be enabled for debugging production issues if needed
     */
    sourcemap: false,

    /**
     * JavaScript Minification
     * Uses Terser for aggressive compression while maintaining functionality
     * Critical for mobile networks and app store size requirements
     */
    minify: 'terser',

    /**
     * Terser Optimization Options
     * Advanced compression settings for maximum mobile performance
     * Removes development code that shouldn't reach production
     */
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.log statements in production
        drop_debugger: true    // Remove debugger statements for security
      }
    },

    /**
     * Rollup Bundle Configuration
     * Manual chunk splitting for optimal caching and loading performance
     * Separates vendor libraries from application code for better cache efficiency
     */
    rollupOptions: {
      output: {
        /**
         * Manual Chunks Strategy
         * Splits code into logical groups for optimal loading:
         *
         * - vendor: Core Vue framework (changes infrequently, long cache)
         * - maps: Leaflet mapping library (large, lazy-loaded when needed)
         * - ui: UI utilities like QR codes (feature-specific loading)
         *
         * Benefits:
         * - Faster initial loads (smaller main bundle)
         * - Better caching (vendor code cached longer)
         * - Parallel loading (browser can fetch multiple chunks)
         */
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],    // Core framework code
          maps: ['leaflet'],                         // Mapping functionality
          ui: ['qrcode.vue']                         // UI utility libraries
        }
      }
    }
  },

  // ===== DEPENDENCY OPTIMIZATION =====
  /**
   * Vite Dependency Pre-bundling
   * Pre-bundles dependencies during development for faster hot module replacement
   * Ensures consistent behavior between development and production builds
   *
   * These dependencies are:
   * - Converted to ES modules for better Vite compatibility
   * - Cached for faster subsequent development server starts
   * - Optimized for hot module replacement during development
   */
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'leaflet']
  }
})
