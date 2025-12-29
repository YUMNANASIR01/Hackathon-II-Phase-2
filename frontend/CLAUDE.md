# Frontend Development Guidelines - Phase II

**Project**: Hackathon Todo - Phase II
**Framework**: Next.js 16+ (App Router)
**Date**: December 28, 2024

---

## 🎯 Frontend Overview

You are building a Next.js frontend for Phase II that:
- ✅ Uses Next.js 16+ with App Router
- ✅ Authenticates users with Better Auth
- ✅ Calls FastAPI REST APIs with JWT in every request
- ✅ Shows only logged-in user's tasks
- ✅ Is fully responsive (mobile, tablet, desktop)

All UI code is **generated from specs** - not manually written.

---

## 📐 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16+ | React framework with App Router |
| **Language** | TypeScript | 5.0+ | Type-safe development |
| **Styling** | Tailwind CSS | 3.0+ | Utility-first CSS framework |
| **Authentication** | Better Auth | Latest | Modern auth library |
| **HTTP Client** | axios | 1.6+ | HTTP requests with JWT interceptors |
| **State Management** | React Context + Zustand | Latest | Auth state and data fetching |
| **Form Validation** | Zod | Latest | Runtime validation with TypeScript |
| **Testing** | Jest/Vitest | Latest | Unit testing |

---

## 📁 Project Structure

### Required Directory Structure

```
frontend/
├── app/                               # Next.js App Router
│   ├── (auth)/                       # Route group for auth pages
│   │   ├── layout.tsx                # Auth layout (no navbar)
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   └── register/
│   │       └── page.tsx              # Signup page
│   │
│   ├── (dashboard)/                  # Route group for protected pages
│   │   ├── layout.tsx                # Dashboard layout (with navbar)
│   │   └── tasks/
│   │       ├── page.tsx              # Tasks list page
│   │       ├── new/
│   │       │   └── page.tsx          # Create task page
│   │       └── [id]/
│   │           └── page.tsx          # Edit task page
│   │
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page (redirect to /tasks)
│   └── error.tsx                     # Error page
│
├── components/                       # Reusable React components
│   ├── layout/
│   │   ├── Navbar.tsx               # Top navigation
│   │   └── Layout.tsx               # Page layout wrapper
│   ├── auth/
│   │   ├── LoginForm.tsx            # Login form
│   │   └── SignupForm.tsx           # Signup form
│   ├── tasks/
│   │   ├── TaskList.tsx             # Task list
│   │   ├── TaskItem.tsx             # Individual task
│   │   ├── TaskForm.tsx             # Create/edit form
│   │   ├── TaskFilters.tsx          # Filter controls
│   │   └── CreateTaskButton.tsx     # Create button
│   └── shared/
│       ├── Button.tsx               # Reusable button
│       ├── Input.tsx                # Text input
│       ├── Textarea.tsx             # Multi-line input
│       ├── Card.tsx                 # Container
│       ├── Modal.tsx                # Modal dialog
│       ├── ConfirmDialog.tsx        # Confirmation
│       ├── Toast.tsx                # Notification
│       ├── LoadingSpinner.tsx       # Spinner
│       └── ErrorBoundary.tsx        # Error handling
│
├── lib/                             # Utilities and helpers
│   ├── api.ts                       # HTTP client with JWT
│   ├── auth.ts                      # Better Auth setup
│   ├── hooks.ts                     # Custom React hooks
│   ├── constants.ts                 # App constants
│   ├── types.ts                     # TypeScript types
│   ├── utils.ts                     # Helper functions
│   └── validation.ts                # Zod schemas
│
├── contexts/                        # React contexts
│   └── AuthContext.tsx              # Auth state management
│
├── styles/
│   ├── globals.css                  # Global Tailwind directives
│   └── variables.css                # CSS custom properties
│
├── public/                          # Static assets
│   └── favicon.ico
│
├── .env.local                       # Local environment variables (git-ignored)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore file
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config (strict mode)
├── next.config.js                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── postcss.config.js                # PostCSS config
├── jest.config.js                   # Jest config
├── CLAUDE.md                        # This file
└── README.md                        # Frontend documentation
```

---

## 🎨 Development Rules

### 1. Component Pattern

