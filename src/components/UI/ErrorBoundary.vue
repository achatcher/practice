<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">Oops! Something went wrong</h2>
      <p class="error-message">{{ errorMessage }}</p>

      <div class="error-actions">
        <button class="btn btn-primary" @click="retry">
          🔄 Try Again
        </button>
        <button class="btn btn-secondary" @click="goHome">
          🏠 Go Home
        </button>
      </div>

      <details v-if="isDevelopment" class="error-details">
        <summary>Technical Details</summary>
        <pre class="error-stack">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['error'])
const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const isDevelopment = import.meta.env.DEV

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  // Reload the current route
  router.go(0)
}

const goHome = () => {
  router.push({ name: 'Home' })
}

onErrorCaptured((error, instance, info) => {
  console.error('Error captured:', error, info)

  hasError.value = true
  errorMessage.value = getUserFriendlyMessage(error)
  errorDetails.value = `${error.message}\n\n${error.stack}`

  emit('error', { error, instance, info })

  // Return false to prevent the error from propagating further
  return false
})

const getUserFriendlyMessage = (error) => {
  if (error.message?.includes('Network')) {
    return 'Unable to connect to the internet. Please check your connection and try again.'
  }

  if (error.message?.includes('Failed to fetch')) {
    return 'Unable to load data. Please check your internet connection.'
  }

  if (error.message?.includes('timeout')) {
    return 'The request took too long to complete. Please try again.'
  }

  if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
    return 'You need to sign in to access this feature.'
  }

  if (error.message?.includes('404') || error.message?.includes('Not Found')) {
    return 'The requested information could not be found.'
  }

  if (error.message?.includes('500') || error.message?.includes('Server Error')) {
    return 'Our servers are experiencing issues. Please try again later.'
  }

  return 'An unexpected error occurred. We\'re working to fix this issue.'
}
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: rgba(255, 68, 68, 0.05);
  border: 1px solid rgba(255, 68, 68, 0.2);
  border-radius: var(--radius-xl);
  margin: var(--space-4);
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
}

.error-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-3);
}

.error-message {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-6);
}

.error-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-6);
}

.error-details {
  margin-top: var(--space-6);
  text-align: left;
}

.error-details summary {
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-2);
  font-size: var(--font-size-sm);
}

.error-details summary:hover {
  color: var(--color-primary);
}

.error-stack {
  background: rgba(0, 0, 0, 0.3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  overflow-x: auto;
  margin-top: var(--space-2);
}

@media (max-width: 640px) {
  .error-boundary {
    margin: var(--space-2);
    padding: var(--space-4);
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .btn {
    width: 100%;
  }
}
</style>