<template>
  <div class="business-list-item" @click="handleClick">
    <img 
      :src="business.logo" 
      :alt="business.name"
      class="business-logo"
    />
    <div class="business-info">
      <div class="business-header">
        <h3 class="business-name">{{ business.name }}</h3>
        <span v-if="(business.listing_tier || business.tier) && (business.listing_tier || business.tier) !== 'curated'" class="tier-badge" :class="business.listing_tier || business.tier">
          {{ getTierLabel(business.listing_tier || business.tier) }}
        </span>
      </div>
      <p class="business-category">{{ business.category }}</p>
      <div v-if="business.memberPerks" class="member-perks">
        <span class="perk-icon">✨</span>
        <span class="perk-text">{{ business.memberPerks }}</span>
      </div>
    </div>
    <span class="chevron">›</span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted } from 'vue'
import analytics from '@/utils/analytics'

const props = defineProps({
  business: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  // Track business click as a lead
  analytics.trackBusinessLead(props.business, 'modal_view', {
    placement: 'business_list',
    list_position: 'unknown' // Can be passed as prop if needed
  })

  emit('click')
}

// Track impression when component mounts (business becomes visible)
onMounted(() => {
  if (props.business) {
    analytics.trackBusinessImpression(props.business, 'business_list', {
      viewport_position: 'unknown' // Can be enhanced with intersection observer
    })
  }
})

const getTierLabel = (tier) => {
  const tierLabels = {
    signature: 'SIGNATURE',
    premier: 'PREMIER',
    curated: 'CURATED'
  }
  return tierLabels[tier] || ''
}
</script>

<style scoped>
.business-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: var(--transition-all);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
  border: 1px solid var(--color-border-secondary);
}

.business-list-item:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-alpha-20);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.business-logo {
  width: 70px;
  height: 70px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--color-border-primary);
}

.business-info {
  flex: 1;
  min-width: 0;
}

.business-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.business-name {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tier-badge {
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  flex-shrink: 0;
}

.tier-badge.signature {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-30);
}

.tier-badge.premier {
  background: var(--color-platinum);
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px rgba(229, 228, 226, 0.3);
}


.business-category {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0 0 var(--space-1) 0;
  font-weight: var(--font-weight-medium);
}

.member-perks {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-20);
  border-radius: var(--radius-sm);
  max-width: fit-content;
}

.perk-icon {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.perk-text {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.chevron {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-light);
  flex-shrink: 0;
}
</style>

