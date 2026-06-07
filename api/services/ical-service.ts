import ical, { ICalAttendeeRole } from 'ical-generator'
import { prisma } from '../lib/prisma.js'
import { getEventTypeLabel } from './booking-service.js'

export interface ICalFilterParams {
  startDate?: string
  endDate?: string
  eventType?: string
}

export async function generateICalFeed(params?: ICalFilterParams): Promise<string> {
  const calendar = ical({
    name: 'TSN Lastra a Signa - Prenotazioni',
    description: 'Calendario delle prenotazioni del Tiro a Segno Nazionale di Lastra a Signa',
    timezone: 'Europe/Rome',
    prodId: { company: 'TSN Lastra a Signa', product: 'Calendario Prenotazioni' },
  })

  const rows = await prisma.booking.findMany({
    where: {
      status: { not: 'cancelled' },
      ...(params?.eventType && { eventType: params.eventType }),
      ...(params?.startDate && params?.endDate
        ? { date: { gte: params.startDate, lte: params.endDate } }
        : params?.startDate
        ? { date: { gte: params.startDate } }
        : params?.endDate
        ? { date: { lte: params.endDate } }
        : {}),
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  // Group by date+time+eventType
  const groups = new Map<string, typeof rows>()
  for (const row of rows) {
    const key = `${row.date}_${row.time}_${row.eventType}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }

  for (const group of groups.values()) {
    const first = group[0]
    const [year, month, day] = first.date.split('-').map(Number)
    const [hour, minute] = first.time.split(':').map(Number)
    const startDate = new Date(year, month - 1, day, hour, minute)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

    calendar.createEvent({
      start: startDate,
      end: endDate,
      summary: `${getEventTypeLabel(first.eventType)} (${group.length} prenotazioni)`,
      description: group.map(b => `${b.name} ${b.surname} <${b.email}>`).join('\n'),
      attendees: group.map(b => ({
        name: `${b.name} ${b.surname}`,
        email: b.email,
        rsvp: true,
        role: ICalAttendeeRole.REQ,
      })),
    })
  }

  return calendar.toString()
}
