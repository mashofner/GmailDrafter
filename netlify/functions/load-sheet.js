const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

// Parse Google Sheet URL to get sheet ID
function getSheetId(url) {
  const regex = /\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    const { sheetUrl } = JSON.parse(event.body);
    const sheetId = getSheetId(sheetUrl);
    
    if (!sheetId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid Google Sheet URL' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Check if service account key is available
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Google service account key is not configured' }),
        headers: { 'Content-Type': 'application/json' }
      };
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
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No data found in the sheet' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // First row as headers
    const headers = rows[0];
    
    // Check if headers are empty or contain empty strings
    if (headers.some(header => !header.trim())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Sheet headers cannot be empty. Please ensure your first row contains valid column names.' }),
        headers: { 'Content-Type': 'application/json' }
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify({ headers, data }),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error loading sheet:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load Google Sheet data: ' + (error.message || 'Unknown error') }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};