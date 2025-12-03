// src/utils/axiosServices.ts
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // baseURL: 'http://localhost:3000',
});

axiosServices.defaults.withCredentials = true;

// ============================================================
// REQUEST MANAGER - Handles concurrent requests and auth errors
// ============================================================

// Flag to prevent multiple simultaneous logout flows
let isLoggingOut = false;

// Track all pending requests with their AbortControllers
const pendingRequests = new Map<string, AbortController>();

// Generate unique request ID
const generateRequestId = (config: any): string => {
  return `${config.method}-${config.url}-${Date.now()}-${Math.random()}`;
};

// Cancel all pending requests (called when auth fails)
const cancelAllPendingRequests = () => {
  pendingRequests.forEach((controller, requestId) => {
    controller.abort();
    pendingRequests.delete(requestId);
  });
};

// Handle authentication error (only runs once due to lock)
const handleAuthError = () => {
  // If already logging out, skip (prevents race condition)
  if (isLoggingOut) {
    return;
  }

  // Set lock to prevent concurrent logout flows
  isLoggingOut = true;

  // Cancel all other pending requests to prevent cascading failures
  cancelAllPendingRequests();

  // Clear all auth data
  Cookies.remove('token', { path: '' });
  Cookies.remove('user', { path: '' });
  Cookies.remove('userRole', { path: '' });
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');

  // Show SweetAlert warning and redirect to login (only once)
  Swal.fire({
    icon: 'warning',
    title: 'Session Expired',
    text: 'Please login first',
    confirmButtonText: 'OK',
    allowOutsideClick: false,
    allowEscapeKey: false,
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/auth/login';
    }
  });
};

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
axiosServices.interceptors.request.use(
  (config) => {
    // If already logging out, cancel this request immediately
    if (isLoggingOut) {
      const controller = new AbortController();
      controller.abort();
      config.signal = controller.signal;
      return config;
    }

    // Add auth token
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Create AbortController for this request (if not already provided)
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;

      // Track this request
      const requestId = generateRequestId(config);
      (config as any).__requestId = requestId;
      pendingRequests.set(requestId, controller);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
axiosServices.interceptors.response.use(
  (response) => {
    // Remove from pending requests on success
    const requestId = (response.config as any).__requestId;
    if (requestId) {
      pendingRequests.delete(requestId);
    }
    return response;
  },
  (error: AxiosError) => {
    // Remove from pending requests on error
    const requestId = (error.config as any)?.__requestId;
    if (requestId) {
      pendingRequests.delete(requestId);
    }

    // If request was cancelled (aborted), silently reject
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    // Skip interceptor for login endpoint (let login page handle its own errors)
    const isAuthEndpoint = requestUrl.includes('/api/auth/login');

    // Handle 401 (Unauthorized) or 403 (Forbidden) - but only once!
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      handleAuthError(); // This function has a lock to prevent multiple calls
    }

    return Promise.reject(error);
  },
);

// ============================================================
// EXPORTS
// ============================================================

// Export helper to manually cancel a request (useful for component cleanup)
export const createCancellableRequest = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
};

// Reset logout state (useful for testing or re-authentication)
export const resetAuthState = () => {
  isLoggingOut = false;
};

export default axiosServices;
