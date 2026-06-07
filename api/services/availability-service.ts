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

/**
 * Checks if a time slot is available for booking.
 * Availability is slot-based (exact date+time match), not range-based.
 * The `end` parameter is accepted for API consistency but not used in queries.
 *
 * Without `eventType`: slot is available if no non-cancelled bookings exist at that exact time.
 * With `eventType`: slot is available if current bookings < maxBookings from calendars.json config.
 */
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

  const eventConfig = config.eventTypes[eventType]
  if (!eventConfig) console.warn(`[availability] unknown eventType: ${eventType}, defaulting maxBookings to 1`)
  const maxBookings = eventConfig?.maxBookings ?? 1
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
