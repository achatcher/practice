<template>
  <section v-if="event" class="signature-event-section">
    <div class="signature-event-hero" @click="$emit('click', event)">
      <div class="signature-image-container">
        <img
          :src="event.image"
          :alt="event.title"
          class="signature-hero-image"
          @error="handleImageError"
        />
        <div class="signature-overlay">
          <span class="featured-badge">FEATURED</span>
        </div>
      </div>
      <div class="signature-info">
        <div class="signature-category">{{ event.category }}</div>
        <h1 class="signature-title">{{ event.title }}</h1>
        <div class="signature-details">
          <div class="signature-date">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"/>
            </svg>
            {{ formatSignatureDate(event.date) }}
          </div>
          <div class="signature-location">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"/>
            </svg>
            {{ event.location }}
          </div>
        </div>
        <p class="signature-description">{{ event.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click'])

// Date formatting function
const formatSignatureDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

// Image error handler
const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'
}
</script>

<style scoped>
/* Signature Event Section */
.signature-event-section {
  margin-bottom: var(--space-8);
  padding: 0 var(--space-4);
}

.signature-event-hero {
  cursor: pointer;
  transition: var(--transition-all);
  display: flex;
  flex-direction: column;
}

.signature-event-hero:active {
  transform: scale(0.98);
}

.signature-image-container {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-primary-lg);
  border: 3px solid #FFD700;
  margin-bottom: var(--space-4);
}

.signature-hero-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.signature-overlay {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
}

.featured-badge {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.signature-info {
  padding: 0 var(--space-4);
}

.signature-category {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-2);
}

.signature-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  line-height: var(--line-height-tight);
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
}

.signature-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.signature-date,
.signature-location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  fill: currentColor;
}

.signature-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .signature-image-container {
    margin-bottom: var(--space-3);
  }

  .signature-info {
    padding: 0 var(--space-3);
  }

  .signature-title {
    font-size: var(--font-size-xl);
  }

  .signature-details {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .signature-event-section {
    padding: 0 var(--space-3);
  }

  .signature-info {
    padding: 0 var(--space-2);
  }

  .signature-title {
    font-size: var(--font-size-lg);
  }
}
</style>