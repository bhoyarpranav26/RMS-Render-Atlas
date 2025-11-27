# 📋 Setup & Configuration Checklist

Use this checklist to ensure your backend and frontend are properly set up.

---

## Phase 1: Prerequisites ✅ (5 minutes)

- [ ] Node.js v14+ installed
  - Test: `node --version` in terminal
- [ ] npm installed
  - Test: `npm --version` in terminal
- [ ] MongoDB Atlas account created
  - Go to: https://www.mongodb.com/cloud/atlas
- [ ] Email service account (Gmail recommended)
  - Go to: https://myaccount.google.com

---

## Phase 2: MongoDB Atlas Setup ✅ (10 minutes)

### 2.1 Cluster & Database
- [ ] Created free tier cluster (M0)
- [ ] Cluster is showing "Active" status (wait if pending)
- [ ] Database user created
  - Username: `restom_user`
  - Password: Strong password saved
- [ ] IP whitelist updated
  - Added: `0.0.0.0/0` (or your specific IP)
- [ ] Connection string copied
  - Format: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/restom_db?retryWrites=true&w=majority`
  - Verified `<password>` replaced with actual password

### 2.2 Database Name
- [ ] Database created or will auto-create
  - Name: `restom_db`
- [ ] Collections will auto-create on first insert
  - `users`
  - `otprequests`

---

## Phase 3: Email Service Setup ✅ (5 minutes)

### 3.1 Gmail (Recommended)
- [ ] Gmail account ready
- [ ] 2-Step verification enabled
  - Go to: https://myaccount.google.com/security
  - Enable: 2-Step Verification
- [ ] App password generated
  - Go to: https://myaccount.google.com/apppasswords
  - Generate for: Mail + Windows Computer
  - Saved 16-character app password
  - ⚠️ This password will NOT be displayed again

### 3.2 Alternative Providers (Optional)
- [ ] Mailgun / SendGrid / Brevo account (if not using Gmail)
- [ ] SMTP credentials obtained:
  - Host
  - Port
  - Username
  - Password/API Key

---

## Phase 4: Backend Setup ✅ (5 minutes)

### 4.1 Project Structure
- [ ] Inside `RestoM-Frontend/backend/` folder exists:
  - `package.json` ✓
  - `.env.example` ✓
  - `src/index.js` ✓
  - `src/models/User.js` ✓
  - `src/models/OtpRequest.js` ✓
  - `src/routes/auth.js` ✓
  - `src/utils/email.js` ✓
  - `README.md` ✓
  - `test-api.js` ✓

### 4.2 Environment Configuration
- [ ] Created `backend/.env` file (copied from `.env.example`)
- [ ] Filled in required variables:
  ```
  MONGO_URI=mongodb+srv://restom_user:PASSWORD@cluster.xxxxx.mongodb.net/restom_db?retryWrites=true&w=majority
  JWT_SECRET=your_super_secret_key_here_make_it_long
  JWT_EXPIRES_IN=7d
  PORT=5000
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  EMAIL_SECURE=false
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_16_char_app_password
  ADMIN_KEY=your_secret_admin_key_change_this
  ```
- [ ] All variables have values (no placeholders remaining)
- [ ] `.env` file is in `.gitignore` (never commit secrets)

### 4.3 Dependencies Installation
- [ ] Opened terminal in `backend/` folder
- [ ] Ran: `npm install`
- [ ] Wait for installation to complete
- [ ] Verified `node_modules/` folder created
- [ ] Verified `package-lock.json` created

### 4.4 Backend Verification
- [ ] Run: `npm start` (or `npm run dev`)
- [ ] See output: `Connected to MongoDB`
- [ ] See output: `Server listening on port 5000`
- [ ] Terminal shows no errors
- [ ] Press `Ctrl+C` to stop server

---

## Phase 5: Frontend Updates ✅ (Already Done)

- [ ] AuthContext.tsx updated ✓
  - Has `loginWithCredentials()` method
  - Has `requestOtpForSignup()` method
  - Has `verifyOtpAndCreateAccount()` method
  - Manages JWT token in localStorage
- [ ] Signup.tsx updated ✓
  - Calls `auth.requestOtpForSignup()`
  - Calls `auth.verifyOtpAndCreateAccount()`
- [ ] Login.tsx updated ✓
  - Calls `auth.loginWithCredentials()`
- [ ] WelcomePage.jsx updated ✓
  - Integrates with AuthContext
  - Redirects after successful auth
- [ ] AdminLogin.tsx updated ✓
  - Uses updated AuthContext methods

---

## Phase 6: Frontend Startup ✅ (2 minutes)

### 6.1 Dependencies
- [ ] Opened terminal in root `RestoM-Frontend/` folder
- [ ] Ran: `npm install` (if not already done)
- [ ] Wait for completion
- [ ] Verified `node_modules/` folder exists

### 6.2 Development Server
- [ ] Run: `npm run dev`
- [ ] See output showing frontend URL (usually `http://localhost:5173`)
- [ ] Can access the URL in browser without errors
- [ ] Page loads successfully

