<template>
  <div v-if="isVisible" class="base-modal-overlay" @click="handleOverlayClick">
    <div class="base-modal-container" @click.stop>

      <!-- Header: Title + Back -->
      <div class="base-modal-topbar">
        <h1 v-if="title" class="base-modal-title">{{ title }}</h1>
        <button class="base-modal-back" @click="closeModal" aria-label="Close">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          Back
        </button>
      </div>

      <!-- Hero Image -->
      <div v-if="heroImage" class="base-modal-hero">
        <img
          :src="heroImage"
          :alt="title"
          class="base-modal-hero-image"
          @error="handleImageError"
        />
        <div class="carousel-dots">
          <span class="dot dot-active"></span>
          <span class="dot"></span>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="base-modal-body">

        <!-- Custom Content Slot (price, date, organizer, description, location) -->
        <div class="base-modal-content">
          <slot name="content"></slot>
        </div>

        <!-- Additional Content Slot -->
        <div class="base-modal-additional">
          <slot name="additional"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  heroImage: {
    type: String,
    default: null
  },
  actions: {
    type: Array,
    default: () => []
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal()
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'
}
</script>

<style scoped>
.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  bottom: 0;
  background: var(--color-bg-primary);
  z-index: var(--z-modal);
  display: flex;
  align-items: stretch;
}

.base-modal-container {
  position: relative;
  background: var(--color-bg-primary);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Top bar: title left, back right */
.base-modal-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 12px;
}

.base-modal-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
  line-height: 1.2;
  padding-right: 16px;
}

.base-modal-back {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Hero Image */
.base-modal-hero {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.base-modal-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.dot-active {
  background: #fff;
}

/* Body */
.base-modal-body {
  padding: 20px 24px;
  flex: 1;
}

.base-modal-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.base-modal-additional {
  margin-top: 16px;
}

/* Animation */
.base-modal-overlay {
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
