# Phase II: System Architecture & Design

**Document Date:** December 28, 2024
**Phase:** II - Full-Stack Web Application
**Status:** Reference
**Version:** 2.0.0

---

## 1. Architectural Overview

### 1.1 Core Principles

**Separation of Concerns**
- Frontend handles presentation and user interaction
- Backend handles business logic and data persistence
- Database enforces data integrity and relationships
- Each layer has single, clear responsibility

**Security-First Design**
- User isolation enforced at multiple levels (application + database)
- JWT verification on every protected endpoint
- User ID always extracted from verified token, never from request
- HTTPS/TLS for all production communications
- HTTP-only cookies for sensitive data

**Type Safety**
- TypeScript strict mode on frontend (no implicit `any`)
- Type hints on all Python backend functions
- Pydantic models for automatic request validation
- Compile-time errors caught before runtime

**Cloud-Ready**
- Serverless database (Neon PostgreSQL)
- Containerized backend (Docker for Railway/Cloud Run)
- CDN-served frontend (Vercel)
- Horizontal scaling capability
- Connection pooling for efficiency

**Testability**
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Minimum 70% coverage on critical backend paths

---

## 2. Frontend Architecture

### 2.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16+ (App Router) | React with server components, routing, optimization |
| **Language** | TypeScript 5.0+ | Type-safe JavaScript, strict mode |
| **Styling** | Tailwind CSS 3.0+ | Utility-first CSS, responsive design |
| **HTTP Client** | axios | Promise-based HTTP with interceptors |
| **State Management** | React Context + Zustand/TanStack Query | Auth state + data fetching |
| **Authentication** | Better Auth | OAuth, JWT, session management |
| **Form Validation** | Zod/Yup | Runtime validation of form inputs |
| **UI Components** | Custom + shadcn/ui | Reusable components, accessibility |
| **Testing** | Jest/Vitest | Unit testing React components |

