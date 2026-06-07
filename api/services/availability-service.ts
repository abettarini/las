import { prisma } from '../lib/prisma.js'
import calendarsData from '../data/calendars.json' assert { type: 'json' }

interface EventTypeConfig {
  maxBookings: number
  label: string
}

interface CalendarsData {
  eventTypes: Record<string, EventTypeConfig>
}

const config = calendarsData as unknown as CalendarsData

export async function checkTimeAvailability(
  start: Date,
  end: Date,
  excludeBookingId?: string,
  eventType?: string
): Promise<boolean> {
  const startDate = start.toISOString().split('T')[0]
  const startTime = start.toISOString().split('T')[1].substring(0, 5)

  if (!eventType) {
    const count = await prisma.booking.count({
      where: {
        status: { not: 'cancelled' },
        date: startDate,
        time: startTime,
        ...(excludeBookingId && { id: { not: excludeBookingId } }),
      },
    })
    return count === 0
  }

  const maxBookings = config.eventTypes[eventType]?.maxBookings ?? 1
  const count = await prisma.booking.count({
    where: {
      status: { not: 'cancelled' },
      eventType,
      date: startDate,
      time: startTime,
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
    },
  })
  return count < maxBookings
}
