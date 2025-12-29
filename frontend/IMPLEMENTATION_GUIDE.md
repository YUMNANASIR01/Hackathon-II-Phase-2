# Frontend Implementation Guide - Phase II (SDD Aligned)

**Framework:** Next.js 16+ with Spec-Driven Development
**Language:** TypeScript (Strict Mode)
**Development Methodology:** SDD (Spec-Driven Development)
**Status:** Ready for Implementation

---

## 🎯 Implementation Workflow (Spec-Driven)

### The SDD Cycle
```
1. READ SPEC
   └─ specs/phase2-web/overview.md
   └─ specs/phase2-web/api/rest-endpoints.md
   └─ frontend/CLAUDE.md patterns

2. WRITE TEST (Red Phase)
   └─ __tests__/*.test.tsx
   └─ Test covers spec requirements
   └─ Test fails (RED)

3. IMPLEMENT COMPONENT (Green Phase)
   └─ components/*.tsx
   └─ App router pages/app/*.tsx
   └─ Code makes test pass
   └─ Test passes (GREEN)

4. REFACTOR (Refactor Phase)
   └─ Clean up, optimize, document
   └─ Tests still pass
   └─ Code aligns with spec

5. CREATE PHR (Prompt History Record)
   └─ Record what was done
   └─ Store under history/prompts/phase2-web/
   └─ Reference spec in PHR

6. REPEAT for next feature
```

---

## 📋 Before Starting Each Task

### Pre-Implementation Checklist
- [ ] Read the spec for this page/component
- [ ] Read relevant CLAUDE.md section
- [ ] Check CONSTITUTION.md for standards
- [ ] Create test cases first (TDD)
- [ ] Write minimal code to pass tests
- [ ] Refactor for clarity
- [ ] Create PHR record

---

## 🔴 RED PHASE: Write Tests First

### Component Test Structure (Jest)

**File:** `frontend/components/__tests__/TaskList.test.tsx`

```typescript
// components/__tests__/TaskList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../tasks/TaskList';
import * as api from '@/lib/api';

// Mock the API
jest.mock('@/lib/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('TaskList Component', () => {
  /**
   * SPEC SOURCE: specs/phase2-web/overview.md (Feature: Task CRUD Operations)
   * Component Purpose: Display list of user's tasks
   */

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task list from API', async () => {
    /**
     * SPEC: List all tasks for authenticated user
     * Source: specs/phase2-web/api/rest-endpoints.md (GET /api/tasks)
     *
     * Given: API returns list of tasks
     * When: Component mounts
     * Then: All tasks displayed in list
     */

    const mockTasks = [
      {
        id: 1,
        title: 'Buy Groceries',
        description: 'Milk, eggs, bread',
        completed: false,
      },
      {
        id: 2,
        title: 'Complete Project',
        description: 'Finish Phase II',
        completed: true,
      },
    ];

    mockedApi.getTasks.mockResolvedValue({
      items: mockTasks,
      total: 2,
    });

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('Buy Groceries')).toBeInTheDocument();
      expect(screen.getByText('Complete Project')).toBeInTheDocument();
    });
  });

  it('should filter tasks by status', async () => {
    /**
     * SPEC: Filter tasks by status (all, pending, completed)
     * Source: specs/phase2-web/api/rest-endpoints.md (Query parameter: status)
     *
     * Given: User selects "Pending" filter
     * When: Component updates
     * Then: Only pending tasks shown
     */

    const mockPendingTasks = [
      {
        id: 1,
        title: 'Buy Groceries',
        completed: false,
      },
    ];

    mockedApi.getTasks.mockResolvedValue({
      items: mockPendingTasks,
      total: 1,
    });

    render(<TaskList initialStatus="pending" />);

    await waitFor(() => {
      expect(mockedApi.getTasks).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' })
      );
      expect(screen.getByText('Buy Groceries')).toBeInTheDocument();
      expect(screen.queryByText('Complete Project')).not.toBeInTheDocument();
    });
  });

  it('should show error when API fails', async () => {
    /**
     * SPEC: Handle API errors gracefully
     * Source: specs/phase2-web/api/rest-endpoints.md (Error responses)
     *
     * Given: API request fails
     * When: Component renders
     * Then: Error message displayed to user
     */

    mockedApi.getTasks.mockRejectedValue(
      new Error('Failed to fetch tasks')
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should handle unauthorized (401)', async () => {
    /**
     * SPEC: Authentication required on all endpoints
     * Source: specs/phase2-web/api/rest-endpoints.md (Authentication section)
     *
     * Given: User's JWT token expired
     * When: Component requests tasks
     * Then: Redirect to login
     */

    const error = new Error('Unauthorized');
    (error as any).response = { status: 401 };

    mockedApi.getTasks.mockRejectedValue(error);

    // This should trigger redirect
    render(<TaskList />);

    await waitFor(() => {
      // Verify redirect happened (mocked in actual implementation)
      expect(mockedApi.getTasks).toHaveBeenCalled();
    });
  });
});
```

