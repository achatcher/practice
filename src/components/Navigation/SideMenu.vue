<template>
  <div class="side-menu-overlay" @click="handleOverlayClick">
    <div class="side-menu" @click.stop>

      <!-- Menu Header -->
      <div class="side-menu-header">
        <div class="logo-section">
          <h2 class="side-menu-logo" @click="goHome" style="cursor: pointer;">{{ appName }}</h2>
        </div>
        <button class="side-menu-close" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <nav class="side-menu-nav">
        <div class="side-menu-item" v-for="item in menuItems" :key="item.name">
          <a
            :href="item.link"
            class="side-menu-link"
            @click="handleMenuClick($event, item)"
          >
            {{ item.name }}
          </a>
        </div>
      </nav>

      <!-- Install App Button -->
      <button class="btn btn-secondary" @click="handleInstall">
        Install App
      </button>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppConfig } from '@/composables/useAppConfig'

const emit = defineEmits(['close', 'show-community-modal'])
const router = useRouter()
const { getAppInfo, initializeApp } = useAppConfig()

const appName = computed(() => getAppInfo.value?.name || 'KSocial')

const menuItems = computed(() => {
  const info = getAppInfo.value
  return [
    {
      name: 'Happy Hours',
      link: '/happy-hours',
      internal: true
    },
    {
      name: 'Events',
      link: '/events',
      internal: true
    },
    {
      name: 'Explore Map',
      link: '/explore',
      internal: true
    },
    {
      name: 'Share App',
      link: '/share',
      internal: true
    },
    {
      name: 'Contact Us',
      link: '/contact',
      internal: true
    }
  ]
})

onMounted(async () => {
  try {
    await initializeApp()
  } catch (error) {
    console.error('Failed to initialize app config in SideMenu:', error)
  }
})

const goHome = () => {
  router.push({ name: 'Home' })
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}

const handleMenuClick = (event, item) => {
  event.preventDefault()
  if (item.internal) {
    router.push(item.link)
  } else if (item.link && item.link.startsWith('http')) {
    window.open(item.link, '_blank')
  }
  emit('close')
}

const handleInstall = () => {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt()
    window.deferredPrompt.userChoice.then(() => {
      window.deferredPrompt = null
    })
  } else {
    alert("To install: tap the Share button in your browser and select 'Add to Home Screen'")
  }
  emit('close')
}
</script>

<!-- All styles in src/assets/styles/components/navigation.css -->
