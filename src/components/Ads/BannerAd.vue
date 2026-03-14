<template>
  <div class="banner-ad" :class="{ 'sticky': ad.position === 'top_sticky' }">
    <img 
      :src="ad.image" 
      :alt="ad.business_name"
      class="banner-image"
      @click="handleClick"
    />
    <div v-if="showPointer" class="pointer-icon">👆</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  ad: {
    type: Object,
    required: true
  }
})

const showPointer = props.ad.show_pointer || false

const handleClick = () => {
  if (props.ad.link) {
    window.open(props.ad.link, '_blank')
  }
}
</script>

<style scoped>
.banner-ad {
  position: relative;
  width: 100%;
  cursor: pointer;
}

.banner-ad.sticky {
  position: sticky;
  top: 60px;
  z-index: 100;
}

.banner-image {
  width: 100%;
  display: block;
  border-radius: 0;
}

.pointer-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(-50%); }
  50% { transform: translateY(-70%); }
}
</style>
