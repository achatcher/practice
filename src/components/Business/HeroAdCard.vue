<template>
  <div v-if="business" class="hero-ad-section">
    <div
      class="hero-ad-card"
      :class="{ 'layout-overlay': layout === 'overlay', 'layout-split': layout === 'split' }"
      @click="handleClick"
    >
      <!-- Image Container -->
      <div v-if="layout === 'split'" class="hero-ad-image-container">
        <img
          :src="businessImage"
          :alt="business.name"
          class="hero-ad-image"
          @error="handleImageError"
        />
        <div v-if="business.tier === 'featured'" class="hero-ad-badge">
          <span class="featured-badge">FEATURED</span>
        </div>
      </div>

      <!-- Overlay Layout (for LuxuryShopping style) -->
      <template v-if="layout === 'overlay'">
        <img
          :src="businessImage"
          :alt="business.name"
          class="hero-ad-image"
          @error="handleImageError"
        />
        <div class="hero-ad-overlay">
          <div class="hero-ad-content">
            <span v-if="business.tier === 'featured'" class="featured-badge">FEATURED</span>
            <h2 class="hero-ad-title">{{ business.name }}</h2>
            <p class="hero-ad-subtitle">{{ business.description }}</p>
            <div class="hero-ad-features">
              <span class="hero-ad-category">{{ business.subcategory || business.category }}</span>
            </div>
            <div class="hero-ad-cta">
              <span>{{ ctaText }}</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </div>
      </template>

      <!-- Split Layout Info (for CocktailHour style) -->
      <div v-if="layout === 'split'" class="hero-ad-info">
        <h2 class="hero-ad-name">{{ business.name }}</h2>
        <p class="hero-ad-description">{{ business.description }}</p>
        <div class="hero-ad-features">
          <span class="hero-ad-category">{{ business.subcategory || business.category }}</span>
        </div>
        <div class="hero-ad-cta">
          <span>{{ ctaText }}</span>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  business: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && 'name' in value
    }
  },
  layout: {
    type: String,
    default: 'split',
    validator: (value) => ['split', 'overlay'].includes(value)
  },
  ctaText: {
    type: String,
    default: 'View Details'
  },
  badgeText: {
    type: String,
    default: null
  },
  fallbackImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&crop=center'
  }
})

const emit = defineEmits(['click', 'image-error'])

// Computed business image with fallbacks
const businessImage = computed(() => {
  return props.business.heroImage ||
         props.business.image ||
         props.business.logo ||
         props.fallbackImage
})

// Handle click events
const handleClick = () => {
  emit('click', props.business)
}

// Handle image errors
const handleImageError = (event) => {
  event.target.src = props.fallbackImage
  emit('image-error', { business: props.business, originalSrc: event.target.src })
}
</script>

<style scoped>
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

.hero-ad-section {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.hero-ad-card {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-primary-lg);
  transition: var(--transition-all);
  background: var(--color-bg-secondary);
}

.hero-ad-card:active {
  transform: scale(0.98);
}

/* Split Layout (Vertical - Image on top, text underneath) */
.layout-split {
  display: flex;
  flex-direction: column;
  min-height: auto;
}

.hero-ad-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  border: 3px solid var(--color-tier-gold);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.layout-split .hero-ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.layout-split .hero-ad-info {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
}

.hero-ad-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 10;
}

.hero-ad-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
}

.hero-ad-description {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3);
  line-height: var(--line-height-relaxed);
}

/* Overlay Layout (LuxuryShopping style) */
.layout-overlay {
  position: relative;
  height: 200px;
}

.layout-overlay .hero-ad-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-ad-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: var(--space-5) var(--space-4) var(--space-4);
}

.hero-ad-content {
  color: white;
}

.hero-ad-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin: var(--space-2) 0 var(--space-1);
  line-height: var(--line-height-tight);
}

.hero-ad-subtitle {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin: 0 0 var(--space-3);
  line-height: var(--line-height-relaxed);
}

/* Common Styles */
.hero-ad-features {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
}

.hero-ad-category {
  color: var(--color-primary);
}

.hero-ad-cta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.layout-overlay .hero-ad-cta {
  color: var(--color-primary);
}

.hero-ad-cta svg {
  width: 16px;
  height: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .layout-split {
    flex-direction: column;
    min-height: auto;
  }

  .hero-ad-image-container {
    max-width: 100%;
    height: 150px;
  }

  .hero-ad-info {
    padding: var(--space-4);
  }

  .layout-overlay {
    height: 180px;
  }
}
</style>