### 2.2 Directory Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout (global UI)
│   ├── page.tsx                     # Home page
│   ├── error.tsx                    # Global error boundary
│   ├── loading.tsx                  # Global loading UI
│   │
│   ├── (auth)/                      # Route group for auth pages
│   │   ├── layout.tsx               # Auth-specific layout
│   │   ├── login/
│   │   │   └── page.tsx             # Login form page
│   │   ├── signup/
│   │   │   └── page.tsx             # Signup form page
│   │   └── forgot-password/
│   │       └── page.tsx             # Password reset page
│   │
│   ├── (dashboard)/                 # Route group for protected pages
│   │   ├── layout.tsx               # Dashboard layout with nav
│   │   ├── tasks/
│   │   │   ├── page.tsx             # Task list view
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Create task page
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx         # Task detail/edit page
│   │   │   │   └── loading.tsx      # Skeleton loader
│   │   │   └── loading.tsx          # Task list skeleton
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard overview
│   │   └── settings/
│   │       └── page.tsx             # User settings
│   │
│   └── api/                         # Route handlers (optional)
│       ├── auth/                    # Auth webhooks
│       └── middleware.ts            # Middleware configuration
│
├── components/                      # Reusable React components
│   ├── layout/
│   │   ├── Header.tsx              # Top navigation bar
│   │   ├── Sidebar.tsx             # Left sidebar navigation
│   │   ├── Footer.tsx              # Footer component
│   │   └── Navigation.tsx          # Mobile menu toggle
│   │
│   ├── tasks/
│   │   ├── TaskList.tsx            # Display list of tasks
│   │   ├── TaskItem.tsx            # Individual task row
│   │   ├── TaskForm.tsx            # Create/edit form
│   │   ├── TaskActions.tsx         # Edit/delete buttons
│   │   ├── TaskFilters.tsx         # Status filter controls
│   │   └── TaskSortSelect.tsx      # Sort order selector
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx           # Email/password login
│   │   ├── SignupForm.tsx          # User registration form
│   │   ├── LogoutButton.tsx        # Sign out button
│   │   └── ProtectedRoute.tsx      # Route protection wrapper
│   │
│   └── shared/
│       ├── Button.tsx              # Reusable button component
│       ├── Input.tsx               # Text input field
│       ├── Card.tsx                # Container card
│       ├── Modal.tsx               # Modal dialog
│       ├── Toast.tsx               # Notification toast
│       ├── LoadingSpinner.tsx      # Loading indicator
│       ├── ErrorBoundary.tsx       # Error handling
│       └── ConfirmDialog.tsx       # Confirmation modal
│
├── lib/
│   ├── api.ts                      # HTTP client with axios
│   │   ├── API base URL configuration
│   │   ├── axios instance creation
│   │   ├── JWT interceptors
│   │   ├── Error handling
│   │   └── Request/response transformation
│   │
│   ├── auth.ts                     # Authentication utilities
│   │   ├── Better Auth setup
│   │   ├── Token management
│   │   ├── Session helpers
│   │   └── Protected route logic
│   │
│   ├── hooks.ts                    # Custom React hooks
│   │   ├── useAuth() - Auth state
│   │   ├── useTasks() - Task list
│   │   ├── useTask() - Single task
│   │   ├── usePagination() - Pagination
│   │   └── useLocalStorage() - Local storage
│   │
│   ├── constants.ts                # Application constants
│   │   ├── API_BASE_URL
│   │   ├── Task statuses
│   │   ├── HTTP status codes
│   │   └── Error messages
│   │
│   ├── utils.ts                    # Helper functions
│   │   ├── formatDate()
│   │   ├── formatTime()
│   │   ├── truncateString()
│   │   └── debounce()
│   │
│   ├── validation.ts               # Form validation schemas
│   │   ├── loginSchema
│   │   ├── signupSchema
│   │   ├── taskSchema
│   │   └── settingsSchema
│   │
│   └── types.ts                    # TypeScript type definitions
│       ├── User
│       ├── Task
│       ├── ApiResponse
│       └── FormErrors
│
├── styles/
│   ├── globals.css                 # Global Tailwind directives
│   └── variables.css               # CSS custom properties
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│
├── .env.example                    # Environment variables template
├── .env.local                      # Local environment config (git-ignored)
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration (strict mode)
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── package.json                    # Dependencies and scripts
├── jest.config.js                  # Jest testing configuration
├── CLAUDE.md                       # Development guide for frontend
└── README.md                       # Frontend-specific documentation
```

### 2.3 Key Components

**Header Component**
- Displays user name/email
- Sign out button
- Navigation to main sections
- Responsive mobile menu

**Task List Component**
- Displays all tasks for authenticated user
- Shows task title, description preview, completion status
- Filter buttons (All/Pending/Completed)
- Sort options (Date/Title)
- Delete button with confirmation
- Edit button linking to detail page
- Create new task button
- Loading and error states

**Task Form Component**
- Title input (required, max 255 chars)
- Description input (optional, textarea)
- Submit button (Create/Update based on context)
- Cancel button returning to list
- Real-time validation feedback
- Error display for submission failures

**Authentication Forms**
- Login form: email, password inputs
- Signup form: email, password, password confirm, name inputs
- Password requirements displayed
- Form validation on change and submit
- Server error display
- Loading state during submission

### 2.4 State Management Strategy

**AuthContext (React Context)**
- Current user information
- JWT token (stored in HTTP-only cookie, but checked)
- Authentication status (loading, authenticated, unauthenticated)
- Sign in/out/signup functions

**TanStack Query or Zustand (Data Layer)**
- Task list caching
- Automatic refetch on window focus
- Mutation management for create/update/delete
- Optimistic updates UI

**Local State**
- Form inputs (controlled components)
- Filter/sort selections
- Modal/dialog open states
- Loading states for UI

### 2.5 API Integration Pattern

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// JWT interceptor adds token to requests
api.interceptors.request.use((config) => {
  const token = getTokenFromCookie(); // From Better Auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor handles 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2.6 Authentication Flow

**Sign Up Flow:**
1. User navigates to `/signup`
2. User enters email, password, confirm password, name
3. Frontend validates form with Zod schema
4. Frontend sends `POST /api/auth/signup` with credentials
5. Backend creates user and returns JWT token
6. Frontend stores token in HTTP-only cookie via Better Auth
7. Frontend redirects to `/tasks` dashboard
8. User can now access protected pages

**Sign In Flow:**
1. User navigates to `/login`
2. User enters email and password
3. Frontend validates inputs
4. Frontend sends `POST /api/auth/signin` with credentials
5. Backend validates password and returns JWT token
6. Frontend stores token in HTTP-only cookie
7. Frontend redirects to `/tasks` dashboard
8. User can now access protected pages

**Protected Route:**
1. Route checks if user is authenticated
2. If not authenticated, redirect to `/login`
3. If authenticated, render protected component
4. On logout, clear token and redirect to `/login`

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | FastAPI 0.100+ | Modern Python web framework, async, auto OpenAPI |
| **Language** | Python 3.11+ | Type hints, developer friendly |
| **ORM** | SQLModel 0.0.14+ | SQLAlchemy + Pydantic combined |
| **Server** | Uvicorn 0.24+ | ASGI server for async FastAPI |
| **Validation** | Pydantic 2.0+ | Request/response validation |
| **Database** | PostgreSQL (Neon) | Serverless relational database |
| **Driver** | psycopg2 | PostgreSQL async driver |
| **Authentication** | Better Auth | JWT generation and session management |
| **Testing** | pytest 7.0+ | Unit and integration testing |
| **Code Quality** | Black, isort, flake8 | Code formatting and linting |

### 3.2 Directory Structure

```
backend/
├── main.py                         # FastAPI application entry point
│   ├── Create FastAPI app instance
│   ├── Configure CORS middleware
│   ├── Include API routers
│   ├── Add error handlers
│   └── Run uvicorn server
│
├── models.py                       # SQLModel definitions
│   ├── Base: SQLModel base class
│   ├── User model
│   │   ├── id (UUID, primary key)
│   │   ├── email (string, unique)
│   │   ├── name (string)
│   │   ├── password_hash (string)
│   │   ├── created_at (datetime)
│   │   └── updated_at (datetime)
│   │
│   ├── Task model
│   │   ├── id (integer, primary key)
│   │   ├── user_id (UUID, foreign key)
│   │   ├── title (string)
│   │   ├── description (text, optional)
│   │   ├── completed (boolean)
│   │   ├── created_at (datetime)
│   │   └── updated_at (datetime)
│   │
│   └── Pydantic schemas
│       ├── TaskCreate (for input)
│       ├── TaskUpdate (for partial updates)
│       ├── TaskResponse (for output)
│       ├── UserResponse (for output)
│       └── TokenResponse (for auth)
│
├── db/
│   ├── __init__.py
│   ├── connection.py               # Database connection setup
│   │   ├── Connection string from env
│   │   ├── Engine creation with pooling
│   │   ├── Session factory
│   │   └── Dependency injection
│   │
│   └── init_db.py                  # Database initialization
│       ├── Create tables
│       ├── Run migrations
│       └── Seed initial data
│
├── middleware/
│   ├── __init__.py
│   ├── auth.py                     # JWT verification middleware
│   │   ├── Extract token from Authorization header
│   │   ├── Verify JWT signature
│   │   ├── Validate token expiration
│   │   ├── Extract user_id from payload
│   │   └── Return user_id as dependency
│   │
│   ├── cors.py                     # CORS configuration
│   │   ├── Allow specific origins
│   │   ├── Allow credentials
│   │   └── Allow headers
│   │
│   └── error_handler.py            # Global error handling
│       ├── Catch validation errors
│       ├── Format error responses
│       └── Log errors
│
├── services/
│   ├── __init__.py
│   ├── task_service.py             # Task business logic
│   │   ├── create_task()
│   │   ├── get_user_tasks()
│   │   ├── get_task_by_id()
│   │   ├── update_task()
│   │   ├── delete_task()
│   │   ├── toggle_completion()
│   │   ├── filter_tasks()
│   │   └── sort_tasks()
│   │
│   └── auth_service.py             # Authentication logic
│       ├── hash_password()
│       ├── verify_password()
│       ├── create_token()
│       ├── verify_token()
│       ├── register_user()
│       └── authenticate_user()
│
├── routes/
│   ├── __init__.py
│   ├── health.py                   # Health check endpoint
│   │   └── GET /api/health
│   │
│   ├── auth.py                     # Authentication endpoints
│   │   ├── POST /api/auth/signup
│   │   ├── POST /api/auth/signin
│   │   ├── POST /api/auth/signout
│   │   ├── POST /api/auth/refresh
│   │   └── GET /api/auth/me
│   │
│   └── tasks.py                    # Task CRUD endpoints
│       ├── GET /api/tasks          (list with filtering)
│       ├── POST /api/tasks         (create)
│       ├── GET /api/tasks/{id}     (get single)
│       ├── PUT /api/tasks/{id}     (update)
│       ├── PATCH /api/tasks/{id}   (partial update)
│       ├── PATCH /api/tasks/{id}/complete (toggle)
│       └── DELETE /api/tasks/{id}  (delete)
│
├── dependencies/
│   ├── __init__.py
│   └── auth.py                     # Dependency injection for auth
│       └── verify_jwt_token() - FastAPI Depends()
│
├── config.py                       # Configuration settings
│   ├── DATABASE_URL
│   ├── JWT_SECRET_KEY
│   ├── JWT_ALGORITHM
│   ├── JWT_EXPIRATION
│   ├── CORS_ORIGINS
│   ├── API_PREFIX
│   └── Load from .env
│
├── schemas/                        # Pydantic schemas (alternative location)
│   ├── __init__.py
│   ├── task.py
│   ├── user.py
│   └── common.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py                 # Pytest fixtures and configuration
│   │   ├── Database test instance
│   │   ├── Test client
│   │   ├── Sample test data
│   │   └── Cleanup after tests
│   │
│   ├── test_health.py              # Health endpoint tests
│   ├── test_auth.py                # Authentication tests
│   │   ├── test_signup_valid
│   │   ├── test_signup_duplicate_email
│   │   ├── test_signin_valid
│   │   ├── test_signin_invalid_password
│   │   ├── test_token_expiration
│   │   └── test_logout
│   │
│   └── test_tasks.py               # Task CRUD tests
│       ├── test_create_task
│       ├── test_get_user_tasks
│       ├── test_cannot_see_other_users_tasks
│       ├── test_update_own_task
│       ├── test_cannot_update_other_user_task
│       ├── test_delete_task
│       ├── test_toggle_completion
│       └── test_filter_and_sort
│
├── .env.example                    # Environment variables template
├── requirements.txt                # Python dependencies
├── pyproject.toml                  # Python project config (if using Poetry)
├── CLAUDE.md                       # Development guide for backend
└── README.md                       # Backend-specific documentation
```

### 3.3 Route Implementation Pattern

**GET /api/tasks - List all user's tasks**
```python
@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[str] = Query(None, enum=["all", "pending", "completed"]),
    sort_by: Optional[str] = Query("created_at", enum=["created_at", "title"]),
    user_id: str = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    # 1. Extract user_id from verified JWT (trust it!)
    # 2. Query database: SELECT * FROM tasks WHERE user_id = ? AND (status filter)
    # 3. Apply sorting
    # 4. Return list of tasks
    # 5. Handle errors (user not found, database error)
