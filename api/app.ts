import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from './routes/auth-router.js'
import bookingRouter from './routes/booking-router.js'
import adminRouter from './routes/admin-router.js'
import { turniRouter } from './routes/turni-router.js'
import contentRouter from './routes/content-router.js'
import newsletterRouter from './routes/newsletter-router.js'

const app = new Hono().basePath('/api')

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5174',
      'https://tsnlas.netlify.app',
      'https://tsnlastrasigna.it',
      'https://www.tsnlastrasigna.it',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.get('/', (c) => c.json({ status: 'ok', service: 'tsnlas-api' }))

app.route('/', authRouter)
app.route('/', bookingRouter)
app.route('/', adminRouter)
app.route('/turni', turniRouter)
app.route('/', contentRouter)
app.route('/', newsletterRouter)

export default app
