import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dlt.aurigraph.io/api/v12';

export interface PerformanceMetrics {
  timestamp: string;
  tps: number;
  latency: number;
  finality: number;
  blockTime: number;
  validatorCount: number;
}

export interface PerformanceSummary {
  avgTPS: number;
  avgLatency: number;
  avgFinality: number;
  avgBlockTime: number;
  peakTPS: number;
  minLatency: number;
  maxLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  uptime: number;
}

interface MetricsParams {
  startTime?: string;
  endTime?: string;
  granularity?: 'second' | 'minute' | 'hour';
  appId?: string;
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

export const performanceApi = {
  // Get performance metrics
  async getMetrics(params?: MetricsParams): Promise<PerformanceMetrics[]> {
    try {
      const response = await apiClient.get('/performance/metrics', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch performance metrics'
      );
    }
  },

  // Get performance summary
  async getSummary(params?: MetricsParams): Promise<PerformanceSummary> {
    try {
      const response = await apiClient.get('/performance/summary', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch performance summary'
      );
    }
  },

  // Get TPS metrics
  async getTPS(params?: MetricsParams): Promise<PerformanceMetrics[]> {
    try {
      const response = await apiClient.get('/performance/tps', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch TPS data'
      );
    }
  },

  // Get latency metrics
  async getLatency(params?: MetricsParams): Promise<PerformanceMetrics[]> {
    try {
      const response = await apiClient.get('/performance/latency', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch latency data'
      );
    }
  },

  // Get latency percentiles
  async getLatencyPercentiles(params?: MetricsParams): Promise<any> {
    try {
      const response = await apiClient.get('/performance/latency-percentiles', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch latency percentiles'
      );
    }
  },

  // Get finality metrics
  async getFinality(params?: MetricsParams): Promise<PerformanceMetrics[]> {
    try {
      const response = await apiClient.get('/performance/finality', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch finality data'
      );
    }
  },

  // Get validator performance
  async getValidatorPerformance(params?: MetricsParams): Promise<any[]> {
    try {
      const response = await apiClient.get('/performance/validators', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch validator performance'
      );
    }
  },

  // Get real-time metrics
  async getRealTimeMetrics(): Promise<PerformanceSummary> {
    try {
      const response = await apiClient.get('/performance/realtime');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch real-time metrics'
      );
    }
  },

  // Export metrics
  async exportMetrics(
    format: 'csv' | 'json' = 'csv',
    params?: MetricsParams
  ): Promise<Blob> {
    try {
      const response = await apiClient.get('/performance/export', {
        params: { format, ...params },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to export metrics'
      );
    }
  },

  // Get health check
  async getHealthCheck(): Promise<any> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Health check failed'
      );
    }
  },
};

export default performanceApi;
