import type { Context, Next } from 'hono'
import { hasRole, verifyAuthToken } from '../services/user-service.js'

function getJwtEnv() {
  return {
    JWT_SECRET: process.env.JWT_SECRET!,
    EMAIL_SECRET: process.env.EMAIL_SECRET!,
  }
}

export async function isAuthenticated(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, message: "Accesso negato: è necessario effettuare l'accesso" }, 401)
  }
  const token = authHeader.substring(7)
  const user = await verifyAuthToken(token, getJwtEnv())
  if (!user) {
    return c.json({ success: false, message: 'Accesso negato: token non valido o scaduto' }, 401)
  }
  c.set('user', user)
  return next()
}

export async function isAdmin(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Token mancante o non valido' }, 401)
  }
  const token = authHeader.substring(7)
  const user = await verifyAuthToken(token, getJwtEnv())
  if (!user) {
    return c.json({ success: false, message: 'Token non valido' }, 401)
  }
  if (!hasRole(user, 'ROLE_ADMIN')) {
    return c.json({ success: false, message: 'Accesso negato: richiesti privilegi di amministratore' }, 403)
  }
  c.set('user', user)
  return next()
}
