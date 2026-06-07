/**
 * Calendar service — pure logic, no DB or external dependencies.
 * Reads calendars.json to determine the active season and opening hours.
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const configData = JSON.parse(readFileSync(join(__dirname, '../data/calendars.json'), 'utf-8'))

/**
 * Determines the active season based on the current date.
 * @returns 'orarioEstivo' or 'orarioInvernale'
 */
export function getActiveSeason(): string {
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
  const currentDay = now.getDate()

  // Format MM-DD for comparison
  const currentDate = `${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`

  const { orarioEstivo } = configData.orari

  // Check if we are in summer season (April 2 – September 30)
  if (isDateInRange(currentDate, orarioEstivo.startDate, orarioEstivo.endDate)) {
    return 'orarioEstivo'
  }

  // Otherwise we are in winter season (October 1 – April 1)
  return 'orarioInvernale'
}

/**
 * Checks whether a date falls within a range (both inclusive).
 * Handles ranges that wrap around the end of the year.
 *
 * @param date      - Date to check in MM-DD format
 * @param startDate - Range start in MM-DD format
 * @param endDate   - Range end in MM-DD format
 */
function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  const [startMonth, startDay] = startDate.split('-').map(Number)
  const [endMonth, endDay] = endDate.split('-').map(Number)
  const [dateMonth, dateDay] = date.split('-').map(Number)

  const startValue = startMonth * 100 + startDay
  const endValue = endMonth * 100 + endDay
  const dateValue = dateMonth * 100 + dateDay

  // Range does not wrap around the year end
  if (startValue <= endValue) {
    return dateValue >= startValue && dateValue <= endValue
  }

  // Range wraps around the year end (e.g. Oct 1 → Apr 1)
  return dateValue >= startValue || dateValue <= endValue
}

/**
 * Returns the opening hours for the active season as boolean flags.
 *
 * Each key is an Italian day name (e.g. "lunedì", "sabato").
 * Each value indicates whether the morning and/or afternoon session is open.
 */
export function getActiveOpeningHours(): Record<string, { morning: boolean; afternoon: boolean }> {
  const season = getActiveSeason()
  const orari = configData.orari[season as keyof typeof configData.orari] as any
  const rawHours: Record<string, any> = orari?.openingHours ?? {}

  const result: Record<string, { morning: boolean; afternoon: boolean }> = {}
  for (const [day, sessions] of Object.entries(rawHours)) {
    result[day] = {
      morning: !!(sessions as any)?.morning,
      afternoon: !!(sessions as any)?.afternoon,
    }
  }
  return result
}
