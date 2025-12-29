# Phase II: Full-Stack Web Application - Overview

**Document Date:** December 28, 2024
**Phase:** II - Full-Stack Web Application
**Status:** In Development

---

## 1. Executive Summary

Phase II transforms the Phase I console application into a modern, multi-user web application. Users can now manage their tasks through a responsive web interface with secure authentication, real-time data synchronization, and persistent cloud storage using Neon PostgreSQL.

**Key Deliverables:**
- RESTful API backend with FastAPI
- Responsive frontend with Next.js
- Secure authentication with Better Auth + JWT
- Cloud-ready PostgreSQL database (Neon)
- Complete monorepo structure with specs-driven development

---

## 2. Current State (Phase I)

### What We Built in Phase I:
- CLI-based task management system
- Task CRUD operations (Create, Read, Update, Delete)
- Task completion tracking
- JSON-based data persistence
- All business logic in Python with clean separation of concerns

### What We're Keeping:
- Core task management logic (can be ported to backend)
- Business rules for task validation
- Data model structure
- Test coverage patterns

### What We're Replacing:
- JSON file storage → Cloud PostgreSQL database
- CLI interface → Web application (frontend)
- Monolithic Python app → Microservices-like architecture (frontend + backend)
- Local only → Multi-user with user isolation

---

## 3. Desired Future State (Phase II)

### User Experience

**Before Login:**
- User visits website
- Sees welcome page with signup/signin options
- Creates account or logs in with email

**After Login:**
- Dashboard with all their tasks
- Add new task button
- Task list with filtering (All/Pending/Completed)
- Edit and delete options for each task
- Mark tasks as complete with checkbox
- Sign out option

### Technical Features

**Backend:**
- RESTful API with proper HTTP methods
- JWT-based authentication
- User isolation (each user sees only their tasks)
- Database persistence with PostgreSQL
- Proper error handling and validation

**Frontend:**
- Next.js with TypeScript for type safety
- Responsive design (mobile, tablet, desktop)
- Real-time form validation
- Loading states and error handling
- Toast notifications for user feedback

**Authentication:**
- Email/password signup and signin
- JWT token-based sessions
- Automatic token refresh
- Secure logout

---

## 4. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Frontend Framework** | Next.js | 16+ | Server components, App Router, optimized performance |
| **Frontend Language** | TypeScript | 5.0+ | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS | 3.0+ | Utility-first, responsive, rapid development |
| **Backend Framework** | FastAPI | 0.100+ | Fast, async, automatic OpenAPI docs |
| **Backend Language** | Python | 3.11+ | Type hints, Pydantic validation, developer friendly |
| **ORM** | SQLModel | 0.0.14+ | Combines SQLAlchemy + Pydantic, best of both |
| **Database** | Neon PostgreSQL | Latest | Serverless, free tier, auto-scaling |
| **Authentication** | Better Auth | Latest | Modern auth, JWT support, multi-provider ready |
| **HTTP Client** | axios | 1.6+ | Interceptors for JWT, promise-based |
| **Testing (Frontend)** | Jest/Vitest | Latest | Unit testing React components |
| **Testing (Backend)** | pytest | 7.0+ | Python unit testing standard |
| **Package Manager** | npm/pnpm | Latest | Frontend dependency management |
| **Version Control** | Git | Latest | GitHub for monorepo |
| **Deployment (Frontend)** | Vercel | - | Optimized for Next.js, free tier |
| **Deployment (Backend)** | Railway/Cloud Run | - | Containerized Python apps |

---

## 5. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                             │
├─────────────────────────────────────────────────────────────┤
│                   Next.js Frontend (Vercel)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Next.js App Router                                   │   │
│  │ - Pages: /login, /tasks, /dashboard                 │   │
│  │ - API: /lib/api.ts (HTTP client)                    │   │
│  │ - Auth: Better Auth integration                     │   │
│  │ - State: React Context (auth), React Query (data)   │   │
│  │ - UI: Tailwind CSS components                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓ HTTP                             │
│              Authorization: Bearer <JWT>                     │
└─────────────────────────────────────────────────────────────┘
                              │
                    HTTPS REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│            FastAPI Backend (Railway/Cloud Run)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ FastAPI Application                                 │   │
│  │ - Routes: /api/tasks, /api/auth                    │   │
│  │ - Middleware: JWT verification                     │   │
│  │ - Models: SQLModel (ORM)                           │   │
│  │ - Services: Business logic                         │   │
│  │ - Validation: Pydantic schemas                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                            ↓ SQL                              │
│              Connection Pool (psycopg2)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                    PostgreSQL Protocol
                              │
┌─────────────────────────────────────────────────────────────┐
│          Neon Serverless PostgreSQL Database                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tables:                                              │   │
│  │ - users (Better Auth managed)                       │   │
│  │ - tasks (user_id FK to users.id)                    │   │
│  │ - sessions (Better Auth managed)                    │   │
│  │ Indexes: user_id, completed, email                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Examples

**Create Task Flow:**
```
1. User fills form → Click "Add Task"
2. Frontend validates input
3. Frontend sends: POST /api/tasks
   Headers: Authorization: Bearer <JWT>
   Body: { title, description }
4. Backend receives request
5. Middleware extracts user_id from JWT
6. Backend validates data with Pydantic
7. Backend queries: INSERT INTO tasks (user_id, title, description, ...)
8. Database returns new task record
9. Backend responds: { task object }
10. Frontend updates UI with new task
11. Toast notification: "Task created successfully"
```

