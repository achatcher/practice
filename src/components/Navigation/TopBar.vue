<template>
  <header class="top-bar">
    <button
      v-if="showBack"
      class="top-bar-btn back-btn"
      @click="goBack"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button
      v-else
      class="top-bar-btn menu-btn"
      @click="toggleSideMenu"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>

    <h1 class="top-bar-title" @click="router.push({ name: 'Home' })">{{ title || appName }}</h1>

    <div class="top-bar-spacer"></div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppConfig } from '@/composables/useAppConfig'
import { useSideMenu } from '@/composables/useSideMenu'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { getAppInfo } = useAppConfig()
const { toggleSideMenu } = useSideMenu()

const appName = computed(() => getAppInfo.value?.name || 'KSocial')

const goBack = () => {
  router.push({ name: 'Home' })
}
</script>

<!-- All styles in src/assets/styles/components/navigation.css -->
