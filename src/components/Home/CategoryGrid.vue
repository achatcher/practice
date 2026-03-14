<!-- CategoryGrid.vue example structure -->
<template>
  <div class="category-grid">
    <div 
      v-for="category in categories" 
      :key="category.id"
      class="category-card"
      @click="navigateToCategory(category)"
    >
      <img :src="category.image" :alt="category.name">
      <h3 class="category-title">{{ category.name }}</h3>
    </div>
  </div>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
}

.category-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
}
</style>
