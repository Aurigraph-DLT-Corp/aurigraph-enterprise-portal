import { useState, useCallback } from 'react';
import subscriptionApi from '../services/subscriptionApi';

interface Subscription {
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

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionApi.getCurrentSubscription();
      setSubscription(data);
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch subscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionApi.getPlans();
      setPlans(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch plans';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const upgrade = useCallback(async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await subscriptionApi.upgradeSubscription(planId);
      setSubscription(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to upgrade subscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downgrade = useCallback(async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await subscriptionApi.downgradeSubscription(planId);
      setSubscription(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to downgrade subscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await subscriptionApi.cancelSubscription(reason);
      setSubscription(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const updated = await subscriptionApi.pauseSubscription();
      setSubscription(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to pause subscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const updated = await subscriptionApi.resumeSubscription();
      setSubscription(updated);
      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to resume subscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subscription,
    plans,
    loading,
    error,
    fetchCurrentSubscription,
    fetchPlans,
    upgrade,
    downgrade,
    cancel,
    pause,
    resume,
  };
};

export default useSubscription;
