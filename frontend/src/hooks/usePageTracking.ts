import { useEffect, useRef, useCallback } from 'react';
import { analyticsService } from '../lib/analyticsApi';

interface TrackingSession {
  [pageName: string]: {
    lastTracked: number;
    count: number;
  };
}

export const usePageTracking = (pageName: string, options?: {
  cooldownMs?: number;
  trackRefresh?: boolean;
  sessionBased?: boolean;
}) => {
  const {
    cooldownMs = 30000, // 30 seconds between same page tracks
    trackRefresh = false,
    sessionBased = true
  } = options || {};

  const hasTracked = useRef(false);
  const currentPage = useRef<string | null>(null);

  const getStorageKey = useCallback(() => {
    return sessionBased ? 'analytics_session' : 'analytics_persistent';
  }, [sessionBased]);

  const getStorage = useCallback(() => {
    return sessionBased ? sessionStorage : localStorage;
  }, [sessionBased]);

  const getTrackingData = useCallback((): TrackingSession => {
    try {
      const storage = getStorage();
      const data = storage.getItem(getStorageKey());
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }, [getStorage, getStorageKey]);

  const setTrackingData = useCallback((data: TrackingSession) => {
    try {
      const storage = getStorage();
      storage.setItem(getStorageKey(), JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save tracking data:', error);
    }
  }, [getStorage, getStorageKey]);

  const shouldTrack = useCallback((pageName: string): boolean => {
    const trackingData = getTrackingData();
    const pageData = trackingData[pageName];

    if (!pageData) return true;

    const timeSinceLastTrack = Date.now() - pageData.lastTracked;
    return timeSinceLastTrack > cooldownMs;
  }, [getTrackingData, cooldownMs]);

  useEffect(() => {
    // Only track if we should based on cooldown and settings
    if (shouldTrack(pageName) && (!hasTracked.current || currentPage.current !== pageName || trackRefresh)) {
      console.log(`🔍 Tracking page view: ${pageName}`);

      // Update tracking data
      const trackingData = getTrackingData();
      trackingData[pageName] = {
        lastTracked: Date.now(),
        count: (trackingData[pageName]?.count || 0) + 1
      };
      setTrackingData(trackingData);

      // Track with analytics service
      analyticsService.trackPageView(pageName);

      hasTracked.current = true;
      currentPage.current = pageName;
    }
  }, [pageName, shouldTrack, trackRefresh, getTrackingData, setTrackingData]);

  return {
    isTracked: hasTracked.current,
    currentPage: currentPage.current,
    getTrackingStats: () => getTrackingData()
  };
};
