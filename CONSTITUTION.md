# Hackathon Todo App - Phase II Constitution

**Document Version:** 2.0.0
**Ratification Date:** 2024-12-28
**Last Amended Date:** 2024-12-28
**Phase:** II - Full-Stack Web Application

---

## 1. Project Purpose & Vision

**Mission:**
Transform the Phase I console application into a modern, multi-user web application with persistent cloud storage, secure authentication, and a responsive frontend interface. Enable users to manage their tasks through an intuitive web interface with real-time synchronization and data persistence.

**Core Principles:**
- **User-Centric Design**: Clean, intuitive UI with responsive design
- **Data Security**: Secure authentication with JWT tokens and user isolation
- **Scalability**: Cloud-ready architecture with serverless PostgreSQL
- **Code Quality**: Type-safe code with comprehensive testing
- **Developer Experience**: Clear separation of concerns with monorepo structure

---

## 2. Technology Stack (Non-Negotiable)

### Frontend
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3+
- **State Management:** React Context or Zustand (for auth state)
- **HTTP Client:** axios with interceptors for JWT
- **UI Components:** Headless UI or shadcn/ui

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLModel (combines Pydantic + SQLAlchemy)
- **Database:** Neon Serverless PostgreSQL
- **Authentication:** Better Auth (JWT integration)
- **API Format:** RESTful JSON endpoints
- **Validation:** Pydantic models for request/response validation

### DevOps & Deployment
- **Frontend Hosting:** Vercel (optimal Next.js integration)
- **Backend Hosting:** Railway or Google Cloud Run
- **Database:** Neon DB (serverless PostgreSQL)
- **Version Control:** Git with monorepo structure

### Development Tools
- **Code Quality:**
  - TypeScript for frontend type safety
  - Pydantic for backend validation
  - ESLint + Prettier (frontend)
  - Black + isort (backend)
- **Testing:**
  - Jest/Vitest (frontend unit tests)
  - Pytest (backend unit tests)
  - Cypress/Playwright (E2E tests)
- **Documentation:** Markdown specs in `/specs` directory

---

## 3. Architecture Principles (MUST/SHOULD)

### MUST (Non-Negotiable Requirements)

1. **Security**
   - All API endpoints MUST require valid JWT token in `Authorization: Bearer <token>` header
   - MUST implement user isolation: each user sees only their own tasks
   - MUST never trust user_id from frontend; extract from verified JWT token
   - MUST use secure HTTP-only cookies for session management (Better Auth)
   - MUST implement CORS with explicit origin whitelisting

2. **Database**
   - MUST use SQLModel for all database operations
   - MUST have foreign key relationships enforcing referential integrity
   - MUST include created_at and updated_at timestamps on all tables
   - MUST use connection pooling for database efficiency

3. **API Design**
   - MUST follow RESTful conventions (GET, POST, PUT, DELETE, PATCH)
   - MUST return consistent JSON response format
   - MUST implement proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
   - MUST include error messages in response body
   - MUST validate all input using Pydantic schemas

4. **Type Safety**
   - MUST use TypeScript for all frontend code (no `any` types without justification)
   - MUST use type hints in all Python backend code
   - MUST define Pydantic models for all API request/response bodies

5. **Testing**
   - MUST have unit tests for core business logic
   - MUST test all API endpoints with valid and invalid inputs
   - MUST achieve minimum 70% code coverage on critical paths
   - MUST test authentication flows (login, logout, token refresh)

### SHOULD (Strong Recommendations)

