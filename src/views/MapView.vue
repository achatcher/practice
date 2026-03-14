<template>
  <div class="map-view">
    <TopBar />

    <!-- ===== PAGE HEADER ===== -->
    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">Explore</h1>
      <p class="page-subtitle">Find bars, restaurants, and venues near you</p>
    </div>

    <div class="map-container">
      <!-- Search Bar and Filter Button -->
      <div class="pg-search-bar">
        <div class="pg-search-input-group">
          <svg class="pg-search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <input
            v-model="mapSearchQuery"
            type="text"
            placeholder="Search establishments..."
            class="pg-search-input"
          />
          <button
            v-if="mapSearchQuery"
            class="pg-btn-clear"
            @click="clearSearch"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>
        <button class="pg-btn-filter" @click="toggleCategorySort" :class="{ active: showCategorySort }">
          <svg class="pg-filter-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"/>
          </svg>
          <span class="map-filter-text">Filter</span>
        </button>
      </div>

      <!-- Category Sort Filter -->
      <transition name="slide-down">
        <div v-if="showCategorySort" class="pg-filter-panel">
          <div class="pg-filter-panel-header">
            <h3>Filter by Category</h3>
            <button
              v-if="selectedCategory"
              class="pg-btn-ghost-sm"
              @click="clearCategoryFilter"
            >
              Clear
            </button>
          </div>
          <div class="pg-chip-row">
            <button
              v-for="category in availableCategories"
              :key="category"
              class="pg-filter-chip"
              :class="{ active: selectedCategory === category }"
              @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </transition>

      <div class="list-divider"></div>

      <!-- Map -->
      <div ref="mapContainer" class="map"></div>

      <!-- Location Button -->
      <button class="btn btn-primary location-btn-position" @click="centerOnUserLocation">
        <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
        Show Current Location
      </button>

      <!-- Search Results List -->
      <div v-if="mapSearchQuery.trim() && waterBusinesses.length > 0" class="search-results-section">
        <h3 class="search-results-title">
          {{ waterBusinesses.length }} result{{ waterBusinesses.length !== 1 ? 's' : '' }} for "{{ mapSearchQuery }}"
        </h3>
        <div class="search-results-list">
          <div
            v-for="business in waterBusinesses"
            :key="business.id"
            class="search-result-item"
            @click="selectBusiness(business)"
          >
            <div class="result-content">
              <h4 class="result-name">{{ business.name }}</h4>
              <p class="result-category">{{ business.category }}</p>
              <p class="result-description" v-if="business.description">
                {{ business.description.length > 100 ? business.description.substring(0, 100) + '...' : business.description }}
              </p>
              <div class="result-meta">
                <span class="result-subcategory" v-if="business.subcategory">{{ business.subcategory }}</span>
              </div>
            </div>
            <div class="result-action">
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="mapSearchQuery.trim() && waterBusinesses.length === 0" class="no-results-section">
        <div class="no-results-content">
          <svg class="no-results-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or browse all establishments on the map.</p>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- List View Modal -->
    <transition name="slide-up">
      <div v-if="showListView" class="list-view-modal">
        <div class="map-modal-header">
          <h3>Local Establishments</h3>
          <button class="close-modal-btn" @click="toggleViewMode">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="map-modal-content">
          <BusinessListItem
            v-for="business in waterBusinesses"
            :key="business.id"
            :business="business"
            @click="selectBusiness(business)"
          />
        </div>
      </div>
    </transition>

    <!-- Business Modal -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useBusinessStore } from '@/stores/businessStore'
import { useLocationStore } from '@/stores/locationStore'
import { useAppConfig } from '@/composables/useAppConfig'
import { getLocationCenter, getDefaultZoom } from '@/utils/constants'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessListItem from '@/components/Business/BusinessListItem.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const router = useRouter()
const businessStore = useBusinessStore()
const locationStore = useLocationStore()
const { initializeApp, getCurrentBusinesses } = useAppConfig()

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const mapSearchQuery = ref('')
const showListView = ref(false)
const showCategorySort = ref(false)
const selectedCategory = ref('')

