import { prisma } from '../lib/prisma.js'

export interface BookingData {
  id: string
  eventType: string
  name: string
  surname: string
  email: string
  phone: string
  date: string
  time: string
  seasonId: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'cancelled'
  cancelSecret?: string | null
  notes?: string | null
  adminNotes?: string | null
}

function generateCancelSecret(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function toBookingData(row: {
  id: string; eventType: string; name: string; surname: string; email: string
  phone: string; date: string; time: string; seasonId: string; status: string
  cancelSecret: string | null; notes: string | null; adminNotes: string | null
  createdAt: Date
}): BookingData {
  return {
    id: row.id,
    eventType: row.eventType,
    name: row.name,
    surname: row.surname,
    email: row.email,
    phone: row.phone,
    date: row.date,
    time: row.time,
    seasonId: row.seasonId,
    status: (['pending', 'confirmed', 'cancelled'] as const).includes(row.status as BookingData['status'])
      ? (row.status as BookingData['status'])
      : 'pending',
    cancelSecret: row.cancelSecret,
    notes: row.notes,
    adminNotes: row.adminNotes,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function createBooking(data: Omit<BookingData, 'id' | 'createdAt' | 'cancelSecret'>): Promise<BookingData> {
  const row = await prisma.booking.create({
    data: {
      eventType: data.eventType,
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      seasonId: data.seasonId,
      status: data.status,
      cancelSecret: generateCancelSecret(),
      notes: data.notes ?? null,
      adminNotes: data.adminNotes ?? null,
    },
  })
  return toBookingData(row)
}

export async function getBooking(id: string): Promise<BookingData | null> {
  const row = await prisma.booking.findUnique({ where: { id } })
  return row ? toBookingData(row) : null
}

export async function updateBooking(id: string, data: Partial<Pick<BookingData, 'eventType' | 'name' | 'surname' | 'email' | 'phone' | 'date' | 'time' | 'status' | 'notes' | 'adminNotes'>>): Promise<BookingData> {
  const row = await prisma.booking.update({ where: { id }, data })
  return toBookingData(row)
}

export async function deleteBooking(id: string): Promise<void> {
  await prisma.booking.delete({ where: { id } })
}

export async function verifyBookingSecret(id: string, secret: string): Promise<boolean> {
  const row = await prisma.booking.findUnique({ where: { id }, select: { cancelSecret: true } })
  return !!row?.cancelSecret && row.cancelSecret === secret
}

export async function getUserBookings(email: string): Promise<BookingData[]> {
  const rows = await prisma.booking.findMany({
    where: { email },
    orderBy: [{ date: 'desc' }, { time: 'desc' }],
  })
  return rows.map(toBookingData)
}

export async function getAllBookings(options: {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'all'
  eventType?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: 'date' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
} = {}): Promise<{ bookings: BookingData[]; total: number; page: number; limit: number; totalPages: number }> {
  const { status = 'all', eventType, startDate, endDate, page = 1, limit = 50, sortBy = 'date', sortOrder = 'desc' } = options

  const where = {
    ...(status !== 'all' && { status }),
    ...(eventType && { eventType }),
    ...(startDate && endDate ? { date: { gte: startDate, lte: endDate } }
      : startDate ? { date: { gte: startDate } }
      : endDate ? { date: { lte: endDate } }
      : {}),
  }

  const orderBy = sortBy === 'date'
    ? [{ date: sortOrder as 'asc' | 'desc' }, { time: sortOrder as 'asc' | 'desc' }]
    : [{ createdAt: sortOrder as 'asc' | 'desc' }]

  const [total, rows] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
  ])

  return { bookings: rows.map(toBookingData), total, page, limit, totalPages: Math.ceil(total / limit) }
}

export function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    visita_dottore: 'Visita Dottore',
    corso_dima: 'Corso DIMA',
    taratura_carabina: 'Taratura Carabina',
    cinghialino_corrente: 'Cinghialino Corrente',
  }
  return labels[eventType] ?? eventType
}
