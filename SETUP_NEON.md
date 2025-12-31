# Setting Up Neon PostgreSQL Database

## ✅ What I've Done

1. **Fixed your `.env` file** - Removed quotes around DATABASE_URL
2. **Now points to Neon** - `postgresql://neondb_owner:npg_C3riNGTZKhu1@ep-tiny-rain-abl3qwkm-pooler.eu-west-2.aws.neon.tech/neondb`

---

## 🚀 Next Steps

### Step 1: Stop the Backend
If your backend is running, stop it:
- Press `Ctrl+C` in the terminal where uvicorn is running

### Step 2: Restart Backend (Connected to Neon)

```bash
cd backend
uvicorn main:app --reload
```

**Look for this in the output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

If you see connection errors, check your DATABASE_URL.

### Step 3: Create Tables in Neon

The backend automatically creates tables on startup. You can verify they were created by going to:
- https://console.neon.tech
- Select your project
- Go to SQL Editor
- Run: `SELECT * FROM information_schema.tables WHERE table_schema='public';`

You should see: `user` and `task` tables

### Step 4: Create Test User in Neon

```bash
cd backend
python << 'EOF'
import sys
sys.path.insert(0, '.')

from database import engine, create_db_and_tables
from sqlmodel import Session
import crud
from models import UserCreate

# Ensure tables exist in Neon
create_db_and_tables()

# Create a test user
db = Session(engine)
user = crud.create_user(db, UserCreate(
    email="demo@test.com",
    password="demo123",
    name="Demo User"
))
print(f"✓ Created user in Neon: {user.email}")
db.close()
EOF
```

### Step 5: Verify Data in Neon Console

1. Go to https://console.neon.tech
2. Select your project
3. Go to SQL Editor
4. Run:
```sql
SELECT email, name FROM "user";
```

You should see:
```
email              | name
demo@test.com      | Demo User
```

### Step 6: Sign In to Your App

1. Go to http://localhost:3000/login
2. Enter:
   - Email: `demo@test.com`
   - Password: `demo123`
3. Click "Sign In"

**You should now be logged in and see the tasks page!**

---

## 🎯 How It Works

When you:
1. **Sign up** → User data is saved to Neon
2. **Sign in** → Backend looks up user in Neon
3. **Create task** → Task data is saved to Neon
4. **View tasks** → Backend fetches from Neon
5. **Update/Delete** → Changes are saved to Neon

All data now persists in your Neon database!

---

## 🔍 Verify Connection

To check if backend is connected to Neon, run:

```bash
cd backend
python << 'EOF'
import sys
sys.path.insert(0, '.')
import os
from dotenv import load_dotenv

load_dotenv()
database_url = os.getenv('DATABASE_URL')

if 'neon' in database_url:
    print("✓ Backend is configured to use Neon")
    print(f"  Database: {database_url.split('/')[-1].split('?')[0]}")
else:
    print("✗ Backend is NOT using Neon!")
    print(f"  Current: {database_url}")
EOF
```

---

## 📋 Troubleshooting

### Issue: Still can't sign in
**Solution:** Make sure you:
1. Restarted the backend after updating `.env`
2. Created the test user in Neon
3. Using correct credentials: `demo@test.com` / `demo123`

### Issue: Backend won't connect to Neon
**Solution:** Check:
1. DATABASE_URL in `.env` has NO quotes
2. No typos in connection string
3. Neon is still active (check console.neon.tech)

### Issue: Data not appearing in Neon
**Solution:**
1. Verify backend is using Neon (check above)
2. Check backend logs for errors
3. Try creating user again

---

## ✅ Success Checklist

- [ ] Backend restarted and connected to Neon
- [ ] Tables created in Neon (check SQL Editor)
- [ ] Test user created: `demo@test.com`
- [ ] Can sign in with `demo@test.com` / `demo123`
- [ ] Data appears in Neon console
- [ ] Can create and view tasks

---

## 🎓 What Happens After This

Once you confirm everything works:
1. All your data is in Neon (cloud)
2. You can sign up new users
3. Each user sees only their tasks
4. Data persists between restarts
5. Ready to deploy to production!

---

**Do the steps above and let me know when you've verified the data in Neon console!**
