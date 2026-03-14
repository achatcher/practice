<template>
  <div class="business-detail-view">
    <div v-if="!business" class="page-view">
      <p class="no-events-text" style="padding: var(--space-10) 0; text-align:center;">Loading...</p>
    </div>

    <div v-else>
      <!-- Hero -->
      <div class="bd-hero">
        <img :src="business.heroImage || business.logo" :alt="business.name" class="bd-hero-img" />
        <button class="bd-back-btn" @click="goBack">←</button>
      </div>

      <!-- Info -->
      <div class="bd-info">
        <h1 class="bd-name">{{ business.name }}</h1>

        <div class="bd-actions">
          <button class="bd-action-btn" @click="callBusiness">
            <svg class="bd-action-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span>Call</span>
          </button>

          <button class="bd-action-btn" @click="getDirections">
            <svg class="bd-action-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Directions</span>
          </button>

          <button class="bd-action-btn" @click="shareBusiness">
            <svg class="bd-action-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span>Share</span>
          </button>
        </div>

        <div class="bd-details">
          <div v-if="business.description" class="bd-section">
            <h3 class="bd-section-title">About</h3>
            <p class="bd-section-text">{{ business.description }}</p>
          </div>

          <div v-if="business.contact?.address" class="bd-section">
            <h3 class="bd-section-title">Address</h3>
            <p class="bd-section-text">{{ business.contact.address }}</p>
          </div>

          <div v-if="business.hours" class="bd-section">
            <h3 class="bd-section-title">Hours</h3>
            <div class="bd-hours-list">
              <div v-for="(time, day) in business.hours" :key="day" class="bd-hour-row">
                <span class="bd-day">{{ capitalize(day) }}</span>
                <span>{{ time }}</span>
              </div>
            </div>
          </div>

          <div v-if="business.contact?.website" class="bd-section">
            <button class="bd-website-btn" @click="openWebsite">Visit Website</button>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import BottomNav from '@/components/Navigation/BottomNav.vue'

const router = useRouter()
const route = useRoute()
const businessStore = useBusinessStore()

const businessId = ref(route.params.businessId)
const business = ref(null)

onMounted(() => {
  const found = businessStore.getBusinessById(businessId.value)
  if (found) {
    business.value = found
  } else {
    router.push({ name: 'Home' })
  }
})

const goBack = () => router.back()

const callBusiness = () => {
  if (business.value.contact?.phone) window.location.href = `tel:${business.value.contact.phone}`
}

const getDirections = () => {
  const loc = business.value.location
  if (loc?.lat && loc?.lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank')
  } else if (business.value.contact?.address) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.value.contact.address)}`, '_blank')
  }
}

const shareBusiness = async () => {
  const shareData = {
    title: business.value.name,
    text: `Check out ${business.value.name} on KSocial!`,
    url: window.location.href
  }
  if (navigator.share) {
    try { await navigator.share(shareData) } catch (err) { /* cancelled */ }
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

const openWebsite = () => {
  if (business.value.contact?.website) window.open(business.value.contact.website, '_blank')
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
</script>
