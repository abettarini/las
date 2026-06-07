import { Hono } from 'hono'
import { isAuthenticated, isAdmin } from '../middleware/auth.js'
import type { UserData } from '../services/user-service.js'
import { hasRole } from '../services/user-service.js'
import {
  registerDirector,
  getAllTurni,
  getUserTurni,
  deleteTurno,
} from '../services/turni-service.js'
import { getActiveOpeningHours } from '../services/calendar-service.js'

type AuthVariables = { user: UserData }
const turniRouter = new Hono<{ Variables: AuthVariables }>()

function getDayOfWeek(date: Date): string {
  return ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'][date.getDay()]
}

// GET /open-days — public
turniRouter.get('/open-days', async (c) => {
  try {
    const now = new Date()
    const yearParam = c.req.query('year') ?? String(now.getFullYear())
    const monthParam = c.req.query('month') ?? String(now.getMonth() + 1)

    const year = parseInt(yearParam, 10)
    const month = parseInt(monthParam, 10)

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return c.json({ success: false, message: 'Parametri anno o mese non validi' }, 400)
    }

    const openingHours = getActiveOpeningHours()
    const daysInMonth = new Date(year, month, 0).getDate()
    const openDays: { date: string; dayOfWeek: string; morning: boolean; afternoon: boolean }[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dayName = getDayOfWeek(date)
      const hours = openingHours[dayName]
      if (hours && (hours.morning || hours.afternoon)) {
        const mm = String(month).padStart(2, '0')
        const dd = String(day).padStart(2, '0')
        openDays.push({
          date: `${year}-${mm}-${dd}`,
          dayOfWeek: dayName,
          morning: hours.morning,
          afternoon: hours.afternoon,
        })
      }
    }

    return c.json(openDays)
  } catch (err) {
    console.error('Errore nel recupero dei giorni aperti:', err)
    return c.json({ success: false, message: 'Errore interno del server' }, 500)
  }
})

// GET /my-turni — isAuthenticated + ROLE_DIRECTOR or ROLE_ADMIN
turniRouter.get('/my-turni', isAuthenticated, async (c) => {
  try {
    const user = c.get('user')
    if (!hasRole(user, 'ROLE_DIRECTOR') && !hasRole(user, 'ROLE_ADMIN')) {
      return c.json({ success: false, message: 'Accesso negato: ruolo direttore richiesto' }, 403)
    }

    const year = c.req.query('year')
    const month = c.req.query('month')
    const day = c.req.query('day')

    const turni = await getUserTurni(user.id, year, month, day)
    return c.json(turni)
  } catch (err) {
    console.error('Errore nel recupero dei turni personali:', err)
    return c.json({ success: false, message: 'Errore interno del server' }, 500)
  }
})

// POST /register-director — isAdmin
turniRouter.post('/register-director', isAdmin, async (c) => {
  try {
    const body = await c.req.json() as { userId?: string; date?: string; timeSlot?: string }
    const { userId, date, timeSlot } = body

    if (!userId || !date || !timeSlot) {
      return c.json({ success: false, message: 'Campi obbligatori mancanti: userId, date, timeSlot' }, 400)
    }

    if (timeSlot !== 'MORNING' && timeSlot !== 'AFTERNOON') {
      return c.json({ success: false, message: 'Valore timeSlot non valido. Usare MORNING o AFTERNOON' }, 400)
    }

    const turno = await registerDirector({ userId, date, timeSlot })
    return c.json({ success: true, message: 'Turno registrato con successo', turno }, 201)
  } catch (err: any) {
    if (err?.message === 'Utente non trovato') {
      return c.json({ success: false, message: 'Utente non trovato' }, 404)
    }
    if (err?.message === 'Il direttore è già iscritto a questo turno') {
      return c.json({ success: false, message: err.message }, 409)
    }
    console.error('Errore nella registrazione del turno (admin):', err)
    return c.json({ success: false, message: 'Errore interno del server' }, 500)
  }
})

// POST /register — isAuthenticated + ROLE_DIRECTOR
turniRouter.post('/register', isAuthenticated, async (c) => {
  try {
    const user = c.get('user')
    if (!hasRole(user, 'ROLE_DIRECTOR') && !hasRole(user, 'ROLE_ADMIN')) {
      return c.json({ success: false, message: 'Accesso negato: ruolo direttore richiesto' }, 403)
    }

    const body = await c.req.json() as { date?: string; timeSlot?: string }
    const { date, timeSlot } = body

    if (!date || !timeSlot) {
      return c.json({ success: false, message: 'Campi obbligatori mancanti: date, timeSlot' }, 400)
    }

    if (timeSlot !== 'MORNING' && timeSlot !== 'AFTERNOON') {
      return c.json({ success: false, message: 'Valore timeSlot non valido. Usare MORNING o AFTERNOON' }, 400)
    }

    const turno = await registerDirector({ userId: user.id, date, timeSlot })
    return c.json({ success: true, message: 'Turno registrato con successo', turno }, 201)
  } catch (err: any) {
    if (err?.message === 'Il direttore è già iscritto a questo turno') {
      return c.json({ success: false, message: err.message }, 409)
    }
    console.error('Errore nella registrazione del turno:', err)
    return c.json({ success: false, message: 'Errore interno del server' }, 500)
  }
})

// GET / — isAuthenticated
turniRouter.get('/', isAuthenticated, async (c) => {
  try {
    const user = c.get('user')
    const year = c.req.query('year')
    const month = c.req.query('month')
    const day = c.req.query('day')

    // Non-admin cannot filter by other users
    let userIdParam = c.req.query('user')
    if (userIdParam && !hasRole(user, 'ROLE_ADMIN')) {
      userIdParam = user.id
    }

    const turni = await getAllTurni(year, month, day, userIdParam)
    return c.json(turni)
  } catch (err) {
    console.error('Errore nel recupero dei turni:', err)
    return c.json({ success: false, message: 'Errore interno del server' }, 500)
  }
})

// DELETE /:id — isAuthenticated + ROLE_ADMIN or ROLE_DIRECTOR
turniRouter.delete('/:id', isAuthenticated, async (c) => {
  try {
    const user = c.get('user')
    if (!hasRole(user, 'ROLE_ADMIN') && !hasRole(user, 'ROLE_DIRECTOR')) {
      return c.json({ success: false, message: 'Accesso negato: privilegi insufficienti' }, 403)
    }

    const id = c.req.param('id')
    if (!id) {
      return c.json({ success: false, message: 'ID turno mancante' }, 400)
    }
    const deleted = await deleteTurno(id)

    if (!deleted) {
      return c.json({ success: false, message: 'Turno non trovato' }, 404)
    }

    return c.json({ success: true, message: 'Turno eliminato con successo' })
  } catch (err) {
    console.error('Errore nella cancellazione del turno:', err)
    return c.json({ success: false, message: 'Errore interno del server' }, 500)
  }
})

export { turniRouter }
