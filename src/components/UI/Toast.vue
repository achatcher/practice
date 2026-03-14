<template>
  <Teleport to="body">
    <div class="toast-container">
      <Transition
        v-for="toast in toasts"
        :key="toast.id"
        name="toast"
        appear
      >
        <div
          class="toast"
          :class="[toast.type, { 'toast-dismissible': toast.dismissible }]"
        >
          <div class="toast-icon">
            {{ getIcon(toast.type) }}
          </div>
          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button
            v-if="toast.dismissible !== false"
            class="toast-dismiss"
            @click="dismiss(toast.id)"
          >
            ✕
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])
let nextId = 1

const getIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳'
  }
  return icons[type] || icons.info
}

const addToast = (options) => {
  const toast = {
    id: nextId++,
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    duration: options.duration ?? 5000,
    dismissible: options.dismissible !== false,
    ...options
  }

  toasts.value.push(toast)

  if (toast.duration > 0) {
    setTimeout(() => {
      dismiss(toast.id)
    }, toast.duration)
  }

  return toast.id
}

const dismiss = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const dismissAll = () => {
  toasts.value = []
}

// Convenience methods
const success = (message, options = {}) => {
  return addToast({ ...options, type: 'success', message })
}

const error = (message, options = {}) => {
  return addToast({ ...options, type: 'error', message, duration: 8000 })
}

const warning = (message, options = {}) => {
  return addToast({ ...options, type: 'warning', message })
}

const info = (message, options = {}) => {
  return addToast({ ...options, type: 'info', message })
}

const loading = (message, options = {}) => {
  return addToast({ ...options, type: 'loading', message, duration: 0 })
}

// Expose methods for external use
defineExpose({
  addToast,
  dismiss,
  dismissAll,
  success,
  error,
  warning,
  info,
  loading
})

// Global toast instance
onMounted(() => {
  // Make toast methods available globally
  window.$toast = {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-lg);
  border: 1px solid transparent;
  min-width: 300px;
}

.toast.success {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.3);
  color: var(--color-success);
}

.toast.error {
  background: rgba(255, 68, 68, 0.1);
  border-color: rgba(255, 68, 68, 0.3);
  color: var(--color-error);
}

.toast.warning {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  color: var(--color-warning);
}

.toast.info {
  background: rgba(0, 217, 255, 0.1);
  border-color: rgba(0, 217, 255, 0.3);
  color: var(--color-info);
}

.toast.loading {
  background: rgba(0, 217, 255, 0.1);
  border-color: rgba(0, 217, 255, 0.3);
  color: var(--color-info);
}

.toast-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-1);
  color: var(--color-text-primary);
}

.toast-message {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}

.toast-dismiss {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-1);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
  transition: var(--transition-all);
}

.toast-dismiss:hover {
  color: var(--color-text-primary);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile responsive */
@media (max-width: 640px) {
  .toast-container {
    left: var(--space-4);
    right: var(--space-4);
    top: var(--space-4);
    max-width: none;
  }

  .toast {
    min-width: auto;
  }
}
</style>