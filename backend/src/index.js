require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')

const app = express()

// Configure CORS: prefer explicit FRONTEND_URL in env, otherwise allow all (useful in dev)
const FRONTEND_URL = process.env.FRONTEND_URL || ''
if (FRONTEND_URL) {
  console.log('Configuring CORS to allow frontend origin:', FRONTEND_URL)
  app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true
  }))
} else {
  console.warn('FRONTEND_URL not set — enabling permissive CORS. Set FRONTEND_URL in production.')
  app.use(cors())
}

app.use(express.json())

// Graceful handler for malformed JSON bodies so clients get a helpful 400
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('Malformed JSON body:', err.message)
    return res.status(400).json({ error: 'Invalid JSON payload' })
  }
  // delegate to default error handler
  next(err)
})

const PORT = process.env.PORT || 5000

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI not set — server will still run but DB calls will fail')
    } else {
      await mongoose.connect(process.env.MONGO_URI, {
        // options not required with mongoose v6+
      })
      console.log('Connected to MongoDB')
    }

  // Basic health and informational routes
  app.get('/', (req, res) => res.send('Backend is running successfully 🚀'))
  app.get('/health', (req, res) => res.json({ ok: true }))

  // Simple test endpoint to verify API responses
  app.get('/api/test', (req, res) => res.json({ message: 'API is OK' }))
    app.use('/api/auth', authRoutes)

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
