# Phase II: System Architecture & Design

**Document Date:** December 28, 2024
**Phase:** II - Full-Stack Web Application
**Status:** Reference

---

## 1. Architectural Principles

### 1.1 Core Principles

- **Separation of Concerns:** Frontend handles UI, backend handles business logic
- **Security First:** User isolation, JWT verification on every request
- **Type Safety:** TypeScript frontend, type hints on Python backend
- **Cloud-Ready:** Serverless database, containerized backend, CDN frontend
- **Testability:** Unit tests, integration tests, E2E tests
- **Scalability:** Horizontal scaling ready, connection pooling, proper indexing

### 1.2 Design Patterns

**Frontend:**
- Server Components (default in Next.js 13+)
- Client Components (only when interactive)
- Custom Hooks for API calls
- Context API for auth state
- Atomic component structure

**Backend:**
- Dependency Injection (FastAPI `Depends()`)
- Middleware for cross-cutting concerns
- Repository pattern for database access
- Service layer for business logic
- Pydantic for validation

**Database:**
- Normalized schema (Third Normal Form)
- Foreign keys for referential integrity
- Indexes on frequently queried columns
- Timestamps for audit trail

---

## 2. Frontend Architecture (Next.js 16+)

### 2.1 Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── (auth)/                  # Auth routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx           # Shared auth layout
│   ├── (dashboard)/             # Protected routes group
│   │   ├── tasks/
│   │   │   ├── page.tsx         # Task list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx     # Task detail
│   │   │   └── new/
│   │   │       └── page.tsx     # Create task
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx           # Protected layout
│   └── api/                     # Route handlers (if needed)
│       ├── auth/
│       └── proxy/               # Optional: proxy to backend
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskActions.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── LogoutButton.tsx
│   └── shared/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── api.ts                   # HTTP client with interceptors
│   ├── auth.ts                  # Auth utilities
│   ├── hooks.ts                 # Custom hooks
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Helper functions
│
├── contexts/
│   └── AuthContext.tsx          # Auth state
│
├── styles/
│   └── globals.css              # Global styles
│
├── public/
│   └── assets/
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── jest.config.js
├── .env.example
├── .env.local                   # Local env (git ignored)
└── CLAUDE.md
```

### 2.2 Component Architecture

**Server Components (Default):**
```typescript
// app/tasks/page.tsx - Server component
// Can access database directly, no JS sent to client
export default async function TasksPage() {
  // Can use APIs, databases, secrets
  return <TaskList />;
}
```

**Client Components (Interactive):**
```typescript
// components/tasks/TaskForm.tsx - Client component
'use client'; // Opt-in to client

import { useState } from 'react';

export function TaskForm() {
  const [title, setTitle] = useState('');
  // Can use hooks, event handlers
  return <form>...</form>;
}
```

### 2.3 State Management

**Authentication:**
- Stored in Context API or Zustand
- Token stored in httpOnly cookie (set by Better Auth)
- User info stored in React state
- Refresh automatically when token expires

**Task Data:**
- Fetched from backend API
- Cached locally with React Query or SWR
- Invalidated on mutations
- Optimistic updates for UX

### 2.4 API Client Pattern

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor: Add JWT token
api.interceptors.request.use((config) => {
  const token = getTokenFromCookie(); // From Better Auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh it
      await refreshToken();
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
// ... more endpoints
```

---

## 3. Backend Architecture (FastAPI)

### 3.1 Directory Structure

```
backend/
├── main.py                      # FastAPI app entry point
│
├── core/
│   ├── config.py               # Configuration, env variables
│   ├── security.py             # JWT utilities
│   └── exceptions.py           # Custom exceptions
│
├── models.py                    # SQLModel models
│   ├── User (Better Auth)
│   ├── Task
│   └── Session
│
├── schemas.py                   # Pydantic request/response
│   ├── TaskCreate
│   ├── TaskUpdate
│   ├── TaskResponse
│   └── ErrorResponse
│
├── routes/
│   ├── __init__.py
│   ├── tasks.py                # Task CRUD endpoints
│   ├── auth.py                 # Auth endpoints
│   ├── health.py               # Health check
│   └── api.py                  # Router aggregation
│
├── middleware/
│   ├── __init__.py
│   ├── auth.py                 # JWT verification
│   ├── cors.py                 # CORS setup
│   └── error_handler.py        # Global error handling
│
├── services/
│   ├── __init__.py
│   ├── task_service.py         # Task business logic
│   ├── auth_service.py         # Auth business logic
│   └── user_service.py         # User business logic
│
├── db/
│   ├── __init__.py
│   ├── connection.py           # Database connection
│   ├── session.py              # SQLModel session
│   └── migrations/             # Alembic migrations
│       └── versions/
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Pytest fixtures
│   ├── test_tasks.py           # Task endpoint tests
│   ├── test_auth.py            # Auth endpoint tests
│   └── test_services.py        # Service layer tests
│
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── .env                         # Local env (git ignored)
├── Dockerfile
├── docker-compose.yml
└── CLAUDE.md
```

