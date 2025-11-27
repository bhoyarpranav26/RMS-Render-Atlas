require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')

const app = express()
app.use(cors())
app.use(express.json())

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

    app.get('/health', (req, res) => res.json({ ok: true }))
    app.use('/api/auth', authRoutes)

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
