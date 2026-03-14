<template>
  <BaseModal
    :is-visible="isVisible"
    :title="business?.name"
    :subtitle="business?.category"
    :description="business?.description"
    :hero-image="business?.heroImage || business?.logo"
    @close="closeModal"
  >
    <!-- Business Details Content -->
    <template #content>
      <div v-if="business" class="business-details">

        <!-- Special Information -->
        <div v-if="(business.happyHour && showHappyHour) || business.liveMusic" class="business-specials">
          <!-- Happy Hour (only show on cocktail hour page) -->
          <div v-if="business.happyHour && showHappyHour" class="special-item">
            <svg class="special-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 7L10 12V22H14V12L19 7V5H5V7ZM7.5 9H16.5L14 11.5V20H10V11.5L7.5 9Z"/>
            </svg>
            <div class="special-content">
              <h4 class="special-title">Happy Hour</h4>
              <p class="special-time">{{ business.happyHour }}</p>
            </div>
          </div>

          <!-- Live Music -->
          <div v-if="business.liveMusic" class="special-item">
            <svg class="special-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z"/>
            </svg>
            <div class="special-content">
              <h4 class="special-title">Live Music</h4>
              <p class="special-time">{{ business.liveMusic.schedule }}</p>
              <p v-if="business.liveMusic.time" class="special-detail">{{ business.liveMusic.time }}</p>
            </div>
          </div>
        </div>

        <!-- Business Hours -->
        <BusinessHours
          :business="business"
          :show-full-week="showFullWeek"
          @toggle="handleHoursToggle"
        />

      </div>
    </template>

    <!-- Contact Information in Additional Slot -->
    <template #additional>
      <div v-if="business?.contact" class="business-contact">
        <h3 class="contact-title">
          Contact & Location
        </h3>

        <!-- Action Buttons -->
        <div class="contact-actions">
          <button
            v-if="business.contact?.website"
            @click="openWebsite"
            class="contact-action-btn"
            title="Visit website"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.66 9.66 10H14.34C14.44 10.66 14.5 11.32 14.5 12S14.44 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8 8M5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8M12 2C6.47 2 2 6.5 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2Z"/>
            </svg>
            Website
          </button>

          <button
            v-if="business.contact?.phone"
            @click="callBusiness"
            class="contact-action-btn"
            title="Call business"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
            </svg>
            Call
          </button>

          <button
            v-if="business.contact?.address || business.location?.address"
            @click="openMaps"
            class="contact-action-btn"
            title="Get directions"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.71 11.29L12 1.58L2.29 11.29C2.1 11.48 2 11.73 2 12V20C2 21.1 2.9 22 4 22H9V12H15V22H20C21.1 22 22 21.1 22 20V12C22 11.73 21.9 11.48 21.71 11.29Z"/>
            </svg>
            Directions
          </button>

          <button
            @click="shareBusiness"
            class="contact-action-btn"
            title="Share business"
          >
            <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12S8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5S19.66 2 18 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12S4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.92 18 21.92S20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z"/>
            </svg>
            Share
          </button>
        </div>

        <!-- Contact Information -->
        <div class="contact-info">
          <p v-if="business.contact.phone" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
            </svg>
            {{ business.contact.phone }}
          </p>
          <p v-if="business.contact?.address || business.location?.address" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
            </svg>
            {{ business.contact?.address || business.location?.address }}
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import BusinessHours from '@/components/Business/BusinessHours.vue'
import { ICONS } from '@/utils/icons'
import analytics from '@/utils/analytics'

const props = defineProps({
  business: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  showHappyHour: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Hours display state
const showFullWeek = ref(false)

// Track modal view when opened
watch(() => props.business && props.isVisible, (newVal) => {
  if (newVal && props.business) {
    analytics.trackBusinessView(props.business, 'modal', {
      placement: 'business_modal'
    })
  }
})

// Reset hours display when modal closes
watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    showFullWeek.value = false // Always start with today's hours
  }
})

const closeModal = () => {
  emit('close')
}

// Modal Actions with white SVG icons
const modalActions = computed(() => {
  if (!props.business) return []

  const actions = []

  if (props.business.contact?.website) {
    actions.push({
      label: 'Website',
      icon: ICONS.WEBSITE,
      handler: openWebsite,
      variant: 'primary',
      tooltip: 'Visit website'
    })
  }

  if (props.business.contact?.phone) {
    actions.push({
      label: 'Call',
      icon: ICONS.PHONE,
      handler: callBusiness,
      variant: 'secondary',
      tooltip: 'Call business'
    })
  }

  if (props.business.contact?.address || props.business.location?.address) {
    actions.push({
      label: 'Directions',
      icon: ICONS.DIRECTIONS,
      handler: openMaps,
      variant: 'secondary',
      tooltip: 'Get directions'
    })
  }

  actions.push({
    label: 'Share',
    icon: ICONS.SHARE,
    handler: shareBusiness,
    variant: 'ghost',
    tooltip: 'Share business'
  })

  return actions
})

// Action Functions
const openWebsite = () => {
  if (props.business?.contact?.website) {
    analytics.trackBusinessLead(props.business, 'website', {
      placement: 'business_modal',
      website: props.business.contact.website
    })
    window.open(props.business.contact.website, '_blank')
  }
}

const callBusiness = () => {
  if (props.business?.contact?.phone) {
    analytics.trackBusinessLead(props.business, 'call', {
      placement: 'business_modal',
      phone: props.business.contact.phone
    })
    window.location.href = `tel:${props.business.contact.phone}`
  }
}

const openMaps = () => {
  const address = props.business?.contact?.address || props.business?.location?.address

  analytics.trackBusinessLead(props.business, 'directions', {
    placement: 'business_modal',
    address: address
  })

  if (address) {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  } else if (props.business?.location?.lat && props.business?.location?.lng) {
    const { lat, lng } = props.business.location
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }
}

const shareBusiness = async () => {
  analytics.trackBusinessInteraction(props.business?.id, 'share', {
    placement: 'business_modal',
    business_name: props.business?.name
  })

  const shareData = {
    title: props.business?.name,
    text: `Check out ${props.business?.name} - ${props.business?.description}`,
    url: props.business?.contact?.website || window.location.href
  }

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackShare()
      }
    }
  } else {
    fallbackShare()
  }
}

const fallbackShare = () => {
  const text = `Check out ${props.business?.name} - ${props.business?.description}`
  const url = props.business?.contact?.website || window.location.href

  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`)
    alert('Business details copied to clipboard!')
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = `${text}\n${url}`
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Business details copied to clipboard!')
  }
}

// Handle hours toggle from BusinessHours component
const handleHoursToggle = (isFullWeek) => {
  showFullWeek.value = isFullWeek
}
</script>

<style scoped>
/* Business-specific styling for BaseModal content */
.business-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}


/* Special Information Section */
.business-specials {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.special-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.special-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.special-content {
  flex: 1;
}

.special-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.special-time {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.special-detail {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-1) 0 0;
}


/* Contact Information Section */
.business-contact {
  margin-top: var(--space-2);
}

.contact-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

/* Contact Actions */
.contact-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.contact-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.contact-action-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.contact-action-btn:active {
  transform: translateY(0);
}

.action-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}


.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin: 0;
}

.contact-item-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .business-hours {
    padding: var(--space-3);
  }

  .special-item {
    padding: var(--space-3);
  }

  .hours-header {
    gap: var(--space-2);
  }

  .toggle-text {
    display: none; /* Hide text on mobile, show icon only */
  }

  .contact-actions {
    gap: var(--space-2);
  }

  .contact-action-btn {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
  }
}
</style>