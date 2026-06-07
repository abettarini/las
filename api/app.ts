import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono().basePath('/api')

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:5174',
      'https://tsnlas.netlify.app',
      'https://tsnlastrasigna.it',
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.get('/', (c) => c.json({ status: 'ok', service: 'tsnlas-api' }))

export default app