**Always use server components by default**:
```typescript
// ✅ GOOD - Server component (default)
export default function TasksPage() {
  return <div>Tasks</div>
}

// ❌ BAD - Client component when not needed
'use client'
export default function TasksPage() {
  return <div>Tasks</div>
}
```

**Use client components ONLY when necessary**:
```typescript
// ✅ GOOD - Client for interactivity
'use client'
import { useState } from 'react'

export function TaskForm() {
  const [title, setTitle] = useState('')
  return <input value={title} onChange={(e) => setTitle(e.target.value)} />
}
```

### 2. Styling Rules

**Use Tailwind CSS only**:
```typescript
// ✅ GOOD
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
  Click me
</button>

// ❌ BAD - Inline styles
<button style={{ backgroundColor: 'blue' }}>Click me</button>

// ❌ BAD - CSS modules
import styles from './Button.module.css'
<button className={styles.btn}>Click me</button>
```

**Responsive design mobile-first**:
```typescript
// ✅ GOOD - Mobile first, add desktop
<div className="w-full md:w-1/2 lg:w-1/3">
  Mobile: full width → Tablet: half → Desktop: third
</div>

// ❌ BAD - Desktop first
<div className="w-1/3 md:w-1/2 lg:w-full">
  Desktop: third → Desktop: half → Mobile: full (wrong!)
</div>
```

### 3. API Calls - CRITICAL

**All API calls go through /lib/api.ts**:
```typescript
// ✅ GOOD
import { api } from '@/lib/api'

async function fetchTasks() {
  const response = await api.get('/tasks')
  return response.data
}

// ❌ BAD - Direct fetch
const response = await fetch('http://localhost:8000/api/tasks')

// ❌ BAD - Using axios directly
import axios from 'axios'
const response = await axios.get('http://localhost:8000/api/tasks')
```

**API client automatically adds JWT**:
```typescript
// /lib/api.ts
// The api.ts file automatically:
// 1. Reads JWT from Better Auth
// 2. Adds Authorization header: Bearer <token>
// 3. Handles token refresh
// 4. Redirects to login on 401

// Your components just use it:
const tasks = await api.get('/tasks')
// JWT is automatically included!
```

### 4. Authentication Rules

**Use Better Auth for all auth**:
```typescript
// ✅ GOOD - Use Better Auth
import { auth } from '@/lib/auth'

async function handleLogin(email, password) {
  const response = await auth.signIn({ email, password })
  // Automatically stores JWT in cookie
  // Available to api client
}

// ❌ BAD - Custom auth logic
// Don't implement auth yourself!
```

**All protected pages must redirect if not authenticated**:
```typescript
// ✅ GOOD - Check auth before rendering
'use client'
import { useAuth } from '@/lib/hooks'
import { redirect } from 'next/navigation'

export default function TasksPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />
  if (!user) redirect('/login')

  return <div>Tasks</div>
}
```

### 5. Form Validation

**Use Zod schemas**:
```typescript
// ✅ GOOD - Zod validation
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters')
})

// ❌ BAD - No validation
function LoginForm() {
  const [email, setEmail] = useState('')
  // No validation!
}
```

### 6. Type Safety

**No `any` types**:
```typescript
// ✅ GOOD - Explicit types
interface Task {
  id: number
  title: string
  completed: boolean
}

function TaskItem({ task }: { task: Task }) {
  return <div>{task.title}</div>
}

// ❌ BAD - any type
function TaskItem({ task }: { task: any }) {
  return <div>{task.title}</div>
}
```

**Type all props**:
```typescript
// ✅ GOOD
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

// ❌ BAD
function Button(props) {
  // What props are expected?
}
```

### 7. Error Handling

**Always handle errors in API calls**:
```typescript
// ✅ GOOD
async function createTask(title: string) {
  try {
    const response = await api.post('/tasks', { title })
    showToast('Task created!', 'success')
    return response.data
  } catch (error) {
    showToast('Failed to create task', 'error')
    console.error(error)
  }
}

// ❌ BAD - No error handling
async function createTask(title: string) {
  const response = await api.post('/tasks', { title })
  return response.data
}
```

### 8. Loading States

