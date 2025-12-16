import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';

interface UseGlobalLoadingOptions {
  /** Minimum time loading must be active before showing overlay (ms) */
  delay?: number;
  /** Minimum display time once shown to avoid flicker (ms) */
  minDisplayTime?: number;
}

/**
 * A hook that tracks real loading state from React Query.
 * Only returns true when:
 * 1. There are active fetches/mutations (real network activity)
 * 2. The loading has persisted longer than the delay threshold
 * 
 * This prevents showing loaders for fast requests and cached data.
 */
export function useGlobalLoading(options: UseGlobalLoadingOptions = {}) {
  const { delay = 400, minDisplayTime = 300 } = options;
  
  // Track actual React Query fetching state
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isNetworkActive = isFetching > 0 || isMutating > 0;
  
  // State for delayed visibility
  const [showLoader, setShowLoader] = useState(false);
  const showTimeRef = useRef<number | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending hide timeout when network becomes active
    if (isNetworkActive) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      
      // Only set delay timeout if not already showing
      if (!showLoader && !delayTimeoutRef.current) {
        delayTimeoutRef.current = setTimeout(() => {
          setShowLoader(true);
          showTimeRef.current = Date.now();
          delayTimeoutRef.current = null;
        }, delay);
      }
    } else {
      // Network is no longer active
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
      
      if (showLoader && showTimeRef.current) {
        // Ensure minimum display time
        const elapsed = Date.now() - showTimeRef.current;
        const remaining = Math.max(0, minDisplayTime - elapsed);
        
        hideTimeoutRef.current = setTimeout(() => {
          setShowLoader(false);
          showTimeRef.current = null;
          hideTimeoutRef.current = null;
        }, remaining);
      }
    }

    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isNetworkActive, showLoader, delay, minDisplayTime]);

  return {
    showLoader,
    isNetworkActive,
    fetchingCount: isFetching,
    mutatingCount: isMutating,
  };
}