```

**POST /api/tasks - Create new task**
```python
@router.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    # 1. Extract and verify user_id from JWT
    # 2. Validate input: title required, description optional
    # 3. Create Task model with user_id from JWT
    # 4. Insert into database
    # 5. Return created task with 201 status
    # 6. Handle errors (validation, database)
```

**PUT /api/tasks/{task_id} - Update entire task**
```python
@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: str = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    # 1. Find task by ID
    # 2. Verify task belongs to authenticated user (WHERE user_id = ?)
    # 3. Update all fields from request body
    # 4. Save to database
    # 5. Return updated task
    # 6. Handle errors (not found, permission denied)
```

**DELETE /api/tasks/{task_id} - Delete task**
```python
@router.delete("/tasks/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    user_id: str = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    # 1. Find task by ID
    # 2. Verify task belongs to authenticated user
    # 3. Delete from database
    # 4. Return 204 No Content
    # 5. Handle errors (not found, permission denied)
```

### 3.4 JWT Authentication Middleware

```python
# dependencies/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
import jwt
from config import JWT_SECRET_KEY, JWT_ALGORITHM

security = HTTPBearer()

async def verify_jwt_token(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """
    Verify JWT token and return user_id.

    This function is used as a dependency on protected routes.
    It extracts the token from Authorization header, verifies signature,
    checks expiration, and returns the user_id from the payload.

    Args:
        credentials: HTTP Bearer token from Authorization header

    Returns:
        user_id from JWT payload

    Raises:
        HTTPException 401: Token invalid, expired, or malformed
    """
    try:
        # Extract token (format: "Bearer <token>")
        token = credentials.credentials

        # Verify signature and decode
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        # Extract user_id from 'sub' claim (subject)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: user_id not found"
            )

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

### 3.5 Error Handling

**Standard Error Response Format:**
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": [
    {
      "field": "fieldname",
      "message": "Field-specific error"
    }
  ],
  "timestamp": "2024-12-28T20:00:00Z"
}
```

**Common Error Scenarios:**
- **400 Bad Request:** Invalid input, validation failed
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** User lacks permission (e.g., deleting other's task)
- **404 Not Found:** Resource doesn't exist
- **409 Conflict:** Resource already exists (duplicate email)
- **500 Internal Server Error:** Unexpected server error

---

## 4. Database Architecture

### 4.1 Schema Design

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_users_email (email)
);
```

