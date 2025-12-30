import { useState, useCallback, useEffect, useRef } from 'react';
import performanceApi from '../services/performanceApi';

interface PerformanceMetrics {
  timestamp: string;
  tps: number;
  latency: number;
  finality: number;
  blockTime: number;
  validatorCount: number;
}

interface PerformanceSummary {
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

export const usePerformanceMetrics = (autoFetch = true) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMetrics = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await performanceApi.getMetrics(params);
      setMetrics(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? error.message : 'Failed to fetch metrics';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await performanceApi.getSummary(params);
      setSummary(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch summary';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRealTimeMetrics = useCallback(async () => {
    try {
      const data = await performanceApi.getRealTimeMetrics();
      setSummary(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch real-time metrics:', err);
    }
  }, []);

  const fetchLatencyPercentiles = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await performanceApi.getLatencyPercentiles(params);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch percentiles';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportMetrics = useCallback(
    async (format: 'csv' | 'json' = 'csv', params?: any) => {
      try {
        const blob = await performanceApi.exportMetrics(format, params);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics.${format}`;
        a.click();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to export metrics';
        setError(message);
        throw err;
      }
    },
    []
  );

  const startPolling = useCallback((interval: number = 5000) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchRealTimeMetrics();
    }, interval);
  }, [fetchRealTimeMetrics]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMetrics();
      fetchSummary();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [autoFetch, fetchMetrics, fetchSummary, startPolling, stopPolling]);

  return {
    metrics,
    summary,
    loading,
    error,
    fetchMetrics,
    fetchSummary,
    fetchRealTimeMetrics,
    fetchLatencyPercentiles,
    exportMetrics,
    startPolling,
    stopPolling,
  };
};

export default usePerformanceMetrics;
