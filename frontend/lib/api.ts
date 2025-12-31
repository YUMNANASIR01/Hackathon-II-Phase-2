import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, AuthResponse, Task, TasksResponse, CreateTaskInput, UpdateTaskInput } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get token from localStorage (Better Auth sets it as httpOnly cookie, but we can also use sessionStorage)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Try to get from sessionStorage first (set by Better Auth)
    const token = sessionStorage.getItem('auth_token');
    return token;
  } catch {
    return null;
  }
};

// Request interceptor: Add JWT token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && token.trim()) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    } else {
      // Log when token is missing (helpful for debugging)
      console.debug(`No token available for ${config.method?.toUpperCase()} ${config.url}`);
    }

    // Log all requests for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, {
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    const errorDetails = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    };

    console.error('API Error Details:', errorDetails);

    // Log the actual error message from backend
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as Record<string, unknown>;
      console.error('[Backend Error Message]', data.detail || data.message || JSON.stringify(data));
    }

    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear token on 401
        try {
          sessionStorage.removeItem('auth_token');
        } catch {
          // Ignore
        }
        // Redirect to login (will be handled by middleware)
      }
    }

    // Return error with consistent format
    const apiError: ApiError = {
      status: 'error',
      code: String(error.response?.status || 'UNKNOWN'),
      message: getErrorMessage(error),
    };

    console.error('Formatted API Error:', apiError);
    console.error('Full error object:', error);
    return Promise.reject(apiError);
  }
);

// Helper to extract error message from API response
function getErrorMessage(error: AxiosError): string {
  // Try to extract detail from FastAPI error response
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>;

    // FastAPI returns "detail" field for errors
    if ('detail' in data && typeof data.detail === 'string') {
      return data.detail;
    }

    // Also try "message" field
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  if (error.message && error.message !== 'Network Error') {
    return error.message;
  }

  return `Error: ${error.response?.status || 'Network error'}`;
}

// Health check
export const checkHealth = async (): Promise<{ status: string; version: string }> => {
  const { data } = await axiosInstance.get('/api/health');
  return data;
};

// ============ AUTH ENDPOINTS ============

export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post('/api/auth/signup', {
      email,
      password,
      name,
    });
    // Backend returns: {access_token, token_type, user: {id, email, name, created_at}}
    const token = data.access_token || data.token;
    if (token) {
      sessionStorage.setItem('auth_token', token);
    }
    return {
      id: data.user?.id || '',
      email: data.user?.email || email,
      name: data.user?.name || name,
      token: token,
      expiresIn: 604800, // 7 days in seconds
    };
  },

  /**
   * Sign in with email and password
   */
  signin: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('[Signin] Raw input:', { email, password });
    console.log('[Signin] Email type:', typeof email, 'Password type:', typeof password);
    console.log('[Signin] Email length:', email?.length, 'Password length:', password?.length);
    console.log('[Signin] Email trimmed:', email?.trim(), 'Password trimmed:', password?.trim());

    const { data } = await axiosInstance.post('/api/auth/signin', {
      email: email?.trim() || email,
      password: password?.trim() || password,
    });
    // Backend returns: {access_token, token_type, user: {id, email, name, created_at}}
    const token = data.access_token || data.token;
    if (token) {
      sessionStorage.setItem('auth_token', token);
    }
    return {
      id: data.user?.id || '',
      email: data.user?.email || email,
      name: data.user?.name,
      token: token,
      expiresIn: 604800, // 7 days in seconds
    };
  },

  /**
   * Get current user info
   */
  me: async () => {
    const { data } = await axiosInstance.get('/api/auth/me');
    return data;
  },

  /**
   * Refresh auth token
   */
  refresh: async (): Promise<{ token: string; expiresIn: number }> => {
    const { data } = await axiosInstance.post('/api/auth/refresh', {});
    if (data.token) {
      sessionStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  /**
   * Sign out (logout)
   */
  signout: async (): Promise<{ status: string; message: string }> => {
    try {
      const { data } = await axiosInstance.post('/api/auth/signout', {});
      return data;
    } finally {
      // Clear token even if request fails
      try {
        sessionStorage.removeItem('auth_token');
      } catch {
        // Ignore
      }
    }
  },
};

// Helper function to convert snake_case to camelCase
function snakeToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  const camelObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      camelObj[camelKey] = snakeToCamel(obj[key]);
    }
  }
  return camelObj;
}

// ============ TASK ENDPOINTS ============

export const tasksApi = {
  /**
   * List all tasks with optional filtering
   */
  list: async (
    status: string = 'all',
    sort: string = 'created',
    limit: number = 20,
    offset: number = 0
  ): Promise<TasksResponse> => {
    const { data } = await axiosInstance.get('/api/tasks', {
      params: {
        status,
        sort,
        limit,
        offset,
      },
    });
    // Convert snake_case to camelCase and wrap in expected format
    const tasks = Array.isArray(data) ? data : data.items || [];
    const convertedTasks = tasks.map(snakeToCamel);

    // Return in expected TasksResponse format
    return {
      items: convertedTasks,
      total: data.total || convertedTasks.length,
      limit: data.limit || limit,
      offset: data.offset || offset,
    };
  },

  /**
   * Get a single task by ID
   */
  get: async (id: number): Promise<Task> => {
    const { data } = await axiosInstance.get(`/api/tasks/${id}`);
    // Convert snake_case to camelCase
    return snakeToCamel(data);
  },

  /**
   * Create a new task
   */
  create: async (input: CreateTaskInput): Promise<Task> => {
    const { data } = await axiosInstance.post('/api/tasks', input);
    // Convert snake_case to camelCase
    return snakeToCamel(data);
  },

  /**
   * Update a task (full replacement)
   */
  update: async (id: number, input: UpdateTaskInput): Promise<Task> => {
    const { data } = await axiosInstance.put(`/api/tasks/${id}`, input);
    // Convert snake_case to camelCase
    return snakeToCamel(data);
  },

  /**
   * Partially update a task
   */
  patch: async (id: number, input: Partial<UpdateTaskInput>): Promise<Task> => {
    const { data } = await axiosInstance.patch(`/api/tasks/${id}`, input);
    // Convert snake_case to camelCase
    return snakeToCamel(data);
  },

  /**
   * Toggle task completion status
   */
  toggleComplete: async (id: number): Promise<Task> => {
    const { data } = await axiosInstance.patch(`/api/tasks/${id}/complete`, {});
    // Convert snake_case to camelCase
    return snakeToCamel(data);
  },

  /**
   * Delete a task
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tasks/${id}`);
  },
};

// Re-export axios instance for advanced usage
export { axiosInstance as api };

// Type-safe API wrapper with error handling
export async function apiCall<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: ApiError) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const apiError = error as ApiError;
    if (errorHandler) {
      errorHandler(apiError);
    }
    console.error('API Error:', apiError);
    return null;
  }
}

// Export for convenience
export default axiosInstance;
