<template>
  <div class="event-card-skeleton">
    <!-- Event Image Skeleton -->
    <div class="skeleton-image">
      <SkeletonLoader variant="rectangle" width="100%" height="200px" />
      <!-- Date badge skeleton -->
      <div class="skeleton-date-badge">
        <SkeletonLoader variant="rectangle" width="50px" height="50px" />
      </div>
    </div>

    <!-- Event Content Skeleton -->
    <div class="skeleton-content">
      <!-- Category -->
      <SkeletonLoader variant="text" width="30%" height="12px" class="mb-2" />

      <!-- Event Title -->
      <SkeletonLoader variant="text" width="90%" height="20px" class="mb-3" />

      <!-- Event Details -->
      <div class="skeleton-details">
        <SkeletonLoader variant="text" width="60%" height="14px" class="mb-1" />
        <SkeletonLoader variant="text" width="70%" height="14px" class="mb-1" />
        <SkeletonLoader variant="text" width="40%" height="14px" class="mb-3" />
      </div>

      <!-- Description -->
      <div class="skeleton-description">
        <SkeletonLoader variant="text" width="100%" height="14px" class="mb-1" />
        <SkeletonLoader variant="text" width="80%" height="14px" class="mb-3" />
      </div>

      <!-- Actions -->
      <div class="skeleton-actions">
        <SkeletonLoader variant="circle" width="40px" height="40px" />
        <div class="skeleton-links">
          <SkeletonLoader variant="rectangle" width="60px" height="24px" />
          <SkeletonLoader variant="rectangle" width="50px" height="24px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'
</script>

<style scoped>
.event-card-skeleton {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.skeleton-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.skeleton-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.skeleton-content {
  padding: var(--space-4);
}

.skeleton-details {
  margin-bottom: var(--space-3);
}

.skeleton-description {
  margin-bottom: var(--space-4);
}

.skeleton-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-links {
  display: flex;
  gap: var(--space-2);
}

.mb-1 {
  margin-bottom: var(--space-1);
}

.mb-2 {
  margin-bottom: var(--space-2);
}

.mb-3 {
  margin-bottom: var(--space-3);
}
</style>