### Page Test Structure

**File:** `frontend/app/(dashboard)/tasks/__tests__/page.test.tsx`

```typescript
// app/(dashboard)/tasks/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import TasksPage from '../page';

describe('Tasks Page', () => {
  /**
   * SPEC SOURCE: specs/phase2-web/ui/pages.md (Tasks Dashboard)
   * Page Purpose: Display user's task dashboard
   */

  it('should render tasks page with header and form', () => {
    /**
     * SPEC: Tasks page includes task list and create form
     *
     * Given: User navigates to /tasks
     * When: Page loads
     * Then: Display header, create form, and task list
     */

    render(<TasksPage />);

    expect(screen.getByText(/my tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });
});
```

---

## 🟢 GREEN PHASE: Implement to Pass Tests

### Component Implementation Template

**File:** `frontend/components/tasks/TaskList.tsx`

```typescript
// components/tasks/TaskList.tsx
/**
 * TASK LIST COMPONENT
 *
 * SPEC SOURCE: specs/phase2-web/overview.md (Feature: Task CRUD Operations)
 * ARCHITECTURE: specs/phase2-web/architecture.md (Frontend Architecture)
 *
 * Purpose: Display and manage list of user's tasks
 * Requirements:
 * - Show all tasks for authenticated user
 * - Support filtering by status (all, pending, completed)
 * - Support sorting
 * - Handle loading and error states
 * - Support task actions (edit, delete, complete)
 */

'use client'; // Client component (interactive)

import { useState, useEffect } from 'react';
import { Task, getTasks, deleteTask, updateTask } from '@/lib/api';
import { TaskItem } from './TaskItem';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Toast } from '@/components/shared/Toast';

interface TaskListProps {
  initialStatus?: 'all' | 'pending' | 'completed';
}

export function TaskList({ initialStatus = 'all' }: TaskListProps) {
  // STATE MANAGEMENT
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // SPEC: GET /api/tasks - Fetch tasks
  useEffect(() => {
    async function loadTasks() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTasks({ status });
        setTasks(response.items);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load tasks';
        setError(message);
        setToast({ message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [status]);

  // SPEC: DELETE /api/tasks/{id} - Delete task
  async function handleDelete(taskId: number) {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      setToast({ message: 'Task deleted', type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setToast({ message, type: 'error' });
    }
  }

  // SPEC: PATCH /api/tasks/{id}/complete - Toggle completion
  async function handleToggleComplete(taskId: number) {
    try {
      const updatedTask = await updateTask(taskId, {});
      setTasks(tasks.map(t => (t.id === taskId ? updatedTask : t)));
      setToast({ message: 'Task updated', type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setToast({ message, type: 'error' });
    }
  }

  // RENDER LOADING STATE
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // RENDER ERROR STATE
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  // RENDER EMPTY STATE
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No tasks found</p>
        <p className="text-sm text-gray-400">Create your first task to get started</p>
      </div>
    );
  }

  // RENDER TASK LIST
  return (
    <div className="space-y-3">
      {/* Status Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded ${
              status === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={() => handleDelete(task.id)}
            onToggleComplete={() => handleToggleComplete(task.id)}
          />
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  );
}
```

### API Client Integration

**File:** `frontend/lib/api.ts`

