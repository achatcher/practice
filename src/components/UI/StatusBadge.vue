<template>
  <span
    :class="[
      'status-badge',
      `status-badge--${variant}`,
      `status-badge--${size}`,
      { 'status-badge--pulse': pulse }
    ]"
  >
    <span v-if="icon" class="status-badge__icon" :class="`status-badge__icon--${variant}`">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path :d="icon"/>
      </svg>
    </span>
    <span class="status-badge__text">{{ text }}</span>
  </span>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'active', 'upcoming', 'ended', 'warning', 'success', 'error',
      'signature', 'premier', 'curated'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: {
    type: String,
    default: null
  },
  pulse: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  white-space: nowrap;
  line-height: 1;
}

/* Pulse animation */
.status-badge--pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Variants */
.status-badge--default {
  background: var(--color-bg-surface);
  color: var(--color-text-tertiary);
}

.status-badge--active {
  background: var(--color-success);
  color: var(--color-white);
}

.status-badge--upcoming {
  background: var(--color-warning);
  color: var(--color-white);
}

.status-badge--ended {
  background: var(--color-bg-surface);
  color: var(--color-text-tertiary);
  opacity: 0.6;
}

.status-badge--warning {
  background: var(--color-warning);
  color: var(--color-white);
}

.status-badge--success {
  background: var(--color-success);
  color: var(--color-white);
}

.status-badge--error {
  background: var(--color-error);
  color: var(--color-white);
}

/* Tier variants */
.status-badge--signature {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-30);
}

.status-badge--premier {
  background: var(--color-tier-silver);
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
}

.status-badge--curated {
  background: var(--color-tier-bronze);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
}

/* Sizes */
.status-badge--small {
  padding: var(--space-1);
  font-size: 10px;
}

.status-badge--large {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
}

/* Icon styling */
.status-badge__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-badge__icon svg {
  width: 12px;
  height: 12px;
}

.status-badge--small .status-badge__icon svg {
  width: 10px;
  height: 10px;
}

.status-badge--large .status-badge__icon svg {
  width: 14px;
  height: 14px;
}

.status-badge__text {
  font-size: inherit;
  font-weight: inherit;
}

/* Responsive */
@media (max-width: 768px) {
  .status-badge {
    font-size: 9px;
    padding: var(--space-1);
  }

  .status-badge--large {
    font-size: 10px;
    padding: var(--space-1) var(--space-2);
  }
}
</style>