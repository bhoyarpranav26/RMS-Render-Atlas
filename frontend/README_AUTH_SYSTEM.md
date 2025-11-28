# RestoM - Complete Authentication System

A production-ready food delivery application with complete user authentication, email OTP verification, and admin panel support.

---

## 🚀 What You're Getting

### ✅ Complete Features Implemented

**Frontend (React + TypeScript)**
- User signup with email, phone, password
- Email-based OTP verification (6-digit code)
- User login with JWT tokens
- Admin login
- Persistent authentication (survives page reload)
- Full TypeScript type safety
- Beautiful, responsive UI

**Backend (Node.js + Express)**
- `/api/auth/request-otp` – Send OTP for signup
- `/api/auth/verify-otp` – Verify OTP and create user account
- `/api/auth/login` – Login with email and password
- `/api/auth/create-admin` – Create admin users
- MongoDB integration via Mongoose
- Bcrypt password hashing
- JWT token authentication
- Email service via Nodemailer

**Database (MongoDB Atlas)**
- User accounts with secure password storage
- OTP request tracking
- Auto-expiring OTP records (10-minute TTL)
- Unique email and phone constraints
- Production-ready indexes

---

## 📋 Quick Start (5 Minutes)

### Prerequisites
- Node.js v14+ and npm
- MongoDB Atlas account (free tier available)
- Email account (Gmail recommended)

### Step 1: Backend Setup
```powershell
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and email credentials
npm install
npm run dev
# You should see: "Connected to MongoDB" and "Server listening on port 5000"
```

### Step 2: Frontend Setup
```powershell
# In root folder (open new terminal)
npm install
npm run dev
# You should see: Frontend running on http://localhost:5173
```

### Step 3: Test the Flow
1. Open http://localhost:5173 in browser
2. Click "Ready to Order" → "Create New Account"
3. Fill in: name, email, phone, password
4. Click "Create Account"
5. **Check your email for the 6-digit OTP code**
6. Enter OTP in the modal
7. ✅ Account created! You're logged in

---

## 📁 Project Structure

```
RestoM-Frontend/
├── backend/                          # Node.js Backend
│   ├── src/
│   │   ├── index.js                 # Server entry point
│   │   ├── models/
│   │   │   ├── User.js              # User database model
│   │   │   └── OtpRequest.js        # OTP storage model
│   │   ├── routes/
│   │   │   └── auth.js              # Authentication routes
│   │   └── utils/
│   │       └── email.js             # Nodemailer email service
│   ├── package.json
│   ├── .env.example                 # Environment template
│   ├── README.md                    # Backend documentation
│   └── test-api.js                  # API test script
│
├── src/                              # React Frontend
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication state + API calls
│   ├── customer/
│   │   ├── pages/
│   │   │   ├── Login.tsx            # Login page (UPDATED)
│   │   │   ├── Signup.tsx           # Signup page with OTP (UPDATED)
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── WelcomePage.jsx      # Welcome page (UPDATED)
│   │   │   └── ...
│   │   └── ...
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── AdminLogin.tsx       # Admin login (UPDATED)
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
├── QUICK_START.md                   # 5-minute quick start guide
├── BACKEND_SETUP.md                 # Detailed backend setup guide
├── SETUP_CHECKLIST.md               # Setup verification checklist
├── SYSTEM_ARCHITECTURE.md           # Visual workflows and architecture
├── IMPLEMENTATION_SUMMARY.md        # What was built
└── README.md                        # This file
```

---

## 🔐 Security Features

✅ **Password Security**
- Bcrypt hashing (10 salt rounds)
- Requirements: 8+ chars, uppercase, lowercase, number, special character

✅ **OTP Security**
- 6-digit random code
- Hashed before storage (bcrypt)
- 10-minute expiration (auto-delete from DB)
- Tamper-proof verification

✅ **Token Security**
- JWT with configurable secret
- 7-day expiration (configurable)
- Stored in localStorage
- Can be invalidated server-side

✅ **Data Protection**
- MongoDB unique indexes on email/phone
- All passwords hashed (never stored plain)
- OTP hashed before storage
- Validation on all inputs

---

## 📊 Key Files & Changes

### New Backend Files Created
| File | Purpose |
|------|---------|
| `backend/src/index.js` | Express server & MongoDB connection |
| `backend/src/models/User.js` | User schema (name, email, phone, password hash, role) |
| `backend/src/models/OtpRequest.js` | OTP schema (email, hashed OTP, expiration) |
| `backend/src/routes/auth.js` | All 4 authentication endpoints |
| `backend/src/utils/email.js` | Nodemailer email service |
| `backend/package.json` | Dependencies (express, mongoose, bcrypt, etc.) |
| `backend/.env.example` | Environment variables template |
| `backend/test-api.js` | API test suite |

### Updated Frontend Files
| File | Changes |
|------|---------|
| `src/context/AuthContext.tsx` | Added API methods: `loginWithCredentials()`, `requestOtpForSignup()`, `verifyOtpAndCreateAccount()` |
| `src/customer/pages/Login.tsx` | Integrated `auth.loginWithCredentials()` |
| `src/customer/pages/Signup.tsx` | Integrated OTP flow with backend API calls |
| `src/customer/components/WelcomePage.jsx` | Integrated login/signup with auth context |
| `src/admin/pages/AdminLogin.tsx` | Updated to use new `loginLocal()` method |

### New Documentation Files
| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup guide (start here!) |
| `BACKEND_SETUP.md` | Detailed setup for MongoDB, email, deployment |
| `SETUP_CHECKLIST.md` | Step-by-step verification checklist |
| `SYSTEM_ARCHITECTURE.md` | Visual workflows and database schema |
| `IMPLEMENTATION_SUMMARY.md` | Complete feature list and API reference |
| `backend/README.md` | Backend-specific documentation |

