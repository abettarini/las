import { Hono } from 'hono'
import { isAuthenticated } from '../middleware/auth.js'
import type { UserData } from '../services/user-service.js'
import {
  createBooking, deleteBooking, getAllBookings, getBooking,
  getUserBookings, updateBooking, verifyBookingSecret,
} from '../services/booking-service.js'
import { checkTimeAvailability } from '../services/availability-service.js'
import { generateICalFeed } from '../services/ical-service.js'
import {
  sendBookingCancellationEmail,
  sendBookingConfirmationEmail,
  sendBookingUpdateEmail,
} from '../services/email-service.js'
import { verifyJWT } from '../services/jwt-service.js'
import { getUserById, updateUserProfile } from '../services/user-service.js'

type BookingVariables = { user: UserData }
const bookingRouter = new Hono<{ Variables: BookingVariables }>()

function getEnv() {
  return {
    JWT_SECRET: process.env.JWT_SECRET!,
    EMAIL_SECRET: process.env.EMAIL_SECRET!,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL!,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
  }
}

async function verifyTurnstileToken(token: string, secretKey: string, ip: string): Promise<boolean> {
  const formData = new FormData()
  formData.append('secret', secretKey)
  formData.append('response', token)
  formData.append('remoteip', ip)
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: formData })
  const outcome = await result.json() as { success: boolean }
  return outcome.success
}

// POST /booking
bookingRouter.post('/booking', async (c) => {
  try {
    const data = await c.req.json() as {
      eventType: string; name: string; surname: string; email: string; phone: string
      date: string; time: string; privacyConsent: boolean; website?: string
      cfTurnstileResponse: string; seasonId: string
    }
    const clientIP = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? '0.0.0.0'
    const env = getEnv()

    if (data.website && data.website.length > 0) {
      return c.json({ success: true, message: 'Prenotazione ricevuta' })
    }

    const isTokenValid = await verifyTurnstileToken(data.cfTurnstileResponse, env.TURNSTILE_SECRET_KEY, clientIP)
    if (!isTokenValid) return c.json({ success: false, message: 'Verifica di sicurezza fallita' }, 400)

    if (!data.eventType || !data.name || !data.surname || !data.email ||
        !data.phone || !data.date || !data.time || !data.privacyConsent) {
      return c.json({ success: false, message: 'Dati mancanti o non validi' }, 400)
    }

    const [year, month, day] = data.date.split('-').map(Number)
    const [hour, minute] = data.time.split(':').map(Number)
    const startDate = new Date(year, month - 1, day, hour, minute)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

    const isAvailable = await checkTimeAvailability(startDate, endDate, undefined, data.eventType)
    if (!isAvailable) {
      return c.json({ success: false, message: "L'orario selezionato non è più disponibile. Seleziona un altro orario." }, 409)
    }

    const booking = await createBooking({
      eventType: data.eventType, name: data.name, surname: data.surname,
      email: data.email, phone: data.phone, date: data.date, time: data.time,
      seasonId: data.seasonId ?? '', status: 'pending',
    })

    await sendBookingConfirmationEmail(booking, env)

    const authHeader = c.req.header('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = await verifyJWT(authHeader.substring(7), env)
        if (payload?.sub) {
          const user = await getUserById(payload.sub)
          if (user && !user.privacyConsent && data.privacyConsent) {
            await updateUserProfile(user.id, { privacyConsent: true })
          }
        }
      } catch { /* do not block main flow */ }
    }

    const frontendUrl = env.FRONTEND_URL || new URL(c.req.url).origin
    return c.json({
      success: true,
      message: 'Prenotazione creata con successo',
      bookingId: booking.id,
      cancelSecret: booking.cancelSecret,
      cancelUrl: `${frontendUrl}/annulla-prenotazione/${booking.id}`,
    }, 201)
  } catch (error) {
    console.error('Errore creazione prenotazione:', error)
    return c.json({ success: false, message: "Errore durante l'elaborazione della prenotazione" }, 500)
  }
})

// GET /booking/:id
bookingRouter.get('/booking/:id', async (c) => {
  try {
    const booking = await getBooking(c.req.param('id'))
    if (!booking) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)

    const authHeader = c.req.header('Authorization')
    let authenticated = false
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = await verifyJWT(authHeader.substring(7), getEnv())
        authenticated = !!payload?.sub
      } catch { /* unauthenticated */ }
    }

    if (authenticated) return c.json({ success: true, booking })
    const { cancelSecret, ...safe } = booking
    return c.json({ success: true, booking: safe })
  } catch (error) {
    console.error('Errore recupero prenotazione:', error)
    return c.json({ success: false, message: 'Errore durante il recupero della prenotazione' }, 500)
  }
})

// PUT /booking/:id
bookingRouter.put('/booking/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json() as Partial<{
      eventType: string; name: string; surname: string; email: string; phone: string
      date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled'
    }>
    const existing = await getBooking(id)
    if (!existing) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)

    if (data.date || data.time) {
      const date = data.date ?? existing.date
      const time = data.time ?? existing.time
      const eventType = data.eventType ?? existing.eventType
      const [year, month, day] = date.split('-').map(Number)
      const [hour, minute] = time.split(':').map(Number)
      const startDate = new Date(year, month - 1, day, hour, minute)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
      const isAvailable = await checkTimeAvailability(startDate, endDate, id, eventType)
      if (!isAvailable) return c.json({ success: false, message: "L'orario selezionato non è più disponibile." }, 409)
    }

    const updated = await updateBooking(id, data)
    await sendBookingUpdateEmail(updated, getEnv())
    return c.json({ success: true, message: 'Prenotazione aggiornata con successo', booking: updated })
  } catch (error) {
    console.error('Errore aggiornamento prenotazione:', error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento della prenotazione" }, 500)
  }
})

