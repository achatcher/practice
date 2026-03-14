# 🏔️ The Greenville Social

A sophisticated Progressive Web App showcasing luxury lifestyle experiences with a **dynamic configuration system** that makes it easily adaptable to any city or region. Currently featuring Greenville, South Carolina's finest dining, outdoor adventures, and premium services where mountain charm meets refined living.

## 🎯 Overview

**The Greenville Social** is a **location-agnostic lifestyle directory** that can be deployed to any city with just configuration changes. Built with Vue 3, this PWA features a revolutionary dynamic configuration system that allows the entire application to be customized through JSON files - no code changes required for new locations.

### ✨ Key Features

- **🌍 Dynamic Configuration System**: Deploy to any city by updating JSON configuration files
- **📊 Multi-Location Support**: Switch between different cities/regions instantly
- **🏢 Curated Business Directory**: Real businesses organized by category with three-tier classification
- **🎨 Location-Aware Branding**: App name, colors, and content adapt to each location
- **📱 Mobile-Optimized PWA**: App store ready with offline capability
- **💼 Business Lead Generation**: Modal system for collecting customer inquiries
- **🎯 Interstitial Advertising**: Revenue generation through strategic ad placement
- **🏆 Three-Tier System**: Signature, Premier, and Curated business classifications

---

## 🛠️ Technology Stack

### Frontend Framework
- **Vue 3** - Composition API with `<script setup>` syntax
- **Vite 4** - Lightning-fast build tool with HMR
- **Vue Router 4** - Client-side routing with dynamic parameters

### State Management & Configuration
- **Pinia** - Modern state management
- **Dynamic Configuration System** - JSON-driven application configuration
- **Location-Based Data Loading** - Automatic data switching by location
- **Reactive Configuration** - Real-time updates when configuration changes

### UI & Styling
- **FLOZ CSS Framework** - Custom design system with CSS variables
- **Mobile-First Responsive** - Optimized for all devices
- **Dynamic Theming** - Location-aware color schemes and branding
- **Component Architecture** - Modular, reusable components

### PWA Features
- **Vite PWA Plugin** - Service worker and manifest generation
- **App Store Ready** - Complete PWA configuration
- **Offline Support** - Full functionality without internet

---

## 🌍 Dynamic Configuration System

### 🚀 Deploy to Any City in Minutes

The revolutionary configuration system allows you to deploy this app to any city without touching a single line of code:

1. **Create location configuration files**
2. **Update app settings in JSON**
3. **Deploy** - that's it!

### Configuration Structure

```
public/config/
├── app-config.json                    # Master app configuration
└── locations/
    ├── greenville/
    │   ├── businesses.json            # Greenville businesses
    │   └── events.json               # Greenville events
    └── charleston/
        ├── businesses.json            # Charleston businesses
        └── events.json               # Charleston events
```

### Master Configuration (`app-config.json`)

```json
{
  "app": {
    "name": "The Greenville Social",
    "tagline": "Mountain community lifestyle for Greenville residents",
    "description": "Exclusive access • Private clubs • Dining",
    "location": {
      "city": "Greenville",
      "state": "South Carolina",
      "coordinates": { "lat": 34.8526, "lng": -82.3940 }
    }
  },
  "navigation": {
    "categories": [
      {
        "id": "dining",
        "name": "Dining",
        "displayName": "DINING",
        "featured": true,
        "image": "https://images.unsplash.com/photo-...",
        "order": 1
      }
    ]
  }
}
```

### Location-Specific Data

Each location has its own data files with businesses and events:

```json
{
  "location": "greenville",
  "businesses": [
    {
      "id": 1,
      "name": "The Lazy Goat",
      "category": "Dining",
      "tier": "signature",
      "location": {
        "address": "170 River St, Greenville, SC 29601",
        "lat": 34.8479,
        "lng": -82.3967
      }
    }
  ]
}
```

---

## 🚀 Quick Start

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd "FLOZ copy 2"

# Install dependencies
npm install

# Start development server
npm run dev

```

### Deploy to New City
```bash
# 1. Create location directory
mkdir public/config/locations/your-city

# 2. Copy and customize configuration files
cp public/config/locations/greenville/businesses.json public/config/locations/your-city/
cp public/config/locations/greenville/events.json public/config/locations/your-city/

