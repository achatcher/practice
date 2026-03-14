<template>
  <div class="sp-view">
    <TopBar title="Announcements" :show-back="true" />

    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">Announcements</h1>
      <p class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <main class="sp-content">

      <!-- Loading State -->
      <div v-if="isLoading" class="sp-loading">
        <div class="sp-spinner"></div>
        <p>Loading announcements...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="sp-error">
        <h3>Unable to Load Announcements</h3>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadAnnouncements">Try Again</button>
      </div>

      <!-- Announcements Content -->
      <div v-else class="announcements-section">
        <!-- Featured Announcement -->
        <section v-if="featuredAnnouncement" class="sp-featured">
          <h2 class="sp-section-title">
            <svg class="sp-section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
            Featured Announcement
          </h2>
          <div class="sp-card sp-card--featured" @click="openAnnouncement(featuredAnnouncement)">
            <div class="sp-card-header">
              <h3 class="sp-card-title">{{ featuredAnnouncement.title }}</h3>
              <span class="sp-card-date">{{ formatDate(featuredAnnouncement.date) }}</span>
            </div>
            <div class="sp-card-body">
              <p class="sp-card-excerpt">{{ featuredAnnouncement.content }}</p>
              <div v-if="featuredAnnouncement.category" class="sp-card-category">
                {{ featuredAnnouncement.category }}
              </div>
            </div>
            <div class="sp-click-hint">
              <span>Click for details</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </section>

        <!-- All Announcements -->
        <section class="sp-all">
          <h2 class="sp-section-title">Recent Updates</h2>

          <div v-if="announcements.length === 0" class="sp-empty">
            <h3>No Announcements Yet</h3>
            <p>We'll share important updates and news here as they become available.</p>
          </div>

          <div v-else class="sp-grid">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="sp-card"
              @click="openAnnouncement(announcement)"
            >
              <div class="sp-card-header">
                <h3 class="sp-card-title">{{ announcement.title }}</h3>
                <span class="sp-card-date">{{ formatDate(announcement.date) }}</span>
              </div>
              <div class="sp-card-body">
                <p class="sp-card-excerpt">{{ announcement.content }}</p>
                <div v-if="announcement.category" class="sp-card-category">
                  {{ announcement.category }}
                </div>
              </div>
              <div class="sp-click-hint">
                <span>Click for details</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <BottomNav />

    <!-- Announcement Modal -->
    <AnnouncementModal
      :announcement="selectedAnnouncement"
      :is-visible="showModal"
      @close="closeModal"
      @action="handleAnnouncementAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import AnnouncementModal from '@/components/Community/AnnouncementModal.vue'
import { useAppConfig } from '@/composables/useAppConfig'

const { initializeApp, getCurrentBusinesses, getAppInfo } = useAppConfig()

// State management
const isLoading = ref(true)
const error = ref(null)
const announcements = ref([])
const showModal = ref(false)
const selectedAnnouncement = ref({})

// Dynamic content from app configuration
const pageSubtitle = computed(() => {
  const info = getAppInfo.value
  return `Stay connected with local events, news, and community updates in ${info?.location?.city || 'your area'}`
})

// Featured announcement (most recent)
const featuredAnnouncement = computed(() => {
  return announcements.value.length > 0 ? announcements.value[0] : null
})


