<template>
  <div v-if="business?.hours" class="business-hours">
    <div class="hours-header">
      <h4 class="hours-title">
        {{ showFullWeek ? 'Hours' : 'Today\'s Hours' }}
      </h4>
      <button
        class="hours-toggle"
        @click="toggleHoursDisplay"
        :title="showFullWeek ? 'Show today only' : 'Show full week'"
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="currentColor">
          <path v-if="!showFullWeek" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
          <path v-else d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
        </svg>
        <span class="toggle-text">{{ showFullWeek ? 'Show Less' : 'Show All' }}</span>
      </button>
    </div>
    <div class="hours-grid">
      <div v-for="(hours, day) in hoursToDisplay" :key="day" class="hours-row">
        <span class="day-name">{{ capitalizeFirst(day) }}:</span>
        <span class="day-hours">{{ hours }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  business: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object'
    }
  },
  showFullWeek: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

// Hours display state - allow external control via prop
const showFullWeek = ref(props.showFullWeek)

// Watch for external changes to showFullWeek prop
watch(() => props.showFullWeek, (newValue) => {
  showFullWeek.value = newValue
})

// Helper function to get current day name
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

// Helper function to capitalize first letter
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Get today's hours only
const todaysHours = computed(() => {
  if (!props.business?.hours) return null

  const currentDay = getCurrentDay()
  const hours = props.business.hours[currentDay]

  if (hours) {
    return {
      [currentDay]: hours
    }
  }
  return null
})

// Get all hours for the week
const allHours = computed(() => {
  return props.business?.hours || null
})

// Toggle hours display
const toggleHoursDisplay = () => {
  showFullWeek.value = !showFullWeek.value
  emit('toggle', showFullWeek.value)
}

// Get hours to display (today or full week)
const hoursToDisplay = computed(() => {
  return showFullWeek.value ? allHours.value : todaysHours.value
})
</script>

<style scoped>
/* Business Hours Section */
.business-hours {
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.business-hours.compact {
  padding: var(--space-3);
  background: transparent;
  border: none;
  border-radius: 0;
}

.hours-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.hours-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.hours-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: transparent;
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.hours-toggle:hover {
  background: var(--color-bg-surface);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.toggle-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}

.toggle-text {
  font-weight: var(--font-weight-medium);
}

.hours-grid {
  display: grid;
  gap: var(--space-2);
}

.hours-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-secondary);
}

.hours-row:last-child {
  border-bottom: none;
}

.day-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.day-hours {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

/* Compact variant */
.compact .hours-header {
  margin-bottom: var(--space-2);
}

.compact .hours-title {
  font-size: var(--font-size-sm);
}

.compact .hours-toggle {
  padding: var(--space-1);
  font-size: var(--font-size-xs);
}

.compact .hours-row {
  padding: var(--space-1) 0;
}

.compact .day-name,
.compact .day-hours {
  font-size: var(--font-size-xs);
}

/* Responsive Design */
@media (max-width: 768px) {
  .business-hours {
    padding: var(--space-3);
  }

  .hours-header {
    gap: var(--space-2);
  }

  .toggle-text {
    display: none; /* Hide text on mobile, show icon only */
  }
}
</style>