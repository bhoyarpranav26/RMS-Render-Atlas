# System Architecture & Workflows

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
└────────────────┬────────────────────────────────────┬────────┘
                 │                                    │
          Browser/Mobile                         Browser/Mobile
                 │                                    │
┌────────────────▼──────────────────────────────────▼─────────┐
│                    REACT FRONTEND                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ AuthContext.tsx                                      │  │
│  │ - loginWithCredentials(email, password)             │  │
│  │ - requestOtpForSignup(name, email, phone, pass)     │  │
│  │ - verifyOtpAndCreateAccount(email, otp)            │  │
│  │ - JWT token management                              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages: Login.tsx, Signup.tsx, WelcomePage.jsx       │  │
│  │ - UI components integrated with AuthContext         │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────┬──────────────────────────────────┬─────────┘
                 │                                  │
          HTTP Requests (JSON)                     JWT Tokens
                 │                                  │
          ┌──────▼──────────────────────────┐      │
          │  http://localhost:5000          │◄─────┘
          └──────┬──────────────────────────┘
                 │
      ┌──────────▼──────────────┐
      │  EXPRESS.JS BACKEND     │
      │  ┌────────────────────┐ │
      │  │ Routes: auth.js    │ │
      │  │ - request-otp      │ │
      │  │ - verify-otp       │ │
      │  │ - login            │ │
      │  │ - create-admin     │ │
      │  └────────────────────┘ │
      │  ┌────────────────────┐ │
      │  │ Models: Mongoose   │ │
      │  │ - User.js          │ │
      │  │ - OtpRequest.js    │ │
      │  └────────────────────┘ │
      │  ┌────────────────────┐ │
      │  │ Utils              │ │
      │  │ - email.js         │ │
      │  └────────────────────┘ │
      └──────────┬──────────────┘
                 │
        ┌────────┴────────┬─────────────┐
        │                 │             │
        ▼                 ▼             ▼
   MongoDB Atlas     Nodemailer      JWT Token
   (restom_db)      (SMTP Server)    (Generated)
        │                 │
        │          ┌──────▼──────┐
        │          │    Email    │
        │          │   INBOX     │
        │          │  (OTP Code) │
        │          └─────────────┘
        │
   ┌────▼────────────────────────┐
   │  User Collection            │
   │  - id                       │
   │  - name                     │
   │  - email                    │
   │  - phone                    │
   │  - passwordHash             │
   │  - role (user/admin)        │
   └─────────────────────────────┘
