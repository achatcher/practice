<template>
  <div class="events-list">
    <!-- Events Header -->
    <div class="events-header">
      <h2 class="events-title">{{ title }}</h2>
      <div class="events-controls">
        <!-- Category Filter -->
        <select v-model="selectedCategory" class="category-filter">
          <option value="">All Categories</option>
          <option v-for="category in eventsStore.categories" :key="category.id" :value="category.name">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>

        <!-- View Toggle -->
        <button
          class="view-toggle"
          @click="toggleView"
          :title="`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`"
        >
          {{ viewMode === 'grid' ? '📋' : '⊞' }}
        </button>

        <!-- Refresh Button -->
        <button class="refresh-btn" @click="refreshEvents" :disabled="eventsStore.loading">
          {{ eventsStore.loading ? '⏳' : '🔄' }}
        </button>
      </div>
    </div>

    <!-- Loading State with Skeleton -->
    <div v-if="eventsStore.loading" class="loading-state">
      <div class="skeleton-container" :class="{ 'grid-view': viewMode === 'grid', 'list-view': viewMode === 'list' }">
        <EventCardSkeleton v-for="n in 6" :key="n" />
      </div>
    </div>

    <!-- Events Grid/List -->
    <div
      v-else-if="filteredEvents.length > 0"
      class="events-container"
      :class="{ 'list-view': viewMode === 'list', 'grid-view': viewMode === 'grid' }"
    >
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @click="openEventModal(event)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📅</div>
      <h3 class="empty-title">No Events Found</h3>
      <p class="empty-message">
        {{ selectedCategory ? `No events in "${selectedCategory}" category.` : 'No events available at the moment.' }}
      </p>
      <button class="refresh-btn primary" @click="refreshEvents">
        Check for Updates
      </button>
    </div>

    <!-- Event Modal -->
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-visible="showEventModal"
      @close="closeEventModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/eventsStore'
import EventCard from './EventCard.vue'
import EventModal from './EventModal.vue'
import EventCardSkeleton from '../UI/EventCardSkeleton.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Live Events'
  },
  filter: {
    type: String,
    default: '' // 'upcoming', 'weekend', 'today', 'featured'
  },
  limit: {
    type: Number,
    default: null
  }
})

const eventsStore = useEventsStore()

const selectedCategory = ref('')
const viewMode = ref('grid')
const selectedEvent = ref(null)
const showEventModal = ref(false)

const filteredEvents = computed(() => {
  let events = []

  // Apply filter type
  switch (props.filter) {
    case 'upcoming':
      events = eventsStore.getUpcomingEvents
      break
    case 'weekend':
      events = eventsStore.getEventsThisWeekend
      break
    case 'today':
      events = eventsStore.getTodaysEvents
      break
    case 'featured':
      events = eventsStore.getFeaturedEvents
      break
    default:
      events = [...eventsStore.events].sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // Apply category filter
  if (selectedCategory.value) {
    events = events.filter(event => event.category === selectedCategory.value)
  }

  // Apply limit
  if (props.limit) {
    events = events.slice(0, props.limit)
  }

  return events
})

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const refreshEvents = async () => {
  await eventsStore.refreshEvents()
}

const openEventModal = (event) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const closeEventModal = () => {
  selectedEvent.value = null
  showEventModal.value = false
}

onMounted(async () => {
  if (eventsStore.events.length === 0) {
    await eventsStore.loadEventsData()
  }
})
</script>

<style scoped>
.events-list {
  width: 100%;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.events-title {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.events-controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.category-filter {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-muted);
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  min-width: 150px;
}

.category-filter:focus {
  outline: none;
  border-color: var(--color-primary);
}

.view-toggle,
.refresh-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-muted);
  color: var(--color-text-primary);
  padding: var(--space-2);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-size: var(--font-size-lg);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-all);
}

.view-toggle:hover,
.refresh-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn.primary {
  background: var(--color-primary);
  color: #000;
  font-weight: var(--font-weight-semibold);
  width: auto;
  padding: var(--space-3) var(--space-6);
}

.loading-state {
  padding: var(--space-4) 0;
}

.skeleton-container.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.skeleton-container.list-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.events-container.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.events-container.list-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-state {
  text-align: center;
  padding: var(--space-8);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
}

.empty-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

.empty-message {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-6);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .events-header {
    flex-direction: column;
    align-items: stretch;
  }

  .events-controls {
    justify-content: space-between;
  }

  .category-filter {
    flex: 1;
    min-width: auto;
  }

  .events-container.grid-view {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .events-controls {
    flex-wrap: wrap;
  }

  .category-filter {
    order: -1;
    width: 100%;
  }
}
</style>