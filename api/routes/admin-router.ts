import { Hono } from 'hono'
import { isAdmin } from '../middleware/auth.js'
import type { UserData } from '../services/user-service.js'
import {
  getAllUsers,
  getUserById,
  getUserStats,
  getLoginStats,
  updateUserRoles,
  updateUserProfile,
} from '../services/user-service.js'
import {
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getEventTypeLabel,
} from '../services/booking-service.js'
import { checkTimeAvailability } from '../services/availability-service.js'
import {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendBookingUpdateEmail,
} from '../services/email-service.js'

type AdminVariables = { user: UserData }
const adminRouter = new Hono<{ Variables: AdminVariables }>()

function getEmailEnv() {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL!,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
  }
}

// ===== USER ADMIN ENDPOINTS =====

// GET /admin/users
adminRouter.get('/admin/users', isAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') ?? '1')
    const limit = parseInt(c.req.query('limit') ?? '50')
    const search = c.req.query('search')
    const role = c.req.query('role')
    const isVerifiedParam = c.req.query('isVerified')
    const isSocioParam = c.req.query('isSocio')
    const isVerified = isVerifiedParam !== undefined ? isVerifiedParam === 'true' : undefined
    const isSocio = isSocioParam !== undefined ? isSocioParam === 'true' : undefined

    const result = await getAllUsers({ page, limit, search, role, isVerified, isSocio })
    return c.json({ success: true, ...result })
  } catch (error) {
    console.error('Errore recupero utenti:', error)
    return c.json({ success: false, message: 'Errore durante il recupero degli utenti' }, 500)
  }
})

// GET /admin/users/:id
adminRouter.get('/admin/users/:id', isAdmin, async (c) => {
  try {
    const user = await getUserById(c.req.param('id')!)
    if (!user) return c.json({ success: false, message: 'Utente non trovato' }, 404)
    return c.json({ success: true, user })
  } catch (error) {
    console.error('Errore recupero utente:', error)
    return c.json({ success: false, message: "Errore durante il recupero dell'utente" }, 500)
  }
})