```

---

## 📋 Signup Flow (Detailed)

```
START: User visits WelcomePage
  │
  ├─> Clicks "Ready to Order"
  │   │
  │   └─> Modal opens with Login/Signup options
  │
  ├─> Clicks "Create New Account"
  │   │
  │   └─> Signup component loads
  │
  ├─> Fills Form:
  │   ├─ Name: "John Doe"
  │   ├─ Email: "john@example.com"
  │   ├─ Phone: "9876543210"
  │   ├─ Password: "Secure123!"
  │   └─ Confirm: "Secure123!"
  │
  ├─> Clicks "Create Account"
  │   │
  │   ├─ Frontend validates form
  │   │  ├─ Email format check
  │   │  ├─ Password strength check
  │   │  ├─ Phone format check
  │   │  └─ All fields filled
  │   │
  │   └─> Calls: auth.requestOtpForSignup()
  │       │
  │       ├─> HTTP POST /api/auth/request-otp
  │       │   {
  │       │     "name": "John Doe",
  │       │     "email": "john@example.com",
  │       │     "phone": "9876543210",
  │       │     "password": "Secure123!"
  │       │   }
  │       │
  │       ├─> Backend receives request
  │       │   │
  │       │   ├─ Validate all fields
  │       │   ├─ Check if email/phone already exists
  │       │   ├─ Generate OTP: "123456"
  │       │   ├─ Hash OTP with bcrypt
  │       │   ├─ Hash password with bcrypt
  │       │   ├─ Save OtpRequest to MongoDB:
  │       │   │  {
  │       │   │    "email": "john@example.com",
  │       │   │    "otpHash": "$2b$10$...",
  │       │   │    "data": {
  │       │   │      "name": "John Doe",
  │       │   │      "phone": "9876543210",
  │       │   │      "passwordHash": "$2b$10$..."
  │       │   │    },
  │       │   │    "expiresAt": "2024-01-01T10:10:00Z",
  │       │   │    "attempts": 0
  │       │   │  }
  │       │   ├─ Send email with OTP via Nodemailer
  │       │   └─ Return success response
  │       │
  │       └─> Frontend receives: {ok: true, message: "OTP sent..."}
  │
  ├─> Frontend shows OTP verification screen
  │   │
  │   ├─ Shows: "We've sent a 6-digit code to john@example.com"
  │   ├─ Shows: 6 input fields for OTP digits
  │   ├─ Shows: "Resend in 30s" timer
  │   └─ Shows: "Verify & Complete Signup" button
  │
  ├─> User checks email inbox
  │   │
  │   └─> Gets email: "Your verification code is 123456. It will expire in 10 minutes."
  │
  ├─> User enters OTP: "123456"
  │   │
  │   ├─ Frontend auto-focuses between digit inputs
  │   ├─ User enters all 6 digits
  │   │
  │   └─> Clicks "Verify & Complete Signup"
  │       │
  │       └─> Calls: auth.verifyOtpAndCreateAccount()
  │           │
  │           ├─> HTTP POST /api/auth/verify-otp
  │           │   {
  │           │     "email": "john@example.com",
  │           │     "otp": "123456"
  │           │   }
  │           │
  │           ├─> Backend receives request
  │           │   │
  │           │   ├─ Find OtpRequest by email
  │           │   ├─ Check if OTP is expired
  │           │   ├─ Compare provided OTP with stored hash using bcrypt
  │           │   │
  │           │   ├─ IF OTP matches:
  │           │   │  ├─ Retrieve stored data (name, phone, passwordHash)
  │           │   │  ├─ Create new User document:
  │           │   │  │  {
  │           │   │  │    "name": "John Doe",
  │           │   │  │    "email": "john@example.com",
  │           │   │  │    "phone": "9876543210",
  │           │   │  │    "passwordHash": "$2b$10$...",
  │           │   │  │    "role": "user",
  │           │   │  │    "createdAt": "2024-01-01T10:00:00Z"
  │           │   │  │  }
  │           │   │  ├─ Delete OtpRequest from DB
  │           │   │  ├─ Generate JWT token:
  │           │   │  │  payload: {id, email, role}
  │           │   │  │  expires: 7 days
  │           │   │  └─ Return: {ok: true, token: "...", user: {...}}
  │           │   │
  │           │   └─ ELSE (OTP doesn't match):
  │           │      ├─ Increment attempts counter
  │           │      └─ Return error
  │           │
  │           └─> Frontend receives: {ok: true, token: "eyJ...", user: {id, name, email, role}}
  │
  ├─> Frontend saves to localStorage:
  │   └─ localStorage.setItem('auth', {user: {...}, token: "eyJ..."})
  │
  ├─> Frontend calls onSignup() callback
  │   │
  │   └─> WelcomePage closes modal and navigates to /Category
  │
  └─> END: User logged in and viewing menu ✅
```

---

## 📋 Login Flow (Detailed)

```
START: User visits WelcomePage
  │
  ├─> Clicks "Ready to Order"
  │   └─> Modal opens with Login/Signup options (Login is default)
  │
  ├─> Fills Form:
  │   ├─ Email: "john@example.com"
  │   └─ Password: "Secure123!"
  │
  ├─> Clicks "Sign In"
  │   │
  │   ├─ Frontend validates form
  │   │  ├─ Email is not empty
  │   │  ├─ Password is not empty
  │   │  └─ No validation errors
  │   │
  │   └─> Calls: auth.loginWithCredentials(email, password)
  │       │
  │       ├─> HTTP POST /api/auth/login
  │       │   {
  │       │     "email": "john@example.com",
  │       │     "password": "Secure123!"
  │       │   }
  │       │
  │       ├─> Backend receives request
  │       │   │
  │       │   ├─ Find user by email in MongoDB
  │       │   │
  │       │   ├─ IF user not found:
  │       │   │  └─ Return: {error: "Invalid credentials"}
  │       │   │
  │       │   └─ IF user found:
  │       │      ├─ Compare provided password with stored passwordHash using bcrypt
  │       │      │
  │       │      ├─ IF password matches:
  │       │      │  ├─ Generate JWT token:
  │       │      │  │  payload: {id, email, role}
  │       │      │  │  expires: 7 days
  │       │      │  └─ Return: {ok: true, token: "...", user: {...}}
  │       │      │
  │       │      └─ ELSE (password doesn't match):
  │       │         └─ Return: {error: "Invalid credentials"}
  │       │
  │       └─> Frontend receives response
  │           │
  │           ├─ IF ok === true:
  │           │  ├─ Save to localStorage: {user, token}
  │           │  ├─ Update AuthContext state
  │           │  └─ Navigate to /Category
  │           │
  │           └─ ELSE (error):
  │              └─ Show error message to user
  │
  └─> END: User logged in ✅
```

---

## 📱 State Management (AuthContext)

```
┌─────────────────────────────────────────────┐
│         React Context: AuthContext          │
├─────────────────────────────────────────────┤
│                                             │
│  STATE:                                     │
│  ├─ user: User | null                       │
│  │  └─ {id, name, email, role, ...}         │
│  │                                          │
│  └─ token: string | null                    │
│     └─ JWT token (7 day expiry)             │
│                                             │
│  METHODS:                                   │
│  ├─ loginLocal(user, token)                 │
│  │  ├─ Set state                            │
│  │  └─ Save to localStorage                 │
│  │                                          │
│  ├─ logout()                                │
│  │  ├─ Clear state                          │
│  │  └─ Clear localStorage                   │
│  │                                          │
│  ├─ updateUser(data)                        │
│  │  ├─ Update user object                   │
│  │  └─ Persist to storage                   │
│  │                                          │
│  ├─ loginWithCredentials(email, pass)       │
│  │  ├─ POST /api/auth/login                 │
│  │  ├─ On success: loginLocal()             │
│  │  └─ Return: {ok, error}                  │
│  │                                          │
│  ├─ requestOtpForSignup(payload)            │
│  │  ├─ POST /api/auth/request-otp           │
│  │  └─ Return: {ok, error}                  │
│  │                                          │
│  └─ verifyOtpAndCreateAccount(email, otp)   │
│     ├─ POST /api/auth/verify-otp            │
│     ├─ On success: loginLocal()             │
│     └─ Return: {ok, error}                  │
│                                             │
│  PERSISTENCE:                               │
│  └─ localStorage key: 'auth'                │
│     └─ Stores: {user, token}                │
│        └─ Loaded on app mount              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```
┌──────────────────────────────────────┐
│         MongoDB Database             │
│           (restom_db)                │
│                                      │
│  Collections:                        │
│  ├─ users                            │
│  ├─ otprequests                      │
│  └─ [other collections...]           │
│                                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│          users Collection                               │
├────────────────────────────────────────────────────────┤
│ Document Example:                                       │
│ {                                                       │
│   "_id": ObjectId("507f1f77bcf86cd799439011"),         │
│   "name": "John Doe",                                   │
│   "email": "john@example.com",         (unique, index) │
│   "phone": "9876543210",               (unique)        │
│   "passwordHash": "$2b$10$...",        (bcrypt)        │
│   "role": "user",                      (enum)          │
│   "createdAt": ISODate("2024-01-01")                   │
│ }                                                       │
│                                                         │
│ Indexes:                                                │
│ ├─ email (unique)                                       │
│ ├─ phone (unique)                                       │
│ └─ createdAt                                            │
└────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│       otprequests Collection                            │
├────────────────────────────────────────────────────────┤
│ Document Example:                                       │
│ {                                                       │
│   "_id": ObjectId("507f1f77bcf86cd799439012"),         │
│   "email": "john@example.com",         (indexed)       │
│   "otpHash": "$2b$10$...",             (bcrypt)        │
│   "data": {                                             │
│     "name": "John Doe",                                 │
│     "phone": "9876543210",                              │
│     "passwordHash": "$2b$10$..."                        │
│   },                                                    │
│   "expiresAt": ISODate("2024-01-01T10:10:00Z"),        │
│   "attempts": 0,                                        │
│   "createdAt": ISODate("2024-01-01T10:00:00Z")         │
│ }                                                       │
│                                                         │
│ Indexes:                                                │
│ ├─ email (indexed for quick lookup)                     │
│ ├─ expiresAt (TTL index - auto-delete after expiry)    │
│ └─ createdAt                                            │
│                                                         │
│ Auto-deletion: Documents expire and delete after       │
│ expiresAt timestamp (MongoDB TTL index feature)        │
└────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

```
PASSWORD INPUT
  │
  ├─> Frontend: Plain text password
  │   ├─ Sent over HTTPS (in production)
  │   └─ Validation: min 8 chars, uppercase, lowercase, number, special
  │
  └─> Backend receives
      │
      ├─> Signup:
      │   ├─ Input: password (plain text)
      │   ├─ Hash with bcrypt (10 rounds): $2b$10$...
      │   └─ Store hash in database
      │
      └─> Login:
          ├─ Input: password (plain text)
          ├─ Retrieve hash from database
          ├─ Compare input with hash using bcrypt
          └─ Match = token generated

OTP FLOW
  │
  ├─> Backend generates: 123456 (6-digit random)
  │   │
  │   ├─> Display to user in logs (dev only) for testing
  │   ├─ Hash with bcrypt: $2b$10$...
  │   ├─ Store hash in database
  │   └─ Send plain text in email to user
  │
  └─> User submits OTP
      │
      ├─ Input: 123456
      ├─ Compare with stored hash using bcrypt
      └─ Match = account created + token generated

JWT TOKEN
  │
  ├─> Generated after successful login/signup
  │   │
  │   ├─ Payload: {id, email, role}
  │   ├─ Signed with: JWT_SECRET (from env)
  │   ├─ Expires: 7 days
  │   └─ Format: eyJ... (3 parts separated by dots)
  │
  └─> Frontend storage
      │
      ├─ Stored in localStorage (key: 'auth')
      ├─ Included in API requests (if needed)
      └─ Can be verified by backend using same secret
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│            Production Environment                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────┐                             │
│  │  Frontend (Vercel)     │                             │
│  │  ├─ React app          │                             │
│  │  ├─ Built JS/HTML/CSS  │                             │
│  │  └─ CDN delivery       │                             │
│  └────────────┬───────────┘                             │
│               │                                         │
│               │ HTTPS Requests                          │
│               │                                         │
│  ┌────────────▼───────────┐                             │
│  │  Backend (Railway)     │                             │
│  │  ├─ Node.js + Express  │                             │
│  │  ├─ Environment vars   │                             │
│  │  └─ API endpoints      │                             │
│  └────────────┬───────────┘                             │
│               │                                         │
│      ┌────────┴────────┬──────────────┐                 │
│      │                 │              │                 │
│      ▼                 ▼              ▼                 │
│  MongoDB         SendGrid SMTP    Monitoring          │
│  (Atlas)          (Email)          (Sentry)           │
│      │                 │              │                 │
│  Database          Email Service   Error Tracking     │
│                                                        │
└─────────────────────────────────────────────────────────┘
```

---

This complete system ensures:
✅ Secure signup with email verification
✅ Persistent authentication across sessions
✅ Production-ready backend
✅ Scalable database
✅ Reliable email delivery
✅ Token-based authorization
