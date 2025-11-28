# 🎯 Quick Reference Card

Keep this handy while setting up your system.

---

## 📦 Installation Commands

```powershell
# Backend setup
cd backend
npm install

# Frontend setup (in root)
npm install

# Run development
npm run dev (in each folder separately)

# Run tests
cd backend
node test-api.js
```

---

## 🔑 Environment Variables (.env)

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/restom_db
JWT_SECRET=your_random_secret_30_chars_long
JWT_EXPIRES_IN=7d
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app_password_16_chars
ADMIN_KEY=secret_admin_key
```

---

## 📍 URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Health | http://localhost:5000/health |

---

## 📞 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/request-otp` | POST | Send OTP for signup |
| `/api/auth/verify-otp` | POST | Verify OTP and create user |
| `/api/auth/login` | POST | Login with email/password |
| `/api/auth/create-admin` | POST | Create admin account |

---

## 🧪 Test Payload Examples

### Request OTP
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "Pass123!@"
}
```

### Verify OTP
```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

### Login
```json
{
  "email": "test@example.com",
  "password": "Pass123!@"
}
```

### Create Admin
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "phone": "9876543211",
  "password": "AdminPass123!@",
  "adminKey": "your_admin_key"
}
```

---

## 📊 Database Collections

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,        // unique
  phone: String,        // unique
  passwordHash: String, // bcrypt
  role: String,         // 'user', 'admin', 'superadmin'
  createdAt: Date
}
```

### otprequests
```javascript
{
  _id: ObjectId,
  email: String,        // indexed
  otpHash: String,      // bcrypt
  data: Object,         // {name, phone, passwordHash}
  expiresAt: Date,      // TTL index - auto-deletes
  attempts: Number,
  createdAt: Date
}
```

---

## 🔐 Password Requirements

✅ **Valid password examples:**
- `Test123!@`
- `MyPassword456#`
- `SecurePass789$`

❌ **Invalid:**
- `test123` (no uppercase, no special char)
- `Test!@` (too short)
- `TestPass` (no number, no special char)

---

## ☎️ Phone Number Format

✅ **Valid (Indian):**
- `9876543210` (10 digits, starts with 6-9)
- `8765432109`
- `7654321098`

❌ **Invalid:**
- `5876543210` (starts with 5)
- `98765432` (too short)
- `abc7654321` (letters)

---

## 📧 Email Setup

### Gmail
1. Enable 2-FA: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use 16-char app password (not main password)

### Other Providers
- **Mailgun**: host=smtp.mailgun.org, port=587
- **SendGrid**: host=smtp.sendgrid.net, port=587
- **Brevo**: host=smtp-relay.brevo.com, port=587

---

## 🚀 Port Conflicts

| Port | Service |
|------|---------|
| 3000 | Usually Node.js |
| 5000 | Backend (this project) |
| 5173 | Frontend (Vite) |
| 27017 | MongoDB (if local) |

Kill process on specific port (Windows):
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🆘 Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` | Backend not running |
| `CORS error` | Check API URL is `localhost:5000` |
| `MongooseError` | Check MongoDB URI, whitelist IP |
| `SMTP error` | Check email credentials |
| `Invalid OTP` | OTP expired or incorrect |
| `Port already in use` | Kill process on that port |
| `Module not found` | Run `npm install` |
| `ENOENT .env` | Copy `.env.example` to `.env` |

---

## 📋 Setup Checklist (Summary)

- [ ] Node.js v14+ installed
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Gmail app password generated
- [ ] `backend/.env` created and filled
- [ ] `npm install` run in backend
- [ ] `npm install` run in root
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can reach http://localhost:5173
- [ ] Signup flow works end-to-end
- [ ] Can login with credentials

---

## 📁 File Structure Quick View

```
RestoM-Frontend/
├── backend/src/
│   ├── index.js                (server)
│   ├── models/User.js          (user schema)
│   ├── models/OtpRequest.js    (otp schema)
│   ├── routes/auth.js          (endpoints)
│   └── utils/email.js          (email service)
├── src/
│   ├── context/AuthContext.tsx (state + API)
│   ├── customer/pages/
│   │   ├── Login.tsx           (login UI)
│   │   ├── Signup.tsx          (signup UI)
│   │   └── ...
│   └── ...
├── QUICK_START.md
├── BACKEND_SETUP.md
└── ...
```

---

## 🎓 Quick Learning

- **Frontend state**: `src/context/AuthContext.tsx`
- **Backend routes**: `backend/src/routes/auth.js`
- **Database models**: `backend/src/models/`
- **Email service**: `backend/src/utils/email.js`
- **Configuration**: `backend/.env`

---

## ⚡ Performance Tips

- MongoDB indexes already configured
- OTP expires in 10 minutes (TTL)
- JWT expires in 7 days (adjustable)
- Email async (non-blocking)
- Bcrypt 10 rounds (secure, reasonable speed)

---

## 🔒 Security Checklist

- [ ] Never commit `.env` to git
- [ ] Use strong JWT_SECRET (30+ chars)
- [ ] Use app password for Gmail (not main password)
- [ ] Whitelist specific IPs if possible (else use 0.0.0.0)
- [ ] Never log passwords/tokens
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Regenerate secrets periodically

---

## 📱 Frontend Integration Summary

| Component | File | Changes |
|-----------|------|---------|
| Auth logic | `AuthContext.tsx` | Added API methods |
| Signup UI | `Signup.tsx` | Calls `requestOtpForSignup()` & `verifyOtpAndCreateAccount()` |
| Login UI | `Login.tsx` | Calls `loginWithCredentials()` |
| Welcome | `WelcomePage.jsx` | Routes to API methods |
| Admin | `AdminLogin.tsx` | Uses `loginLocal()` |

---

## 🚀 Production Steps

1. **Frontend**: Deploy to Vercel (git connect)
2. **Backend**: Deploy to Railway/Render (git connect)
3. **Set env vars** in deployment dashboard
4. **Update API URL** in frontend (prod backend URL)
5. **Test** login/signup flow on production
6. **Monitor** for errors using dashboard

---

## 💡 Tips & Tricks

- Use Thunder Client (VS Code extension) for testing API
- Check MongoDB directly in Atlas web UI
- Use `console.log()` in auth.js to debug
- OTP is logged in backend console (dev mode)
- LocalStorage stores auth data in browser
- JWT decoded at: https://jwt.io

---

## 📞 Support Resources

- **MongoDB docs**: https://docs.mongodb.com
- **Express docs**: https://expressjs.com
- **Nodemailer docs**: https://nodemailer.com
- **JWT info**: https://jwt.io
- **Bcrypt info**: https://www.npmjs.com/package/bcrypt
- **React docs**: https://react.dev

---

**Keep this card nearby during setup! 📌**
