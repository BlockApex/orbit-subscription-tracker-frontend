'use client';

import { Api } from "@/config";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AppRefresh = () => {
  const { setAuthenticated , setUser} = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // 1. Check client environment
    if (typeof window === 'undefined') {
      console.log('AppRefresh: Running on server, skipping auth check.');
      setChecked(true);
      return;
    }

    // 2. Retrieve values from localStorage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const hasSeenOnboard = localStorage.getItem('hasSeenOnboard');

    // console.group('AppRefresh Debug Log');
    // console.log(`[1] Raw Token Value: ${token}`);
    // console.log(`[2] Onboard Value: ${hasSeenOnboard}`);

    // --- Onboarding Check (Priority 1) ---
    // If user hasn't seen onboarding, send them there immediately, 
    // regardless of token status.
    if (!hasSeenOnboard) {
      console.log('➡️ [3] Redirecting: Onboarding NOT seen. Going to /');
      if (pathname !== '/') {
        router.replace('/');
      }
      setChecked(true);
      console.groupEnd();
      return;
    }

    // --- Authentication Check (Priority 2) ---
    const isValidToken = token && token !== "null" && token !== "";

    if (isValidToken) {
      console.log('✅ [4] Authentication Succeeded: Token is valid.');
      setUser(user ? JSON.parse(user) : null);
      setAuthenticated(true);
      
      Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect to dashboard if not already there (and not on a public route that might be valid? 
      // For now, preserving original "force dashboard" behavior but preventing loop)
      // NOTE: Original code always redirected to /dashboard. 
      // We'll keep it simple: if on /auth or /onboard or root, go to dashboard.
      const publicRoutes = ['/auth', '/onboard', '/'];
      if (publicRoutes.includes(pathname)) {
        console.log('➡️ [5a] Redirecting: Authenticated user on public route. Going to /dashboard');
        router.replace('/dashboard');
      }

    } else {
      console.log('🛑 [4] Authentication Failed: Token is invalid or missing.');

      setAuthenticated(false);
      // Redirect to auth if not already there
      if (pathname !== '/auth') {
        console.log('➡️ [5b] Redirecting: No valid token. Going to /auth');
        router.replace('/auth');
      }
    }

    console.groupEnd();
    setChecked(true);
  }, [router, setAuthenticated, pathname]);

  if (!checked) return null;

  return null;
};

export default AppRefresh;