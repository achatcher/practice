<template>
  <div class="page-view">
    <TopBar />

    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">Events</h1>
      <p class="page-subtitle">Discover what's happening near you</p>
    </div>

    <main class="page-content">
      <section class="ev-calendar-section">
        <div class="pg-search-bar">
          <button class="pg-chip" @click="showCalendar = !showCalendar">
            {{ formattedSelectedDate }}
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:6px;opacity:0.6"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="pg-search-input-group">
            <svg class="pg-search-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
            </svg>
            <input
              v-model="searchQuery"
              class="pg-search-input"
              type="text"
              placeholder="Search events…"
            />
            <button v-if="searchQuery" class="pg-btn-clear" @click="searchQuery = ''">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
            </button>
          </div>
        </div>

        <div v-if="showCalendar" class="cal-dropdown">
          <div class="cal-header">
            <button class="cal-nav" @click="prevMonth">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span class="cal-month-label">{{ calendarMonthLabel }}</span>
            <button class="cal-nav" @click="nextMonth">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          <div class="cal-grid">
            <span v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="cal-dow">{{ d }}</span>
            <span v-for="n in calendarStartOffset" :key="'e'+n" class="cal-cell cal-empty"></span>
            <button
              v-for="day in calendarDays"
              :key="day.date"
              class="cal-cell"
              :class="{
                'cal-selected': day.date === selectedDateStr,
                'cal-today': day.date === todayStr,
                'cal-has-events': day.hasEvents
              }"
              @click="selectDate(day.date)"
            >
              {{ day.num }}
            </button>
          </div>
        </div>
      </section>

      <div class="list-divider"></div>

      <section class="ev-monthly-section">
        <div v-if="currentMonthEvents.length > 0" class="pulse-list">
          <div
            v-for="event in currentMonthEvents"
            :key="event.id"
            class="pulse-card"
            @click="openEventModal(event)"
          >
            <div class="card-inner">
              <div class="image-box">
                <img :src="event.image" :alt="event.title" @error="handleImageError" />
              </div>

              <div class="content-box">
                <div class="top-row">
                  <h3 class="event-title">{{ event.title }}</h3>
                </div>

                <p class="event-price">${{ event.price || event.ticketPrice || '125.00' }}</p>

                <div class="bottom-row">
                  <span class="event-organizer">{{ event.organizer || event.location }} →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-events">
          <p class="no-events-text">{{ searchQuery ? `No results for "${searchQuery}"` : `No events on ${formattedSelectedDate}.` }}</p>
        </div>
      </section>
    </main>

    <BottomNav />

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
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import EventModal from '@/components/Events/EventModal.vue'
import { useEventsStore } from '@/stores/eventsStore'

const eventsStore = useEventsStore()

const selectedEvent = ref(null)
const showEventModal = ref(false)

const searchQuery = ref('')

const today = new Date()
const toDateStr = (d) => d.toISOString().slice(0, 10)
const todayStr = toDateStr(today)

const selectedDateStr = ref(todayStr)
const showCalendar = ref(false)
const calViewYear = ref(today.getFullYear())
const calViewMonth = ref(today.getMonth())

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const formattedSelectedDate = computed(() => {
  const [y, m, d] = selectedDateStr.value.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return `${DAY_NAMES[dow]} ${MONTH_NAMES[m - 1].slice(0, 3)} ${d}`
})

const calendarMonthLabel = computed(() => `${MONTH_NAMES[calViewMonth.value]} ${calViewYear.value}`)

const calendarStartOffset = computed(() => {
  return new Date(calViewYear.value, calViewMonth.value, 1).getDay()
})

const calendarDays = computed(() => {
  const year = calViewYear.value
  const month = calViewMonth.value
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const eventDates = new Set(eventsStore.events.map(e => e.date?.slice(0, 10)).filter(Boolean))
  const days = []
  for (let n = 1; n <= daysInMonth; n++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`
    days.push({ num: n, date: dateStr, hasEvents: eventDates.has(dateStr) })
  }
  return days
})

const prevMonth = () => {
  if (calViewMonth.value === 0) { calViewMonth.value = 11; calViewYear.value-- }
  else calViewMonth.value--
}

const nextMonth = () => {
  if (calViewMonth.value === 11) { calViewMonth.value = 0; calViewYear.value++ }
  else calViewMonth.value++
}

const selectDate = (dateStr) => {
  selectedDateStr.value = dateStr
  showCalendar.value = false
}

const currentMonthEvents = computed(() => {
  const all = eventsStore.events.length > 0 ? eventsStore.events : eventsStore.getUpcomingEvents
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    return all.filter(e =>
      e.title?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.organizer?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q)
    )
  }
  return all.filter(e => e.date?.slice(0, 10) === selectedDateStr.value)
})

const openEventModal = (event) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop'
}

onMounted(async () => {
  await eventsStore.loadEventsData()
})
</script>

<style scoped>
.ev-calendar-section {
  position: relative;
}

.ev-monthly-section {
  padding-bottom: var(--space-4);
}
</style>
