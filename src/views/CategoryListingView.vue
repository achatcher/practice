<template>
  <div class="page-view">
    <TopBar :show-back="true" />

    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">{{ categoryDisplayName }}</h1>
      <p class="page-subtitle">{{ categoryDescription }}</p>
    </div>

    <main class="cat-listing-main">
      <section class="cat-filter-section">
        <div class="pg-search-bar">
          <button class="pg-chip" @click="showDropdown = !showDropdown">
            {{ activeSubcat || 'All' }}
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
              :placeholder="`Search ${categoryDisplayName.toLowerCase()}…`"
            />
            <button v-if="searchQuery" class="pg-btn-clear" @click="searchQuery = ''">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>
            </button>
          </div>
        </div>

        <div v-if="showDropdown" class="pg-dropdown">
          <button
            class="pg-dropdown-option"
            :class="{ active: activeSubcat === '' }"
            @click="selectSubcat('')"
          >All</button>
          <button
            v-for="sub in availableSubcats"
            :key="sub"
            class="pg-dropdown-option"
            :class="{ active: activeSubcat === sub }"
            @click="selectSubcat(sub)"
          >{{ sub }}</button>
        </div>
      </section>

      <div class="list-divider"></div>

      <section class="cat-results-section">
        <div v-if="businessStore.loading" class="no-events">
          <p class="no-events-text">Loading…</p>
        </div>

        <div v-else-if="filteredListings.length > 0" class="pulse-list">
          <div
            v-for="business in filteredListings"
            :key="business.id"
            class="pulse-card"
            @click="openBusiness(business)"
          >
            <div class="card-inner">
              <div class="image-box">
                <img :src="business.image || business.logo" :alt="business.name" @error="handleImageError" />
              </div>
              <div class="content-box">
                <div class="top-row">
                  <h3 class="event-title">{{ business.name }}</h3>
                </div>
                <p class="event-price">{{ business.subcategory }}</p>
                <div class="bottom-row">
                  <span class="event-organizer">{{ business.priceRange }} · View details →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="no-events">
          <p class="no-events-text">
            {{ searchQuery ? `No results for "${searchQuery}"` : activeSubcat ? `No ${activeSubcat} listings yet.` : 'No listings yet.' }}
          </p>
        </div>
      </section>
    </main>

    <BottomNav />

    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import { useAppConfig } from '@/composables/useAppConfig'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

const router = useRouter()
const route = useRoute()
const businessStore = useBusinessStore()
const { initializeApp, getAppInfo } = useAppConfig()

const categoryName = computed(() => route.params.categoryName || 'Category')

const searchQuery = ref('')
const showDropdown = ref(false)
const activeSubcat = ref('')

const categoryDisplayName = computed(() => {
  const appInfo = getAppInfo.value
  const cat = appInfo?.navigation?.categories?.find(c => c.id === categoryName.value)
  return cat?.displayName || categoryName.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
})

const categoryDescription = computed(() => {
  const appInfo = getAppInfo.value
  const cat = appInfo?.navigation?.categories?.find(c => c.id === categoryName.value)
  return cat?.description || `Discover ${categoryDisplayName.value.toLowerCase()} near you`
})

const allBusinesses = computed(() => businessStore.getBusinessesByCategory(categoryName.value))

const availableSubcats = computed(() => {
  const subs = allBusinesses.value.map(b => b.subcategory).filter(Boolean)
  return [...new Set(subs)]
})

const filteredListings = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allBusinesses.value.filter(b => {
    const matchesSub = !activeSubcat.value || b.subcategory === activeSubcat.value
    const matchesSearch = !q ||
      b.name?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.subcategory?.toLowerCase().includes(q) ||
      b.tags?.some(t => t.toLowerCase().includes(q))
    return matchesSub && matchesSearch
  })
})

const selectSubcat = (sub) => {
  activeSubcat.value = sub
  showDropdown.value = false
}

const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

const openBusiness = (business) => {
  selectedBusiness.value = business
  showBusinessModal.value = true
}

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop'
}

onMounted(async () => {
  await initializeApp()
  if (categoryName.value === 'cocktail-hour') {
    router.push({ name: 'CocktailHour' })
  }
})
</script>

<style scoped>
.cat-listing-main {
  padding: var(--space-4) 0 0;
}

.cat-filter-section {
  position: relative;
}

.cat-results-section {
  padding-bottom: var(--space-4);
}
</style>
