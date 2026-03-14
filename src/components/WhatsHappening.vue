<template>
  <div class="whats-happening">
    <h2 class="section-title">🎵 What's Happening Now</h2>

    <!-- Happy Hours -->
    <div v-if="currentHappyHours.length" class="happening-section">
      <h3 class="happening-title">🍹 Happy Hour Right Now</h3>
      <div class="happening-cards">
        <div
          v-for="business in currentHappyHours"
          :key="business.id"
          class="happening-card happy-hour"
          @click="$emit('select-business', business)"
        >
          <div class="card-icon">🍻</div>
          <div class="card-content">
            <h4 class="card-name">{{ business.name }}</h4>
            <p class="card-detail">{{ business.description }}</p>
            <p class="card-location">{{ business.subcategory }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Music -->
    <div v-if="currentLiveMusic.length" class="happening-section">
      <h3 class="happening-title">🎸 Live Music Tonight</h3>
      <div class="happening-cards">
        <div
          v-for="business in currentLiveMusic"
          :key="business.id"
          class="happening-card live-music"
          @click="$emit('select-business', business)"
        >
          <div class="card-icon">🎵</div>
          <div class="card-content">
            <h4 class="card-name">{{ business.name }}</h4>
            <p class="card-detail">{{ business.description }}</p>
            <p class="card-location">{{ business.subcategory }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- All Restaurants -->
    <div class="happening-section">
      <h3 class="happening-title">🍽️ All Restaurants & Bars</h3>
      <div class="restaurant-grid">
        <div
          v-for="business in restaurants"
          :key="business.id"
          class="restaurant-card"
          @click="$emit('select-business', business)"
        >
          <div class="restaurant-info">
            <h4 class="restaurant-name">{{ business.name }}</h4>
            <p class="restaurant-description">{{ business.description }}</p>
            <div class="restaurant-details">
              <span v-if="business.features?.happy_hour" class="happy-hour-tag">🍹 Happy Hour</span>
              <span v-if="business.features?.live_music" class="live-music-tag">🎵 Live Music</span>
            </div>
          </div>
          <div class="restaurant-contact">
            <div class="phone">📞 {{ business.contact.phone }}</div>
            <div v-if="isOpenNow(business)" class="open-now">✅ Open Now</div>
            <div v-else class="closed-now">❌ Closed</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBusinessStore } from '@/stores/businessStore'

// Store
const businessStore = useBusinessStore()

// Emits
defineEmits(['select-business'])

// Computed
const restaurants = computed(() => {
  // Get businesses from multiple relevant categories
  const cocktailBusinesses = businessStore.getBusinessesByCategory('Cocktail Hour')
  const fineDiningBusinesses = businessStore.getBusinessesByCategory('Dining')
  const casualDiningBusinesses = businessStore.getBusinessesByCategory('Casual Dining')

  return [...cocktailBusinesses, ...fineDiningBusinesses, ...casualDiningBusinesses]
})

const currentHappyHours = computed(() => {
  const now = new Date()
  const currentHour = now.getHours()

  return restaurants.value.filter(business => {
    // Check if business has happy hour feature
    if (!business.features?.happy_hour) return false

    // Default happy hour detection (4-7 PM typical)
    return currentHour >= 16 && currentHour < 19 // 4 PM - 7 PM
  })
})

const currentLiveMusic = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const currentHour = now.getHours()

  return restaurants.value.filter(business => {
    if (!business.liveMusic) return false

    const schedule = business.liveMusic.schedule.toLowerCase()

    // Check if live music is scheduled for today
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = dayNames[dayOfWeek]

    let isScheduledToday = false

    if (schedule.includes('daily')) {
      isScheduledToday = true
    } else if (schedule.includes(today)) {
      isScheduledToday = true
    } else if (schedule.includes('friday') && schedule.includes('saturday') && (dayOfWeek === 5 || dayOfWeek === 6)) {
      isScheduledToday = true
    } else if (schedule.includes('thursday') && schedule.includes('sunday') && (dayOfWeek >= 4 || dayOfWeek === 0)) {
      isScheduledToday = true
    } else if (schedule.includes('wednesday') && schedule.includes('saturday') && (dayOfWeek >= 3 && dayOfWeek <= 6)) {
      isScheduledToday = true
    }

    // Check if it's currently during live music hours (evening)
    const isEveningTime = currentHour >= 19 // 7 PM or later

    return isScheduledToday && isEveningTime
  })
})

// Methods
const isOpenNow = (business) => {
  if (!business.hours) return true

  const now = new Date()
  const dayOfWeek = now.getDay()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = dayNames[dayOfWeek]
  const todayHours = business.hours[today]

  if (!todayHours || todayHours.toLowerCase() === 'closed') {
    return false
  }

  // Parse hours like "11:00 AM - 10:00 PM"
  const timeRange = todayHours.split(' - ')
  if (timeRange.length !== 2) return true

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.trim().split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let hour24 = hours

    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hour24 += 12
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hour24 = 0
    }

    return hour24 * 60 + minutes
  }

  const openTime = parseTime(timeRange[0])
  const closeTime = parseTime(timeRange[1])

  // Handle overnight hours (like 11 PM to 2 AM)
  if (closeTime < openTime) {
    return currentTime >= openTime || currentTime <= closeTime
  }

  return currentTime >= openTime && currentTime <= closeTime
}
</script>

<style scoped>
.whats-happening {
  padding: 20px;
}

.section-title {
  color: white;
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin: 0 0 30px 0;
}

.happening-section {
  margin-bottom: 40px;
}

.happening-title {
  color: #06b6d4;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.happening-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.happening-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.happening-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.happening-card.happy-hour {
  border-left: 4px solid #f59e0b;
}

.happening-card.live-music {
  border-left: 4px solid #8b5cf6;
}

.card-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-name {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.card-detail {
  color: #06b6d4;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.card-location {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin: 0;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.restaurant-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.restaurant-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.restaurant-info {
  flex: 1;
  margin-right: 16px;
}

.restaurant-name {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.restaurant-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.restaurant-details {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.price-range {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.happy-hour-tag {
  background: rgba(251, 191, 36, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.live-music-tag {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.restaurant-contact {
  text-align: right;
  flex-shrink: 0;
}

.phone {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-bottom: 8px;
}

.open-now {
  color: #10b981;
  font-size: 12px;
  font-weight: 600;
}

.closed-now {
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .happening-cards {
    grid-template-columns: 1fr;
  }

  .restaurant-grid {
    grid-template-columns: 1fr;
  }

  .restaurant-card {
    flex-direction: column;
    align-items: stretch;
  }

  .restaurant-info {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .restaurant-contact {
    text-align: left;
  }
}
</style>