import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseLoadingStateOptions {
  initialLoading?: boolean;
  resetOnLocationChange?: boolean;
  debounceMs?: number;
}

export const useLoadingState = (options: UseLoadingStateOptions = {}) => {
  const {
    initialLoading = false,
    resetOnLocationChange = true,
    debounceMs = 0
  } = options;

  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset loading state when location changes
  useEffect(() => {
    if (resetOnLocationChange) {
      setLoading(initialLoading);
      setError(null);
    }
  }, [location.pathname, resetOnLocationChange, initialLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setLoadingWithDebounce = (newLoading: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (debounceMs > 0) {
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setLoading(newLoading);
        }
      }, debounceMs);
    } else {
      if (isMountedRef.current) {
        setLoading(newLoading);
      }
    }
  };

  const setErrorWithReset = (errorMessage: string | null) => {
    if (isMountedRef.current) {
      setError(errorMessage);
      if (errorMessage) {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    if (isMountedRef.current) {
      setLoading(initialLoading);
      setError(null);
    }
  };

  return {
    loading,
    error,
    setLoading: setLoadingWithDebounce,
    setError: setErrorWithReset,
    reset,
    isMounted: isMountedRef.current
  };
};
