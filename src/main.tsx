import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Production-safe cache clearing for authentication issues
if (typeof window !== "undefined") {
  console.log('🧹 Starting production cache management...');
  
  // Check for corrupted auth state
  const hasCorruptedAuth = () => {
    try {
      const authKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth') || key.includes('token')
      );
      
      for (const key of authKeys) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            // Check if the token is expired or malformed
            if (parsed.expires_at && parsed.expires_at < Date.now() / 1000) {
              console.log('🔍 Found expired auth data:', key);
              return true;
            }
            if (!parsed.access_token || !parsed.user) {
              console.log('🔍 Found malformed auth data:', key);
              return true;
            }
          } catch {
            console.log('🔍 Found corrupted auth data:', key);
            return true;
          }
        }
      }
      return false;
    } catch {
      return true;
    }
  };

  // Clear corrupted auth data in production
  if (hasCorruptedAuth()) {
    console.log('🧹 Clearing corrupted or expired auth data...');
    
    // 1. Unregister all service workers
    navigator.serviceWorker?.getRegistrations().then(regs => {
      regs.forEach(reg => {
        console.log('🗑️ Unregistering service worker:', reg);
        reg.unregister();
      });
    });
    
    // 2. Clear all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          console.log('🗑️ Deleting cache:', cacheName);
          caches.delete(cacheName);
        });
      });
    }
    
    // 3. Clear auth-related localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('token')) {
        console.log('🗑️ Clearing localStorage key:', key);
        localStorage.removeItem(key);
      }
    });
    
    // 4. Clear sessionStorage
    sessionStorage.clear();
    console.log('🗑️ Cleared sessionStorage');
    
    console.log('✅ Cache clearing completed');
  }
}

// Add AI backend health check function for production debugging
if (typeof window !== "undefined") {
  (window as any).testAIBackend = async () => {
    console.log('🧪 Testing AI backend connection...');
    try {
      const { healthCheck } = await import('@/services/aiAnalysisService');
      const result = await healthCheck();
      console.log('✅ AI Backend health check:', result);
      return result;
    } catch (error) {
      console.error('❌ AI Backend health check failed:', error);
      return { error: error.message };
    }
  };
}

createRoot(document.getElementById("root")!).render(<App />);