**Tasks Table**
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_tasks_user_id (user_id),
  INDEX idx_tasks_completed (completed)
);
```

**Relationships:**
- Tasks.user_id → Users.id (Foreign Key)
- One user can have many tasks
- Deleting user automatically deletes their tasks (CASCADE)

### 4.2 Indexes for Performance

**Users Table Indexes:**
- `email` (unique) - Fast lookup by email for login
- Primary key on `id` - Required for foreign key relationships

**Tasks Table Indexes:**
- `user_id` - Required for filtering tasks by user (most common query)
- `completed` - Optional, for filtering by status
- Composite index on `(user_id, completed)` - For combined queries

### 4.3 Key Design Decisions

**UUID for Users:**
- Better security (non-sequential IDs)
- Industry standard (Better Auth uses UUIDs)
- Easy to share safely without exposing database size

**Integer for Task IDs:**
- Simple auto-increment
- Fine for single-user query scope
- No privacy concern (filtered by user_id)

**Timestamps on All Tables:**
- Audit trail for data changes
- Sorting tasks by creation date
- Debugging and monitoring

**ON DELETE CASCADE for Tasks:**
- Automatic cleanup when user deleted
- Maintains referential integrity
- No orphaned tasks

---

## 5. Authentication & Security

### 5.1 JWT Authentication Flow

**Token Generation (Sign In)**
```
1. User submits email + password
2. Backend finds user by email
3. Backend hashes submitted password and compares with stored hash
4. If match:
   a. Create JWT payload: { sub: user_id, email: user@example.com, exp: 7days }
   b. Sign with JWT_SECRET_KEY
   c. Return token to frontend