// Business Modal
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// Get all businesses for display with search and category filtering
const waterBusinesses = computed(() => {
  const allBusinesses = getCurrentBusinesses.value || []
  let filteredBusinesses = allBusinesses.filter(business =>
    business.location && business.location.lat && business.location.lng
  )

  // Apply category filter if selected
  if (selectedCategory.value) {
    filteredBusinesses = filteredBusinesses.filter(business =>
      business.category === selectedCategory.value
    )
  }

  // Apply search filter if search query exists
  if (mapSearchQuery.value.trim()) {
    const query = mapSearchQuery.value.toLowerCase()
    filteredBusinesses = filteredBusinesses.filter(business =>
      business.name.toLowerCase().includes(query) ||
      business.category.toLowerCase().includes(query) ||
      (business.subcategory && business.subcategory.toLowerCase().includes(query)) ||
      (business.description && business.description.toLowerCase().includes(query))
    )
  }

  return filteredBusinesses
})

// Get available categories from businesses
const availableCategories = computed(() => {
  const allBusinesses = getCurrentBusinesses.value || []
  const categories = [...new Set(allBusinesses.map(business => business.category))]
  return categories.sort()
})

// Watch for search and category changes and update markers
watch([mapSearchQuery, selectedCategory], () => {
  addBusinessMarkers()
})

onMounted(async () => {
  // Initialize the app to load dynamic configuration
  try {
    await initializeApp()
  } catch (error) {
    // silent — app will show empty map if config fails
  }

  initializeMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

const initializeMap = () => {
  const center = getLocationCenter()
  map.value = L.map(mapContainer.value).setView([center.lat, center.lng], getDefaultZoom())

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)

  // Add markers immediately
  addBusinessMarkers()
}

const addBusinessMarkers = () => {
  // Clear existing markers
  markers.value.forEach(marker => map.value.removeLayer(marker))
  markers.value = []

  // Add markers for filtered businesses with locations
  waterBusinesses.value.forEach(business => {
    if (business.location && business.location.lat && business.location.lng) {
      // Create custom gold marker icon
      const goldIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: var(--color-primary);
            border: 3px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 16px;
          ">
            🍺
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; font-family: Arial, sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1A1A2E;">${business.name}</h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">${business.category}</p>
          <button
            onclick="window.goToBusinessFromMap(${business.id}); return false;"
            style="
              background: #FF6B35;
              color: #ffffff;
              border: none;
              padding: 10px 16px;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-weight: 600;
              font-size: 14px;
              transition: all 0.2s ease;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            "
            onmouseover="this.style.background='#E55A25'; this.style.transform='translateY(-1px)'"
            onmouseout="this.style.background='#FF6B35'; this.style.transform='translateY(0)'"
          >
            View Details
          </button>
        </div>
      `

      // Create marker
      const marker = L.marker([business.location.lat, business.location.lng], { icon: goldIcon })
        .addTo(map.value)
        .bindPopup(popupContent)

      markers.value.push(marker)
    }
  })

  // Add global function to navigate from popup
  window.goToBusinessFromMap = (businessId) => {
    const business = businessStore.getBusinessById(businessId)
    if (!business) return
    selectedBusiness.value = business
    showBusinessModal.value = true
  }
}

const centerOnUserLocation = async () => {
  try {
    const location = await locationStore.requestLocation()

    // Create user location marker icon
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #007bff;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    // Add user location marker
    L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(map.value)
      .bindPopup('Your Location')

    // Fly to user location
    map.value.flyTo([location.lat, location.lng], 15, {
      duration: 2
    })
  } catch (error) {
    alert('Unable to get your location. Please enable location services.')
  }
}

const toggleViewMode = () => {
  showListView.value = !showListView.value
}

const toggleCategorySort = () => {
  showCategorySort.value = !showCategorySort.value
}

const selectCategory = (category) => {
  selectedCategory.value = category
  showCategorySort.value = false
}

const clearCategoryFilter = () => {
  selectedCategory.value = ''
  showCategorySort.value = false
}

const clearSearch = () => {
  mapSearchQuery.value = ''
}

const selectBusiness = (business) => {
  showListView.value = false
  selectedBusiness.value = business
  showBusinessModal.value = true
}



const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}
</script>

<!-- Custom marker styles are inline in JS -->
