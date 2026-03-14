<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-content">
      <button
        v-for="item in navItems"
        :key="item.name"
        class="bottom-nav-item"
        :class="{ active: isActive(item.route) }"
        @click="navigate(item.route)"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="bottom-nav-icon">
          <path :d="item.iconPath"/>
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// KSocial core navigation: Home, Happy Hours, Events, Map
const navItems = [
  {
    name: 'home',
    label: 'Home',
    route: '/',
    iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'
  },
  {
    name: 'happy-hours',
    label: 'Happy Hours',
    route: '/happy-hours',
    // Martini glass icon
    iconPath: 'M21 3H3l9 9.46V19H8v2h8v-2h-4v-6.54L21 3z'
  },
  {
    name: 'events',
    label: 'Events',
    route: '/events',
    // Calendar icon
    iconPath: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'
  },
  {
    name: 'explore',
    label: 'Explore',
    route: '/explore',
    // Map icon
    iconPath: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z'
  },
  {
    name: 'share',
    label: 'Share',
    route: '/share',
    // Share icon
    iconPath: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z'
  }
]

const isActive = (routePath) => {
  return route.path === routePath
}

const navigate = (routePath) => {
  if (route.path !== routePath) {
    router.push(routePath)
  }
}
</script>

<!-- All styles in src/assets/styles/components/navigation.css -->