5. Frontend stores in HTTP-only cookie
```

**Token Verification (Protected Requests)**
```
1. Frontend sends request with Authorization: Bearer <token>
2. Backend middleware extracts token from header
3. Backend verifies signature using JWT_SECRET_KEY
4. Backend checks expiration (exp claim)
5. Backend extracts user_id from 'sub' claim
6. If all checks pass, request proceeds with user_id
7. If any check fails, return 401 Unauthorized
```

**Token Refresh**
```
1. Frontend can refresh token before expiration
2. Backend validates old token
3. Backend generates new token with updated expiration
4. Frontend replaces old token with new
5. Allows for "sliding window" expiration (optional enhancement)
```

### 5.2 User Isolation

**Application Level:**
- Every endpoint requires valid JWT token
- Extract user_id from JWT (never from request parameters)
- Filter all database queries by user_id

**Database Level:**
- Foreign key relationships enforce data ownership
- Tasks have user_id column
- Queries: `SELECT * FROM tasks WHERE user_id = ?`

**Example Security Check:**
```python
# ❌ WRONG - User ID from request (INSECURE!)
def get_tasks(user_id: str):
    return db.session.query(Task).filter(Task.user_id == user_id).all()

# ✅ CORRECT - User ID from verified JWT
async def get_tasks(user_id: str = Depends(verify_jwt_token)):
    return db.session.query(Task).filter(Task.user_id == user_id).all()
```

### 5.3 Password Security

**Requirements:**
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one number
- Better Auth handles hashing with bcrypt (industry standard)

**Never Store Plaintext:**
- Always hash before storing
- Always verify by hashing again and comparing
- Never transmit over insecure connections

### 5.4 CORS Configuration

**Frontend Domain:**
```python
# backend/config.py
CORS_ORIGINS = [
    "http://localhost:3000",              # Local development
    "https://app.example.com",            # Production frontend
]
```

**Headers Allowed:**
```
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 6. Error Handling Strategy