---

## Phase 7: Integration Testing ✅ (10 minutes)

### 7.1 Backend API Test
- [ ] Open terminal in `backend/` folder
- [ ] Run: `node test-api.js`
- [ ] See test results:
  - ✅ Health Check PASS
  - ✅ Request OTP PASS
  - ✅ Login failure PASS (expected)
  - ✅ Invalid email PASS (expected)
  - ✅ Create Admin PASS (or SKIP with note)
- [ ] Exit: See summary and next steps

### 7.2 Manual Signup Flow
- [ ] Both backend and frontend running:
  - Backend: `npm run dev` (in `backend/`)
  - Frontend: `npm run dev` (in root)
- [ ] Open http://localhost:5173 in browser
- [ ] Click **"Ready to Order"** button
- [ ] Click **"Create New Account"** button
- [ ] Fill in signup form:
  - Name: Test User
  - Email: your_real_email@gmail.com
  - Phone: 9876543210
  - Password: Test123!@
  - Confirm: Test123!@
- [ ] Click **"Create Account"** button
- [ ] Wait for "Sending OTP..." message
- [ ] See **OTP Verification** screen appear
- [ ] Check your email inbox for OTP
  - Look for email from: `your_email@gmail.com`
  - Subject: "Your RestoM verification code"
  - Contains: 6-digit code
- [ ] Copy OTP code
- [ ] Enter OTP in the 6 digit fields
- [ ] Click **"Verify & Complete Signup"** button
- [ ] Wait for verification
- [ ] Successfully redirected to **/Category** page ✅
- [ ] User menu shows account info

### 7.3 Manual Login Flow
- [ ] Reload page or click logout
- [ ] Click **"Ready to Order"**
- [ ] Click **"Sign In Instead"** (or already on login)
- [ ] Fill login form:
  - Email: (same email from signup)
  - Password: Test123!@
- [ ] Click **"Sign In"** button
- [ ] Successfully redirected to **/Category** page ✅

### 7.4 Persistence Test
- [ ] Logged in and on `/Category` page
- [ ] Reload browser (F5)
- [ ] User remains logged in ✅
- [ ] User info preserved from localStorage

---

## Phase 8: Admin Account Creation (Optional) ✅

### 8.1 Create First Admin
- [ ] Using Postman or Thunder Client
- [ ] Make POST request to:
  ```
  http://localhost:5000/api/auth/create-admin
  ```
- [ ] Body (JSON):
  ```json
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "9876543211",
    "password": "AdminPass123!",
    "adminKey": "your_secret_admin_key_change_this"
  }
  ```
- [ ] Replace `adminKey` with value from `.env` ADMIN_KEY
- [ ] Send request
- [ ] Response: `{ok: true, user: {...}}`
- [ ] Admin account created in database ✅

---

## Phase 9: Production Preparation ✅ (Optional)

### 9.1 Security Checklist
- [ ] JWT_SECRET is long and random (30+ chars)
- [ ] ADMIN_KEY is secret and strong
- [ ] Email password is app-specific (not main password)
- [ ] `.env` is in `.gitignore`
- [ ] No secrets in code or comments
- [ ] All error messages don't leak sensitive info

### 9.2 Performance
- [ ] MongoDB indexes are created:
  - `users.email` (unique)
  - `users.phone` (unique)
  - `otprequests.email` (indexed)
  - `otprequests.expiresAt` (TTL)
- [ ] API response times are < 500ms
- [ ] Email delivery time < 2 minutes

### 9.3 Deployment (when ready)
- [ ] Frontend deployment (Vercel/Netlify)
  - [ ] Environment: `VITE_API_URL=https://your-backend-url.com`
