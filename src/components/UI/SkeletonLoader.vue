<template>
  <div class="skeleton-loader" :class="[variant, size]">
    <div class="skeleton-item" :style="skeletonStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'rectangle', // rectangle, circle, text
    validator: (value) => ['rectangle', 'circle', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  width: {
    type: String,
    default: null
  },
  height: {
    type: String,
    default: null
  },
  lines: {
    type: Number,
    default: 1
  }
})

const skeletonStyle = computed(() => {
  const style = {}
  if (props.width) style.width = props.width
  if (props.height) style.height = props.height
  return style
})
</script>

<style scoped>
.skeleton-loader {
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.skeleton-item {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-base);
}

/* Variants */
.rectangle .skeleton-item {
  border-radius: var(--radius-base);
}

.circle .skeleton-item {
  border-radius: 50%;
  aspect-ratio: 1;
}

.text .skeleton-item {
  border-radius: var(--radius-sm);
  height: 1em;
}

/* Sizes */
.small .skeleton-item {
  width: 80px;
  height: 20px;
}

.small.circle .skeleton-item {
  width: 40px;
  height: 40px;
}

.medium .skeleton-item {
  width: 120px;
  height: 40px;
}

.medium.circle .skeleton-item {
  width: 60px;
  height: 60px;
}

.large .skeleton-item {
  width: 200px;
  height: 60px;
}

.large.circle .skeleton-item {
  width: 80px;
  height: 80px;
}

.text.small .skeleton-item {
  height: 14px;
}

.text.medium .skeleton-item {
  height: 16px;
}

.text.large .skeleton-item {
  height: 20px;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Multi-line text skeleton */
.skeleton-loader.text-multiline {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>