1. **Code Organization**
   - SHOULD use atomic commits with conventional commit messages
   - SHOULD implement proper error handling with meaningful error messages
   - SHOULD add comprehensive logging for debugging
   - SHOULD follow DRY (Don't Repeat Yourself) principle

2. **Performance**
   - SHOULD optimize database queries (use indexes on frequently queried columns)
   - SHOULD implement pagination for large task lists
   - SHOULD cache user authentication tokens appropriately
   - SHOULD lazy-load frontend components for better initial load time

3. **Accessibility**
   - SHOULD implement WCAG 2.1 Level AA accessibility standards
   - SHOULD ensure keyboard navigation support
   - SHOULD use semantic HTML elements
   - SHOULD implement proper ARIA labels

4. **Documentation**
   - SHOULD document all API endpoints with examples
   - SHOULD maintain up-to-date README files
   - SHOULD include setup instructions for new developers
   - SHOULD document environment variables required

---

## 4. Feature Requirements (Phase II)

### 4.1 Core Features (MUST IMPLEMENT)

#### Feature 1: Task CRUD Operations
- Create new tasks with title and description
- View all tasks for authenticated user
- Update existing tasks
- Delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status (all, pending, completed)
- Sort tasks by created date or title

#### Feature 2: User Authentication
- Sign up with email and password
- Sign in with email and password
- Sign out
- Secure session management with JWT
- Password validation (min 8 chars, alphanumeric)
- Email verification (SHOULD: implement for security)
- Token refresh mechanism

#### Feature 3: Responsive UI
- Mobile-first responsive design
- Dark/Light mode toggle (SHOULD)
- Intuitive task management interface
- Real-time form validation
- Toast notifications for user feedback
- Loading states and error states

### 4.2 API Endpoints (MUST IMPLEMENT)

All endpoints require `Authorization: Bearer <JWT_TOKEN>` header.

```
GET     /api/health                    - Health check
GET     /api/tasks                     - List all tasks for user
POST    /api/tasks                     - Create new task
GET     /api/tasks/{task_id}           - Get task details
PUT     /api/tasks/{task_id}           - Update task
DELETE  /api/tasks/{task_id}           - Delete task
PATCH   /api/tasks/{task_id}/complete  - Toggle completion status

POST    /api/auth/signup               - Register new user
POST    /api/auth/signin               - Login user
POST    /api/auth/signout              - Logout user
POST    /api/auth/refresh              - Refresh JWT token
GET     /api/auth/me                   - Get current user
```

### 4.3 Database Schema (MUST IMPLEMENT)

#### Users Table (managed by Better Auth)
- id (UUID)
- email (unique)
- name
- password_hash
- created_at
- updated_at

#### Tasks Table
- id (integer, auto-increment)
- user_id (UUID, foreign key)
- title (string, not null)
- description (text, nullable)
- completed (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)

#### Indexes
- tasks.user_id (for filtering by user)
- tasks.completed (for status filtering)
- users.email (unique constraint)

---

## 5. Development Workflow

### Phase II Workflow Steps:

1. **Specification** → Create feature specs in `/specs/phase2-web/features/`
2. **Planning** → Design architecture and create plan in `/specs/phase2-web/`
3. **Task Breakdown** → Create atomic implementation tasks
4. **Backend Development** → Implement FastAPI routes and models
5. **Frontend Development** → Build Next.js components and pages
6. **Integration** → Connect frontend to backend API
7. **Testing** → Unit tests, integration tests, E2E tests
8. **Documentation** → Update specs and README files

### Git Workflow
- Main branch: production-ready code
- Develop branch: integration branch
- Feature branches: `feature/task-name` for new features
- Bug branches: `bugfix/issue-name` for bug fixes
- Hotfix branches: `hotfix/critical-issue` for critical production fixes

---

## 6. Code Quality Standards

### Frontend (TypeScript/Next.js)
```typescript
// MUST have proper type annotations
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

// MUST handle errors properly
try {
  const tasks = await fetchTasks();
} catch (error) {
  console.error('Failed to fetch tasks:', error);
  // Show error to user
}
```

### Backend (Python/FastAPI)
```python
# MUST have type hints
from sqlmodel import SQLModel, Field
from typing import Optional

class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None

# MUST validate all inputs
@app.post("/api/tasks")
async def create_task(task: TaskCreate, user_id: str = Depends(verify_jwt)):
    # Task validation happens automatically via Pydantic
    pass
```

### Testing Requirements
- Minimum 70% code coverage on critical paths
- All API endpoints tested with valid/invalid inputs
- Authentication flows tested thoroughly
- Database operations tested with transactions

---

## 7. Non-Functional Requirements

### Performance
- API response time: < 200ms for 99th percentile
- Database queries: < 100ms for basic operations
- Frontend First Contentful Paint: < 2 seconds
- Task list pagination: 20 items per page

### Security
- HTTPS/TLS for all communications
- CORS properly configured
- SQL injection prevention via parameterized queries
- XSS prevention via input sanitization
- CSRF protection on state-changing operations
- Rate limiting on authentication endpoints

### Reliability
- Database uptime: 99.9% (Neon SLA)
- Graceful error handling with meaningful messages
- Automatic reconnection to database
- Proper logging for debugging

### Scalability
- Serverless architecture (no long-running instances)
- Connection pooling for database
- CDN for static assets (Vercel provides this)
- Horizontal scaling ready for backend

---

## 8. File Structure & Organization

```
hackathon-todo/
├── .spec-kit/
│   └── config.yaml                 # Spec-Kit configuration
├── .specify/
│   └── memory/
│       └── constitution.md         # This document
├── specs/
│   ├── phase1-console/
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── phase2-web/
│       ├── overview.md
│       ├── architecture.md
│       ├── features/
│       │   ├── task-crud.md
│       │   ├── authentication.md
│       │   └── responsive-ui.md
│       ├── api/
│       │   ├── rest-endpoints.md
│       │   └── auth-flow.md
│       ├── database/
│       │   └── schema.md
│       └── ui/
│           ├── components.md
│           ├── pages.md
│           └── layouts.md
├── frontend/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tasks/
│   │   ├── auth/
│   │   └── api/
│   ├── components/
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── AuthForm.tsx
│   │   └── shared/
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   ├── auth.ts                 # Auth utilities
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── CLAUDE.md
├── backend/
│   ├── main.py                     # FastAPI entry point
│   ├── models.py                   # SQLModel definitions
│   ├── routes/
│   │   ├── tasks.py
│   │   ├── auth.py
│   │   └── health.py
│   ├── middleware/
│   │   └── auth.py                 # JWT verification
│   ├── db/
│   │   └── connection.py
│   ├── services/
│   │   ├── task_service.py
│   │   └── auth_service.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── tests/
│   │   ├── test_tasks.py
│   │   ├── test_auth.py
│   │   └── conftest.py
│   └── CLAUDE.md
├── docs/
│   ├── SETUP.md                    # Setup instructions
│   ├── API.md                      # API documentation
│   ├── ARCHITECTURE.md             # Architecture overview
│   └── DEPLOYMENT.md               # Deployment guide
├── docker-compose.yml
├── CLAUDE.md                       # Root navigation
├── CONSTITUTION.md                 # This document
├── README.md                       # Project overview
└── .gitignore
```

---

## 9. Dependencies & Governance

### Frontend Dependencies (Next.js 16+)
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `next-auth` (optional: for auth UI) or direct Better Auth integration
- `axios` - HTTP client
- `zustand` or `react-query` - State management
- `zod` or `yup` - Schema validation

### Backend Dependencies (Python 3.11+)
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlmodel` - ORM combining SQLAlchemy + Pydantic
- `psycopg2-binary` - PostgreSQL driver
- `python-jose[cryptography]` - JWT handling
- `python-dotenv` - Environment variables
- `pytest` - Testing framework

### Deployment & Hosting
- **Frontend:** Vercel (free tier supports deployment)
- **Backend:** Railway or Google Cloud Run
- **Database:** Neon DB (free tier includes 3 branches)
- **Version Control:** GitHub with this repository

---

## 10. Definition of Done (Phase II)

### Backend Complete When:
- [ ] All API endpoints implemented and tested
- [ ] JWT authentication middleware working
- [ ] SQLModel migrations created
- [ ] Database connection pooling configured
- [ ] Unit tests passing (70%+ coverage)
- [ ] API documentation complete
- [ ] Error handling implemented
- [ ] CORS configured properly
- [ ] Environment variables documented

### Frontend Complete When:
- [ ] All pages and components implemented
- [ ] Authentication flows working
- [ ] API integration complete
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Form validation working
- [ ] Error handling and loading states implemented
- [ ] TypeScript strict mode enabled
- [ ] Unit tests passing
- [ ] E2E tests for critical flows passing

### Deployment Complete When:
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database seeded with test data
- [ ] Environment variables configured
- [ ] Monitoring/logging working
- [ ] Documentation updated
- [ ] Handoff checklist completed

---

## 11. Amendment Procedure

### Making Changes to This Constitution

1. **Identify the change**: Determine if it affects principles (MAJOR), guidance (MINOR), or clarification (PATCH)
2. **Create ADR** (if significant): Use `/sp.adr "<decision-title>"` to document the decision
3. **Update this document**: Edit the relevant section
4. **Increment version**: Use semantic versioning (e.g., 2.0.0 → 2.1.0 for additions)
5. **Record amendment date**: Update `Last Amended Date` field
6. **Notify team**: Share changes in commit message

---

## 12. Compliance Checklist

### Before Implementing Phase II:
- [ ] This constitution is read and understood by all developers
- [ ] Technology stack is approved and available
- [ ] Neon DB account created and configured
- [ ] Better Auth setup completed
- [ ] Development environment configured
- [ ] Git workflow documented and agreed upon

### During Implementation:
- [ ] All code follows type safety requirements
- [ ] Tests written before/alongside code
- [ ] Documentation updated as features are completed
- [ ] Code reviews ensure compliance
- [ ] Architecture decisions documented

### Before Production Deployment:
- [ ] All tests passing
- [ ] Code coverage verified
- [ ] Security review completed
- [ ] Performance benchmarks acceptable
- [ ] Documentation complete and reviewed
- [ ] Deployment checklist verified

---

## 13. Contact & Support

**Project Lead:** [Team Name]
**Documentation:** See `/specs` directory
**API Reference:** See `/docs/API.md`
**Architecture Guide:** See `/docs/ARCHITECTURE.md`
**Issues & Questions:** File GitHub issues with `[phase-ii]` label

---

**Document Status:** ACTIVE
**Next Review Date:** 2025-01-15
**Approved By:** [Approver Name/Date]

