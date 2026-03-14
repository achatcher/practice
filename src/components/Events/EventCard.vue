<template>
  <div class="event-card" @click="$emit('click', event)">
    <!-- Event Image -->
    <div class="event-image-container">
      <img
        :src="event.image"
        :alt="event.title"
        class="event-image"
        @error="handleImageError"
      />
      <div v-if="event.featured" class="featured-badge">
        ⭐ Featured
      </div>
      <div class="event-date-badge">
        <div class="date-month">{{ formatMonth(event.date) }}</div>
        <div class="date-day">{{ formatDay(event.date) }}</div>
      </div>
    </div>

    <!-- Event Content -->
    <div class="event-content">
      <div class="event-category">{{ event.category }}</div>
      <h3 class="event-title">{{ event.title }}</h3>

      <div class="event-details">
        <div class="event-time">
          🕐 {{ event.time }}
          <span v-if="event.endDate"> - {{ formatDateRange(event.date, event.endDate) }}</span>
        </div>
        <div class="event-location">
          📍 {{ event.location }}
        </div>
        <div v-if="event.ticketPrice" class="event-price">
          🎫 {{ event.ticketPrice }}
        </div>
      </div>

      <p class="event-description">{{ truncateDescription(event.description) }}</p>

      <!-- Event Actions -->
      <div class="event-actions">
        <button
          class="favorite-btn"
          :class="{ active: isFavorite }"
          @click.stop="toggleFavorite"
        >
          {{ isFavorite ? '❤️' : '🤍' }}
        </button>
        <div class="event-links">
          <a v-if="event.website" :href="event.website" target="_blank" @click.stop class="event-link">
            🌐 Website
          </a>
          <a v-if="event.phone" :href="`tel:${event.phone}`" @click.stop class="event-link">
            📞 Call
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '@/stores/eventsStore'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const eventsStore = useEventsStore()

const isFavorite = computed(() => eventsStore.isEventFavorite(props.event.id))

const formatMonth = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

const formatDay = (dateString) => {
  return new Date(dateString).getDate()
}

const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start.toDateString() === end.toDateString()) {
    return ''
  }

  return `${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 150 ? description.substring(0, 147) + '...' : description
}

const toggleFavorite = () => {
  if (isFavorite.value) {
    eventsStore.removeFromFavorites(props.event.id)
  } else {
    eventsStore.addToFavorites(props.event.id)
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'
}
</script>

<style scoped>
.event-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-all);
  backdrop-filter: blur(10px);
}

.event-card:hover {
  border-color: var(--color-primary-alpha-30);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
}

.event-image-container {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-all);
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.event-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-primary);
  color: #000;
  padding: 8px;
  border-radius: var(--radius-lg);
  text-align: center;
  font-weight: var(--font-weight-bold);
  min-width: 50px;
}

.date-month {
  font-size: var(--font-size-xs);
  line-height: 1;
}

.date-day {
  font-size: var(--font-size-lg);
  line-height: 1;
}

.event-content {
  padding: var(--space-4);
}

.event-category {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-2);
}

.event-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-snug);
}

.event-details {
  margin-bottom: var(--space-3);
}

.event-details > div {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.event-description {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
}

.event-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-btn {
  background: none;
  border: 1px solid var(--color-border-muted);
  border-radius: var(--btn-border-radius);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-all);
  font-size: var(--font-size-lg);
}

.favorite-btn:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
}

.favorite-btn.active {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
}

.event-links {
  display: flex;
  gap: var(--space-2);
}

.event-link {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  text-decoration: none;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-primary-alpha-30);
  border-radius: var(--radius-lg);
  transition: var(--transition-all);
}

.event-link:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
  border-color: var(--color-primary);
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .event-card {
    margin-bottom: var(--space-4);
  }

  .event-content {
    padding: var(--space-3);
  }

  .event-title {
    font-size: var(--font-size-base);
  }

  .event-links {
    flex-direction: column;
    gap: var(--space-1);
  }

  .event-link {
    font-size: var(--font-size-xs);
    text-align: center;
  }
}
</style>