<template>
  <div class="home-view">
    <TopBar />

    <main class="home-content">

      <!-- ===== HERO ===== -->
      <section class="hero">
        <img
          src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&h=600&fit=crop&crop=center"
          alt="Kalamazoo nightlife"
          class="hero-img"
        />
        <div class="hero-overlay">
          <p class="hero-eyebrow">Kalamazoo, MI</p>
          <h1 class="hero-title">Your City's<br><span class="hero-accent">Social Hub.</span></h1>
          <p class="hero-sub">Happy hours, food specials, live music, and events — all in one place.</p>
        </div>
      </section>

      <!-- ===== CATEGORIES ===== -->
      <section class="categories-section">
        <h2 class="section-label">Browse</h2>

        <div class="category-grid">
          <!-- Happy Hours — full width hero tile -->
          <div class="cat-tile cat-tile--hero" @click="router.push({ name: 'HappyHours' })">
            <img
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&h=420&fit=crop&crop=center"
              alt="Happy Hours"
              class="cat-img"
            />
            <div class="cat-overlay">
              <h3 class="cat-name">Happy Hours</h3>
              <p class="cat-desc">Today's best drink & food deals</p>
            </div>
          </div>

          <!-- Events — half width -->
          <div class="cat-tile cat-tile--half" @click="router.push({ name: 'Events' })">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&crop=center"
              alt="Events"
              class="cat-img"
            />
            <div class="cat-overlay">
              <h3 class="cat-name">Events</h3>
              <p class="cat-desc">What's happening this week</p>
            </div>
          </div>

          <!-- Services — half width -->
          <div class="cat-tile cat-tile--half" @click="router.push({ name: 'Services' })">
            <img
              src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop&crop=center"
              alt="Services"
              class="cat-img"
            />
            <div class="cat-overlay">
              <h3 class="cat-name">Services</h3>
              <p class="cat-desc">Spas, salons & wellness</p>
            </div>
          </div>

          <!-- Food Specials — half width -->
          <div class="cat-tile cat-tile--half" @click="handleCategoryClick('food-specials')">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&crop=center"
              alt="Food Specials"
              class="cat-img"
            />
            <div class="cat-overlay">
              <h3 class="cat-name">Food Specials</h3>
              <p class="cat-desc">Plates worth ordering tonight</p>
            </div>
          </div>

          <!-- Brunch — half width -->
          <div class="cat-tile cat-tile--half" @click="handleCategoryClick('brunch')">
            <img
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&crop=center"
              alt="Brunch"
              class="cat-img"
            />
            <div class="cat-overlay">
              <h3 class="cat-name">Brunch</h3>
              <p class="cat-desc">Weekend spots & specials</p>
            </div>
          </div>

          <!-- Sports Bars — half width -->
          <div class="cat-tile cat-tile--half" @click="handleCategoryClick('sports-bars')">
            <img
              src="https://images.unsplash.com/photo-1546519638405-a9d1b1d83b45?w=600&h=400&fit=crop&crop=center"
              alt="Sports Bars"
              class="cat-img"
            />
            <div class="cat-overlay">
              <h3 class="cat-name">Sports Bars</h3>
              <p class="cat-desc">Best spots to watch the game</p>
            </div>
          </div>

          <!-- Late Night — half width -->
          <div class="cat-tile cat-tile--half" @click="handleCategoryClick('late-night')">
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&crop=center"
              alt="Late Night"
              class="cat-img"
            />
            <div class="cat-overlay">
              <span class="cat-tag cat-tag--dark">After midnight</span>
              <h3 class="cat-name">Late Night</h3>
              <p class="cat-desc">Still going strong</p>
            </div>
          </div>
        </div>

        <!-- ===== EXPLORE CTA ===== -->
        <div class="explore-strip" @click="goToExplore">
          <div class="explore-inner">
            <div class="explore-text">
              <span class="explore-label">Explore the map</span>
              <span class="explore-sub">Find spots near you</span>
            </div>
            <svg class="explore-arrow" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18Z"/></svg>
          </div>
        </div>

      </section>

    </main>

    <BottomNav />

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppConfig } from '@/composables/useAppConfig'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
const router = useRouter()
const { initializeApp } = useAppConfig()
const goToExplore = () => router.push({ name: 'Explore' })
const handleCategoryClick = (id) => router.push({ name: 'CategoryListing', params: { categoryName: id } })

onMounted(async () => {
  try { await initializeApp() } catch (e) { /* silent */ }
})
</script>

