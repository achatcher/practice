<template>
  <div class="business-card-skeleton">
    <!-- Business Image Skeleton -->
    <div class="skeleton-image">
      <SkeletonLoader variant="rectangle" width="100%" height="200px" />
    </div>

    <!-- Business Content Skeleton -->
    <div class="skeleton-content">
      <!-- Business Name -->
      <SkeletonLoader variant="text" width="80%" height="24px" class="mb-2" />

      <!-- Category -->
      <SkeletonLoader variant="text" width="40%" height="16px" class="mb-3" />

      <!-- Address -->
      <SkeletonLoader variant="text" width="60%" height="14px" class="mb-2" />

      <!-- Phone -->
      <SkeletonLoader variant="text" width="50%" height="14px" class="mb-3" />

      <!-- Action Buttons -->
      <div class="skeleton-actions">
        <SkeletonLoader variant="rectangle" width="80px" height="32px" />
        <SkeletonLoader variant="rectangle" width="80px" height="32px" />
        <SkeletonLoader variant="circle" width="32px" height="32px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'
</script>

<style scoped>
.business-card-skeleton {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--card-border-radius);
  overflow: hidden;
  margin-bottom: var(--space-4);
}

.skeleton-image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.skeleton-content {
  padding: var(--space-4);
}

.skeleton-actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.mb-2 {
  margin-bottom: var(--space-2);
}

.mb-3 {
  margin-bottom: var(--space-3);
}
</style>