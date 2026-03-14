<template>
  <div class="page-view">
    <TopBar />

    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">Happy Hour</h1>
      <p class="page-subtitle">Daily drink &amp; food specials near you</p>
    </div>

    <main class="hh-content">

      <!-- ===== DATE PICKER + FILTER ===== -->
      <section class="hh-calendar-section">
        <div class="pg-search-bar">
          <button class="pg-chip" @click="showCalendar = !showCalendar">
            {{ formattedSelectedDate }}
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:6px;opacity:0.6"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          <button class="pg-btn-filter" :class="{ active: showFilter }" @click="showFilter = !showFilter">
            <svg viewBox="0 0 24 24" fill="currentColor" class="pg-filter-icon"><path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"/></svg>
            <span>Filter</span>
          </button>
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
                'cal-has-specials': day.hasSpecials
              }"
              @click="selectDate(day.date)"
            >
              {{ day.num }}
            </button>
          </div>
        </div>

        <transition name="slide-down">
          <div v-if="showFilter" class="pg-filter-panel">
            <div class="pg-filter-panel-header">
              <h3>Filter by Type</h3>
              <button v-if="selectedCategory" class="pg-btn-ghost-sm" @click="selectedCategory = ''">Clear</button>
            </div>
            <div class="pg-chip-row">
              <button
                v-for="cat in availableCategories"
                :key="cat"
                class="pg-filter-chip"
                :class="{ active: selectedCategory === cat }"
                @click="toggleCategory(cat); showFilter = false"
              >
                {{ cat }}
              </button>
            </div>
          </div>
        </transition>
      </section>

      <div class="list-divider"></div>

      <!-- ===== SPECIALS LIST ===== -->
      <section class="hh-specials-section">
        <div v-if="selectedDaySpecials.length > 0" class="pulse-list">
          <div
            v-for="special in selectedDaySpecials"
            :key="special.id"
            class="pulse-card"
            @click="viewSpecialDetails(special)"
          >
            <div class="card-inner">
              <div class="image-box">
                <img
                  :src="special.logo || special.image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop&crop=center'"
                  :alt="special.venue"
                  @error="handleThumbError"
                />
              </div>
              <div class="content-box">
                <div class="top-row">
                  <h3 class="hh-card-title">{{ special.venue }}</h3>
                  <span class="hh-card-time">{{ formatTimeShort(special.startTime) }}–{{ formatTimeShort(special.endTime) }}</span>
                </div>
                <p class="hh-card-deal">{{ getHappyHourSpecials(special) }}</p>
                <div class="bottom-row">
                  <span class="event-organizer">{{ special.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-events">
          <p class="no-events-text">No specials on {{ formattedSelectedDate }}.</p>
        </div>
      </section>

    </main>

    <BottomNav />

    <BaseModal
      v-if="selectedSpecial"
      :is-visible="!!selectedSpecial"
      :title="selectedSpecial?.name || selectedSpecial?.venue"
      :hero-image="selectedSpecial?.heroImage || selectedSpecial?.logo || selectedSpecial?.image"
      @close="closeModal"
    >
      <template #content>
        <div class="hh-modal-detail">
          <p class="hh-modal-deal">{{ getHappyHourSpecials(selectedSpecial) }}</p>
          <p class="hh-modal-time">{{ getFormattedTimeRange(selectedSpecial) }}</p>
          <p v-if="selectedSpecial?.description" class="hh-modal-desc">{{ selectedSpecial.description }}</p>
          <p v-if="selectedSpecial?.location?.address || selectedSpecial?.address" class="hh-modal-address">
            {{ selectedSpecial?.location?.address || selectedSpecial?.address }}
          </p>
          <div class="hh-modal-actions">
            <button class="hh-modal-btn-primary" @click="openWebsite(selectedSpecial)">Website</button>
            <button
              v-if="selectedSpecial?.phone || selectedSpecial?.contact?.phone"
              class="hh-modal-btn-secondary"
              @click="callVenue(selectedSpecial)"
            >Call</button>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'
import {
  timeToMinutes,
  formatTime12Hour,
  formatTimeShort,
  getSpecialTypeFromDeals
} from '@/utils/businessUtils'

const selectedSpecial = ref(null)
const selectedCategory = ref('')
const showFilter = ref(false)

const today = new Date()
const toDateStr = (d) => d.toISOString().slice(0, 10)
const todayStr = toDateStr(today)

const selectedDateStr = ref(todayStr)
const showCalendar = ref(false)
const calViewYear = ref(today.getFullYear())
const calViewMonth = ref(today.getMonth())

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const DAY_KEYS = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

const selectedDay = computed(() => {
  const [y, m, d] = selectedDateStr.value.split('-').map(Number)
  return new Date(y, m - 1, d).getDay()
})

const formattedSelectedDate = computed(() => {
  const [y, m, d] = selectedDateStr.value.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return `${DAY_NAMES[dow]} ${MONTH_NAMES[m - 1].slice(0, 3)} ${d}`
})

const calendarMonthLabel = computed(() => `${MONTH_NAMES[calViewMonth.value]} ${calViewYear.value}`)

const calendarStartOffset = computed(() =>
  new Date(calViewYear.value, calViewMonth.value, 1).getDay()
)

const calendarDays = computed(() => {
  const year = calViewYear.value
  const month = calViewMonth.value
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let n = 1; n <= daysInMonth; n++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`
    const dow = new Date(year, month, n).getDay()
    const dowName = DAY_KEYS[dow]
    const hasSpecials = (getCurrentBusinesses.value || []).some(b =>
      b.happyHour?.available && b.happyHour?.days?.[dowName]?.available
    )
    days.push({ num: n, date: dateStr, hasSpecials })
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

const { getCurrentBusinesses, forceRefreshLocation } = useAppConfig()

const cocktailVenues = computed(() => {
  const all = getCurrentBusinesses.value || []
  return all.filter(b => {
    if (b.happyHour?.available) return true
    const cat = (b.category || '').toLowerCase()
    const sub = (b.subcategory || '').toLowerCase()
    return cat === 'happy-hours' || sub.includes('bar') || sub.includes('brewery') || sub.includes('lounge') || sub.includes('pub')
  })
})

const happyHourSpecials = computed(() => {
  const dayName = DAY_KEYS[selectedDay.value]

  let specials = cocktailVenues.value
    .filter(b => {
      if (!b.happyHour?.available) return false
      const day = b.happyHour?.days?.[dayName]
      return day?.available
    })
    .map(b => {
      const day = b.happyHour.days[dayName]
      return {
        id: b.id,
        venue: b.name,
        category: b.subcategory || 'Bar',
        offer: day.deals || b.happyHour?.deals || 'Happy Hour Specials',
        startTime: day.startTime || '5:00 PM',
        endTime: day.endTime || '7:00 PM',
        address: b.location?.address || b.location?.neighborhood || 'Kalamazoo',
        phone: b.contact?.phone || b.phone,
        description: b.description,
        tier: b.tier,
        logo: b.logo,
        image: b.image,
        originalBusiness: b,
        type: getSpecialTypeFromDeals(day.deals || b.happyHour?.deals || '')
      }
    })

  if (selectedCategory.value) {
    specials = specials.filter(s => s.type === selectedCategory.value)
  }

  return specials
})

const availableCategories = computed(() => ['Beer', 'Cocktails', 'Food'])

const selectedDaySpecials = computed(() =>
  [...happyHourSpecials.value].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
)

const toggleCategory = (cat) => {
  selectedCategory.value = selectedCategory.value === cat ? '' : cat
}

const viewSpecialDetails = (special) => {
  analytics.trackBusinessLead(special.originalBusiness || special, 'modal_view', { placement: 'happy_hour_listing', page: 'happy_hours' })
  selectedSpecial.value = special.originalBusiness || special
}

const closeModal = () => { selectedSpecial.value = null }

const openWebsite = (special) => {
  analytics.trackBusinessLead(special, 'website', { placement: 'modal_action', page: 'happy_hours' })
  const website = special?.website || special?.contact?.website
  if (website) {
    window.open(website, '_blank')
  } else {
    const name = special?.name || special?.venue || 'business'
    window.open(`https://www.google.com/search?q=${encodeURIComponent(name + ' Kalamazoo MI')}`, '_blank')
  }
}

const callVenue = (special) => {
  const phone = special?.phone || special?.contact?.phone
  if (phone) window.location.href = `tel:${phone}`
}

const getFormattedTimeRange = (special) => {
  if (special?.happyHour?.schedule) return special.happyHour.schedule
  if (special?.startTime && special?.endTime) return `${formatTime12Hour(special.startTime)} – ${formatTime12Hour(special.endTime)}`
  return '5:00 PM – 7:00 PM'
}

const getHappyHourSpecials = (special) => {
  if (!special) return 'Happy hour specials available'
  if (special.offer && special.offer !== 'Happy Hour Specials') return special.offer
  if (special.originalBusiness?.happyHour?.deals) return special.originalBusiness.happyHour.deals
  if (special.happyHour?.deals) return special.happyHour.deals
  return 'Happy hour specials available'
}

const handleThumbError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=120&h=120&fit=crop&crop=center'
}

onMounted(async () => {
  try {
    await forceRefreshLocation()
    analytics.pageView('/happy-hours', 'Happy Hours')
  } catch (e) { /* silent */ }
})
</script>

<style scoped>
.hh-content {
  padding: var(--space-4) 0 0;
}

.hh-calendar-section {
  position: relative;
}

.hh-specials-section {
  padding-bottom: var(--space-4);
}

.hh-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
  flex: 1;
}

.hh-card-time {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.hh-card-deal {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
  margin: var(--space-1) 0;
}

/* ===== MODAL DETAIL ===== */
.hh-modal-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hh-modal-deal {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-1);
}

.hh-modal-time {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  margin: 0;
}

.hh-modal-desc {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
  margin: var(--space-2) 0;
}

.hh-modal-address {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  margin: 0 0 var(--space-2);
}

.hh-modal-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.hh-modal-btn-primary,
.hh-modal-btn-secondary {
  flex: 1;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: none;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.hh-modal-btn-primary:active,
.hh-modal-btn-secondary:active { opacity: 0.8; }

.hh-modal-btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.hh-modal-btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1.5px solid var(--color-border-primary);
}
</style>