```typescript
// lib/api.ts
/**
 * API CLIENT - HTTP requests to backend
 *
 * SPEC SOURCE: specs/phase2-web/api/rest-endpoints.md
 * ARCHITECTURE: specs/phase2-web/architecture.md (Frontend Architecture section 2.4)
 *
 * Purpose:
 * - Make HTTP requests to backend
 * - Handle JWT token in Authorization header
 * - Manage error responses
 * - Type-safe request/response
 *
 * Security:
 * - JWT token automatically included
 * - Error handling without exposing details
 * - HTTPS only in production
 */

import axios, { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  items: Task[];
  total: number;
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Add JWT token
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API METHODS (matching spec endpoints)

export async function getTasks(
  params?: { status?: string; sort?: string }
): Promise<TasksResponse> {
  /**
   * SPEC: GET /api/tasks
   * Reference: specs/phase2-web/api/rest-endpoints.md
   */
  const response = await api.get<TasksResponse>('/tasks', { params });
  return response.data;
}

export async function createTask(data: {
  title: string;
  description?: string;
}): Promise<Task> {
  /**
   * SPEC: POST /api/tasks
   * Reference: specs/phase2-web/api/rest-endpoints.md
   */
  const response = await api.post<Task>('/tasks', data);
  return response.data;
}

export async function getTask(taskId: number): Promise<Task> {
  /**
   * SPEC: GET /api/tasks/{id}
   */
  const response = await api.get<Task>(`/tasks/${taskId}`);
  return response.data;
}

export async function updateTask(
  taskId: number,
  data: Partial<Task>
): Promise<Task> {
  /**
   * SPEC: PUT /api/tasks/{id} or PATCH /api/tasks/{id}
   */
  const response = await api.patch<Task>(`/tasks/${taskId}`, data);
  return response.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  /**
   * SPEC: DELETE /api/tasks/{id}
   */
  await api.delete(`/tasks/${taskId}`);
}

// AUTHENTICATION METHODS

export async function signup(data: {
  email: string;
  password: string;
  name: string;
}): Promise<{ token: string; user: any }> {
  /**
   * SPEC: POST /api/auth/signup
   */
  const response = await api.post('/auth/signup', data);
  return response.data;
}

export async function signin(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: any }> {
  /**
   * SPEC: POST /api/auth/signin
   */
  const response = await api.post('/auth/signin', data);
  return response.data;
}

async function getSession() {
  // Get from Better Auth or local storage
  return null; // Simplified for example
}

export default api;
```

---

## 🔵 REFACTOR PHASE: Code Quality

### Refactoring Checklist

- [ ] No `any` types without justification (TSype strict mode)
- [ ] All props have TypeScript interfaces
- [ ] Error handling complete
- [ ] Accessibility standards met (WCAG 2.1)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Tests still passing
- [ ] No hardcoded strings (use i18n or constants)
- [ ] Follows CLAUDE.md patterns

### Code Review Checklist

```typescript
// ✅ GOOD: Type-safe, accessible, error-handled
interface TaskFormProps {
  onSubmit: (data: TaskCreate) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit({ title });
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        aria-label="Task title"
        disabled={isLoading}
      />
      {error && <span className="text-red-500">{error}</span>}
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}

// ❌ BAD: No types, no error handling, no accessibility
export function TaskForm(props) {
  function handleSubmit() {
    props.onSubmit({ title: 'test' }); // No error handling
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="title" /> {/* No accessibility */}
      <button>Submit</button> {/* No loading state */}
    </form>
  );
}
```

---

## 📝 CREATE PHR: Document Your Work

### PHR File Structure

**Location:** `history/prompts/phase2-web/`
**Naming:** `{ID}-{slug}.{stage}.prompt.md`