### 6.1 HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Request succeeded, returning data |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request succeeded, no data to return |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | User lacks permission for resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 422 | Unprocessable Entity | Validation error in request body |
| 500 | Server Error | Unexpected error in backend |
| 503 | Service Unavailable | Database or external service down |

### 6.2 Error Response Examples

**Validation Error (400):**
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Input validation failed",
  "details": [
    {"field": "email", "message": "Invalid email format"},
    {"field": "password", "message": "Must be at least 8 characters"}
  ]
}
```

**Unauthorized (401):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

**Forbidden (403):**
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "You don't have permission to delete this task"
}
```

**Not Found (404):**
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Task with ID 123 not found"
}
```

### 6.3 Frontend Error Handling

**API Errors:**
- Catch in axios interceptors
- Display toast notification to user
- Log to console/error tracking (Sentry)
- Retry certain errors (network timeouts)

**Form Validation:**
- Validate on change (real-time feedback)
- Validate on blur (reduce noise)
- Display inline error messages
- Disable submit until valid

---

## 7. Scalability Considerations

### 7.1 Database Performance

**Connection Pooling**
- Use Neon connection pooling (built-in)
- Limits number of concurrent connections
- Reuses connections across requests

**Indexing Strategy**
- Index on `user_id` (most common filter)
- Index on `email` (login lookups)
- Don't over-index (write performance)

**Query Optimization**
- Avoid N+1 queries
- Use JOINs instead of loops
- Limit result sets (pagination)

### 7.2 Backend Scaling

**Stateless Design**
- No session state on backend
- Each request is independent
- Horizontal scaling ready

**Connection Management**
- Pool connections to database
- Reuse connections across requests
- Close connections properly

**Rate Limiting**
- Limit auth endpoints (prevent brute force)
- Limit general endpoints (prevent DoS)
- Return 429 Too Many Requests

### 7.3 Frontend Performance

**Code Splitting**
- Lazy load pages with dynamic imports
- Load components on demand
- Reduce initial bundle size

**Image Optimization**
- Use Next.js Image component
- Automatic format conversion (WebP)
- Responsive images

**Caching**
- Cache user session (HTTP-only cookie)
- Cache API responses (React Query)
- Cache static assets (Vercel CDN)

---

## 8. Deployment Architecture

### 8.1 Environments

**Development**
- Local machine with Next.js dev server
- Local FastAPI with uvicorn
- Local PostgreSQL or Neon dev branch

**Staging**
- Vercel preview deployment
- Railway staging branch
- Neon staging database

**Production**
- Vercel production deployment
- Railway production
- Neon production database

### 8.2 Deployment Process

**Frontend (Vercel):**
1. Push to main branch on GitHub
2. Vercel automatically builds
3. Runs tests
4. Deploys to production
5. CDN caches assets

**Backend (Railway):**
1. Push to main branch
2. Railway detects changes
3. Builds Docker image
4. Runs tests
5. Deploys to production
6. Load balances traffic

**Database (Neon):**
1. Create main branch for production
2. Branches for staging/development
3. Automatic backups
4. Point-in-time recovery

---

## 9. Monitoring & Observability

### 9.1 Logging

**Frontend:**
- Log all API errors
- Log authentication events
- Use browser console (dev) or external service (prod)

**Backend:**
- Log API requests (endpoint, status, duration)
- Log authentication events (login, logout, token refresh)
- Log errors with full stack traces
- Correlation IDs for tracing requests

### 9.2 Metrics

**Backend Metrics:**
- Response time per endpoint
- Error rate per endpoint
- Database query time
- JWT validation time
- Active user count

**Database Metrics:**
- Query execution time
- Connection pool usage
- Disk space usage
- Backup status

**Frontend Metrics:**
- Page load time
- Time to interactive
- API call success rate
- JavaScript errors

### 9.3 Error Tracking

**Service:** Sentry or similar
- Capture unhandled exceptions
- Track error frequency
- Group similar errors
- Send alerts on critical errors

---

## 10. Data Flow Diagrams

### Flow 1: User Signs Up

```
Frontend                              Backend                         Database
   │                                    │                               │
   ├─ User fills signup form           │                               │
   ├─ Validates locally (Zod)          │                               │
   ├─ POST /api/auth/signup ───────────>                               │
   │  {email, password, name}           │                               │
   │                                    ├─ Validate with Pydantic      │
   │                                    ├─ Hash password               │
   │                                    ├─ Check email uniqueness      │
   │                                    ├─ INSERT INTO users ──────────>
   │                                    │                      Returns: id│
   │                                    ├─ Generate JWT token          │
   │                                    ├─ Return {id, token}          │
   │<────── 201 Created + token ────────┤                               │
   ├─ Store token in HTTP-only cookie   │                               │
   ├─ Redirect to /tasks               │                               │
   └─ Request /api/tasks              │                               │
      (Token in Authorization header)   │                               │
                                        └─> Welcome!
