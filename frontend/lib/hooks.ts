'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, tasksApi, apiCall } from './api';
import type { User, Task, CreateTaskInput, UpdateTaskInput, ApiError, TaskFilters, TasksResponse } from './types';

// Toast hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info' | 'warning'; message: string }>>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

// Auth hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem('auth_token');

        // Only check auth if token exists
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const userData = await authApi.me();
        setUser(userData);
      } catch (err) {
        // Clear token if auth check fails
        try {
          sessionStorage.removeItem('auth_token');
        } catch {
          // Ignore
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await authApi.signup(email, password, name);
        setUser({
          id: response.id,
          email: response.email,
          name: response.name,
        });
        showToast('Account created successfully!', 'success');
        router.push('/tasks');
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || 'Failed to sign up';
        setError(message);
        showToast(message, 'error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router, showToast]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await authApi.signin(email, password);
        setUser({
          id: response.id,
          email: response.email,
          name: response.name,
        });
        showToast('Signed in successfully!', 'success');
        router.push('/tasks');
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || 'Failed to sign in';
        setError(message);
        showToast(message, 'error');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router, showToast]
  );

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await authApi.signout();
      setUser(null);
      setError(null);
      showToast('Signed out successfully', 'success');
      router.push('/');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  }, [router, showToast]);

  const refreshToken = useCallback(async () => {
    try {
      await authApi.refresh();
      // Token refreshed successfully
    } catch (err) {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signUp,
    signIn,
    signOut,
    refreshToken,
  };
};

// Tasks hook
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { showToast } = useToast();

  const fetchTasks = useCallback(
    async (filters?: Partial<TaskFilters>, pagination?: { limit: number; offset: number }) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await tasksApi.list(
          filters?.status || 'all',
          filters?.sort || 'created',
          pagination?.limit || 20,
          pagination?.offset || 0
        );
        setTasks(response.items);
        setTotal(response.total);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to fetch tasks');
        showToast(apiError.message || 'Failed to fetch tasks', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const createTask = useCallback(
    async (input: CreateTaskInput): Promise<Task | null> => {
      try {
        setIsLoading(true);
        const task = await tasksApi.create(input);
        setTasks((prev) => [task, ...prev]);
        setTotal((prev) => prev + 1);
        showToast('Task created successfully!', 'success');
        return task;
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || 'Failed to create task';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const updateTask = useCallback(
    async (id: number, input: UpdateTaskInput): Promise<Task | null> => {
      try {
        setIsLoading(true);
        const updated = await tasksApi.update(id, input);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        showToast('Task updated successfully!', 'success');
        return updated;
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || 'Failed to update task';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        await tasksApi.delete(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
        showToast('Task deleted successfully!', 'success');
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || 'Failed to delete task';
        setError(message);
        showToast(message, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const toggleTask = useCallback(
    async (id: number): Promise<Task | null> => {
      try {
        const updated = await tasksApi.toggleComplete(id);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        const message = updated.completed ? 'Task completed!' : 'Task marked as pending';
        showToast(message, 'success');
        return updated;
      } catch (err) {
        const apiError = err as ApiError;
        const message = apiError.message || 'Failed to toggle task';
        showToast(message, 'error');
        return null;
      }
    },
    [showToast]
  );

  const getTask = useCallback((id: number): Task | undefined => {
    return tasks.find((t) => t.id === id);
  }, [tasks]);

  return {
    tasks,
    isLoading,
    error,
    total,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTask,
  };
};

// Debounce hook
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Local storage hook
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // Ignore
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

// Previous value hook
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

// Async effect hook
export const useAsync = <T,>(
  effect: () => Promise<T>,
  deps?: React.DependencyList
): { data: T | null; isLoading: boolean; error: Error | null } => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await effect();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, isLoading, error };
};

// Interval hook
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current?.(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

// Window size hook
export const useWindowSize = (): { width: number | undefined; height: number | undefined } => {
  const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};
