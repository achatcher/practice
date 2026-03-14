<template>
  <div class="admin-view">

    <!-- ===== LOGIN ===== -->
    <div v-if="!authed" class="login-screen">
      <div class="login-card">
        <h1 class="login-title">KSocial Admin</h1>
        <p class="login-sub">Kalamazoo, MI</p>
        <form @submit.prevent="login">
          <input
            v-model="passwordInput"
            type="password"
            class="login-input"
            placeholder="Password"
            autocomplete="current-password"
          />
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
          <button type="submit" class="login-btn" :disabled="loggingIn">
            {{ loggingIn ? 'Checking…' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>

    <!-- ===== ADMIN PANEL ===== -->
    <div v-else class="admin-panel">

      <!-- Top bar -->
      <header class="admin-header">
        <span class="admin-logo">KSocial Admin</span>
        <div class="admin-tabs">
          <button class="admin-tab" :class="{ active: tab === 'businesses' }" @click="tab = 'businesses'">Businesses</button>
          <button class="admin-tab" :class="{ active: tab === 'events' }" @click="tab = 'events'">Events</button>
        </div>
        <button class="admin-signout" @click="signOut">Sign out</button>
      </header>

      <!-- ===== BUSINESSES TAB ===== -->
      <div v-if="tab === 'businesses'" class="admin-content">
        <div class="admin-toolbar">
          <input v-model="bizSearch" class="admin-search" placeholder="Search businesses…" />
          <button class="btn-add" @click="openBizForm(null)">+ Add Business</button>
        </div>

        <div v-if="loadingBiz" class="admin-loading">Loading…</div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Tier</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in filteredBusinesses" :key="b.id">
              <td class="td-name">{{ b.name }}</td>
              <td>{{ b.category }}</td>
              <td>{{ b.subcategory }}</td>
              <td>{{ b.priceRange }}</td>
              <td><span class="tier-pill" :class="b.tier">{{ b.tier }}</span></td>
              <td class="td-actions">
                <button class="btn-edit" @click="openBizForm(b)">Edit</button>
                <button class="btn-delete" @click="deleteBusiness(b)">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredBusinesses.length === 0">
              <td colspan="6" class="td-empty">No businesses found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ===== EVENTS TAB ===== -->
      <div v-if="tab === 'events'" class="admin-content">
        <div class="admin-toolbar">
          <input v-model="evtSearch" class="admin-search" placeholder="Search events…" />
          <button class="btn-add" @click="openEvtForm(null)">+ Add Event</button>
        </div>

        <div v-if="loadingEvt" class="admin-loading">Loading…</div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in filteredEvents" :key="e.id">
              <td class="td-name">{{ e.title }}</td>
              <td>{{ e.date }}</td>
              <td>{{ e.location }}</td>
              <td>{{ e.price ? '$' + e.price : '—' }}</td>
              <td class="td-actions">
                <button class="btn-edit" @click="openEvtForm(e)">Edit</button>
                <button class="btn-delete" @click="deleteEvent(e)">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td colspan="5" class="td-empty">No events found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ===== BUSINESS FORM MODAL ===== -->
    <div v-if="showBizModal" class="modal-backdrop" @click.self="showBizModal = false">
      <div class="modal-box">
        <h2 class="modal-title">{{ bizForm.id ? 'Edit Business' : 'Add Business' }}</h2>
        <div class="form-grid">
          <label>Name <input v-model="bizForm.name" /></label>
          <label>Category
            <select v-model="bizForm.category">
              <option value="happy-hours">Happy Hours</option>
              <option value="food-specials">Food Specials</option>
              <option value="sports-bars">Sports Bars</option>
              <option value="brunch">Brunch</option>
              <option value="late-night">Late Night</option>
              <option value="services">Services</option>
            </select>
          </label>
          <label>Subcategory <input v-model="bizForm.subcategory" /></label>
          <label>Tier
            <select v-model="bizForm.tier">
              <option value="featured">Featured</option>
              <option value="standard">Standard</option>
            </select>
          </label>
          <label>Price Range
            <select v-model="bizForm.priceRange">
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
              <option>$$$$</option>
            </select>
          </label>
          <label>Phone <input v-model="bizForm.contact.phone" /></label>
          <label class="full">Address <input v-model="bizForm.contact.address" /></label>
          <label class="full">Website <input v-model="bizForm.contact.website" /></label>
          <label class="full">Image URL <input v-model="bizForm.image" /></label>
          <label class="full">Description <textarea v-model="bizForm.description" rows="3" /></label>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showBizModal = false">Cancel</button>
          <button class="btn-save" @click="saveBusiness" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== EVENT FORM MODAL ===== -->
    <div v-if="showEvtModal" class="modal-backdrop" @click.self="showEvtModal = false">
      <div class="modal-box">
        <h2 class="modal-title">{{ evtForm.id ? 'Edit Event' : 'Add Event' }}</h2>
        <div class="form-grid">
          <label class="full">Title <input v-model="evtForm.title" /></label>
          <label>Date <input v-model="evtForm.date" type="date" /></label>
          <label>Price <input v-model="evtForm.price" placeholder="e.g. 25.00" /></label>
          <label class="full">Location <input v-model="evtForm.location" /></label>
          <label class="full">Organizer <input v-model="evtForm.organizer" /></label>
          <label class="full">Image URL <input v-model="evtForm.image" /></label>
          <label class="full">Description <textarea v-model="evtForm.description" rows="3" /></label>
        </div>
        <p v-if="formError" class="form-error">{{ formError }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showEvtModal = false">Cancel</button>
          <button class="btn-save" @click="saveEvent" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// ── Config ────────────────────────────────────────────────────────────────
// After deploying API Gateway, paste your invoke URL here
const API_URL = import.meta.env.VITE_ADMIN_API_URL || ''

// ── Auth ──────────────────────────────────────────────────────────────────
const authed = ref(false)
const passwordInput = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const token = ref('')

const login = async () => {
  loggingIn.value = true
  loginError.value = ''
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Invalid password')
    token.value = data.token
    authed.value = true
    sessionStorage.setItem('admin_token', token.value)
    loadAll()
  } catch (e) {
    loginError.value = e.message
  } finally {
    loggingIn.value = false
  }
}

const signOut = () => {
  authed.value = false
  token.value = ''
  sessionStorage.removeItem('admin_token')
}

// ── API helper ────────────────────────────────────────────────────────────
const api = async (method, path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

// ── Tab ───────────────────────────────────────────────────────────────────
const tab = ref('businesses')

// ── Businesses ────────────────────────────────────────────────────────────
const businesses = ref([])
const loadingBiz = ref(false)
const bizSearch = ref('')

const filteredBusinesses = computed(() => {
  const q = bizSearch.value.trim().toLowerCase()
  if (!q) return businesses.value
  return businesses.value.filter(b =>
    b.name?.toLowerCase().includes(q) ||
    b.category?.toLowerCase().includes(q) ||
    b.subcategory?.toLowerCase().includes(q)
  )
})

const loadBusinesses = async () => {
  loadingBiz.value = true
  try { businesses.value = await api('GET', '/businesses') }
  finally { loadingBiz.value = false }
}

const emptyBiz = () => ({
  name: '', category: 'happy-hours', subcategory: '', tier: 'standard',
  priceRange: '$$', image: '', description: '',
  contact: { phone: '', address: '', website: '' }
})

const showBizModal = ref(false)
const bizForm = ref(emptyBiz())
const saving = ref(false)
const formError = ref('')

const openBizForm = (b) => {
  bizForm.value = b
    ? { ...b, contact: { ...b.contact } }
    : emptyBiz()
  formError.value = ''
  showBizModal.value = true
}

const saveBusiness = async () => {
  if (!bizForm.value.name.trim()) { formError.value = 'Name is required.'; return }
  saving.value = true
  formError.value = ''
  try {
    if (bizForm.value.id) {
      const updated = await api('PUT', `/businesses/${bizForm.value.id}`, bizForm.value)
      const idx = businesses.value.findIndex(b => b.id === updated.id)
      if (idx !== -1) businesses.value[idx] = updated
    } else {
      const created = await api('POST', '/businesses', bizForm.value)
      businesses.value.push(created)
    }
    showBizModal.value = false
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

const deleteBusiness = async (b) => {
  if (!confirm(`Delete "${b.name}"?`)) return
  await api('DELETE', `/businesses/${b.id}`)
  businesses.value = businesses.value.filter(x => x.id !== b.id)
}

// ── Events ────────────────────────────────────────────────────────────────
const events = ref([])
const loadingEvt = ref(false)
const evtSearch = ref('')

const filteredEvents = computed(() => {
  const q = evtSearch.value.trim().toLowerCase()
  if (!q) return events.value
  return events.value.filter(e =>
    e.title?.toLowerCase().includes(q) ||
    e.location?.toLowerCase().includes(q)
  )
})

const loadEvents = async () => {
  loadingEvt.value = true
  try { events.value = await api('GET', '/events') }
  finally { loadingEvt.value = false }
}

const emptyEvt = () => ({
  title: '', date: '', location: '', organizer: '', price: '', image: '', description: ''
})

const showEvtModal = ref(false)
const evtForm = ref(emptyEvt())

const openEvtForm = (e) => {
  evtForm.value = e ? { ...e } : emptyEvt()
  formError.value = ''
  showEvtModal.value = true
}

const saveEvent = async () => {
  if (!evtForm.value.title.trim()) { formError.value = 'Title is required.'; return }
  saving.value = true
  formError.value = ''
  try {
    if (evtForm.value.id) {
      const updated = await api('PUT', `/events/${evtForm.value.id}`, evtForm.value)
      const idx = events.value.findIndex(e => e.id === updated.id)
      if (idx !== -1) events.value[idx] = updated
    } else {
      const created = await api('POST', '/events', evtForm.value)
      events.value.push(created)
    }
    showEvtModal.value = false
  } catch (e) {
    formError.value = e.message
  } finally {
    saving.value = false
  }
}

const deleteEvent = async (e) => {
  if (!confirm(`Delete "${e.title}"?`)) return
  await api('DELETE', `/events/${e.id}`)
  events.value = events.value.filter(x => x.id !== e.id)
}

const loadAll = () => {
  loadBusinesses()
  loadEvents()
}

onMounted(() => {
  const saved = sessionStorage.getItem('admin_token')
  if (saved) { token.value = saved; authed.value = true; loadAll() }
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background: #0d0d1a;
  color: #fff;
  font-family: var(--font-family-primary);
}

/* ===== LOGIN ===== */
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-4);
}

.login-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-8) var(--space-8);
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.login-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0 0 var(--space-1);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.login-sub {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.login-input {
  width: 100%;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  margin-bottom: var(--space-3);
  box-sizing: border-box;
  outline: none;
}

.login-input:focus {
  border-color: var(--color-primary);
}

.login-error {
  color: #ef4444;
  font-size: var(--font-size-sm);
  margin: 0 0 var(--space-3);
}

.login-btn {
  width: 100%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-all);
}

.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ===== HEADER ===== */
.admin-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-logo {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-right: auto;
}

.admin-tabs {
  display: flex;
  gap: var(--space-2);
}

.admin-tab {
  background: none;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.admin-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.admin-signout {
  background: none;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-all);
}

/* ===== CONTENT ===== */
.admin-content {
  padding: var(--space-5) var(--space-6);
  max-width: 1100px;
  margin: 0 auto;
}

.admin-toolbar {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  align-items: center;
}

.admin-search {
  flex: 1;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  outline: none;
}

.admin-search:focus { border-color: var(--color-primary); }

.btn-add {
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition-all);
}

.admin-loading {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-10);
}

/* ===== TABLE ===== */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.admin-table th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border-primary);
}

.admin-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-secondary);
  color: var(--color-text-primary);
  vertical-align: middle;
}

.admin-table tr:last-child td { border-bottom: none; }

.td-name { font-weight: var(--font-weight-semibold); }

.td-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}

.td-empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-10) !important;
}

.tier-pill {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tier-pill.featured { background: var(--color-primary); color: #fff; }
.tier-pill.standard { background: var(--color-bg-tertiary); color: var(--color-text-secondary); }

.btn-edit {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-3);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: var(--transition-all);
}

.btn-delete {
  background: none;
  border: 1px solid #ef444460;
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-3);
  color: #ef4444;
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: var(--transition-all);
}

/* ===== MODAL ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-box {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-5);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.form-grid label.full { grid-column: 1 / -1; }

.form-grid input,
.form-grid select,
.form-grid textarea {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-3);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  outline: none;
  transition: var(--transition-all);
  resize: vertical;
}

.form-grid input:focus,
.form-grid select:focus,
.form-grid textarea:focus {
  border-color: var(--color-primary);
}

.form-error {
  color: #ef4444;
  font-size: var(--font-size-sm);
  margin: var(--space-3) 0 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.btn-cancel {
  background: none;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.btn-save {
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  color: #fff;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-all);
}

.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
