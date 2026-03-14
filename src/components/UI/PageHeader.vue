<template>
  <div class="page-title-section">
    <h1 class="page-title">{{ title }}</h1>
    <p class="page-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.page-title-section {
  background: var(--color-bg-luxury);
  border-bottom: 2px solid var(--color-primary-alpha-10);
  padding: var(--space-6) var(--space-4);
  text-align: center;
}

.page-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

/* Responsive styles */
@media (min-width: 640px) {
  .page-title-section {
    padding: var(--space-8) var(--space-6);
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 1024px) {
  .page-title-section {
    padding: var(--space-10) var(--space-8);
  }

  .page-title {
    font-size: var(--font-size-4xl);
  }

  .page-subtitle {
    font-size: var(--font-size-lg);
  }
}
</style>