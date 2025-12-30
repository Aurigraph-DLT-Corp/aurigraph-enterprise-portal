import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dlt.aurigraph.io/api/v12';

interface AppData {
  name: string;
}

interface App extends AppData {
  id: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  transactions: number;
  tps: number;
}

interface SearchParams {
  query?: string;
  status?: string;
  sort?: string;
}

interface AppFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const appApi = {
  // Get all apps
  async getApps(params?: SearchParams): Promise<App[]> {
    try {
      const response = await apiClient.get('/apps', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch apps'
      );
    }
  },

  // Get single app
  async getApp(appId: string): Promise<App> {
    try {
      const response = await apiClient.get(`/apps/${appId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch app'
      );
    }
  },

  // Create new app
  async createApp(data: AppData): Promise<App> {
    try {
      const response = await apiClient.post('/apps', data);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create app'
      );
    }
  },

  // Update app
  async updateApp(appId: string, data: Partial<AppData>): Promise<App> {
    try {
      const response = await apiClient.put(`/apps/${appId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update app'
      );
    }
  },

  // Delete app
  async deleteApp(appId: string): Promise<void> {
    try {
      await apiClient.delete(`/apps/${appId}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to delete app'
      );
    }
  },

  // Search apps
  async searchApps(query: string, filters?: any): Promise<App[]> {
    try {
      const response = await apiClient.get('/apps/search', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Search failed'
      );
    }
  },

  // Get app features
  async getAppFeatures(appId: string): Promise<AppFeature[]> {
    try {
      const response = await apiClient.get(`/apps/${appId}/features`);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch features'
      );
    }
  },

  // Toggle feature
  async toggleFeature(
    appId: string,
    featureId: string,
    enabled: boolean
  ): Promise<AppFeature> {
    try {
      const response = await apiClient.patch(
        `/apps/${appId}/features/${featureId}`,
        { enabled }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to toggle feature'
      );
    }
  },

  // Update feature rollout
  async updateFeatureRollout(
    appId: string,
    featureId: string,
    rolloutPercentage: number
  ): Promise<AppFeature> {
    try {
      const response = await apiClient.patch(
        `/apps/${appId}/features/${featureId}/rollout`,
        { rolloutPercentage }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update rollout'
      );
    }
  },
};

export default appApi;