**Always show loading states**:
```typescript
// ✅ GOOD
function TaskForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    setIsLoading(true)
    try {
      await api.post('/tasks', { title })
    } finally {
      setIsLoading(false)
    }
  }

  return <button disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>
}

// ❌ BAD - No loading state
function TaskForm() {
  async function handleSubmit() {
    await api.post('/tasks', { title })
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

---

## 🔐 Security Checklist

### Must Do
- ✅ All API calls use JWT from Better Auth
- ✅ Protected pages redirect to login if not authenticated
- ✅ JWT automatically added by api.ts interceptor
- ✅ No hardcoded API URLs in components (use env vars)
- ✅ No storing JWT in localStorage (use HTTP-only cookies via Better Auth)
- ✅ Validate all form inputs with Zod

### Must NOT Do
- ❌ Don't store JWT in localStorage (security risk)
- ❌ Don't make API calls without JWT
- ❌ Don't skip authentication checks
- ❌ Don't hardcode credentials
- ❌ Don't expose API URLs in code

---

## 📝 Environment Variables

### .env.local (Never commit)
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Secret (must match backend)
NEXT_PUBLIC_AUTH_SECRET=your-shared-secret-key

# Optional
NEXT_PUBLIC_APP_NAME=Todo App
```

### .env.example (For documentation)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_SECRET=your-shared-secret-key
```

---

## 🚀 Key Files to Implement

### 1. lib/api.ts - HTTP Client with JWT
- Create axios instance
- Request interceptor: Add JWT header
- Response interceptor: Handle 401 errors
- Export API functions

### 2. lib/auth.ts - Better Auth Setup
- Configure Better Auth client
- Enable JWT generation
- Handle session management

### 3. lib/hooks.ts - Custom Hooks
- useAuth(): Current user and auth status
- useTasks(): Task list management
- useTask(): Single task operations

### 4. contexts/AuthContext.tsx - Auth State
- Provide user data to app
- Handle auth state changes
- Manage token refresh

### 5. All Pages & Components (from specs)
- Follow pages.md for page structure
- Follow components.md for component specs
- Use Tailwind CSS only
- Add TypeScript types to everything

---

## ✅ Build & Test

### Build Check
```bash
npm run build
# Must complete with no errors
```

### TypeScript Check
```bash
npx tsc --noEmit
# Must have zero errors
# No `any` types allowed
```

### Lint Check
```bash
npm run lint
# Must pass ESLint
```

---

## 📋 Code Quality Standards

- **TypeScript**: Strict mode enabled, zero errors
- **Tailwind**: All styling via classes, no inline styles
- **Components**: Always typed, exported interfaces
- **API Calls**: Always through api.ts with error handling
- **Forms**: Validated with Zod
- **Accessibility**: Semantic HTML, focus indicators
- **Responsiveness**: Mobile-first Tailwind design
- **Loading States**: Always show during async operations
- **Error Handling**: Try-catch on all API calls

---

## 🔗 Key Specifications to Reference

When implementing, always reference:
- `@specs/ui/pages.md` - Page layouts and structures
- `@specs/ui/components.md` - Component specifications
- `@specs/features/task-crud.md` - Task feature requirements
- `@specs/features/authentication.md` - Auth requirements
- `@specs/api/rest-endpoints.md` - API endpoints
- `@backend/CLAUDE.md` - Backend patterns (for reference)

---

## 🎓 Learning Path

1. Read this file (CLAUDE.md)
2. Read the UI specs (@specs/ui/pages.md and @specs/ui/components.md)
3. Set up project structure
4. Create lib/api.ts (HTTP client)
5. Create lib/auth.ts (Better Auth)
6. Create pages and components from specs
7. Test authentication flow
8. Test task CRUD operations
9. Test responsive design
10. Deploy to Vercel

---

## 📖 Related Documentation

- Next.js App Router: https://nextjs.org/docs/app
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Better Auth: https://better-auth.com/docs
- axios: https://axios-http.com/docs
- Zod: https://zod.dev

---

**Guidelines Document Version**: 1.0
**Date**: December 28, 2024
**Last Updated**: December 28, 2024

**Remember**: All UI code is generated from specs. Don't write UI manually. Tell Claude Code to generate from @specs files!
