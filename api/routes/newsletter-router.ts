import { Hono } from 'hono'
import { isSubscribed, subscribe, unsubscribe } from '../services/newsletter-service.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const newsletterRouter = new Hono()

newsletterRouter.get('/newsletter/status', async (c) => {
  const email = c.req.query('email')
  if (!email || !EMAIL_RE.test(email)) {
    return c.json({ success: false, message: 'Email non valida' }, 400)
  }
  const subscribed = await isSubscribed(email)
  return c.json({ success: true, subscribed })
})

newsletterRouter.post('/newsletter/subscribe', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body?.email || !EMAIL_RE.test(body.email)) {
    return c.json({ success: false, message: 'Email non valida' }, 400)
  }
  const result = await subscribe(body.email)
  return c.json({ success: true, result })
})

newsletterRouter.delete('/newsletter/unsubscribe', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body?.email || !EMAIL_RE.test(body.email)) {
    return c.json({ success: false, message: 'Email non valida' }, 400)
  }
  const result = await unsubscribe(body.email)
  if (result === 'not_found') {
    return c.json({ success: false, message: 'Email non trovata o già disiscitta' }, 404)
  }
  return c.json({ success: true, result })
})

export default newsletterRouter
