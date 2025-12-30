import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dlt.aurigraph.io/api/v12';

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'paused';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  renewalDate: string;
  features: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
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

export const subscriptionApi = {
  // Get current subscription
  async getCurrentSubscription(): Promise<Subscription> {
    try {
      const response = await apiClient.get('/subscription');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch subscription'
      );
    }
  },

  // Get available plans
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await apiClient.get('/plans');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch plans'
      );
    }
  },

  // Upgrade subscription
  async upgradeSubscription(planId: string): Promise<Subscription> {
    try {
      const response = await apiClient.post('/subscription/upgrade', {
        planId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to upgrade subscription'
      );
    }
  },

  // Downgrade subscription
  async downgradeSubscription(planId: string): Promise<Subscription> {
    try {
      const response = await apiClient.post('/subscription/downgrade', {
        planId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to downgrade subscription'
      );
    }
  },

  // Cancel subscription
  async cancelSubscription(reason?: string): Promise<Subscription> {
    try {
      const response = await apiClient.post('/subscription/cancel', {
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to cancel subscription'
      );
    }
  },

  // Pause subscription
  async pauseSubscription(): Promise<Subscription> {
    try {
      const response = await apiClient.post('/subscription/pause');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to pause subscription'
      );
    }
  },

  // Resume subscription
  async resumeSubscription(): Promise<Subscription> {
    try {
      const response = await apiClient.post('/subscription/resume');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to resume subscription'
      );
    }
  },

  // Get billing history
  async getBillingHistory(limit: number = 50): Promise<any[]> {
    try {
      const response = await apiClient.get('/billing/history', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch billing history'
      );
    }
  },
};

export default subscriptionApi;
