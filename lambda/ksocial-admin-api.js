/**
 * KSocial Admin API - Lambda Function
 *
 * Handles all admin CRUD operations for businesses and events.
 * Reads and writes JSON files stored in S3.
 *
 * Routes:
 *   GET    /businesses          - list all businesses
 *   POST   /businesses          - add a business
 *   PUT    /businesses/:id      - update a business
 *   DELETE /businesses/:id      - delete a business
 *   GET    /events              - list all events
 *   POST   /events              - add an event
 *   PUT    /events/:id          - update an event
 *   DELETE /events/:id          - delete an event
 *   POST   /login               - validate admin password
 */

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')

const s3 = new S3Client({ region: 'us-east-1' })

const BUCKET = 'kzoosocial-config'
const LOCATION = 'kalamazoo'
const BUSINESSES_KEY = `locations/${LOCATION}/businesses.json`
const EVENTS_KEY = `locations/${LOCATION}/events.json`

// Set this as a Lambda environment variable: ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'

// ── CORS headers ────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

const respond = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...CORS },
  body: JSON.stringify(body)
})

// ── Auth ────────────────────────────────────────────────────────────────────
const checkAuth = (event) => {
  const auth = event.headers?.authorization || event.headers?.Authorization || ''
  return auth === `Bearer ${ADMIN_PASSWORD}`
}

// ── S3 helpers ───────────────────────────────────────────────────────────────
const readS3 = async (key) => {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  const res = await s3.send(cmd)
  const str = await res.Body.transformToString()
  return JSON.parse(str)
}

const writeS3 = async (key, data) => {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json'
  })
  await s3.send(cmd)
}

// ── Handler ──────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod
  const path = event.requestContext?.http?.path || event.path || '/'

  // Preflight
  if (method === 'OPTIONS') return respond(200, {})

  // Login — no auth needed
  if (method === 'POST' && path === '/login') {
    const body = JSON.parse(event.body || '{}')
    if (body.password === ADMIN_PASSWORD) {
      return respond(200, { ok: true, token: ADMIN_PASSWORD })
    }
    return respond(401, { error: 'Invalid password' })
  }

  // All other routes require auth
  if (!checkAuth(event)) return respond(401, { error: 'Unauthorized' })

  try {
    // ── BUSINESSES ────────────────────────────────────────────────────────
    if (path === '/businesses') {
      if (method === 'GET') {
        const data = await readS3(BUSINESSES_KEY)
        return respond(200, data.businesses)
      }

      if (method === 'POST') {
        const data = await readS3(BUSINESSES_KEY)
        const newBusiness = JSON.parse(event.body)
        const maxId = data.businesses.reduce((m, b) => Math.max(m, b.id || 0), 0)
        newBusiness.id = maxId + 1
        data.businesses.push(newBusiness)
        data.lastUpdated = new Date().toISOString()
        await writeS3(BUSINESSES_KEY, data)
        return respond(201, newBusiness)
      }
    }

    const businessMatch = path.match(/^\/businesses\/(\d+)$/)
    if (businessMatch) {
      const id = parseInt(businessMatch[1])

      if (method === 'PUT') {
        const data = await readS3(BUSINESSES_KEY)
        const idx = data.businesses.findIndex(b => b.id === id)
        if (idx === -1) return respond(404, { error: 'Business not found' })
        data.businesses[idx] = { ...data.businesses[idx], ...JSON.parse(event.body), id }
        data.lastUpdated = new Date().toISOString()
        await writeS3(BUSINESSES_KEY, data)
        return respond(200, data.businesses[idx])
      }

      if (method === 'DELETE') {
        const data = await readS3(BUSINESSES_KEY)
        const idx = data.businesses.findIndex(b => b.id === id)
        if (idx === -1) return respond(404, { error: 'Business not found' })
        data.businesses.splice(idx, 1)
        data.lastUpdated = new Date().toISOString()
        await writeS3(BUSINESSES_KEY, data)
        return respond(200, { ok: true })
      }
    }

    // ── EVENTS ────────────────────────────────────────────────────────────
    if (path === '/events') {
      if (method === 'GET') {
        const data = await readS3(EVENTS_KEY)
        return respond(200, data.events)
      }

      if (method === 'POST') {
        const data = await readS3(EVENTS_KEY)
        const newEvent = JSON.parse(event.body)
        const maxId = data.events.reduce((m, e) => Math.max(m, e.id || 0), 0)
        newEvent.id = maxId + 1
        data.events.push(newEvent)
        data.lastUpdated = new Date().toISOString()
        await writeS3(EVENTS_KEY, data)
        return respond(201, newEvent)
      }
    }

    const eventMatch = path.match(/^\/events\/(\d+)$/)
    if (eventMatch) {
      const id = parseInt(eventMatch[1])

      if (method === 'PUT') {
        const data = await readS3(EVENTS_KEY)
        const idx = data.events.findIndex(e => e.id === id)
        if (idx === -1) return respond(404, { error: 'Event not found' })
        data.events[idx] = { ...data.events[idx], ...JSON.parse(event.body), id }
        data.lastUpdated = new Date().toISOString()
        await writeS3(EVENTS_KEY, data)
        return respond(200, data.events[idx])
      }

      if (method === 'DELETE') {
        const data = await readS3(EVENTS_KEY)
        const idx = data.events.findIndex(e => e.id === id)
        if (idx === -1) return respond(404, { error: 'Event not found' })
        data.events.splice(idx, 1)
        data.lastUpdated = new Date().toISOString()
        await writeS3(EVENTS_KEY, data)
        return respond(200, { ok: true })
      }
    }

    return respond(404, { error: 'Not found' })

  } catch (err) {
    console.error(err)
    return respond(500, { error: err.message })
  }
}