```markdown
# Prompt History Record (PHR)

---
id: 2
title: Implement Task List Component
stage: red-green-refactor
phase: phase2-web
date: 2024-12-28
model: claude-haiku-4-5
status: completed
---

## User Prompt
[Verbatim copy of your request]

## Implementation Summary

### Tasks Completed
1. ✅ Write test cases for TaskList component
2. ✅ Implement TaskList component
3. ✅ Implement API client methods
4. ✅ Add error handling and loading states
5. ✅ Add TypeScript types

### Specs Referenced
- specs/phase2-web/overview.md (Feature: Task CRUD)
- specs/phase2-web/api/rest-endpoints.md (GET /api/tasks)
- frontend/CLAUDE.md (Component Patterns)

### Files Modified
- frontend/components/tasks/TaskList.tsx (NEW)
- frontend/lib/api.ts (UPDATED)
- frontend/components/__tests__/TaskList.test.tsx (NEW)

### Tests Status
```bash
npm test -- TaskList.test.tsx
# ✅ 4 passed
# Coverage: 88%
```

### Features Implemented
- [x] Display list of tasks
- [x] Filter by status (all, pending, completed)
- [x] Delete task functionality
- [x] Toggle completion status
- [x] Error handling
- [x] Loading states
- [x] Empty state messaging

### Next Steps
- [ ] Implement TaskForm component
- [ ] Implement edit functionality
- [ ] Add E2E tests
- [ ] Responsive design refinement
```

---

## 🔄 Complete Implementation Example

### Task: Implement Task Creation Form

#### Step 1: READ SPEC
```
Source: specs/phase2-web/api/rest-endpoints.md (POST /api/tasks)
Requirement: Create task with title and description
Input: { title, description }
Response: Task object (201 Created)
Error: 400 Bad Request (validation error)
```

#### Step 2: RED PHASE (Write Test)
```typescript
describe('TaskForm', () => {
  it('should create task on submit', async () => {
    const mockOnSubmit = jest.fn();

    render(<TaskForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Enter task title');
    await userEvent.type(input, 'Buy Groceries');

    const button = screen.getByText('Create');
    await userEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Buy Groceries',
    });
  });

  it('should show validation error for empty title', async () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    const button = screen.getByText('Create');
    await userEvent.click(button);

    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });
});
```

#### Step 3: GREEN PHASE (Implement)
```typescript
'use client';

import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ title, description });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        disabled={isLoading}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        disabled={isLoading}
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
```

#### Step 4: Tests Pass ✅
```bash
npm test -- TaskForm
# ✅ 2 passed
```

#### Step 5: REFACTOR
- Add TypeScript types ✅
- Add error handling ✅
- Add loading state ✅
- Add accessibility ✅

#### Step 6: CREATE PHR
```
Created: history/prompts/phase2-web/2-implement-task-form.red-green-refactor.prompt.md
Status: Completed
```

---

## ✅ Implementation Checklist (Per Component)

For every component/page:

- [ ] Read spec in `specs/phase2-web/overview.md` and `api/rest-endpoints.md`
- [ ] Write test cases (RED phase) with `__tests__/*.test.tsx`
- [ ] Implement component in `components/` or `app/`
- [ ] Tests pass (GREEN phase)
- [ ] TypeScript strict mode (no `any` without justification)
- [ ] Error handling for all API calls
- [ ] Accessibility verified (keyboard nav, ARIA labels)
- [ ] Responsive design verified
- [ ] Create PHR record
- [ ] Update status in task tracking

---

## 📊 Development Progress Tracking

### Feature Completion Log

| Component/Page | Spec Section | Test | Code | Review | PHR | Status |
|---|---|---|---|---|---|---|
| LoginForm | Auth | 🔴 | 🔴 | ⚪ | ⚪ | 0% |
| SignupForm | Auth | 🔴 | 🔴 | ⚪ | ⚪ | 0% |
| TaskList | Task CRUD | 🟢 | 🟢 | 🟡 | 🟡 | 50% |
| TaskForm | Task CRUD | 🟢 | 🟢 | 🟡 | ⚪ | 50% |
| Dashboard | Layout | 🔴 | 🔴 | ⚪ | ⚪ | 0% |

Legend: 🔴 Pending | 🟡 In Progress | 🟢 Complete | ⚪ Not Started

---

## 🎯 Success Criteria

Implementation is successful when:

- ✅ All tests pass
- ✅ Code coverage > 60% on components
- ✅ No TypeScript errors (strict mode)
- ✅ Error handling complete
- ✅ Responsive on mobile, tablet, desktop
- ✅ Accessibility standards met (WCAG 2.1)
- ✅ All spec requirements implemented
- ✅ PHR records created for all features
- ✅ Code follows CLAUDE.md and CONSTITUTION.md

---

**Document Status:** IMPLEMENTATION READY
**Last Updated:** December 28, 2024

