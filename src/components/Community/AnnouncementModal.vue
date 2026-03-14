<template>
  <BaseModal
    :is-visible="isVisible"
    :title="announcement.title"
    :subtitle="announcement.author"
    :description="formatDate(announcement.date)"
    :hero-image="announcement.image"
    :actions="modalActions"
    @close="$emit('close')"
  >
    <!-- Announcement Content -->
    <template #content>
      <div v-if="announcement" class="announcement-details">

        <!-- Category Badge -->
        <div v-if="announcement.category" class="announcement-category-badge">
          {{ announcement.category }}
        </div>

        <!-- Full Content -->
        <div class="announcement-body">
          <p v-for="(paragraph, index) in contentParagraphs" :key="index" class="content-paragraph">
            {{ paragraph }}
          </p>
        </div>

      </div>
    </template>

    <!-- Contact Information in Additional Slot -->
    <template #additional>
      <div v-if="announcement.details" class="announcement-contact">
        <h3 class="contact-title">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
          </svg>
          Event Details
        </h3>
        <div class="contact-info">
          <p v-if="announcement.details.location" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
            </svg>
            {{ announcement.details.location }}
          </p>
          <p v-if="announcement.details.time" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/>
            </svg>
            {{ announcement.details.time }}
          </p>
          <p v-if="announcement.details.contact" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
            </svg>
            {{ announcement.details.contact }}
          </p>
          <p v-if="announcement.details.website" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.77 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
            </svg>
            <a :href="announcement.details.website" target="_blank" class="detail-link">
              Visit Website
            </a>
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/UI/BaseModal.vue'

const props = defineProps({
  announcement: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'action'])

// Split content into paragraphs for better formatting
const contentParagraphs = computed(() => {
  if (!props.announcement.fullContent && !props.announcement.content) return []

  const content = props.announcement.fullContent || props.announcement.content
  return content.split('\n\n').filter(p => p.trim())
})

// Convert announcement actions to modal actions format
const modalActions = computed(() => {
  if (!props.announcement.actions) return []

  return props.announcement.actions.map(action => ({
    label: action.label,
    variant: action.type === 'secondary' ? 'secondary' : 'primary',
    handler: () => {
      if (action.url) {
        window.open(action.url, '_blank')
      } else {
        emit('action', action)
      }
    }
  }))
})

// Format date for display
const formatDate = (date) => {
  if (!date) return ''

  const now = new Date()
  const announcementDate = new Date(date)
  const diffTime = Math.abs(now - announcementDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`

  return announcementDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* ===== ANNOUNCEMENT CONTENT STYLES ===== */
.announcement-details {
  margin-bottom: var(--space-6);
}

.announcement-category-badge {
  display: inline-block;
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-4);
}

.announcement-body {
  margin-bottom: var(--space-4);
}

.content-paragraph {
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 var(--space-4) 0;
}

.content-paragraph:last-child {
  margin-bottom: 0;
}

/* ===== CONTACT STYLES (matching BusinessModal) ===== */
.announcement-contact {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--color-border-secondary);
}

.contact-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 var(--space-4) 0;
  font-family: var(--font-family-heading);
}

.contact-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
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
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0;
}

.contact-item-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.detail-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-all);
}

.detail-link:hover {
  text-decoration: underline;
  color: var(--color-primary-light);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 640px) {
  .announcement-contact {
    padding: var(--space-4);
  }

  .contact-title {
    font-size: 16px;
  }

  .contact-item {
    font-size: 13px;
  }

  .content-paragraph {
    font-size: 15px;
  }
}
</style>