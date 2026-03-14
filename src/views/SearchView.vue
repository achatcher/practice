<template>
  <div class="page-view">
    <TopBar title="Search" />

    <div class="sv-container">
      <!-- Search Input -->
      <div class="sv-search-bar pg-search-bar">
        <div class="pg-search-input-group">
          <svg class="pg-search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search establishments..."
            class="pg-search-input"
            @input="handleSearch"
          />
          <button v-if="searchQuery" class="pg-btn-clear" @click="clearSearch">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>
        <button class="pg-btn-filter" :class="{ active: showFilters }" @click="toggleFilters">
          <svg class="pg-filter-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"/>
          </svg>
          <span class="sv-filter-text">Filter</span>
        </button>
      </div>

      <!-- Filter Panel -->
      <transition name="slide-down">
        <div v-if="showFilters" class="pg-filter-panel">
          <div class="pg-filter-panel-header">
            <h3>Filter by Category</h3>
            <button v-if="selectedCategory" class="pg-btn-ghost-sm" @click="selectCategory(null)">
              Clear
            </button>
          </div>
          <div class="pg-chip-row">
            <button
              v-for="category in categories"
              :key="category.id"
              class="pg-filter-chip"
              :class="{ active: selectedCategory === category.name }"
              @click="selectCategory(category.name)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Search Results -->
      <div class="sv-results">
        <div v-if="loading" class="sv-state">
          <div class="sv-spinner"></div>
          <p>Searching...</p>
        </div>

        <div v-else-if="searchQuery && filteredResults.length === 0" class="sv-state">
          <svg class="sv-empty-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <h3>No results found</h3>
          <p>No establishments match "{{ searchQuery }}".</p>
        </div>

        <div v-else class="sv-results-list">
          <BusinessListItem
            v-for="business in filteredResults"
            :key="business.id"
            :business="business"
            @click="goToBusinessDetail(business.id)"
          />
        </div>
      </div>
    </div>

    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businessStore'
import { useAppConfig } from '@/composables/useAppConfig'
import { debounce } from '@/utils/helpers'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessListItem from '@/components/Business/BusinessListItem.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

const businessStore = useBusinessStore()
const { getCurrentBusinesses } = useAppConfig()

const searchQuery = ref('')
const selectedCategory = ref(null)
const showFilters = ref(false)
const loading = ref(false)
const categories = ref([])

const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

onMounted(async () => {
  await businessStore.loadData()
  const businesses = getCurrentBusinesses.value || []
  const uniqueCategories = [...new Set(businesses.map(b => b.category))].filter(Boolean).sort()
  categories.value = uniqueCategories.map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name
  }))
})

const filteredResults = computed(() => {
  let results = getCurrentBusinesses.value || []
  if (selectedCategory.value) {
    results = results.filter(b => b.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    results = results.filter(b =>
      b.name?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q) ||
      b.subcategory?.toLowerCase().includes(q)
    )
  }
  return results
})

const handleSearch = debounce(() => {
  if (searchQuery.value.length > 0) {
    loading.value = true
    setTimeout(() => { loading.value = false }, 300)
  }
}, 300)

const clearSearch = () => { searchQuery.value = '' }
const toggleFilters = () => { showFilters.value = !showFilters.value }

const selectCategory = (name) => {
  selectedCategory.value = selectedCategory.value === name ? null : name
}

const goToBusinessDetail = (businessId) => {
  const business = (getCurrentBusinesses.value || []).find(b => b.id === businessId)
  if (business) {
    selectedBusiness.value = business
    showBusinessModal.value = true
  }
}

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}
</script>

