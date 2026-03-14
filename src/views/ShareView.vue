<template>
  <div class="sh-view">
    <TopBar />

    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">Share</h1>
      <p class="page-subtitle">Invite others to discover what's happening</p>
    </div>

    <main class="sh-content">

      <!-- QR Code Section -->
      <section class="sh-qr-section" aria-labelledby="qr-heading">
        <div class="sh-qr-container">
          <div class="sh-qr-glow" aria-hidden="true"></div>
          <div class="sh-qr-wrapper">
            <qrcode-vue
              :value="shareUrl"
              :size="qrSize"
              level="H"
              :margin="2"
              render-as="svg"
              class="sh-qr-code"
              :alt="`QR code linking to ${shareUrl}`"
            />
            <div class="sh-qr-logo" aria-hidden="true">
              <div class="sh-logo-circle">
                <span class="sh-logo-text">KS</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sh-qr-info">
          <h2 id="qr-heading" class="sh-qr-title">
            <svg class="sh-title-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M9.5 6.5V8.5H16V15H14V16.5H16.5V15V8.5V6.5H9.5ZM16.5 6.5H18V8.5V15V16.5H16.5V18H15V16.5H8.5V15V8.5V6.5H15V5H16.5V6.5ZM15 8.5V15H9.5V8.5H15Z"/>
            </svg>
            Scan & Access Instantly
          </h2>
          <p class="sh-qr-description">{{ qrDescription }}</p>

          <button class="sh-share-btn" @click="handleNativeShare">
            Share
          </button>
        </div>
      </section>

    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'

const { initializeApp, getAppInfo } = useAppConfig()
const shareUrl = computed(() => window.location.origin)
const qrSize = ref(250)

// Dynamic app content from JSON configuration
const appName = computed(() => {
  return getAppInfo.value?.name || 'KSocial'
})

const appLocation = computed(() => {
  return getAppInfo.value?.location || { city: 'Kalamazoo', state: 'Michigan' }
})

const qrDescription = computed(() => {
  return `Point your camera at the QR code for immediate access to ${appName.value}`
})

// Dynamic share content from app configuration
const shareTitle = computed(() => {
  const info = getAppInfo.value
  const location = appLocation.value
  return info?.tagline || `${appName.value} - ${location.city}'s Social Hub`
})

const shareText = computed(() => {
  const location = appLocation.value
  return `Discover happy hours, food specials, and events in ${location.city} — your city's social hub.`
})

onMounted(async () => {
  try {
    await initializeApp()
  } catch (error) {
    console.error('Failed to initialize app data for ShareView:', error)
  }
})

const handleNativeShare = async () => {
  const shareData = {
    title: shareTitle.value,
    text: shareText.value,
    url: shareUrl.value
  }

  analytics.track('share_attempted', { method: 'native' })

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
      analytics.track('share_completed', { method: 'native' })
      if (window.$toast) {
        window.$toast.success(`Thanks for sharing ${appName.value}!`)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share error:', err)
        await copyLink()
      }
    }
  } else {
    await copyLink()
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    analytics.track('share_completed', { method: 'copy' })

    if (window.$toast) {
      window.$toast.success('Link copied! Ready to share!')
    }
  } catch (err) {
    console.error('Copy failed:', err)
    if (window.$toast) {
      window.$toast.error('Copy failed. Please try again.')
    }
  }
}

</script>
