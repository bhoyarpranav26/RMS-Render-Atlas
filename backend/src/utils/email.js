const nodemailer = require('nodemailer')

const getTransport = () => {
  const host = process.env.EMAIL_HOST
  const port = process.env.EMAIL_PORT
  const secure = process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465'

  if (!host || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set — emails will not be sent')
    return null
  }

  return nodemailer.createTransport({
    host,
    port: Number(port || 587),
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

/**
 * Send OTP email. Returns true if sent, false if not sent (missing config).
 * Throws on transport errors.
 */
async function sendOtpEmail(to, otp) {
  const transporter = getTransport()
  if (!transporter) {
    // In non-production allow a mock send so dev/testing can continue.
    console.log(`Mock send OTP ${otp} to ${to} (SMTP not configured)`)
    return false
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Your RestoM verification code',
      text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your verification code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
    })

    console.log('OTP email sent:', info.messageId)
    return true
  } catch (err) {
    console.error('Failed to send OTP email:', err && err.message ? err.message : err)
    // bubble up the error to allow callers to decide how to handle
    throw err
  }
}

module.exports = { sendOtpEmail }
