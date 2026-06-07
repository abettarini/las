import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { prisma } from '../lib/prisma.js'

export interface Turno {
  id: string
  userId: string
  userName: string
  date: string
  timeSlot: 'MORNING' | 'AFTERNOON'
}

export async function registerDirector(
  turnoData: { userId: string; date: string; timeSlot: 'MORNING' | 'AFTERNOON' }
): Promise<Turno> {
  const user = await prisma.user.findUnique({ where: { id: turnoData.userId } })
  if (!user) throw new Error('Utente non trovato')

  const userName = user.name ?? user.email

  try {
    const turno = await prisma.turno.create({
      data: {
        userId: turnoData.userId,
        userName,
        date: turnoData.date,
        timeSlot: turnoData.timeSlot,
      },
    })
    return turno as unknown as Turno
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Il direttore è già iscritto a questo turno')
    }
    throw error
  }
}

export async function getAllTurni(
  year?: string,
  month?: string,
  day?: string,
  userId?: string
): Promise<Turno[]> {
  const where: Record<string, unknown> = {}

  if (year) {
    if (month) {
      const mm = month.padStart(2, '0')
      if (day) {
        where.date = `${year}-${mm}-${day.padStart(2, '0')}`
      } else {
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
        where.date = { gte: `${year}-${mm}-01`, lte: `${year}-${mm}-${lastDay}` }
      }
    } else {
      where.date = { gte: `${year}-01-01`, lte: `${year}-12-31` }
    }
  }

  if (userId) where.userId = userId

  const results = await prisma.turno.findMany({
    where,
    orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
  })

  return results as unknown as Turno[]
}

export async function getTurno(id: string): Promise<Turno | null> {
  const result = await prisma.turno.findUnique({ where: { id } })
  return result as unknown as Turno | null
}

export async function getUserTurni(
  userId: string,
  year?: string,
  month?: string,
  day?: string
): Promise<Turno[]> {
  return getAllTurni(year, month, day, userId)
}

export async function deleteTurno(id: string): Promise<boolean> {
  try {
    await prisma.turno.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
