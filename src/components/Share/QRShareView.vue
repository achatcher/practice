<!-- QR code implementation -->
<template>
  <div class="share-view">
    <qrcode-vue
      :value="appUrl"
      :size="300"
      level="H"
    />
    <button @click="shareApp">
      Tap to Share
    </button>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';

const appUrl = window.location.origin;

const shareApp = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'KSocial',
      text: 'Check out KSocial — happy hours, food specials, and events in your city!',
      url: appUrl
    });
  }
};
</script>
