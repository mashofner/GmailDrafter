import axios from 'axios';

interface SheetDataResponse {
  headers: string[];
  data: any[];
}

export const loadSheetData = async (sheetUrl: string): Promise<SheetDataResponse> => {
  try {
    const response = await axios.post('/api/load-sheet', { sheetUrl });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Failed to load sheet data';
    throw new Error(errorMessage);
  }
};