---

## 🔑 Environment Variables Required

Create `backend/.env`:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restom_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_long_random_secret_key_here_min_20_chars
JWT_EXPIRES_IN=7d

# Server
PORT=5000

# Email Service (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Admin Key
ADMIN_KEY=your_secret_admin_key_change_this
```

---

## 📱 API Endpoints

All endpoints return JSON. Use `POST` method unless stated otherwise.

### Authentication Endpoints

#### 1. Request OTP for Signup
**POST** `/api/auth/request-otp`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123!"
}
```

Response (success):
```json
{
  "ok": true,
  "message": "OTP sent to email. Expires in 10 minutes."
}
```

#### 2. Verify OTP & Create Account
**POST** `/api/auth/verify-otp`

Request:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Response (success):
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 3. Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response: (same as verify-otp)

#### 4. Create Admin
**POST** `/api/auth/create-admin`

Request:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "9876543211",
  "password": "AdminPass123!",
  "adminKey": "your_secret_admin_key_here"
}
```

Response:
```json
{
  "ok": true,
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 🧪 Testing

### Automated Test
```powershell
cd backend
node test-api.js
```

This validates:
- Backend connectivity
- OTP request functionality
- Login validation
- Error handling
- Admin creation

### Manual Testing with Postman/Thunder Client
1. Create a new POST request to `http://localhost:5000/api/auth/request-otp`
2. Set body to JSON and send the request
3. Check terminal for mock OTP (if email not configured)
4. Use OTP to test verify endpoint

---

## 📚 Learning Resources

### How to Set Up
1. **Start here:** `QUICK_START.md` (5 minutes)
2. **Deep dive:** `BACKEND_SETUP.md` (detailed setup)
3. **Verify setup:** `SETUP_CHECKLIST.md` (step-by-step)
4. **Understand flow:** `SYSTEM_ARCHITECTURE.md` (visual diagrams)

### Technologies Used
- **Express.js** – Web framework
- **MongoDB** – Database
- **Mongoose** – MongoDB ORM
- **Bcrypt** – Password hashing
- **Nodemailer** – Email service
- **JWT** – Token authentication
- **React** – Frontend framework
- **TypeScript** – Type safety

---

## 🚀 Deployment

### Deploy Backend
```bash
# Option 1: Railway
railway link
railway up

# Option 2: Render
git push (connects to GitHub)

# Option 3: Heroku
heroku create app-name
git push heroku main
```

Set environment variables in deployment dashboard:
- `MONGO_URI` – Production MongoDB URI
- `JWT_SECRET` – Production secret
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` – Email credentials
- `PORT` – Usually 3000 or auto-assigned

### Deploy Frontend
```bash
# Vercel
vercel deploy

# Netlify
netlify deploy --prod
```

Update frontend API URL in `AuthContext.tsx` or `.env`:
```
VITE_API_URL=https://your-backend-url.com
```

---

## 🐛 Troubleshooting

### Can't Connect to MongoDB
```
Error: connect ECONNREFUSED
```
**Fix:**
1. Check MONGO_URI in `.env`
2. Add your IP to MongoDB Atlas whitelist
3. Verify username/password are correct
4. Test connection string separately

### OTP Email Not Received
```
Error: 550 5.7.1 The email account
```
**Fix:**
1. Verify EMAIL_USER and EMAIL_PASS
2. Use Gmail app password (not main password)
3. Enable 2-FA on Gmail account
4. Check spam folder
5. Test SMTP with Postman

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Fix:**
1. Ensure backend is running
2. Frontend should call `http://localhost:5000` exactly
3. Check backend has `cors()` middleware (it does)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Fix (Windows):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📞 Support & Documentation

For detailed help, see:
- **QUICK_START.md** – Get started in 5 minutes
- **BACKEND_SETUP.md** – Complete setup guide with MongoDB, SMTP, deployment
- **SYSTEM_ARCHITECTURE.md** – Flow diagrams and database schema
- **SETUP_CHECKLIST.md** – Troubleshooting guide
- **backend/README.md** – Backend API reference

---

## ✨ What's Next?

### Recommended Enhancements
1. **Refresh tokens** – Keep sessions alive longer
2. **Password reset** – Forgot password flow
3. **Email verification** – Verify email before account creation
4. **Two-factor auth** – Extra security layer
5. **Social login** – Google, Facebook, GitHub OAuth
6. **Rate limiting** – Prevent brute force attacks
7. **User profile** – Update name, phone, address
8. **Admin dashboard** – Manage users and orders

### Production Checklist
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set strong JWT_SECRET (30+ random characters)
- [ ] Configure MongoDB backups
- [ ] Set up error logging (Sentry)
- [ ] Enable monitoring (database, API)
- [ ] Create admin accounts
- [ ] Test email delivery
- [ ] Load testing (check scalability)

---

## 🎉 Summary

You now have:

✅ **Complete authentication system** – Signup, login, OTP
✅ **Secure password storage** – Bcrypt hashing
✅ **Email OTP verification** – 6-digit codes
✅ **JWT token management** – Secure sessions
✅ **MongoDB integration** – Scalable database
✅ **Admin account support** – Role-based access
✅ **Production-ready code** – Security best practices
✅ **Full documentation** – Setup guides and API reference
✅ **Type-safe frontend** – TypeScript throughout
✅ **Beautiful UI** – Responsive design

---

## 🚀 Get Started Now!

1. **Read:** `QUICK_START.md` (5 min)
2. **Setup:** Follow the steps (10 min)
3. **Test:** Create an account (2 min)
4. **Deploy:** Take it live (optional)

**Total time to production: ~20 minutes**

---

**Happy coding! Build something amazing! 💪**

Questions? Check the documentation files or check your terminal for error messages.