**Fetch Tasks Flow:**
```
1. User navigates to /tasks
2. Frontend sends: GET /api/tasks?status=all
   Headers: Authorization: Bearer <JWT>
3. Backend middleware validates JWT
4. Backend queries: SELECT * FROM tasks WHERE user_id = ? AND completed = false
5. Database returns task records
6. Backend responds: [{ task1 }, { task2 }, ...]
7. Frontend renders task list
8. Each task shows: title, description, checkbox, edit, delete buttons
```

**Authentication Flow:**
```
1. User enters email and password
2. Frontend sends: POST /api/auth/signin
   Body: { email, password }
3. Backend queries: SELECT * FROM users WHERE email = ?
4. Backend validates password hash
5. Backend generates JWT token
6. Backend returns: { token, user }
7. Frontend stores token (httpOnly cookie)
8. Frontend redirects to /tasks dashboard
9. All subsequent requests include Authorization header
```

---

## 6. Feature Breakdown

### Feature 1: Task CRUD Operations
- **Scope:** Create, read, update, delete tasks
- **Owner:** Both frontend and backend
- **Dependencies:** Authentication, Database
- **API Endpoints:** GET, POST, PUT, DELETE /api/tasks

### Feature 2: User Authentication
- **Scope:** Sign up, sign in, sign out, session management
- **Owner:** Backend (auth logic), Frontend (UI)
- **Dependencies:** Better Auth integration, JWT handling
- **API Endpoints:** POST /api/auth/signin, /api/auth/signup, /api/auth/signout

### Feature 3: Responsive UI
- **Scope:** Mobile, tablet, desktop layouts
- **Owner:** Frontend
- **Dependencies:** Tailwind CSS, Next.js
- **Features:** Task forms, task lists, navigation, authentication pages

### Feature 4: Task Filtering & Sorting
- **Scope:** Filter by status, sort by date or title
- **Owner:** Backend (query logic), Frontend (UI controls)
- **Dependencies:** Database indexing, API query parameters
- **API Endpoints:** GET /api/tasks?status=pending&sort=created

---

## 7. Success Criteria (Definition of Done)

### Backend Complete When:
- [ ] All 6 API endpoints working correctly
- [ ] JWT authentication middleware implemented
- [ ] SQLModel migrations created
- [ ] Database populated with tables
- [ ] Unit tests passing (70%+ coverage)
- [ ] Error handling for all scenarios
- [ ] CORS configured properly
- [ ] Environment variables documented

### Frontend Complete When:
- [ ] Login/signup pages functional
- [ ] Dashboard displays all tasks
- [ ] CRUD operations working via UI
- [ ] Responsive on mobile, tablet, desktop
- [ ] Form validation working
- [ ] Error messages displayed properly
- [ ] TypeScript strict mode enabled
- [ ] Unit tests passing

### Deployment Complete When:
- [ ] Backend API deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database configured and seeded
- [ ] End-to-end tests passing
- [ ] Documentation complete
- [ ] Team handoff completed

---

## 8. Comparison: Phase I vs Phase II

| Aspect | Phase I | Phase II |
|--------|---------|----------|
| **Interface** | CLI (command line) | Web UI (browser) |
| **Data Storage** | JSON file | PostgreSQL database |
| **Users** | Single user | Multi-user |
| **Authentication** | None | Email/password with JWT |
| **Architecture** | Monolithic CLI | Distributed (frontend + backend) |
| **Languages** | Python only | Python + TypeScript |
| **Deployment** | Local machine only | Cloud deployment |
| **Real-time** | No sync needed | Automatic sync on each action |
| **Scalability** | Limited (single file) | Scalable (cloud database) |
| **User Isolation** | N/A (single user) | Complete isolation |

---

## 9. Development Phases

### Phase 2.1: Backend Setup (Week 1-2)
- [ ] FastAPI project initialized
- [ ] SQLModel models created
- [ ] Database connection configured
- [ ] API endpoints scaffolded
- [ ] Basic unit tests created

### Phase 2.2: Frontend Setup (Week 1-2)
- [ ] Next.js project initialized
- [ ] Tailwind CSS configured
- [ ] TypeScript configured
- [ ] Project structure created
- [ ] Basic components scaffolded

### Phase 2.3: Authentication (Week 2-3)
- [ ] Better Auth setup
- [ ] JWT token generation
- [ ] Backend auth endpoints
- [ ] Frontend auth pages
- [ ] Auth middleware integrated

### Phase 2.4: Core Features (Week 3-4)
- [ ] Task CRUD endpoints
- [ ] Frontend task components
- [ ] API integration
- [ ] Form validation
- [ ] Error handling

### Phase 2.5: Polish & Testing (Week 4-5)
- [ ] Responsive design refinement
- [ ] Unit tests added
- [ ] E2E tests added
- [ ] Bug fixes
- [ ] Performance optimization

### Phase 2.6: Deployment (Week 5-6)
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database configured
- [ ] Environment variables set
- [ ] Monitoring enabled

---

## 10. Next Steps

1. **Read the full specifications:** See `/specs/phase2-web/` directory
2. **Review architecture details:** See `architecture.md`
3. **Check API endpoint specs:** See `/specs/phase2-web/api/`
4. **Review database schema:** See `/specs/phase2-web/database/`
5. **Begin implementation:** Use Claude Code with `/sp.implement` command

---

## 11. Resources & Documentation

- **API Documentation:** See `/specs/phase2-web/api/rest-endpoints.md`
- **Database Schema:** See `/specs/phase2-web/database/schema.md`
- **UI Components:** See `/specs/phase2-web/ui/components.md`
- **Frontend Guide:** See `frontend/CLAUDE.md`
- **Backend Guide:** See `backend/CLAUDE.md`
- **Setup Instructions:** See `docs/SETUP.md`

---

**Document Status:** ACTIVE
**Last Updated:** December 28, 2024
**Next Review:** January 15, 2025

