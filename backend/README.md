# RestoM Backend (Auth + OTP)

This backend provides authentication for the RestoM frontend. Features:

- Signup with email + phone and OTP sent to email
- OTP verification endpoint which creates user after successful OTP
- Login with JWT
- MongoDB (Atlas) via Mongoose

Setup

1. Copy `.env.example` to `.env` and fill in values (MongoDB Atlas URI, SMTP credentials, JWT secret)
2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run in development:

```powershell
npm run dev
```

API Endpoints

- POST /api/auth/request-otp  -> send OTP for signup (body: name,email,phone,password)
- POST /api/auth/verify-otp   -> verify OTP (body: email, otp) -> creates user and returns JWT
- POST /api/auth/login        -> login (body: email, password) -> returns JWT
- POST /api/auth/create-admin -> create admin (body: name,email,phone,password, adminKey)

Read source files in `src/` for implementation details.
