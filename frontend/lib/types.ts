/**
 * Type definitions for Hackathon Todo Frontend
 */

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name?: string;
  token: string;
  expiresIn: number;
}

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TasksResponse {
  items: Task[];
  total: number;
  limit: number;
  offset: number;
}

// API Error types
export interface ApiError {
  status: 'error';
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp?: string;
}

export interface ApiSuccess<T> {
  status: 'success';
  data: T;
}

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Filter types
export type TaskStatus = 'all' | 'pending' | 'completed';
export type TaskSort = 'created' | 'title' | 'updated';

export interface TaskFilters {
  status: TaskStatus;
  sort: TaskSort;
  search?: string;
}

// Pagination types
export interface PaginationParams {
  limit: number;
  offset: number;
}

// Health check
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  error?: string;
}

// Component prop types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

// Auth context
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInInput) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  error: string | null;
}

// Task context (for data management)
export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<Task>;
  updateTask: (id: number, data: UpdateTaskInput) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<Task>;
  getTask: (id: number) => Task | undefined;
}

// Request config
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
}
