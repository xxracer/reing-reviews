const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const axios = require('axios');
require('dotenv').config();

const app = express();

// --- Vercel Deployment Fix ---
const IS_VERCEL = process.env.VERCEL === '1';
const LOCAL_DB_PATH = path.join(__dirname, 'instructors.json');
const VERCEL_TMP_DB_PATH = '/tmp/instructors.json';
const DB_PATH = IS_VERCEL ? VERCEL_TMP_DB_PATH : LOCAL_DB_PATH;
// ----------------------------

app.use(cors());
app.use(bodyParser.json());

// Helper function to read the database
const readDB = () => {
  if (IS_VERCEL && !fs.existsSync(DB_PATH)) {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const initialData = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      fs.writeFileSync(DB_PATH, initialData, 'utf8');
    } else {
      fs.writeFileSync(DB_PATH, JSON.stringify([]), 'utf8');
    }
  }
  if (!fs.existsSync(DB_PATH)) {
    return [];
  }
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
};

// Helper function to write to the database
const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// --- API Routes ---

// Instructors API
app.get('/api/instructors', (req, res) => {
  const instructors = readDB();
  res.json(instructors);
});

app.post('/api/instructors', (req, res) => {
  const instructors = readDB();
  const newInstructor = { id: Date.now().toString(), ...req.body };
  instructors.push(newInstructor);
  writeDB(instructors);
  res.status(201).json(newInstructor);
});

app.put('/api/instructors/:id', (req, res) => {
  let instructors = readDB();
  const { id } = req.params;
  const instructorIndex = instructors.findIndex(i => i.id === id);

  if (instructorIndex === -1) {
    return res.status(404).send('Instructor not found');
  }

  const updatedInstructor = { ...instructors[instructorIndex], ...req.body };
  instructors[instructorIndex] = updatedInstructor;
  writeDB(instructors);
  res.json(updatedInstructor);
});

app.delete('/api/instructors/:id', (req, res) => {
  let instructors = readDB();
  const { id } = req.params;
  const newInstructors = instructors.filter(i => i.id !== id);

  if (instructors.length === newInstructors.length) {
    return res.status(404).send('Instructor not found');
  }

  writeDB(newInstructors);
  res.status(204).send();
});

// Twilio Contact Form API
app.post('/api/send-message', (req, res) => {
  const { name, email, message } = req.body;

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_NUMBER,
    TWILIO_TO_NUMBER,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !TWILIO_TO_NUMBER) {
    console.log('Twilio credentials not found. Skipping message send. Form data:', { name, email, message });
    // Return a success response to not break the frontend flow
    return res.status(200).json({ success: true, message: 'Form submitted (Twilio inactive).' });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const body = `New Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`;

  client.messages
    .create({
      body: body,
      from: TWILIO_FROM_NUMBER,
      to: TWILIO_TO_NUMBER,
    })
    .then(message => {
      console.log('Twilio message sent:', message.sid);
      res.status(200).json({ success: true, message: 'Message sent successfully!' });
    })
    .catch(error => {
      console.error('Twilio Error:', error);
      res.status(500).json({ success: false, message: 'Failed to send message.' });
    });
});

// For local development, we still need to listen on a port.
if (!IS_VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running for local development on http://localhost:${PORT}`);
  });
}

// Google Reviews API
app.get('/api/google-reviews', async (req, res) => {
  const { GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID } = process.env;

  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    console.log('Google Places API credentials not found.');
    return res.status(500).json({ success: false, message: 'API credentials not configured.' });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await axios.get(url);
    const place = response.data.result;

    if (place && place.reviews) {
      const fiveStarReviews = place.reviews.filter(review => review.rating === 5);
      res.json({ success: true, reviews: fiveStarReviews });
    } else {
      res.json({ success: true, reviews: [] });
    }
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
});

// Export the app for Vercel's serverless environment
module.exports = app;