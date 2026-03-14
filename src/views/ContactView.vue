<template>
  <!--
    ContactView Component

    Professional contact form for user inquiries and business listing requests.
    Features separate sections for general issues and business partnership inquiries.

    Key Features:
    - Clean, professional form design
    - Separate inquiry types (General Issues, Business Partnerships)
    - Form validation and submission handling
    - Responsive design for all devices
    - Professional messaging and branding
  -->
  <div class="contact-view">
    <TopBar title="Contact Us" :show-back="true" />

    <div class="page-header">
      <p class="page-eyebrow">Kalamazoo, MI</p>
      <h1 class="page-title">Contact Us</h1>
      <p class="page-subtitle">Get help or discuss partnerships</p>
    </div>

    <div class="contact-content">

      <!-- Contact Form -->
      <form @submit.prevent="handleSubmit" class="contact-form">
        <!-- Simplified Inquiry Type -->
        <div class="form-group">
          <label class="form-label">What's this about?</label>
          <select v-model="formData.inquiryType" class="form-input">
            <option value="issue">Report an Issue or Get Support</option>
            <option value="business">Business Partnership/Listing</option>
          </select>
        </div>

        <!-- Contact Information -->
        <div class="form-group">
          <label for="name" class="form-label">Name *</label>
          <input
            id="name"
            type="text"
            v-model="formData.name"
            class="form-input"
            placeholder="Your name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email *</label>
          <input
            id="email"
            type="email"
            v-model="formData.email"
            class="form-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <!-- Business Name (conditional) -->
        <div v-if="formData.inquiryType === 'business'" class="form-group">
          <label for="businessName" class="form-label">Business Name *</label>
          <input
            id="businessName"
            type="text"
            v-model="formData.businessName"
            class="form-input"
            placeholder="Your business name"
            :required="formData.inquiryType === 'business'"
          />
        </div>

        <!-- Message -->
        <div class="form-group">
          <label for="message" class="form-label">Message *</label>
          <textarea
            id="message"
            v-model="formData.message"
            class="form-textarea"
            placeholder="Tell us how we can help you..."
            rows="4"
            required
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="submit-button"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Sending...' : 'Send Message' }}
        </button>
      </form>

      <!-- Success Message -->
      <div v-if="showSuccess" class="success-message">
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'

// Form data
const formData = ref({
  inquiryType: 'issue',
  name: '',
  email: '',
  businessName: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

// Form submission
const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For now, just log the form data
    console.log('Contact form submitted:', formData.value)

    // Show success message
    showSuccess.value = true

    // Reset form
    formData.value = {
      inquiryType: 'issue',
      name: '',
      email: '',
      businessName: '',
      message: ''
    }

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)

  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error sending your message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<!-- All styles moved to src/assets/styles/pages/contact.css -->