- [ ] Backend deployment (Railway/Heroku/Render)
  - [ ] Environment variables set in dashboard
  - [ ] MongoDB Atlas updated IP whitelist
  - [ ] Database selected for production
- [ ] Update frontend API_URL to production backend URL

---

## Phase 10: Troubleshooting Checklist ✅

If something doesn't work:

### Connection Issues
- [ ] Backend won't connect to MongoDB?
  - Check: MONGO_URI is copied correctly
  - Check: Password doesn't contain special chars (if so, URL-encode)
  - Check: IP whitelist includes your IP (or 0.0.0.0)
  - Fix: Delete and recreate database user with simple password
- [ ] Frontend can't reach backend?
  - Check: Backend is running (`npm run dev`)
  - Check: Port 5000 is not in use (kill: `lsof -ti:5000 | xargs kill -9`)
  - Check: CORS is enabled in backend (it is by default)
- [ ] CORS error in browser?
  - Check: Frontend is calling `http://localhost:5000` (exact URL)
  - Check: No typo in API endpoint paths

### Email Issues
- [ ] OTP email not received?
  - Check: EMAIL_HOST, EMAIL_USER, EMAIL_PASS are correct
  - Check: Gmail has 2-FA enabled
  - Check: Using generated app password (not main password)
  - Check: Spam folder (email might be there)
  - Fix: Test SMTP credentials in Postman first
  - Fix: Gmail may block "less secure apps" – use app password instead
- [ ] "Mock send OTP to email" in logs?
  - This means EMAIL credentials are not configured
  - Check: All EMAIL_* variables in `.env`

### Auth Issues
- [ ] OTP verification fails?
  - Check: Entered OTP matches exactly (case-sensitive)
  - Check: OTP not expired (10-minute limit)
  - Check: Entered all 6 digits
  - Fix: Request new OTP and try again
- [ ] Login fails with "Invalid credentials"?
  - Check: Email is correct (typo?)
  - Check: Password is correct (case-sensitive)
  - Check: User exists in database (run signup first)
  - Fix: Verify in MongoDB Atlas (check `restom_db.users`)
- [ ] Token not working?
  - Check: JWT_SECRET is consistent
  - Check: Token not expired (7 day limit)
  - Fix: Clear browser localStorage and login again

### Validation Issues
- [ ] "Invalid email" error?
  - Check: Email format (must have @ and .)
  - Fix: Use valid email format
- [ ] "Password must be 8+ chars" error?
  - Check: Password has uppercase, lowercase, number, special char
  - Example valid: `Test123!@`
- [ ] "Invalid phone" error?
  - Check: Phone is 10 digits
  - Check: Starts with 6-9 (Indian format)
  - Example valid: `9876543210`

---

## ✅ Final Verification

Before launching, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can create account with email/phone/password
- [ ] Receive OTP in email
- [ ] OTP verification creates account
- [ ] Can login with credentials
- [ ] User remains logged in after reload
- [ ] All validation messages appear correctly
- [ ] No console errors in browser
- [ ] No errors in backend terminal
- [ ] MongoDB documents are created
  - Check: `restom_db.users` collection has documents
  - Check: User email/phone are unique

---

## 📞 Quick Command Reference

```powershell
# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev          # Start development server
npm start            # Start production server
node test-api.js     # Run API tests

# Frontend setup
npm install
npm run dev          # Start frontend development server
npm run build        # Build for production

# Useful checks
node --version       # Check Node.js version
npm --version        # Check npm version
npm list             # List installed dependencies
```

---

## 🎓 Document Reference

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-minute setup guide (START HERE) |
| **BACKEND_SETUP.md** | Detailed MongoDB, email, deployment setup |
| **SYSTEM_ARCHITECTURE.md** | Visual flows and system design |
| **IMPLEMENTATION_SUMMARY.md** | What was built and features |
| **backend/README.md** | Backend API and usage reference |
| **This file** | Setup checklist and troubleshooting |

---

## 🎉 Success!

When this checklist is complete, you have:
✅ Production-ready backend
✅ Fully integrated frontend
✅ Email OTP verification
✅ User authentication
✅ MongoDB database
✅ JWT tokens
✅ Ready to scale! 🚀

---

**Good luck building! Ask questions in documentation or check logs for errors.** 💪
