const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const User = require('../models/User')
const OtpRequest = require('../models/OtpRequest')
const { sendOtpEmail } = require('../utils/email')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
const OTP_TTL_MINUTES = 10

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

router.post('/request-otp', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !phone || !password) return res.status(400).json({ error: 'Missing fields' })
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email' })

    const existing = await User.findOne({ $or: [{ email }, { phone }] })
    if (existing) return res.status(409).json({ error: 'User with given email or phone already exists' })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpHash = await bcrypt.hash(otp, 10)
    const passwordHash = await bcrypt.hash(password, 10)

    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000)

    // Upsert OTP request for this email (overwrite any previous pending)
    await OtpRequest.findOneAndUpdate(
      { email },
      { email, otpHash, data: { name, phone, passwordHash }, expiresAt, attempts: 0 },
      { upsert: true, new: true }
    )

    // Send OTP via email. sendOtpEmail returns true when sent, false when SMTP not configured.
    try {
      const sent = await sendOtpEmail(email, otp)
      if (!sent) {
        // If SMTP isn't configured, be explicit. In production we fail; in dev we return the OTP for testing.
        if (process.env.NODE_ENV === 'production' || process.env.EMAIL_REQUIRED === 'true') {
          console.error('SMTP not configured; cannot send OTP in production')
          return res.status(500).json({ error: 'Failed to send OTP email. Please contact support.' })
        }

        // Development/testing mode: include OTP in response so the developer can continue testing.
        return res.json({ ok: true, message: 'OTP (mocked) — SMTP not configured. Expires in 10 minutes.', otp })
      }

      return res.json({ ok: true, message: 'OTP sent to email. Expires in 10 minutes.' })
    } catch (err) {
      console.error('Error sending OTP email:', err && err.message ? err.message : err)
      return res.status(500).json({ error: 'Failed to send OTP email' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ error: 'Missing email or otp' })

    const record = await OtpRequest.findOne({ email })
    if (!record) return res.status(400).json({ error: 'No OTP request found or OTP expired' })

    if (record.expiresAt < new Date()) {
      await OtpRequest.deleteOne({ _id: record._id })
      return res.status(400).json({ error: 'OTP expired' })
    }

    const ok = await bcrypt.compare(otp, record.otpHash)
    if (!ok) {
      record.attempts = (record.attempts || 0) + 1
      await record.save()
      return res.status(400).json({ error: 'Invalid OTP' })
    }

    // Create user
    const { name, phone, passwordHash } = record.data
    const existing = await User.findOne({ $or: [{ email }, { phone }] })
    if (existing) {
      await OtpRequest.deleteOne({ _id: record._id })
      return res.status(409).json({ error: 'User already exists' })
    }

    const user = new User({ name, email, phone, passwordHash })
    await user.save()

    await OtpRequest.deleteOne({ _id: record._id })

    const token = signToken(user)
    return res.json({ ok: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })

    const token = signToken(user)
    return res.json({ ok: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Create admin (protected with ADMIN_KEY env variable)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, phone, password, adminKey } = req.body
    if (adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Invalid admin key' })
    if (!name || !email || !phone || !password) return res.status(400).json({ error: 'Missing fields' })

    const existing = await User.findOne({ $or: [{ email }, { phone }] })
    if (existing) return res.status(409).json({ error: 'User exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ name, email, phone, passwordHash, role: 'admin' })
    await user.save()

    return res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
