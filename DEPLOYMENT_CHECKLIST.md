# ✅ Deployment Checklist

## Phase 1: Pre-Deployment Preparation

### Code & Repository
- [ ] All code committed to GitHub
- [ ] No hardcoded secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] `.gitignore` checked for sensitive files
- [ ] Latest code pushed to main branch
- [ ] README.md up to date

### Dependencies
- [ ] Backend: `requirements.txt` has all dependencies
- [ ] Frontend: `package.json` locked with correct versions
- [ ] Both run successfully locally (`npm run dev` and `uvicorn`)

### Environment Variables
- [ ] Backend `.env` file exists with all required variables
- [ ] Frontend `.env.local` file exists with API_URL set to localhost:8000
- [ ] No secrets committed to git

### Testing
- [ ] Backend API works locally on http://localhost:8000
- [ ] Frontend works locally on http://localhost:3002
- [ ] Signup endpoint works (test with curl)
- [ ] Login endpoint works
- [ ] Task CRUD operations work
- [ ] Logout redirects to home page
- [ ] No console errors in browser DevTools

---

## Phase 2: Backend Deployment (Railway)

### Account Setup
- [ ] Railway account created at https://railway.app
- [ ] Logged in with GitHub credentials
- [ ] GitHub authorization granted to Railway

### Project Creation
- [ ] New Railway project created
- [ ] GitHub repository connected
- [ ] Project name set (e.g., "todo-app-backend")

### Configuration
- [ ] Root directory set to `backend/`
- [ ] Environment variables added:
  - [ ] `DATABASE_URL` = Neon PostgreSQL connection string
  - [ ] `BETTER_AUTH_SECRET` = Strong random 32+ char string (⚠️ CHANGE FROM admin1234)
  - [ ] `FRONTEND_URL` = Placeholder (update after frontend deployment)
  - [ ] `ENVIRONMENT` = production

### Build & Start Configuration
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
- [ ] Public URL enabled
- [ ] Domain noted: `https://yourapp.railway.app`

### Deployment
- [ ] Deploy button clicked
- [ ] Deployment logs show no errors
- [ ] Backend successfully deployed and running
- [ ] Public domain URL obtained

### Verification
- [ ] Test health endpoint: `curl https://yourapp.railway.app/api/health`
- [ ] API docs accessible: `https://yourapp.railway.app/docs`
- [ ] No CORS errors in initial testing

### Post-Backend Deployment
- [ ] Copy backend public URL
- [ ] Save for frontend configuration
- [ ] Keep domain for CORS configuration

---

## Phase 3: Frontend Deployment (Vercel)

### Account Setup
- [ ] Vercel account created at https://vercel.com
- [ ] Logged in with GitHub credentials
- [ ] GitHub authorization granted to Vercel

### Project Import
- [ ] GitHub repository imported
- [ ] Root directory set to `frontend/`
- [ ] Project name set (e.g., "todo-app-frontend")

### Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` = Your Railway backend URL (e.g., https://yourapp.railway.app)
- [ ] `NEXT_PUBLIC_AUTH_SECRET` = Same as backend's BETTER_AUTH_SECRET

### Build Configuration
- [ ] Framework detected: Next.js ✓
- [ ] Build command verified: `next build`
- [ ] Output directory: `.next`

### Deployment
- [ ] Deploy button clicked
- [ ] Build logs show no errors
- [ ] Frontend successfully deployed
- [ ] Vercel domain obtained: `https://your-project.vercel.app`

### Verification
- [ ] Frontend loads at Vercel URL
- [ ] Home page displays correctly
- [ ] "Log In" and "Create Account" buttons visible
- [ ] No "Cannot find module" errors

---

## Phase 4: Post-Deployment Integration

### Update Backend CORS
- [ ] Go back to Railway dashboard
- [ ] Update `FRONTEND_URL` environment variable to Vercel domain
- [ ] Optional: Update `allow_origins` in `backend/main.py` to include Vercel domain
- [ ] Trigger backend redeploy
- [ ] Wait for deployment to complete

### Update Frontend Environment (if needed)
- [ ] Verify `NEXT_PUBLIC_API_URL` is correct in Vercel
- [ ] If changed, trigger redeploy

---

## Phase 5: End-to-End Testing

### Authentication Flow
- [ ] Open frontend at `https://your-project.vercel.app`
- [ ] Click "Create Account"
- [ ] Fill in email, password, name
- [ ] Submit form
- [ ] Should create account and redirect to tasks page
- [ ] Check browser DevTools → No CORS errors
- [ ] Check Network tab → API calls successful (200/201)

