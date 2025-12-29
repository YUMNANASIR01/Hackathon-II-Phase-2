
# Hackathon Todo App - Phase II Development Guide

**Project:** Hackathon Todo - Full-Stack Web Application
**Phase:** II (Next: Multi-user web application)
**Status:** Development Setup Complete
**Last Updated:** December 28, 2024

---

## 📋 Quick Navigation

### Project Documentation
- **Constitution:** `CONSTITUTION.md` - Governance, principles, standards
- **Phase I:** `specs/phase1-console/` - Completed console app (reference)
- **Phase II:** `specs/phase2-web/` - Full-stack web application specs

### Frontend Setup
- **Guide:** `frontend/CLAUDE.md` - Frontend development instructions
- **Tech:** Next.js 16+, TypeScript, Tailwind CSS
- **Running:** `cd frontend && npm run dev` (http://localhost:3000)

### Backend Setup
- **Guide:** `backend/CLAUDE.md` - Backend development instructions
- **Tech:** FastAPI, Python 3.11+, SQLModel
- **Running:** `cd backend && uvicorn main:app --reload` (http://localhost:8000)

---

## 🎯 Project Overview

### What We're Building
A multi-user task management web application that allows users to:
- Sign up and log in securely
- Create, update, delete, and complete tasks
- View tasks with filtering and sorting
- Manage their data in the cloud

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16+ | React framework with server components |
| **Frontend** | TypeScript | Type-safe frontend code |
| **Frontend** | Tailwind CSS | Responsive UI styling |
| **Backend** | FastAPI | Fast, async Python web framework |
| **Backend** | SQLModel | ORM combining SQLAlchemy + Pydantic |
| **Database** | Neon PostgreSQL | Serverless cloud database |
| **Auth** | Better Auth | Modern authentication library |
| **Deployment** | Vercel (FE), Railway (BE) | Cloud deployment platforms |

### Repository Structure

```
hackathon-todo/
├── CONSTITUTION.md              # Project governance
├── CLAUDE.md                    # This file
├── specs/
│   ├── phase1-console/          # Phase I specs (reference)
│   └── phase2-web/              # Phase II specs
│       ├── overview.md          # Project overview
│       ├── architecture.md      # System architecture
│       ├── features/            # Feature specifications
│       ├── api/                 # API specifications
│       ├── database/            # Database schema
│       └── ui/                  # UI specifications
├── frontend/                    # Next.js application
│   ├── CLAUDE.md               # Frontend guide
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   └── package.json
├── backend/                     # FastAPI application
│   ├── CLAUDE.md               # Backend guide
│   ├── main.py                 # FastAPI entry point
│   ├── models.py               # Database models
│   ├── routes/                 # API routes
│   ├── services/               # Business logic
│   ├── middleware/             # JWT verification, etc.
│   ├── tests/                  # Unit tests
│   └── requirements.txt
├── docs/                        # Documentation
│   ├── SETUP.md                # Setup instructions
│   ├── API.md                  # API documentation
│   └── DEPLOYMENT.md           # Deployment guide
└── .spec-kit/
    └── config.yaml             # Spec-Kit configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL or Neon account (database)
- Git

### 1. Clone & Setup Project

```bash
# Clone repository
git clone <repository-url>
cd hackathon-todo

# Create virtual environment (backend)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`.env` in backend/):**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/todo_db

# JWT Secret (Must match frontend)
BETTER_AUTH_SECRET=your-secret-key-here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Environment
ENVIRONMENT=development
```

**Frontend (`.env.local` in frontend/):**
```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Auth configuration
NEXT_PUBLIC_AUTH_SECRET=your-secret-key-here
```

### 3. Initialize Database

```bash
cd backend

# Create database and tables
python -c "from db.connection import create_tables; create_tables()"

# Or use Neon: https://console.neon.tech
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend available at http://localhost:3000
```

---

## 📚 Specification Files

### Phase II Documentation

1. **Overview** (`specs/phase2-web/overview.md`)
   - Project goals and deliverables
   - Feature breakdown
   - Success criteria

2. **Architecture** (`specs/phase2-web/architecture.md`)
   - System design and patterns
   - Frontend, backend, database architecture
   - Security and scalability considerations

3. **API Specification** (`specs/phase2-web/api/rest-endpoints.md`)
   - All 11 REST endpoints documented
   - Request/response examples
   - Error handling

4. **Database Schema** (`specs/phase2-web/database/schema.md`)
   - SQLModel models
   - Table structure
   - Indexes and relationships

5. **Feature Specifications** (`specs/phase2-web/features/`)
   - Task CRUD operations
   - Authentication flows
   - UI/UX requirements

---

## 🔐 Development Workflow

### Using Claude Code (Spec-Driven Development)

1. **Read the relevant spec first:**
   ```bash
   # Before implementing a feature:
   cat specs/phase2-web/features/task-crud.md
   cat specs/phase2-web/api/rest-endpoints.md
   cat specs/phase2-web/database/schema.md
   ```

2. **Implement following the spec:**
   - Backend: `backend/CLAUDE.md` for patterns
   - Frontend: `frontend/CLAUDE.md` for patterns
   - Reference specs in your prompts

3. **Test your implementation:**
   ```bash
   # Backend
   cd backend && pytest tests/

   # Frontend
   cd frontend && npm test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: implement task CRUD endpoints"
   ```

### Code Quality Standards

**All code MUST:**
- Have TypeScript types (frontend) or type hints (backend)
- Be tested with unit tests
- Follow the patterns in `frontend/CLAUDE.md` or `backend/CLAUDE.md`
- Include error handling
- Be documented with comments for complex logic

**Prohibited:**
- Using `any` types in TypeScript without justification
- Hardcoding secrets in code
- Not checking user_id in API queries (security issue!)
- Missing error handling
- No test coverage for core logic

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=.

# Run specific test file
pytest tests/test_tasks.py
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Manual Testing

1. **API Testing with Swagger:**
   - Visit http://localhost:8000/docs
   - Test all endpoints interactively

2. **Frontend Testing:**
   - Visit http://localhost:3000
   - Test signup, login, task CRUD

---

## 📝 Common Tasks

### Create a New API Endpoint

1. **Spec it:** Add to `specs/phase2-web/api/rest-endpoints.md`
2. **Model it:** Add SQLModel in `backend/models.py` if needed
3. **Implement it:** Create route in `backend/routes/`
4. **Test it:** Add test in `backend/tests/`
5. **Integrate:** Call from `backend/main.py`

### Add a New Frontend Component

1. **Spec it:** Add to `specs/phase2-web/ui/components.md`
2. **Create it:** Add component in `frontend/components/`
3. **Style it:** Use Tailwind CSS classes
4. **Test it:** Add unit test or manual test
5. **Integrate:** Use in page or other component

### Deploy to Production

1. **Backend:** Deploy to Railway or Cloud Run
2. **Frontend:** Deploy to Vercel
3. **Database:** Use Neon production branch
4. **See:** `docs/DEPLOYMENT.md` for detailed steps

---

## 🐛 Debugging

### Common Issues

**"CORS error" when API calls fail:**
- Check CORS configuration in `backend/main.py`
- Verify `FRONTEND_URL` env variable matches your frontend
- Check browser console for exact error

**"401 Unauthorized" on API requests:**
- Verify JWT token is being sent in `Authorization` header
- Check token isn't expired
- Verify token secret matches between frontend and backend

**"Task belongs to different user" error:**
- This is correct behavior! User isolation is working
- Each user should only see their own tasks

**Database connection errors:**
- Verify `DATABASE_URL` in `.env`
- Test connection: `psql $DATABASE_URL`
- For Neon: Use connection string from console

### Useful Commands

```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check database connection
python -c "from db.connection import test_connection; test_connection()"

# View database schema
psql $DATABASE_URL -c "\d tasks"

# Clear all tasks (dev only!)
curl -X DELETE http://localhost:8000/api/admin/clear-tasks \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 Learning Resources

### Better Auth Documentation
- https://better-auth.com/ - Authentication library docs
- JWT tokens: https://jwt.io/

### FastAPI Documentation
- https://fastapi.tiangolo.com/ - FastAPI official docs
- SQLModel: https://sqlmodel.tiangolo.com/

### Next.js Documentation
- https://nextjs.org/docs - Next.js official docs
- App Router: https://nextjs.org/docs/app

### Tailwind CSS
- https://tailwindcss.com/docs - Tailwind documentation
- Components: https://ui.shadcn.com/

---

## 🎓 Development Principles

### Constitution Highlights

**MUST follow these principles:**
1. **Security First** - Always verify user_id from JWT, never from request
2. **Type Safety** - Use TypeScript types and Python type hints everywhere
3. **Tests Required** - All core logic must have unit tests (70%+ coverage)
4. **Error Handling** - Never let errors go unhandled
5. **Documentation** - Update specs when behavior changes

**See:** `CONSTITUTION.md` for full governance document

---

## 📞 Getting Help

### Documentation
- **Frontend guide:** `frontend/CLAUDE.md`
- **Backend guide:** `backend/CLAUDE.md`
- **API docs:** `specs/phase2-web/api/rest-endpoints.md`
- **Architecture:** `specs/phase2-web/architecture.md`

### Common Questions

**Q: How do I add a new field to tasks?**
A: Update SQLModel in `backend/models.py`, create migration, update API schema, update frontend.

**Q: How do I implement authentication?**
A: Better Auth handles frontend auth, backend verifies JWT tokens via middleware.

**Q: Where do I store sensitive data?**
A: Use environment variables (`.env`), never hardcode secrets.

---

## 🔄 Development Cycle

### Week-by-Week Plan

**Week 1: Backend Setup**
- [ ] FastAPI project scaffolded
- [ ] SQLModel models created
- [ ] Database connection working
- [ ] Basic API endpoints working

**Week 2: Frontend Setup**
- [ ] Next.js project scaffolded
- [ ] Tailwind CSS configured
- [ ] TypeScript strict mode enabled
- [ ] Basic pages created

**Week 3: Authentication**
- [ ] Better Auth integrated
- [ ] JWT tokens working
- [ ] Backend auth endpoints
- [ ] Frontend login/signup pages

**Week 4: Core Features**
- [ ] Task CRUD endpoints complete
- [ ] Frontend task components complete
- [ ] API integration working
- [ ] Forms validated

**Week 5: Polish & Testing**
- [ ] Unit tests added
- [ ] E2E tests created
- [ ] Responsive design complete
- [ ] Error handling comprehensive

**Week 6: Deployment**
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database configured
- [ ] Monitoring enabled

---

## ✅ Deployment Checklist

Before going to production:
- [ ] All tests passing
- [ ] Code coverage > 70%
- [ ] Environment variables set correctly
- [ ] Database migrations run
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting active
- [ ] Error logging working
- [ ] Monitoring alerts set up
- [ ] Documentation updated

---

## 📄 Related Documents

- `CONSTITUTION.md` - Full project governance
- `frontend/CLAUDE.md` - Frontend development guide
- `backend/CLAUDE.md` - Backend development guide
- `specs/phase2-web/overview.md` - Project overview
- `specs/phase2-web/architecture.md` - System architecture
- `docs/SETUP.md` - Detailed setup instructions
- `docs/API.md` - API documentation
- `docs/DEPLOYMENT.md` - Deployment guide

---

## 🚦 Status Dashboard

### Phase II Development Status

| Component | Status | Owner | ETA |
|-----------|--------|-------|-----|
| Specifications | ✅ Complete | Team | - |
| Backend Scaffolding | ⏳ Pending | Backend | - |
| Frontend Scaffolding | ⏳ Pending | Frontend | - |
| Authentication | ⏳ Pending | Both | - |
| Task CRUD | ⏳ Pending | Both | - |
| Testing | ⏳ Pending | Both | - |
| Deployment | ⏳ Pending | DevOps | - |

---

**Document Status:** ACTIVE
**Last Updated:** December 28, 2024
**Next Review:** January 15, 2025

