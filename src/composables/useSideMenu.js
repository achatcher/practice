import { ref } from 'vue'

const showSideMenu = ref(false)

export function useSideMenu() {
  const toggleSideMenu = () => {
    showSideMenu.value = !showSideMenu.value
  }

  const closeSideMenu = () => {
    showSideMenu.value = false
  }

  return { showSideMenu, toggleSideMenu, closeSideMenu }
}
