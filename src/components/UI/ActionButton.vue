<template>
  <button
    :class="[
      'action-button',
      `action-button--${variant}`,
      `action-button--${size}`,
      { 'action-button--full-width': fullWidth }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <svg v-if="icon" class="action-button__icon" viewBox="0 0 24 24" fill="currentColor">
      <path :d="icon"/>
    </svg>
    <span class="action-button__text">{{ label }}</span>
    <svg v-if="showArrow" class="action-button__arrow" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
    </svg>
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'outline'].includes(value)
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
  showArrow: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--btn-padding-base);
  border-radius: var(--btn-border-radius);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  border: none;
  min-height: var(--btn-height-base);
  font-family: var(--font-family-primary);
  text-decoration: none;
  user-select: none;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.action-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-button:not(:disabled):active {
  transform: translateY(0);
}

/* Variants */
.action-button--primary {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.action-button--primary:not(:disabled):hover {
  background: var(--color-primary-dark);
}

.action-button--secondary {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.action-button--secondary:not(:disabled):hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.action-button--ghost {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary-alpha-30);
}

.action-button--ghost:not(:disabled):hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
}

.action-button--outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.action-button--outline:not(:disabled):hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Sizes */
.action-button--small {
  padding: var(--btn-padding-sm);
  min-height: var(--btn-height-sm);
  font-size: var(--font-size-xs);
}

.action-button--large {
  padding: var(--btn-padding-lg);
  min-height: var(--btn-height-lg);
  font-size: var(--font-size-base);
}

/* Full width */
.action-button--full-width {
  width: 100%;
}

/* Icon styling */
.action-button__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.action-button--small .action-button__icon {
  width: 16px;
  height: 16px;
}

.action-button--large .action-button__icon {
  width: 20px;
  height: 20px;
}

.action-button__text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-button__arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .action-button {
    font-size: var(--font-size-xs);
    padding: var(--space-2) var(--space-3);
  }

  .action-button--large {
    padding: var(--space-3) var(--space-4);
  }
}
</style>