// DELETE /booking/:id
bookingRouter.delete('/booking/:id', async (c) => {
  try {
    const id = c.req.param('id')
    let secret = c.req.query('secret')
    if (!secret) {
      try { secret = ((await c.req.json()) as { secret?: string }).secret } catch { /* no body */ }
    }

    const existing = await getBooking(id)
    if (!existing) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)

    if (existing.cancelSecret) {
      if (!secret) return c.json({ success: false, message: 'È richiesta una chiave segreta', requiresSecret: true }, 403)
      const valid = await verifyBookingSecret(id, secret)
      if (!valid) return c.json({ success: false, message: 'La chiave segreta non è valida', requiresSecret: true }, 403)
    }

    await deleteBooking(id)
    await sendBookingCancellationEmail(existing, getEnv())
    return c.json({ success: true, message: 'Prenotazione cancellata con successo' })
  } catch (error) {
    console.error('Errore cancellazione prenotazione:', error)
    return c.json({ success: false, message: 'Errore durante la cancellazione della prenotazione' }, 500)
  }
})

// POST /booking/:id/verify-secret
bookingRouter.post('/booking/:id/verify-secret', async (c) => {
  try {
    const id = c.req.param('id')
    const { secret } = await c.req.json() as { secret?: string }
    if (!secret) return c.json({ success: false, message: 'La chiave segreta è richiesta' }, 400)
    const existing = await getBooking(id)
    if (!existing) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)
    const valid = await verifyBookingSecret(id, secret)
    return c.json({ success: valid, message: valid ? 'La chiave segreta è valida' : 'La chiave segreta non è valida' })
  } catch (error) {
    console.error('Errore verifica secret:', error)
    return c.json({ success: false, message: 'Errore durante la verifica della chiave segreta' }, 500)
  }
})

// POST /booking/check-availability
bookingRouter.post('/booking/check-availability', async (c) => {
  try {
    const { date, time, eventType } = await c.req.json() as { date?: string; time?: string; eventType?: string }
    if (!date || !time) return c.json({ success: false, message: 'Data e ora sono richiesti' }, 400)
    const [year, month, day] = date.split('-').map(Number)
    const [hour, minute] = time.split(':').map(Number)
    const startDate = new Date(year, month - 1, day, hour, minute)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
    const isAvailable = await checkTimeAvailability(startDate, endDate, undefined, eventType)
    return c.json({ success: true, isAvailable })
  } catch (error) {
    console.error('Errore check availability:', error)
    return c.json({ success: false, message: 'Errore durante la verifica della disponibilità' }, 500)
  }
})

// GET /bookings (lista completa, usato da admin)
bookingRouter.get('/bookings', async (c) => {
  try {
    const status = (c.req.query('status') ?? 'all') as 'pending' | 'confirmed' | 'cancelled' | 'all'
    const eventType = c.req.query('eventType')
    const startDate = c.req.query('startDate')
    const endDate = c.req.query('endDate')
    const page = parseInt(c.req.query('page') ?? '1')
    const limit = parseInt(c.req.query('limit') ?? '50')
    const sortBy = (c.req.query('sortBy') ?? 'date') as 'date' | 'createdAt'
    const sortOrder = (c.req.query('sortOrder') ?? 'desc') as 'asc' | 'desc'

    const result = await getAllBookings({ status, eventType, startDate, endDate, page, limit, sortBy, sortOrder })
    const bookings = result.bookings.map(({ cancelSecret, ...b }) => b)
    return c.json({ success: true, bookings, total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages })
  } catch (error) {
    console.error('Errore recupero tutte le prenotazioni:', error)
    return c.json({ success: false, message: 'Errore durante il recupero delle prenotazioni' }, 500)
  }
})

// GET /calendar/ical
bookingRouter.get('/calendar/ical', async (c) => {
  try {
    const params = {
      startDate: c.req.query('startDate'),
      endDate: c.req.query('endDate'),
      eventType: c.req.query('eventType'),
    }
    const feed = await generateICalFeed(Object.values(params).some(Boolean) ? params : undefined)
    c.header('Content-Type', 'text/calendar; charset=utf-8')
    c.header('Content-Disposition', 'attachment; filename="tsnlas-calendar.ics"')
    return c.body(feed)
  } catch (error) {
    console.error('Errore generazione iCal:', error)
    return c.json({ success: false, message: 'Errore durante la generazione del feed iCal' }, 500)
  }
})

// GET /me/bookings (authenticated)
bookingRouter.get('/me/bookings', isAuthenticated, async (c) => {
  try {
    const user = c.get('user')
    const bookings = await getUserBookings(user.email)
    return c.json({ success: true, bookings: bookings.map(({ cancelSecret, ...b }) => b) })
  } catch (error) {
    console.error('Errore me/bookings:', error)
    return c.json({ success: false, message: 'Errore durante il recupero delle prenotazioni' }, 500)
  }
})

export default bookingRouter