# 3. Update app-config.json with new city information
# 4. Deploy - no code changes needed!
```

### Available Scripts
```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run icons        # Generate PWA icons
npm run clean        # Clean build artifacts
npm run reset        # Full reset and reinstall
```

---

## 📁 Project Structure

```
FLOZ copy 2/
├── 📁 public/                    # Static assets & configuration
│   ├── 📁 config/              # 🌍 DYNAMIC CONFIGURATION SYSTEM
│   │   ├── 📄 app-config.json   # Master app configuration
│   │   └── 📁 locations/        # Location-specific data
│   │       ├── 📁 greenville/   # Greenville configuration
│   │       │   ├── 📄 businesses.json  # Greenville businesses
│   │       │   └── 📄 events.json     # Greenville events
│   │       └── 📁 charleston/   # Charleston configuration
│   │           ├── 📄 businesses.json  # Charleston businesses
│   │           └── 📄 events.json     # Charleston events
│   │
│   ├── 📄 green.png             # Brand logo (green version)
│   ├── 📄 white.png             # Brand logo (white version)
│   └── 📄 pwa-*.png            # PWA icons (various sizes)
│
├── 📁 src/                      # Source code
│   ├── 📁 composables/          # 🔧 CONFIGURATION MANAGEMENT
│   │   └── 📄 useAppConfig.js    # Dynamic configuration composable
│   │
│   ├── 📁 stores/               # Pinia state stores
│   │   ├── 📄 businessStore.js         # Legacy business store
│   │   ├── 📄 dynamicBusinessStore.js  # 🌍 Dynamic business store
│   │   └── 📄 dynamicEventsStore.js    # 🌍 Dynamic events store
│   │
│   ├── 📁 views/               # Page components
│   │   ├── 📄 HomeView.vue            # 🌍 Dynamic home page
│   │   └── 📄 CategoryListingView.vue # Business category pages
│   │
│   ├── 📁 components/          # Vue components
│   │   ├── 📁 Navigation/      # Navigation components
│   │   ├── 📁 Business/        # Business-related components
│   │   └── 📁 UI/              # Reusable UI components
│   │
│   └── 📁 assets/              # Application assets
│       └── 📁 styles/          # FLOZ CSS Framework
│
└── 📄 README.md               # This documentation
```

---

## 🌍 Multi-Location Deployment Guide

### 🎯 Step 1: Create Location Configuration

Create a new directory for your city:

```bash
mkdir public/config/locations/your-city-name
```

### 🎯 Step 2: Configure Businesses

Create `businesses.json` with your city's businesses:

```json
{
  "location": "your-city-name",
  "lastUpdated": "2025-01-15T00:00:00Z",
  "businesses": [
    {
      "id": 1,
      "name": "Your City Restaurant",
      "category": "Dining",
      "subcategory": "Fine Dining",
      "tier": "signature",
      "description": "Premium dining experience...",
      "location": {
        "address": "123 Main St, Your City, State 12345",
        "lat": 40.7128,
        "lng": -74.0060,
        "neighborhood": "Downtown"
      },
      "contact": {
        "phone": "(555) 123-4567",
        "website": "https://restaurant.com",
        "email": "info@restaurant.com"
      },
      "hours": {
        "monday": "5:00 PM - 10:00 PM",
        "tuesday": "5:00 PM - 10:00 PM"
      },
      "features": ["Fine Dining", "Wine Selection"],
      "priceRange": "$$$$",
      "rating": 4.8,
      "reviewCount": 245
    }
  ]
}
```

### 🎯 Step 3: Configure Events

Create `events.json` with your city's events:

```json
{
  "location": "your-city-name",
  "lastUpdated": "2025-01-15T00:00:00Z",
  "events": [
    {
      "id": 1,
      "name": "Wine Tasting Event",
      "date": "2025-02-15",
      "time": "7:00 PM",
      "category": "Food & Wine",
      "tier": "signature",
      "venue": "Your City Restaurant",
      "description": "Exclusive wine tasting..."
    }
  ]
}
```

### 🎯 Step 4: Update Master Configuration

Update `app-config.json` with your city information:

```json
{
  "app": {
    "name": "The [Your City] Social",
    "shortName": "[Your City] Social",
    "tagline": "Luxury lifestyle for [Your City] residents",
    "location": {
      "city": "Your City",
      "state": "Your State",
      "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
      }
    }
  }
}
```

### 🎯 Step 5: Deploy

```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

---

## 🔧 Configuration API Reference

### useAppConfig Composable

The heart of the dynamic configuration system:

```javascript
import { useAppConfig } from '@/composables/useAppConfig'

const {
  // State
  currentLocation,
  isLoading,
  appConfig,

  // Methods
  initializeApp,
  setLocation,

  // Getters
  getAppInfo,
  getCategories,
  getCurrentBusinesses,
  getCurrentEvents,
  getBusinessesByCategory
} = useAppConfig()

// Initialize app
await initializeApp('greenville')

// Switch locations
await setLocation('charleston')

// Access dynamic data
const businesses = getCurrentBusinesses.value
const categories = getCategories.value
```

### Dynamic Store Usage

```javascript
import { useDynamicBusinessStore } from '@/stores/dynamicBusinessStore'

const businessStore = useDynamicBusinessStore()

// Load data for current location
await businessStore.loadData()

// Switch to different location
await businessStore.switchLocation('charleston')

// Access business data
const restaurants = businessStore.getBusinessesByCategory('Dining')
const featured = businessStore.getFeaturedBusinesses
```


---

## 📊 Business Data Structure

### Business Tiers
1. **Signature** - Premium featured businesses with enhanced visibility
2. **Premier** - High-quality businesses with good positioning
3. **Curated** - Vetted businesses in standard listings

