import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Parse Google Sheet URL to get sheet ID
function getSheetId(url) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Load Google Sheet data
app.post('/api/load-sheet', async (req, res) => {
  try {
    const { sheetUrl } = req.body;
    const sheetId = getSheetId(sheetUrl);
    
    if (!sheetId) {
      return res.status(400).json({ error: 'Invalid Google Sheet URL' });
    }

    // Check if service account key is available
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return res.status(500).json({ error: 'Google service account key is not configured' });
    }

    // Initialize Google Sheets API with service account
    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // First, get the spreadsheet to find all available sheets
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    // Get the first sheet's title (or use "Sheet1" as fallback)
    const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    
    // Get sheet data from the first sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: firstSheetTitle,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found in the sheet' });
    }

    // First row as headers
    const headers = rows[0];
    
    // Check if headers are empty or contain empty strings
    if (headers.some(header => !header.trim())) {
      return res.status(400).json({ error: 'Sheet headers cannot be empty. Please ensure your first row contains valid column names.' });
    }
    
    // Map the data rows to objects using the headers
    const data = rows.slice(1).map(row => {
      const item = {};
      headers.forEach((header, index) => {
        // Use the header as the key, and the corresponding cell value (or empty string if undefined)
        item[header] = row[index] || '';
      });
      return item;
    });

    res.json({ headers, data });
  } catch (error) {
    console.error('Error loading sheet:', error);
    res.status(500).json({ error: 'Failed to load Google Sheet data: ' + (error.message || 'Unknown error') });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});