```

### Flow 2: User Fetches Their Tasks

```
Frontend                              Backend                         Database
   │                                    │                               │
   ├─ Navigate to /tasks               │                               │
   ├─ GET /api/tasks ──────────────────>                               │
   │  (Authorization: Bearer <token>)   │                               │
   │                                    ├─ Extract token               │
   │                                    ├─ Verify JWT signature        │
   │                                    ├─ Check expiration            │
   │                                    ├─ Get user_id from payload    │
   │                                    ├─ SELECT * FROM tasks ───────>
   │                                    │  WHERE user_id = ? <────┤    │
   │                                    │          Returns: tasks│     │
   │                                    ├─ Filter by status (if param) │
   │                                    ├─ Sort by date/title (if param)│
   │                                    ├─ Return task list            │
   │<────── 200 OK + [tasks] ──────────┤                               │
   ├─ Render task list                │                               │
   └─ User sees their tasks           │                               │
```

### Flow 3: User Updates a Task

```
Frontend                              Backend                         Database
   │                                    │                               │
   ├─ User edits task                  │                               │
   ├─ Submits form                     │                               │
   ├─ PUT /api/tasks/123 ─────────────>                               │
   │  {title, description}              │                               │
   │                                    ├─ Verify JWT → get user_id    │
   │                                    ├─ Find task with ID 123       │
   │                                    ├─ Check user_id matches <────┤
   │                                    │         (SELECT user_id)      │
   │                                    ├─ Verify ownership            │
   │                                    ├─ UPDATE tasks SET ───────────>
   │                                    │  title=?, description=? <────┤
   │                                    │  WHERE id = 123 AND user_id=?│
   │                                    ├─ Return updated task         │
   │<────── 200 OK + task ─────────────┤                               │
   ├─ Update UI                        │                               │
   └─ Show success toast              │                               │
```

---

## 11. Key Decision Summary

### Technology Choices Rationale

**Why Next.js (Frontend)?**
- Server components reduce client-side JavaScript
- App Router simplifies routing
- Automatic code splitting
- Vercel integration and optimizations
- TypeScript support built-in

**Why FastAPI (Backend)?**
- Async by default (better concurrency)
- Automatic OpenAPI documentation
- Pydantic integration for validation
- Fast performance
- Python ecosystem for data processing

**Why SQLModel (ORM)?**
- Combines SQLAlchemy + Pydantic
- Type hints for IDE support
- Automatic validation
- Cleaner code than separate ORM + schemas

**Why Better Auth?**
- Modern authentication platform
- Handles password hashing securely
- JWT support built-in
- Session management
- Multi-provider support (future)

**Why Neon DB?**
- Serverless (no infrastructure to manage)
- Free tier with 3 branches
- Auto-scaling and connection pooling
- PostgreSQL (industry standard)
- Instant database branching for testing

---

## 12. Related Documents

- `/specs/overview.md` - Project overview and scope
- `/specs/phase2-web/api/rest-endpoints.md` - Detailed endpoint specifications
- `/specs/database/schema.md` - Database schema definition
- `/specs/features/task-crud.md` - Task feature specification
- `/specs/features/authentication.md` - Authentication feature specification
- `/specs/ui/components.md` - UI component specifications
- `/specs/ui/pages.md` - Page specifications
- `/backend/CLAUDE.md` - Backend implementation guide
- `/frontend/CLAUDE.md` - Frontend implementation guide

---

**Document Status:** ACTIVE
**Last Updated:** December 28, 2024
**Next Review:** January 15, 2025

---

*For implementation details, consult the CLAUDE.md guides in your specific directory (frontend or backend). For governance and standards, see CONSTITUTION.md.*