### Required Business Fields
```javascript
{
  id: Number,                    // Unique identifier
  name: String,                  // Business name
  category: String,              // Primary category
  tier: String,                  // 'signature' | 'premier' | 'curated'

  location: {
    address: String,             // Full address
    lat: Number,                 // GPS latitude
    lng: Number,                 // GPS longitude
    neighborhood: String         // Area name
  },

  contact: {
    phone: String,               // Phone number
    website: String,             // Website URL
    email: String                // Email address
  },

  description: String,           // Business description
  priceRange: String,            // '$' to '$$$$'
  rating: Number,                // 1-5 star rating
  reviewCount: Number,           // Number of reviews

  hours: Object,                 // Operating hours by day
  features: Array,               // Special features/amenities
  tags: Array                    // Search tags
}
```

---

## 🎨 Dynamic Branding System

### Location-Aware Styling

The app automatically adapts its branding based on location:

```json
{
  "app": {
    "branding": {
      "primaryColor": "#D4AF37",
      "secondaryColor": "#2F5233",
      "logoLight": "/images/white.png",
      "logoDark": "/images/green.png"
    }
  }
}
```

### CSS Variable Integration

```css
:root {
  --color-primary: var(--app-primary-color, #D4AF37);
  --color-secondary: var(--app-secondary-color, #2F5233);
}
```

---

## 🔧 Development Guidelines

### Adding New Locations

1. **Create location directory** in `public/config/locations/`
2. **Copy template files** from existing location
3. **Customize business and event data**
4. **Test with configuration test page**
5. **Deploy** - no code changes needed

### Extending Configuration

To add new configuration options:

1. **Update master schema** in `app-config.json`
2. **Add getters** to `useAppConfig.js`
3. **Use in components** via the composable
4. **Update documentation**

### Component Integration

```vue
<template>
  <div class="dynamic-component">
    <h1>{{ appInfo?.name }}</h1>
    <p>{{ appInfo?.tagline }}</p>

    <div v-for="category in categories" :key="category.id">
      <h3>{{ category.displayName }}</h3>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppConfig } from '@/composables/useAppConfig'

const { getAppInfo, getCategories, initializeApp } = useAppConfig()

const appInfo = computed(() => getAppInfo.value)
const categories = computed(() => getCategories.value)

onMounted(async () => {
  await initializeApp()
})
</script>
```

---

## 🚀 Location Examples

### Currently Configured Locations

#### 🏔️ Greenville, South Carolina
- **Focus**: Mountain community lifestyle
- **Businesses**: 8 premium establishments
- **Categories**: Dining, outdoor activities, luxury services
- **Specialty**: Blue Ridge Mountain experiences

#### 🌊 Charleston, South Carolina
- **Focus**: Historic coastal luxury
- **Businesses**: 2 signature establishments
- **Categories**: Southern cuisine, waterfront experiences
- **Specialty**: Historic charm and coastal dining

### Adding Your Location

Follow the deployment guide above to add your city. The system supports:
- ✅ Any number of locations
- ✅ Different business categories per location
- ✅ Location-specific branding
- ✅ Automatic data switching
- ✅ Independent event calendars

---

## 📱 PWA Features

### Mobile Optimization
- **App Store Ready**: Complete PWA configuration for iOS and Android
- **Offline Functionality**: Full app works without internet connection
- **Touch Optimized**: 44px+ touch targets, no tap delays
- **Native Feel**: Smooth animations and transitions
- **Dynamic Updates**: Configuration changes reflect immediately

---

## 🤝 Developer Onboarding

### Getting Started (New Developer)
1. **Clone and Setup**: `git clone` → `npm install` → `npm run dev`
2. **Understand Configuration**: Review `public/config/app-config.json`
3. **Explore Data Flow**: Configuration → Composable → Stores → Components
4. **Add New Location**: Follow multi-location deployment guide

### Key Files to Understand
- **useAppConfig.js**: Central configuration management system
- **app-config.json**: Master application configuration
- **HomeView.vue**: Dynamic home page using configuration
- **dynamicBusinessStore.js**: Location-aware business data

---

## 🌟 System Benefits

### 🚀 For Developers
- **No Code Changes**: Deploy to new cities with just JSON updates
- **Hot Module Replacement**: See configuration changes instantly
- **Type Safety**: Structured schemas with validation

### 💼 For Business
- **Rapid Scaling**: Launch in new cities in hours, not weeks
- **Easy Maintenance**: Update content without developer involvement
- **A/B Testing**: Test different configurations easily
- **Cost Effective**: One codebase serves unlimited locations

### 👥 For Users
- **Location Aware**: Content automatically adapts to their city
- **Fast Performance**: Intelligent caching and preloading
- **Always Current**: Real-time updates when content changes
- **Offline Ready**: Full functionality without internet

---

**The Greenville Social** - A revolutionary location-agnostic lifestyle directory that adapts to any city through dynamic configuration. Built with Vue 3, optimized for mobile, and ready for unlimited scaling.

*Deploy to your city in minutes, not months.*