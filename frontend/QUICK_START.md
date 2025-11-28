# QUICK START - Backend + Frontend Authentication

## 🚀 Get Started in 5 Minutes

### 1. Backend Setup

```powershell
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install
```

Edit `backend/.env` and add:
```
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=your_random_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password_here
ADMIN_KEY=secret_admin_key_here
PORT=5000
```

Start backend:
```powershell
npm run dev
```

✅ Backend running on http://localhost:5000

---

### 2. Frontend Setup

```powershell
# In root folder
npm install
npm run dev
```

✅ Frontend running on http://localhost:5173

---

### 3. Test Authentication Flow

1. Open http://localhost:5173 in browser
2. Click **"Ready to Order"** button
3. Click **"Create New Account"**
4. Fill in:
   - Name: John Doe
   - Email: your_email@gmail.com
   - Phone: 9876543210
   - Password: Test123!@
   - Confirm: Test123!@
5. Click **"Create Account"**
6. **Check your email for OTP** (6-digit code)
7. Enter OTP in the modal
8. ✅ Account created! Redirected to menu

---

## 📊 Features Implemented

### Frontend
- ✅ Signup with email/phone/password
- ✅ OTP verification flow (email-based)
- ✅ Login with JWT
- ✅ Admin login (demo mode preserved)
- ✅ AuthContext with token management
- ✅ Protected routes with token

### Backend (Node.js + Express + MongoDB)
- ✅ `/api/auth/request-otp` – Send OTP to email
- ✅ `/api/auth/verify-otp` – Create user after OTP match
- ✅ `/api/auth/login` – Login with email/password
- ✅ `/api/auth/create-admin` – Create admin users
- ✅ MongoDB connection via Mongoose
- ✅ Password hashing with bcrypt
- ✅ JWT token generation
- ✅ Email service via Nodemailer

---

## 📁 Project Structure

```
RestoM-Frontend/
├── backend/
│   ├── src/
│   │   ├── index.js              # Server entry point
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   └── OtpRequest.js     # OTP storage
│   │   ├── routes/
│   │   │   └── auth.js           # All auth endpoints
│   │   └── utils/
│   │       └── email.js          # Email service
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── src/
│   ├── context/
│   │   └── AuthContext.tsx       # Updated with API calls
│   ├── customer/
│   │   ├── pages/
│   │   │   ├── Login.tsx         # Updated to use backend
│   │   │   ├── Signup.tsx        # Updated to use backend
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── WelcomePage.jsx   # Updated to use backend
│   │   │   └── ...
│   │   └── ...
│   ├── admin/
│   │   ├── pages/
│   │   │   └── AdminLogin.tsx    # Updated
│   │   └── ...
│   └── ...
└── BACKEND_SETUP.md              # Detailed setup guide
```

---

## 🔐 How It Works

### Signup Flow

```
User fills form (name, email, phone, password)
↓
Frontend: calls /api/auth/request-otp
↓
Backend: generates OTP, hashes it, sends email, saves in DB
↓
Frontend: shows OTP input screen
↓
User enters OTP from email
↓
Frontend: calls /api/auth/verify-otp
↓
Backend: checks OTP match, creates user, returns JWT
↓
Frontend: saves JWT in localStorage, user logged in ✅
```

### Login Flow

```
User enters email/password
↓
Frontend: calls /api/auth/login
↓
Backend: finds user, checks password hash, returns JWT
↓
Frontend: saves JWT, user logged in ✅
```

---

## 🔑 Authentication Details

### JWT Token
- Stored in localStorage (key: `auth`)
- Includes: `id`, `email`, `role`
- Expires in 7 days (configurable)
- Sent to backend in requests (Authorization header if needed)

### Password Security
- Hashed with bcrypt (salt rounds: 10)
- Never stored in plain text
- Min 8 chars, uppercase, lowercase, number, special char required

### OTP Security
- 6-digit code
- Expires in 10 minutes
- Hashed before storage
- Limited to 1 per email at a time

---

## 🛠️ Environment Variables Needed

Create `backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/restom_db

# JWT
JWT_SECRET=your_long_random_string_here_make_it_unique
JWT_EXPIRES_IN=7d

# Server
PORT=5000

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Admin
ADMIN_KEY=your_secret_admin_key
```

---

## 📞 API Endpoints Reference

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/request-otp` | `{name, email, phone, password}` | `{ok, message}` |
| POST | `/api/auth/verify-otp` | `{email, otp}` | `{ok, token, user}` |
| POST | `/api/auth/login` | `{email, password}` | `{ok, token, user}` |
| POST | `/api/auth/create-admin` | `{name, email, phone, password, adminKey}` | `{ok, user}` |

---

## ✅ Verification Checklist

- [ ] Backend installed dependencies (`npm install` in `backend/`)
- [ ] `.env` file created with MongoDB URI
- [ ] `.env` file has email credentials
- [ ] Backend running (`npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Signup flow shows OTP screen
- [ ] OTP received in email inbox
- [ ] Account created after OTP verification
- [ ] Can login with credentials

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| MongoDB connection error | Check MONGO_URI, add IP to Atlas whitelist |
| OTP email not received | Verify EMAIL credentials, check spam folder |
| CORS error | Frontend should use http://localhost:5000 |
| Token not persisting | Check localStorage, clear browser cache |
| Admin login not working | Demo mode works, use admin/admin123 |

---

## 📚 Full Setup Guide

See `BACKEND_SETUP.md` for detailed instructions on:
- MongoDB Atlas setup
- Gmail app password creation
- Production deployment
- Troubleshooting

---

## 🎉 Done!

You now have a fully functional authentication system with:
- ✅ Signup with email OTP verification
- ✅ User data in MongoDB
- ✅ Secure JWT tokens
- ✅ Login functionality
- ✅ Admin accounts
- ✅ Production-ready backend

Happy coding! 🚀