// PUT /admin/users/:id
adminRouter.put('/admin/users/:id', isAdmin, async (c) => {
  try {
    const id = c.req.param('id')!
    const existing = await getUserById(id)
    if (!existing) return c.json({ success: false, message: 'Utente non trovato' }, 404)
    const profileData = await c.req.json()
    const updatedUser = await updateUserProfile(id, profileData)
    return c.json({ success: true, message: 'Utente aggiornato con successo', user: updatedUser })
  } catch (error) {
    console.error("Errore aggiornamento utente:", error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento dell'utente" }, 500)
  }
})

// PUT /admin/users/:id/roles
adminRouter.put('/admin/users/:id/roles', isAdmin, async (c) => {
  try {
    const id = c.req.param('id')!
    const existing = await getUserById(id)
    if (!existing) return c.json({ success: false, message: 'Utente non trovato' }, 404)
    const { roles } = await c.req.json() as { roles?: string[] }
    if (!roles || !Array.isArray(roles) || !roles.every(r => typeof r === 'string')) {
      return c.json({ success: false, message: 'I ruoli devono essere specificati come un array di stringhe' }, 400)
    }
    const updatedUser = await updateUserRoles(id, roles)
    return c.json({ success: true, message: 'Ruoli aggiornati con successo', user: updatedUser })
  } catch (error) {
    console.error("Errore aggiornamento ruoli:", error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento dei ruoli" }, 500)
  }
})

// GET /users/directors (pubblico — nessun guard auth)
adminRouter.get('/users/directors', async (c) => {
  try {
    const result = await getAllUsers({ role: 'ROLE_DIRECTOR' })
    const directors = result.users.map(u => ({ id: u.id, name: u.name ?? u.email }))
    return c.json(directors)
  } catch (error) {
    console.error('Errore recupero direttori:', error)
    return c.json({ success: false, message: 'Errore durante il recupero dei direttori' }, 500)
  }
})

// GET /admin/stats
adminRouter.get('/admin/stats', isAdmin, async (c) => {
  try {
    const type = c.req.query('type')
    const period = (c.req.query('period') ?? 'month') as 'today' | 'week' | 'month'

    if (type === 'login') {
      const data = await getLoginStats(period)
      return c.json({ success: true, data })
    }

    const stats = await getUserStats()
    return c.json({ success: true, stats })
  } catch (error) {
    console.error('Errore recupero statistiche:', error)
    return c.json({ success: false, message: 'Errore durante il recupero delle statistiche' }, 500)
  }
})

// ===== BOOKING ADMIN ENDPOINTS =====

// GET /admin/bookings/stats
// IMPORTANTE: definita prima di /admin/bookings/:id per evitare conflitti di routing
adminRouter.get('/admin/bookings/stats', isAdmin, async (c) => {
  try {
    const result = await getAllBookings({ limit: 1000 })
    const bookings = result.bookings

    const byEventType: Record<string, number> = {}
    const eventTypeLabels: Record<string, string> = {}
    const byMonth: Record<string, number> = {}

    for (const b of bookings) {
      byEventType[b.eventType] = (byEventType[b.eventType] ?? 0) + 1
      eventTypeLabels[b.eventType] = getEventTypeLabel(b.eventType)
      const monthKey = b.date.substring(0, 7) // "YYYY-MM"
      byMonth[monthKey] = (byMonth[monthKey] ?? 0) + 1
    }

    return c.json({
      success: true,
      stats: {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
        byEventType,
        eventTypeLabels,
        byMonth,
      },
    })
  } catch (error) {
    console.error('Errore statistiche prenotazioni:', error)
    return c.json({ success: false, message: 'Errore durante il recupero delle statistiche delle prenotazioni' }, 500)
  }
})

// GET /admin/bookings
adminRouter.get('/admin/bookings', isAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') ?? '1')
    const limit = parseInt(c.req.query('limit') ?? '10')
    const status = (c.req.query('status') ?? 'all') as 'pending' | 'confirmed' | 'cancelled' | 'all'
    const eventType = c.req.query('eventType')
    const startDate = c.req.query('startDate')
    const endDate = c.req.query('endDate')
    const search = c.req.query('search')
    const sortBy = (c.req.query('sortBy') ?? 'date') as 'date' | 'createdAt'
    const sortOrder = (c.req.query('sortOrder') ?? 'desc') as 'asc' | 'desc'

    const options = {
      status: status !== 'all' ? status : undefined,
      eventType: eventType && eventType !== 'all' ? eventType : undefined,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
      page,
      limit,
      sortBy,
      sortOrder,
    }

    if (search) {
      const allResult = await getAllBookings({ ...options, limit: 10000, page: 1 })
      const searchLower = search.toLowerCase()
      const filtered = allResult.bookings.filter(b =>
        b.name.toLowerCase().includes(searchLower) ||
        b.surname.toLowerCase().includes(searchLower) ||
        b.email.toLowerCase().includes(searchLower) ||
        b.phone.includes(search)
      )
      const total = filtered.length
      const totalPages = Math.ceil(total / limit)
      const paginated = filtered.slice((page - 1) * limit, page * limit)
      return c.json({
        success: true,
        bookings: paginated.map(b => ({ ...b, eventTypeLabel: getEventTypeLabel(b.eventType) })),
        total,
        page,
        limit,
        totalPages,
      })
    }

    const result = await getAllBookings(options)
    return c.json({
      success: true,
      bookings: result.bookings.map(b => ({ ...b, eventTypeLabel: getEventTypeLabel(b.eventType) })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  } catch (error) {
    console.error('Errore recupero prenotazioni admin:', error)
    return c.json({ success: false, message: 'Errore durante il recupero delle prenotazioni' }, 500)
  }
})

// GET /admin/bookings/:id
adminRouter.get('/admin/bookings/:id', isAdmin, async (c) => {
  try {
    const booking = await getBooking(c.req.param('id')!)
    if (!booking) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)
    return c.json({ success: true, booking: { ...booking, eventTypeLabel: getEventTypeLabel(booking.eventType) } })
  } catch (error) {
    console.error('Errore recupero prenotazione admin:', error)
    return c.json({ success: false, message: 'Errore durante il recupero della prenotazione' }, 500)
  }
})

// PUT /admin/bookings/:id/status
adminRouter.put('/admin/bookings/:id/status', isAdmin, async (c) => {
  try {
    const id = c.req.param('id')!
    const data = await c.req.json() as { status?: string }
    if (!data.status || !['pending', 'confirmed', 'cancelled'].includes(data.status)) {
      return c.json({ success: false, message: 'Stato non valido. Deve essere uno tra: pending, confirmed, cancelled' }, 400)
    }
    const existing = await getBooking(id)
    if (!existing) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)
    const updated = await updateBooking(id, { status: data.status as 'pending' | 'confirmed' | 'cancelled' })
    if (data.status === 'confirmed') await sendBookingConfirmationEmail(updated, getEmailEnv())
    else if (data.status === 'cancelled') await sendBookingCancellationEmail(updated, getEmailEnv())
    return c.json({
      success: true,
      message: `Stato della prenotazione aggiornato a ${data.status}`,
      booking: { ...updated, eventTypeLabel: getEventTypeLabel(updated.eventType) },
    })
  } catch (error) {
    console.error('Errore aggiornamento status prenotazione:', error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento dello stato della prenotazione" }, 500)
  }
})

// PUT /admin/bookings/:id
adminRouter.put('/admin/bookings/:id', isAdmin, async (c) => {
  try {
    const id = c.req.param('id')!
    const data = await c.req.json() as Partial<{
      eventType: string; name: string; surname: string; email: string
      phone: string; date: string; time: string; status: 'pending' | 'confirmed' | 'cancelled'; adminNotes: string; notes: string
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
      if (!isAvailable) {
        return c.json({ success: false, message: "L'orario selezionato non è più disponibile." }, 409)
      }
    }

    const updated = await updateBooking(id, data)
    await sendBookingUpdateEmail(updated, getEmailEnv())
    return c.json({
      success: true,
      message: 'Prenotazione aggiornata con successo',
      booking: { ...updated, eventTypeLabel: getEventTypeLabel(updated.eventType) },
    })
  } catch (error) {
    console.error('Errore aggiornamento prenotazione admin:', error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento della prenotazione" }, 500)
  }
})

// DELETE /admin/bookings/:id
adminRouter.delete('/admin/bookings/:id', isAdmin, async (c) => {
  try {
    const id = c.req.param('id')!
    const existing = await getBooking(id)
    if (!existing) return c.json({ success: false, message: 'Prenotazione non trovata' }, 404)
    await deleteBooking(id)
    return c.json({ success: true, message: 'Prenotazione eliminata con successo' })
  } catch (error) {
    console.error('Errore eliminazione prenotazione admin:', error)
    return c.json({ success: false, message: 'Errore durante la eliminazione della prenotazione' }, 500)
  }
})

export default adminRouter
