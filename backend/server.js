const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const axios = require('axios');
const { Pool } = require('pg');
const { put } = require('@vercel/blob');
const multer = require('multer');
require('dotenv').config();

const app = express();
const upload = multer({ dest: '/tmp' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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

// CMS API
app.get('/api/content/:page_name', async (req, res) => {
  const { page_name } = req.params;
  try {
    const result = await pool.query('SELECT content FROM page_content WHERE page_name = $1', [page_name]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].content);
    } else {
      // return empty object if no content
      res.json({});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/content/:page_name', upload.any(), async (req, res) => {
  const { page_name } = req.params;
  const textFields = req.body;

  try {
    const client = await pool.connect();
    const existingContentResult = await client.query('SELECT content FROM page_content WHERE page_name = $1', [page_name]);
    let content = existingContentResult.rows.length > 0 ? existingContentResult.rows[0].content || {} : {};

    // Process text fields
    for (const key in textFields) {
      try {
        const parsedData = JSON.parse(textFields[key]);
        content[key] = parsedData;

        // If the field is an array of file objects, handle deletions.
        if (Array.isArray(content[key]) && content[key].every(item => typeof item === 'object' && item.url)) {
          const newUrls = new Set(parsedData.map(item => item.url));
          content[key] = content[key].filter(item => newUrls.has(item.url));
        }
      } catch (e) {
        content[key] = textFields[key];
      }
    }

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileStream = fs.createReadStream(file.path);
        const { url } = await put(file.originalname, fileStream, {
          access: 'public',
        });
        fs.unlinkSync(file.path); // Clean up the temporary file

        if (!content[file.fieldname]) {
          content[file.fieldname] = [];
        }
        content[file.fieldname].push({
          url,
          originalname: file.originalname,
          mimetype: file.mimetype,
        });
      }
    }

    const query = `
      INSERT INTO page_content (page_name, content)
      VALUES ($1, $2)
      ON CONFLICT (page_name)
      DO UPDATE SET content = $2
      RETURNING *;
    `;
    const result = await client.query(query, [page_name, content]);
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/content/:page_name', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Vercel Blob Upload API ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const fileStream = fs.createReadStream(req.file.path);
    const { url } = await put(req.file.originalname, fileStream, {
      access: 'public',
    });
    fs.unlinkSync(req.file.path); // Clean up the temporary file
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});


const initializeDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_content (
        id SERIAL PRIMARY KEY,
        page_name VARCHAR(255) UNIQUE NOT NULL,
        content JSONB
      );
    `);
    console.log('"page_content" table is ready.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
};

initializeDb();

// Export the app for Vercel's serverless environment
module.exports = app;
