# RestoM Backend Setup Guide

## Overview

This guide walks you through setting up the Node.js backend with MongoDB Atlas, OTP email verification, and JWT authentication.

---

## Prerequisites

- Node.js v14+ and npm
- MongoDB Atlas account (free tier available)
- Email service (Gmail, SendGrid, or any SMTP provider)

---

## Step 1: Set up MongoDB Atlas

### 1.1 Create a MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier is fine)
3. Create an organization and project

### 1.2 Create a Cluster
1. Click "Create a Deployment"
2. Choose Free Tier (`M0`)
3. Select your preferred region
4. Wait for cluster to initialize (5-10 min)

### 1.3 Create Database User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter username (e.g., `restom_user`) and strong password
5. Click **Add User**

### 1.4 Get Connection String
1. Go to **Database** → **Connect**
2. Select **Drivers** (Node.js)
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `restom_db`

Example:
```
mongodb+srv://restom_user:your_password@cluster0.xxxxx.mongodb.net/restom_db?retryWrites=true&w=majority
```

---

## Step 2: Set up Email Service

### Option A: Gmail SMTP (Recommended for Testing)

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select **Mail** and **Windows Computer**
   - Google will generate a 16-character password
   - Copy this password

### Option B: SendGrid (Production)

1. Sign up at https://sendgrid.com
2. Create an API key from the dashboard
3. Use `apikey` as username and your API key as password

### Option C: Other SMTP Providers
- Mailgun, Amazon SES, Brevo, etc.
- Get SMTP host, port, username, and password from provider

---

## Step 3: Configure Backend

### 3.1 Navigate to Backend Folder
```powershell
cd backend
```

### 3.2 Copy Environment Template
```powershell
cp .env.example .env
```

### 3.3 Edit `.env` File

Open `backend/.env` and fill in your values:

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://restom_user:password@cluster0.xxxxx.mongodb.net/restom_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server
PORT=5000

# Email (Gmail SMTP example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password

# Admin creation key (keep secret!)
ADMIN_KEY=your_admin_key_here
```

---

## Step 4: Install Dependencies

```powershell
npm install
```

This installs:
- `express` – web framework
- `mongoose` – MongoDB ORM
- `bcrypt` – password hashing
- `nodemailer` – email sending
- `jsonwebtoken` – JWT tokens
- `cors` – cross-origin requests
- `dotenv` – environment variables
- `validator` – data validation

---

## Step 5: Run Backend

### Development Mode (with auto-reload)
```powershell
npm run dev
```

### Production Mode
```powershell
npm start
```

Expected output:
```
Connected to MongoDB
Server listening on port 5000
```

---

## Step 6: Update Frontend API URL

In your React frontend, set the API URL. Add to your frontend `vite.config.ts` or `package.json`:

### Option A: Using Vite Environment
Edit `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  // ...
  define: {
    'process.env.VITE_API_URL': JSON.stringify('http://localhost:5000'),
  },
})
```

### Option B: Direct in AuthContext
Edit `frontend/src/context/AuthContext.tsx` and change:
```typescript
const API_URL = 'http://localhost:5000'
```

---

## API Endpoints

### 1. Request OTP for Signup
**POST** `/api/auth/request-otp`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "StrongPass123!"
}
```

Response:
```json
{
  "ok": true,
  "message": "OTP sent to email. Expires in 10 minutes."
}
```

### 2. Verify OTP and Create Account
**POST** `/api/auth/verify-otp`

Request body:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

Response:
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

### 3. Login
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

Response:
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

### 4. Create Admin
**POST** `/api/auth/create-admin`

Request body:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "9876543211",
  "password": "AdminPass123!",
  "adminKey": "your_admin_key_here"
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

## Troubleshooting

### MongoDB Connection Error
- Check MONGO_URI is correct
- Verify username/password in connection string
- Ensure MongoDB Atlas has whitelist your IP (or use 0.0.0.0)

### OTP Email Not Sending
- Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS in `.env`
- For Gmail: verify 2-FA is enabled and app password is correct
- For other providers: test SMTP credentials separately

### CORS Error
- Ensure `cors()` is enabled in `backend/src/index.js`
- Frontend should call `http://localhost:5000/api/auth/...`

### JWT Issues
- Regenerate JWT_SECRET (make it longer)
- Ensure token is sent in Authorization header if needed

---

## Testing Locally

### Using Postman/Thunder Client

1. **Request OTP:**
   - POST to `http://localhost:5000/api/auth/request-otp`
   - Body (JSON):
     ```json
     {
       "name": "Test User",
       "email": "testuser@example.com",
       "phone": "9876543210",
       "password": "Password123!"
     }
     ```
   - Check your email for OTP

2. **Verify OTP:**
   - POST to `http://localhost:5000/api/auth/verify-otp`
   - Body (JSON):
     ```json
     {
       "email": "testuser@example.com",
       "otp": "123456"
     }
     ```
   - You'll receive a JWT token

3. **Login:**
   - POST to `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "testuser@example.com",
       "password": "Password123!"
     }
     ```

---

## Production Deployment

### Deploy to Heroku
```powershell
npm install -g heroku
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_secret
heroku config:set EMAIL_HOST=smtp.gmail.com
# ... set other env vars
git push heroku main
```

### Deploy to Railway/Render
1. Push code to GitHub
2. Connect GitHub repo to Railway/Render
3. Add environment variables in dashboard
4. Deploy

---

## Frontend Integration Complete ✅

Your frontend (`Signup.tsx`, `Login.tsx`) is already wired to call these backend endpoints via `AuthContext.tsx`:

- Signup → calls `/api/auth/request-otp` → shows OTP screen → calls `/api/auth/verify-otp` → creates user
- Login → calls `/api/auth/login` → sets JWT token and navigates

---

## Next Steps

1. Start backend: `npm run dev` (in `backend/` folder)
2. Start frontend: `npm run dev` (in root folder)
3. Visit http://localhost:5173 (frontend)
4. Click "Ready to Order" → "Create New Account"
5. Enter details, receive OTP in email, verify, account created!

---

## Support

For issues:
1. Check server logs in terminal
2. Verify `.env` file has all required variables
3. Test API endpoints with Postman
4. Check MongoDB Atlas for data storage

Enjoy! 🚀
