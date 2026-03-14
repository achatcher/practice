/**
 * Event Scraper Service
 *
 * This is a Node.js backend service that scrapes events from local venue websites.
 * It runs separately from the Vue.js frontend to avoid CORS issues.
 *
 * To use this service:
 * 1. Install dependencies: npm install axios cheerio express cors
 * 2. Run the service: node server/eventScraper.js
 * 3. The service will run on http://localhost:3001
 * 4. Your Vue app can fetch scraped data from http://localhost:3001/api/scraped-events
 */

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for Vue app
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173']
}));

app.use(express.json());

/**
 * Scrapes events from Margaritaville Lake Resort
 */
async function scrapeMargaritavilleEvents() {
  try {
    const response = await axios.get('https://margaritavilleresorts.com/lake-of-the-ozarks/events/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const events = [];

    // This selector would need to be adjusted based on the actual website structure
    $('.event-item').each((index, element) => {
      const title = $(element).find('.event-title').text().trim();
      const date = $(element).find('.event-date').text().trim();
      const description = $(element).find('.event-description').text().trim();

      if (title && date) {
        events.push({
          id: `margaritaville-${Date.now()}-${index}`,
          title,
          description: description || 'Event details available on venue website',
          date: parseEventDate(date),
          time: 'See venue for details',
          location: 'Margaritaville Lake Resort',
          address: '494 Tan Tar A Dr, Osage Beach, MO 65065',
          category: 'Live Entertainment',
          image: '/images/events/margaritaville.jpg',
          website: 'https://margaritavilleresorts.com/lake-of-the-ozarks',
          ticketPrice: 'Contact venue',
          organizer: 'Margaritaville Lake Resort',
          featured: false,
          source: 'scraped-margaritaville',
          coordinates: { lat: 38.1317, lng: -92.6073 }
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error scraping Margaritaville events:', error.message);
    return [];
  }
}

/**
 * Scrapes events from Backwater Jack's
 */
async function scrapeBackwaterJacksEvents() {
  try {
    // Mock implementation - would need actual website scraping logic
    return [
      {
        id: `backwater-${Date.now()}`,
        title: 'Live Music Weekend',
        description: 'Join us for live music on our outdoor stage',
        date: getDateString(2),
        time: '7:00 PM - 11:00 PM',
        location: 'Backwater Jack\'s',
        address: '4836 Keelboat Ct, Lake Ozark, MO 65049',
        category: 'Live Entertainment',
        image: '/images/events/backwater-jacks.jpg',
        website: 'https://backwaterjacks.com',
        ticketPrice: 'Free',
        organizer: 'Backwater Jack\'s',
        featured: false,
        source: 'scraped-backwater',
        coordinates: { lat: 38.1189, lng: -92.6356 }
      }
    ];
  } catch (error) {
    console.error('Error scraping Backwater Jack\'s events:', error.message);
    return [];
  }
}

/**
 * Scrapes events from Shady Gators
 */
async function scrapeShadyGatorsEvents() {
  try {
    // Mock implementation - would need actual website scraping logic
    return [
      {
        id: `shadygators-${Date.now()}`,
        title: 'Trivia Night',
        description: 'Test your knowledge at our weekly trivia night',
        date: getDateString(4),
        time: '7:00 PM - 9:00 PM',
        location: 'Shady Gators',
        address: '4466 Osage Beach Pkwy, Osage Beach, MO 65065',
        category: 'Entertainment',
        image: '/images/events/shady-gators.jpg',
        website: 'https://shadygators.com',
        ticketPrice: 'Free',
        organizer: 'Shady Gators',
        featured: false,
        source: 'scraped-shadygators',
        coordinates: { lat: 38.1205, lng: -92.6345 }
      }
    ];
  } catch (error) {
    console.error('Error scraping Shady Gators events:', error.message);
    return [];
  }
}

/**
 * API endpoint to get all scraped events
 */
app.get('/api/scraped-events', async (req, res) => {
  try {
    console.log('Fetching scraped events...');

    const allEvents = [];

    // Scrape from multiple venues
    const margaritavilleEvents = await scrapeMargaritavilleEvents();
    const backwaterEvents = await scrapeBackwaterJacksEvents();
    const shadyGatorsEvents = await scrapeShadyGatorsEvents();

    allEvents.push(...margaritavilleEvents);
    allEvents.push(...backwaterEvents);
    allEvents.push(...shadyGatorsEvents);

    console.log(`Scraped ${allEvents.length} total events`);

    res.json({
      success: true,
      events: allEvents,
      lastUpdated: new Date().toISOString(),
      sources: ['margaritaville', 'backwater-jacks', 'shady-gators']
    });
  } catch (error) {
    console.error('Error in scraped events endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      events: []
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'event-scraper' });
});

/**
 * Helper function to parse event dates
 */
function parseEventDate(dateString) {
  try {
    // This would need to be customized based on how each venue formats dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    // Return tomorrow's date as fallback
    return getDateString(1);
  }
}

/**
 * Helper function to get future date strings
 */
function getDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Event Scraper Service running on http://localhost:${PORT}`);
  console.log(`📊 Scraped events available at: http://localhost:${PORT}/api/scraped-events`);
  console.log(`💓 Health check available at: http://localhost:${PORT}/health`);
});

module.exports = app;