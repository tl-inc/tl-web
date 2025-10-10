/**
 * Paper API client
 */
import axios from 'axios';
import type { StartPaperRequest, StartPaperResponse } from '@/types/paper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const paperApi = axios.create({
  baseURL: `${API_URL}/user-papers`,
  withCredentials: true,
});

// Add access token to requests
paperApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const paperService = {
  /**
   * Start a new paper
   */
  async startPaper(data: StartPaperRequest): Promise<StartPaperResponse> {
    const response = await paperApi.post<StartPaperResponse>('/start', data);
    return response.data;
  },
};
