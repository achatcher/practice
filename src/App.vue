<!--
  KSocial - Root Application Component

  Main application wrapper providing:
  1. Global error boundary for graceful error handling
  2. Router view with smooth page transitions
  3. Global loading indicator
  4. Toast notification system
  5. Mobile-optimized layout with safe area support
-->

<template>
  <div id="app" :class="{ 'loading': isLoading }">

    <ErrorBoundary>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </ErrorBoundary>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <Toast ref="toastRef" />

    <transition name="slide">
      <SideMenu v-if="showSideMenu" @close="closeSideMenu" />
    </transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBusinessStore } from '@/stores/businessStore'
import ErrorBoundary from '@/components/UI/ErrorBoundary.vue'
import Toast from '@/components/UI/Toast.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'
import { useSideMenu } from '@/composables/useSideMenu'

const businessStore = useBusinessStore()
const toastRef = ref(null)

const isLoading = computed(() => businessStore.loading)
const { showSideMenu, closeSideMenu } = useSideMenu()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--brand-background, #0D0D1A);
  color: var(--brand-text-primary, #FFFFFF);
  overflow-x: hidden;
  line-height: 1.5;
}

/* ===== MOBILE-FIRST LAYOUT =====
   On small screens: full width (true mobile app feel)
   On larger screens: centered phone-width column with dark surround
*/
body {
  background: #0a0d1a !important;
}

#app {
  min-height: 100vh;
  position: relative;
  max-width: 480px;
  margin: 0 auto;
  background: var(--brand-background, #0D0D1A);
  box-shadow: 0 0 60px rgba(0,0,0,0.8);
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-primary-alpha-30, rgba(255, 107, 53, 0.3));
  border-top-color: var(--brand-primary, #FF6B35);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Utility Classes */
.text-center { text-align: center; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

/* Scrollbar Styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--brand-background, #0D0D1A); }
::-webkit-scrollbar-thumb {
  background: var(--brand-primary, #FF6B35);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark, #E55A25);
}

/* Mobile Safe Area */
@supports (padding: max(0px)) {
  #app {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
</style>
