import { useState, useCallback } from 'react';
import appApi from '../services/appApi';

interface App {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  transactions: number;
  tps: number;
}

interface AppData {
  name: string;
}

export const useAppManagement = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appApi.getApps();
      setApps(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch apps';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createApp = useCallback(async (appData: AppData) => {
    try {
      setLoading(true);
      setError(null);
      const newApp = await appApi.createApp(appData);
      setApps((prev) => [...prev, newApp]);
      return newApp;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create app';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApp = useCallback(async (appId: string, appData: Partial<AppData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedApp = await appApi.updateApp(appId, appData);
      setApps((prev) =>
        prev.map((app) => (app.id === appId ? updatedApp : app))
      );
      return updatedApp;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update app';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApp = useCallback(async (appId: string) => {
    try {
      setLoading(true);
      setError(null);
      await appApi.deleteApp(appId);
      setApps((prev) => prev.filter((app) => app.id !== appId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete app';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchApps = useCallback(async (query: string, filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const results = await appApi.searchApps(query, filters);
      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeature = useCallback(
    async (appId: string, featureId: string, enabled: boolean) => {
      try {
        setLoading(true);
        setError(null);
        const feature = await appApi.toggleFeature(appId, featureId, enabled);
        return feature;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to toggle feature';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateFeatureRollout = useCallback(
    async (appId: string, featureId: string, rolloutPercentage: number) => {
      try {
        setLoading(true);
        setError(null);
        const feature = await appApi.updateFeatureRollout(
          appId,
          featureId,
          rolloutPercentage
        );
        return feature;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update rollout';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    apps,
    loading,
    error,
    fetchApps,
    createApp,
    updateApp,
    deleteApp,
    searchApps,
    toggleFeature,
    updateFeatureRollout,
  };
};

export default useAppManagement;
