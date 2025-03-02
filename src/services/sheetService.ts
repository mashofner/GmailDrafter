import axios from 'axios';
import config from '../config';

interface SheetDataResponse {
  headers: string[];
  data: any[];
}

export const loadSheetData = async (sheetUrl: string): Promise<SheetDataResponse> => {
  try {
    // Use the correct API URL based on environment
    const apiUrl = `${config.apiBaseUrl}/api/load-sheet`;
    console.log(`Sending request to: ${apiUrl}`);
    
    const response = await axios.post(apiUrl, { sheetUrl });
    return response.data;
  } catch (error: any) {
    console.error('Sheet loading error:', error);
    const errorMessage = error.response?.data?.error || 'Failed to load sheet data';
    throw new Error(errorMessage);
  }
};