### 3.2 FastAPI Application Setup

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from middleware.error_handler import error_exception_handler
from routes.api import router

app = FastAPI(
    title="Hackathon Todo API",
    version="2.0.0",
    description="Multi-user task management API"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler
app.add_exception_handler(Exception, error_exception_handler)

# Include routers
app.include_router(router)

@app.on_event("startup")
async def startup():
    # Initialize database connection
    pass

@app.on_event("shutdown")
async def shutdown():
    # Close database connection
    pass
```

### 3.3 Middleware Chain

```python
# Request flow:
# 1. Request comes in
# 2. CORS middleware checks origin
# 3. Global exception handler wraps everything
# 4. Route handler gets JWT token from Authorization header
# 5. JWT middleware verifies token and extracts user_id
# 6. Route handler receives verified user_id via Depends()
# 7. Service layer performs business logic
# 8. Response serialized with Pydantic schema
# 9. Response sent to client
```

### 3.4 JWT Authentication Flow

```python
# middleware/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
import jwt

security = HTTPBearer()

async def verify_jwt(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """
    Verify JWT token and return user_id
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=["HS256"]
        )
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

### 3.5 API Route Pattern

```python
# routes/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from middleware.auth import verify_jwt
from services.task_service import TaskService
from schemas import TaskCreate, TaskUpdate, TaskResponse
from db.session import get_session

router = APIRouter(prefix="/api/tasks", tags=["tasks"])
task_service = TaskService()

@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    user_id: str = Depends(verify_jwt),
    status: str = "all",
    session: AsyncSession = Depends(get_session)
):
    """
    List all tasks for authenticated user

    Query Parameters:
    - status: "all" | "pending" | "completed" (default: "all")
    """
    tasks = await task_service.get_tasks(
        user_id=user_id,
        status=status,
        session=session
    )
    return tasks

@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(verify_jwt),
    session: AsyncSession = Depends(get_session)
):
    """Create a new task"""
    new_task = await task_service.create_task(
        user_id=user_id,
        task_data=task_data,
        session=session
    )
    return new_task

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    user_id: str = Depends(verify_jwt),
    session: AsyncSession = Depends(get_session)
):
    """Get task details"""
    task = await task_service.get_task(
        task_id=task_id,
        user_id=user_id,
        session=session
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

# ... PUT, DELETE, PATCH routes follow same pattern
```

---

## 4. Database Architecture (Neon PostgreSQL)

### 4.1 Schema Design

**Users Table** (managed by Better Auth):
```sql
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    emailVerified TIMESTAMP,
    name VARCHAR,
    image VARCHAR,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tasks Table** (our application):
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

### 4.2 SQLModel Models

```python
# models.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID

class UserBase(SQLModel):
    id: UUID
    email: str
    name: Optional[str] = None

class User(UserBase, table=True):
    __tablename__ = "user"
    tasks: list["Task"] = Relationship(back_populates="user")

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = False

class Task(TaskBase, table=True):
    id: int = Field(primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="tasks")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: int
    user_id: UUID
    created_at: datetime
    updated_at: datetime
```

### 4.3 Data Isolation Strategy

**Principle:** Every query MUST filter by user_id from verified JWT

```python
# CORRECT - User isolation enforced
async def get_tasks(user_id: str, session: AsyncSession):
    query = select(Task).where(
        (Task.user_id == user_id) &  # MUST filter by user_id
        (Task.completed == False)
    )
    return await session.execute(query)

# WRONG - Missing user_id filter
async def get_tasks_BAD(session: AsyncSession):
    query = select(Task).where(Task.completed == False)
    return await session.execute(query)  # Could return other users' tasks!
```

---

## 5. Authentication Architecture

### 5.1 JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user-uuid-here",          // Subject (user_id)
  "email": "user@example.com",
  "iat": 1703804800,                 // Issued at
  "exp": 1703891200                  // Expires (7 days)
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### 5.2 Authentication Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User enters credentials
       ↓
┌──────────────────────┐
│  Next.js Frontend    │
│  - Validation        │
│  - Send to backend   │
└──────┬───────────────┘
       │ 2. POST /api/auth/signin
       │    { email, password }
       ↓
┌──────────────────────────┐
│    FastAPI Backend       │
│ - Verify credentials     │
│ - Generate JWT           │
│ - Return token + user    │
└──────┬───────────────────┘
       │ 3. Response: { token, user }
       ↓
┌──────────────────────┐
│  Next.js Frontend    │
│ - Store token        │
│ - Store user info    │
│ - Redirect to /tasks │
└──────┬───────────────┘
       │ 4. All subsequent requests
       │    include JWT in header
       ↓
┌──────────────────────────┐
│    FastAPI Backend       │
│ - Verify JWT token       │
│ - Extract user_id        │
│ - Proceed with request   │
└──────────────────────────┘
```

### 5.3 Better Auth Configuration

```typescript
// frontend/lib/auth.ts
import { betterAuth } from "better-auth/client";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    jwtPlugin({
      issueJWT: true,  // Enable JWT token generation
      secret: process.env.BETTER_AUTH_SECRET,
    }),
  ],
});
```

---

## 6. Security Architecture

### 6.1 Security Layers

**1. Transport Security:**
- HTTPS/TLS for all communications
- Secure cookies (httpOnly, SameSite, Secure flags)

**2. Authentication:**
- JWT tokens with expiration
- Automatic token refresh
- Better Auth for OAuth2 ready

**3. Authorization:**
- Verified JWT on every endpoint
- User isolation at database level
- Role-based access (future enhancement)

**4. Input Validation:**
- Pydantic schemas validate all inputs
- Type checking prevents injection
- SQL parameterization prevents SQL injection

**5. CORS:**
- Explicit whitelist of origins
- Credentials included only for same-origin

### 6.2 Security Checklist

```python
# ✅ DO THIS
@router.get("/api/tasks")
async def list_tasks(
    user_id: str = Depends(verify_jwt),  # Verify JWT first
    session = Depends(get_session)
):
    # Query filtered by verified user_id
    tasks = await session.exec(
        select(Task).where(Task.user_id == user_id)
    )
    return tasks

# ❌ NEVER DO THIS
@router.get("/api/tasks")
async def list_tasks(user_id: str):  # user_id from query parameter!
    # User can pass any user_id
    tasks = await session.exec(
        select(Task).where(Task.user_id == user_id)
    )
    return tasks  # Returns other users' tasks!
```

---

## 7. Error Handling Architecture

### 7.1 Error Response Format

```python
# All errors return consistent format
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Invalid input provided",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### 7.2 Error Categories

```python
# Client Errors (4xx)
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid JWT)
- 403: Forbidden (user isolation violation)
- 404: Not Found (resource doesn't exist)

# Server Errors (5xx)
- 500: Internal Server Error
- 503: Service Unavailable (database down)
```

---

## 8. Scalability Architecture

### 8.1 Database Scalability

- **Connection Pooling:** pgbouncer handles connection limits
- **Read Replicas:** Neon supports read replicas for scaling
- **Indexing Strategy:** Proper indexes prevent full table scans
- **Query Optimization:** Analyze slow queries regularly

### 8.2 Backend Scalability

- **Stateless Design:** No session affinity needed
- **Containerization:** Docker ready for Kubernetes
- **Horizontal Scaling:** Can run multiple backend instances
- **Load Balancing:** LB distributes requests

### 8.3 Frontend Scalability

- **Static Site Generation:** Vercel caches at edge
- **CDN:** Global distribution via Vercel
- **Code Splitting:** Automatic route-based splitting
- **Lazy Loading:** Components load on demand

---

## 9. Deployment Architecture

### 9.1 Frontend Deployment (Vercel)

```
Local Development
    ↓
git push to main
    ↓
GitHub webhook triggers
    ↓
Vercel builds Next.js
    ↓
Runs tests, linting
    ↓
Deploys to Vercel edge network
    ↓
Live at custom domain
```

### 9.2 Backend Deployment (Railway/Cloud Run)

```
Local Development
    ↓
Build Docker image
    ↓
Push to container registry
    ↓
Cloud Run/Railway pulls image
    ↓
Starts FastAPI application
    ↓
Connects to Neon database
    ↓
Live at API endpoint
```

### 9.3 Environment Configuration

```
Production:
- Backend: https://api.example.com
- Frontend: https://example.com
- Database: neon.tech connection string
- Auth Secret: Securely stored in Railway/Cloud Run

Staging:
- Backend: https://staging-api.example.com
- Frontend: https://staging.example.com
- Database: Neon staging branch
- Auth Secret: Different secret for testing

Local Development:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Database: Neon development branch
- Auth Secret: Dev secret from .env
```

---

## 10. Monitoring & Observability

### 10.1 Logging Strategy

```python
# Backend logging
import logging

logger = logging.getLogger(__name__)

logger.info(f"User {user_id} fetched tasks", extra={"user_id": user_id})
logger.error(f"Database error: {error}", exc_info=True)
```

### 10.2 Metrics to Track

- **API Response Times:** Track per endpoint
- **Error Rates:** Monitor 4xx and 5xx errors
- **Database Query Times:** Identify slow queries
- **Authentication Success/Failure:** Monitor login attempts
- **Task CRUD Operations:** Track usage patterns

### 10.3 Alerting

- Alert on API error rate > 5%
- Alert on response time > 500ms
- Alert on database connection errors
- Alert on auth failures > 10/min

---

**Document Status:** REFERENCE
**Last Updated:** December 28, 2024

