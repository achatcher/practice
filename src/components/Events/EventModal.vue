<template>
  <BaseModal
    :is-visible="isVisible"
    :title="event?.title"
    :description="event?.description"
    :hero-image="event?.image"
    :actions="modalActions"
    @close="closeModal"
  >
    <!-- Event Details Content -->
    <template #content>
      <div v-if="event" class="event-details">

        <!-- Price -->
        <p class="event-price">${{ event.price || event.ticketPrice || '0.00' }}</p>

        <!-- Date & Time -->
        <p class="event-datetime">
          {{ formatEventDate(event.date) }}<span v-if="event.time"> • {{ event.time }}</span>
        </p>

        <!-- Organizer -->
        <p v-if="event.organizer || event.location" class="event-organizer">
          {{ event.organizer || event.location }} →
        </p>

        <!-- Description -->
        <p v-if="event.description" class="event-description">{{ event.description }}</p>

        <!-- Location -->
        <p v-if="event.address || (event.organizer && event.location)" class="event-location">
          {{ event.address || event.location }}
        </p>

      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import { ICONS } from '@/utils/icons'

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

// Modal Actions with white SVG icons
const modalActions = computed(() => {
  if (!props.event) return []

  const actions = []

  if (props.event.website) {
    actions.push({
      label: 'Website',
      icon: ICONS.WEBSITE,
      handler: openWebsite,
      variant: 'primary',
      tooltip: 'Visit event website'
    })
  }

  if (props.event.phone) {
    actions.push({
      label: 'Call',
      icon: ICONS.PHONE,
      handler: callPhone,
      variant: 'secondary',
      tooltip: 'Call organizer'
    })
  }

  if (props.event.coordinates || props.event.address || props.event.location) {
    actions.push({
      label: 'Directions',
      icon: ICONS.DIRECTIONS,
      handler: openDirections,
      variant: 'secondary',
      tooltip: 'Get directions'
    })
  }

  actions.push({
    label: 'Share',
    icon: ICONS.SHARE,
    handler: shareEvent,
    variant: 'ghost',
    tooltip: 'Share event'
  })

  return actions
})

// Action Functions
const openWebsite = () => {
  if (props.event?.website) {
    window.open(props.event.website, '_blank')
  }
}

const callPhone = () => {
  if (props.event?.phone) {
    window.location.href = `tel:${props.event.phone}`
  }
}

const openDirections = () => {
  if (props.event?.coordinates) {
    const { lat, lng } = props.event.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  } else if (props.event?.address) {
    const encodedAddress = encodeURIComponent(props.event.address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  } else if (props.event?.location) {
    const encodedLocation = encodeURIComponent(props.event.location)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
    window.open(url, '_blank')
  }
}

const shareEvent = async () => {
  const shareData = {
    title: props.event?.title,
    text: `Check out this event: ${props.event?.title} on ${formatEventDate(props.event?.date)}`,
    url: props.event?.website || window.location.href
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
  const text = `Check out this event: ${props.event?.title} on ${formatEventDate(props.event?.date)}`
  const url = props.event?.website || window.location.href

  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`)
    alert('Event details copied to clipboard!')
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = `${text}\n${url}`
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Event details copied to clipboard!')
  }
}

const formatEventDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.event-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.event-price {
  color: var(--color-primary);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px;
}

.event-datetime {
  color: var(--color-text-secondary);
  font-size: 15px;
  margin: 0;
}

.event-organizer {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0 0 16px;
}

.event-description {
  color: var(--color-text-primary);
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 16px;
}

.event-location {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}
</style>