// Generate dynamic community announcements based on local data
const generateCommunityAnnouncements = () => {
  const info = getAppInfo.value
  const businesses = getCurrentBusinesses.value || []
  const location = info?.location?.city || 'Kalamazoo'
  const now = new Date()

  const communityAnnouncements = []

  // Community Events
  communityAnnouncements.push({
    id: 'farmers-market',
    title: `${location} Saturday Farmers Market`,
    content: 'Join us every Saturday morning for fresh local produce, artisanal crafts, and live music in downtown.',
    fullContent: `Every Saturday from 8:00 AM to 2:00 PM, the ${location} community comes together at Main Street Park for our weekly farmers market.\n\nFeaturing over 30 local vendors, you'll find:\n• Fresh seasonal produce from local farms\n• Artisanal breads and baked goods\n• Handcrafted soaps and candles\n• Live acoustic music\n• Local honey and preserves\n• Fresh flowers and plants\n\nBring the whole family for a morning of community connection and support for local businesses!`,
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: 'Community Events',
    author: `${location} Parks & Recreation`,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop',
    details: {
      location: 'Main Street Park, Downtown',
      time: 'Saturdays 8:00 AM - 2:00 PM',
      contact: `parks@${location.toLowerCase()}.gov`,
      website: `https://www.kalamazoomi.gov`
    },
    actions: [
      { label: 'Get Directions', type: 'primary', url: `https://maps.google.com/?q=Main+Street+Park+${location}` },
      { label: 'Vendor Information', type: 'secondary', url: `https://maps.google.com/?q=farmers+market+${location}` }
    ],
    featured: true
  })

  // Local Business Spotlight
  if (businesses.length > 0) {
    const featuredBusiness = businesses.find(b => b.tier === 'featured') || businesses[0]
    communityAnnouncements.push({
      id: 'business-spotlight',
      title: `Business Spotlight: ${featuredBusiness.name}`,
      content: `Celebrating local excellence with ${featuredBusiness.name}, a cornerstone of our ${location} business community.`,
      fullContent: `We're proud to spotlight ${featuredBusiness.name}, one of ${location}'s premier local businesses.\n\n${featuredBusiness.name} has been serving our community with excellence and dedication. Their commitment to quality and customer service makes them a valued partner in our local business ecosystem.\n\nVisit them today to experience what makes ${location}'s business community so special!`,
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      category: 'Business Spotlight',
      author: 'Community Relations',
      details: {
        location: featuredBusiness.address || `${location} Area`,
        contact: featuredBusiness.phone || 'Contact directly',
        website: featuredBusiness.website
      }
    })
  }

  // Infrastructure Updates
  communityAnnouncements.push({
    id: 'road-construction',
    title: 'Main Street Beautification Project',
    content: 'Temporary traffic adjustments as we enhance our downtown area with new sidewalks and landscaping.',
    fullContent: `The ${location} Department of Public Works has begun the Main Street Beautification Project to enhance our downtown corridor.\n\nProject Details:\n• New decorative sidewalks and crosswalks\n• Enhanced street lighting\n• Native plant landscaping\n• Improved accessibility features\n• Dedicated bike lanes\n\nThe project is expected to be completed by the end of next month. We appreciate your patience as we work to make our downtown area even more beautiful and accessible.\n\nAlternate routes are available via Oak Street and Park Avenue.`,
    date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    category: 'Infrastructure',
    author: `${location} Public Works`,
    details: {
      location: 'Main Street (1st Ave to 5th Ave)',
      time: 'Daily 7:00 AM - 5:00 PM',
      contact: '(269) 337-8000'
    },
    actions: [
      { label: 'Project Updates', type: 'primary', url: `https://maps.google.com/?q=Main+Street+${location}` }
    ]
  })

  // Community Programs
  communityAnnouncements.push({
    id: 'youth-programs',
    title: 'Fall Youth Sports Registration Open',
    content: 'Registration is now open for fall youth soccer, basketball, and swimming programs.',
    fullContent: `${location} Parks and Recreation is excited to announce registration for our fall youth sports programs!\n\nPrograms Available:\n• Youth Soccer (ages 5-12)\n• Basketball Skills Camp (ages 8-16)\n• Swimming Lessons (ages 4-adult)\n• Tennis Clinics (ages 6-14)\n\nAll programs are coached by certified instructors and focus on skill development, teamwork, and fun. Scholarships are available for families in need.\n\nRegister early as spots fill up quickly!`,
    date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    category: 'Youth Programs',
    author: `${location} Parks & Recreation`,
    details: {
      location: 'Community Center & Various Parks',
      time: 'Weekends & After School',
      contact: '(269) 337-8000'
    }
  })

  // Local News
  communityAnnouncements.push({
    id: 'library-events',
    title: 'Library Fall Reading Series',
    content: 'Join us for author readings, book clubs, and literary discussions throughout the fall season.',
    fullContent: `The ${location} Public Library is hosting its annual Fall Reading Series with exciting events for all ages.\n\nUpcoming Events:\n• Author Meet & Greets every Friday at 7 PM\n• Children's Story Time - Wednesdays 10 AM\n• Adult Book Club - First Monday of each month\n• Teen Writing Workshop - Saturdays 2 PM\n• Local History Lectures - Third Thursday monthly\n\nAll events are free and open to the public. Light refreshments will be provided.`,
    date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: 'Education & Culture',
    author: `${location} Public Library`,
    details: {
      location: '315 S Rose St',
      time: 'Various - see schedule',
      contact: '(269) 553-7800'
    }
  })

  return communityAnnouncements.sort((a, b) => b.date - a.date)
}

// Load announcements data
const loadAnnouncements = async () => {
  isLoading.value = true
  error.value = null

  try {
    await initializeApp()
    announcements.value = generateCommunityAnnouncements()
  } catch (err) {
    error.value = `Failed to load announcements: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

// Format date for display
const formatDate = (date) => {
  if (!date) return ''

  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Modal functions
const openAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedAnnouncement.value = {}
}

const handleAnnouncementAction = (_action) => {
  // Handle custom actions if needed
}

// Initialize component
onMounted(async () => {
  await loadAnnouncements()
})
</script>
