import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dlt.aurigraph.io/api/v12';

export interface AnalyticsMetrics {
  timestamp: string;
  transactions: number;
  tps: number;
  latency: number;
  errors: number;
  activeUsers: number;
}

export interface AggregatedMetrics {
  totalTransactions: number;
  averageTPS: number;
  averageLatency: number;
  totalErrors: number;
  peakTPS: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
}

interface MetricsParams {
  startTime?: string;
  endTime?: string;
  granularity?: 'minute' | 'hour' | 'day';
  appId?: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token
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

export const analyticsApi = {
  // Get metrics for time range
  async getMetrics(params?: MetricsParams): Promise<AnalyticsMetrics[]> {
    try {
      const response = await apiClient.get('/analytics/metrics', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch metrics'
      );
    }
  },

  // Get aggregated metrics
  async getAggregatedMetrics(
    params?: MetricsParams
  ): Promise<AggregatedMetrics> {
    try {
      const response = await apiClient.get('/analytics/aggregated', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch aggregated metrics'
      );
    }
  },

  // Get TPS data
  async getTpsData(params?: MetricsParams): Promise<AnalyticsMetrics[]> {
    try {
      const response = await apiClient.get('/analytics/tps', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch TPS data'
      );
    }
  },

  // Get latency percentiles
  async getLatencyPercentiles(params?: MetricsParams): Promise<any> {
    try {
      const response = await apiClient.get('/analytics/latency-percentiles', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch latency percentiles'
      );
    }
  },

  // Get error rates
  async getErrorRates(params?: MetricsParams): Promise<AnalyticsMetrics[]> {
    try {
      const response = await apiClient.get('/analytics/errors', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch error rates'
      );
    }
  },

  // Get transaction volume
  async getTransactionVolume(
    params?: MetricsParams
  ): Promise<AnalyticsMetrics[]> {
    try {
      const response = await apiClient.get('/analytics/transactions', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch transaction volume'
      );
    }
  },

  // Get active users
  async getActiveUsers(params?: MetricsParams): Promise<AnalyticsMetrics[]> {
    try {
      const response = await apiClient.get('/analytics/active-users', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch active users'
      );
    }
  },

  // Export metrics to CSV
  async exportMetrics(params?: MetricsParams): Promise<Blob> {
    try {
      const response = await apiClient.get('/analytics/export', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to export metrics'
      );
    }
  },

  // Get custom report
  async getCustomReport(reportConfig: any): Promise<any> {
    try {
      const response = await apiClient.post('/analytics/report', reportConfig);
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate report'
      );
    }
  },

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<AggregatedMetrics> {
    try {
      const response = await apiClient.get('/analytics/realtime');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch real-time metrics'
      );
    }
  },
};

export default analyticsApi;
