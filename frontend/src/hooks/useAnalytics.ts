import { useState, useEffect } from 'react';
import { analyticsService, AnalyticsSummary } from '../lib/analyticsApi';

interface UseAnalyticsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      const data = await analyticsService.getAnalyticsSummary();
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAnalytics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const refresh = () => {
    setLoading(true);
    fetchAnalytics();
  };

  const trackPageView = (page: string) => {
    analyticsService.trackPageView(page);
  };

  const trackBlogView = (blogId: string, title: string) => {
    analyticsService.trackBlogView(blogId, title);
  };

  const trackProjectView = (projectId: string, name: string) => {
    analyticsService.trackProjectView(projectId, name);
  };

  return {
    analytics,
    loading,
    error,
    refresh,
    trackPageView,
    trackBlogView,
    trackProjectView,
  };
};