### Login Flow
- [ ] Sign out (should go to home page)
- [ ] Click "Log In"
- [ ] Enter email and password
- [ ] Submit form
- [ ] Should login and redirect to tasks page
- [ ] No console errors

### Task Operations
- [ ] Create a new task
- [ ] Task should appear in list
- [ ] Update task (edit title)
- [ ] Delete task
- [ ] Toggle task completion
- [ ] All operations should work without CORS errors

### Logout
- [ ] Click logout/sign out button
- [ ] Should clear auth token
- [ ] Should redirect to home page (not login page)
- [ ] Should show success message

### Error Handling
- [ ] Try invalid login credentials
- [ ] Should show error message (not empty error)
- [ ] Try API without internet (check timeout handling)
- [ ] Try creating account with existing email
- [ ] Should show appropriate error message

---

## Phase 6: Performance & Monitoring

### Frontend (Vercel)
- [ ] Page loads in < 3 seconds
- [ ] Lighthouse score checked (aim for > 80)
- [ ] Mobile responsiveness tested
- [ ] Build output size checked

### Backend (Railway)
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] Logs checked for warnings/errors
- [ ] Connection pool usage monitored

### Database (Neon)
- [ ] Connection pool size adequate (20 configured)
- [ ] No connection limit errors
- [ ] Query performance acceptable
- [ ] Backups enabled (Neon auto-backup)

---

## Phase 7: Security Verification

### Secrets Management
- [ ] No hardcoded secrets in code
- [ ] Environment variables used for all secrets
- [ ] `BETTER_AUTH_SECRET` is strong (32+ characters)
- [ ] Database password never exposed
- [ ] GitHub doesn't show .env files in history

### API Security
- [ ] All protected endpoints require JWT
- [ ] JWT verification working on backend
- [ ] Tokens expire after 7 days
- [ ] Passwords hashed with bcrypt
- [ ] SQL injection prevented (using SQLModel)

### HTTPS & Transport
- [ ] All URLs use HTTPS (automatic on Vercel/Railway)
- [ ] Security headers configured in Next.js
- [ ] CORS properly configured
- [ ] No sensitive data in query parameters

### Database Security
- [ ] SSL/TLS enabled for database connection
- [ ] Database credentials in environment variables only
- [ ] Connection limited by pool size
- [ ] User isolation enforced (user_id checks)

---

## Phase 8: Monitoring & Maintenance

### Logging
- [ ] Backend logs accessible on Railway
- [ ] Frontend errors tracked (optional: Vercel Analytics)
- [ ] Database query logs monitored
- [ ] Error rate < 1%

### Alerts (Optional but Recommended)
- [ ] Set up backend deployment failure notifications
- [ ] Set up frontend build failure alerts
- [ ] Monitor database connection pool usage
- [ ] Track API error rates

### Regular Maintenance
- [ ] Check dependency updates monthly
- [ ] Review security advisories
- [ ] Monitor database size/usage
- [ ] Check Railway/Vercel billing

---

## Phase 9: Rollback Plan (Just in Case)

### If Backend Deployment Fails
- [ ] Check logs in Railway dashboard
- [ ] Verify environment variables are set
- [ ] Verify dependencies in requirements.txt
- [ ] Rollback to previous deployment if needed
- [ ] Fix issue and redeploy

### If Frontend Deployment Fails
- [ ] Check logs in Vercel dashboard
- [ ] Verify environment variables correct
- [ ] Check for build errors (TypeScript, etc.)
- [ ] Rollback to previous deployment
- [ ] Fix issue and redeploy

### If Database Connection Fails
- [ ] Verify DATABASE_URL is correct
- [ ] Check Neon database is up
- [ ] Verify connection pool not exhausted
- [ ] Check for network connectivity issues
- [ ] Contact Neon support if persistent

---

## 📋 Summary of Actions

### Quick Start
1. ✅ Prepare code (commit, no secrets)
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Update CORS with Vercel domain
5. ✅ Test end-to-end
6. ✅ Monitor logs

### Time Estimate
- Backend deployment: 5-10 minutes
- Frontend deployment: 5-10 minutes
- Configuration updates: 2-5 minutes
- Testing: 5-10 minutes
- **Total: 20-35 minutes**

---

## 🎉 Success Criteria

You're done when:
- ✅ Frontend loads without errors
- ✅ Can create account
- ✅ Can login with created account
- ✅ Can create, edit, delete tasks
- ✅ Can logout (redirects to home)
- ✅ No CORS errors
- ✅ No API errors
- ✅ Backend logs show healthy responses
- ✅ All security checks passed

---

**Last Updated**: December 29, 2024
**Status**: Ready for Deployment
