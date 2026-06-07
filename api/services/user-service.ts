import type { User as PrismaUser, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { generateJWT, verifyJWT } from './jwt-service.js'

export interface UserData {
  id: string
  email: string
  birthDate?: string
  securityQuestion1?: string
  securityAnswer1?: string
  securityQuestion2?: string
  securityAnswer2?: string
  createdAt: string
  isVerified: boolean
  verificationToken?: string
  verificationTokenExpiresAt?: string
  lastLogin?: string
  name?: string
  picture?: string
  googleId?: string
  facebookId?: string
  phone?: string
  portoArmi?: string
  scadenzaPortoArmi?: string
  isSocio?: boolean
  numeroTessera?: string
  quotaAnnuale?: boolean
  privacyConsent?: boolean
  roles?: string[]
}

export interface UserProfileData {
  name?: string
  picture?: string
  phone?: string
  portoArmi?: string
  scadenzaPortoArmi?: string
  isSocio?: boolean
  numeroTessera?: string
  quotaAnnuale?: boolean
  privacyConsent?: boolean
  roles?: string[]
}

export interface GetUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: string
  isVerified?: boolean
  isSocio?: boolean
}

export interface UserStats {
  totalUsers: number
  verifiedUsers: number
  adminUsers: number
  socioUsers: number
}

export interface LoginData {
  date: string
  count: number
}

export function convertRolesToArray(rolesString?: string | null): string[] {
  if (!rolesString) return ['ROLE_USER']
  return rolesString.split(',').filter(r => r.trim() !== '')
}

export function hasRole(user: UserData, role: string): boolean {
  return Array.isArray(user.roles) && user.roles.includes(role)
}

function mapUser(u: PrismaUser): UserData {
  return {
    id: u.id,
    email: u.email,
    birthDate: u.birthDate ?? undefined,
    securityQuestion1: u.securityQuestion1 ?? undefined,
    securityAnswer1: u.securityAnswer1 ?? undefined,
    securityQuestion2: u.securityQuestion2 ?? undefined,
    securityAnswer2: u.securityAnswer2 ?? undefined,
    createdAt: u.createdAt.toISOString(),
    isVerified: u.isVerified,
    verificationToken: u.verificationToken ?? undefined,
    verificationTokenExpiresAt: u.verificationTokenExpiresAt?.toISOString(),
    lastLogin: u.lastLogin?.toISOString(),
    name: u.name ?? undefined,
    picture: u.picture ?? undefined,
    googleId: u.googleId ?? undefined,
    facebookId: u.facebookId ?? undefined,
    phone: u.phone ?? undefined,
    portoArmi: u.portoArmi ?? undefined,
    scadenzaPortoArmi: u.scadenzaPortoArmi ?? undefined,
    isSocio: u.isSocio,
    numeroTessera: u.numeroTessera ?? undefined,
    quotaAnnuale: u.quotaAnnuale,
    privacyConsent: u.privacyConsent,
    roles: convertRolesToArray(u.roles),
  }
}

function generateVerificationToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, '').slice(0, 32)
}

export async function createUser(
  userData: Omit<UserData, 'id' | 'createdAt' | 'isVerified' | 'verificationToken' | 'verificationTokenExpiresAt'>
): Promise<UserData> {
  const existing = await prisma.user.findUnique({ where: { email: userData.email } })
  if (existing) throw new Error('Email già in uso')

  const verificationToken = generateVerificationToken()
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const user = await prisma.user.create({
    data: {
      email: userData.email,
      birthDate: userData.birthDate,
      securityQuestion1: userData.securityQuestion1,
      securityAnswer1: userData.securityAnswer1,
      securityQuestion2: userData.securityQuestion2,
      securityAnswer2: userData.securityAnswer2,
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
      roles: 'ROLE_USER',
    },
  })
  return mapUser(user)
}

export async function getUserById(id: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({ where: { id } })
  return user ? mapUser(user) : null
}

export async function getUserByEmail(email: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  return user ? mapUser(user) : null
}

export async function getUserByVerificationToken(token: string): Promise<UserData | null> {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } })
  if (!user) return null
  if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) return null
  return mapUser(user)
}

export async function verifyUserEmail(token: string): Promise<UserData | null> {
  const user = await getUserByVerificationToken(token)
  if (!user) return null
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
  })
  return mapUser(updated)
}

export async function updateUserLastLogin(id: string): Promise<UserData | null> {
  try {
    const updated = await prisma.user.update({ where: { id }, data: { lastLogin: new Date() } })
    return mapUser(updated)
  } catch (e: any) {
    if (e?.code === 'P2025') return null
    throw e
  }
}

export async function generateNewVerificationToken(email: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const verificationToken = generateVerificationToken()
  const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken, verificationTokenExpiresAt },
  })
  return mapUser(updated)
}

export async function generateAuthToken(
  user: UserData,
  env: { JWT_SECRET: string; EMAIL_SECRET: string }
): Promise<string> {
  return generateJWT({ id: user.id, email: user.email, name: user.name, picture: user.picture, roles: user.roles }, env)
}

export async function verifyAuthToken(
  token: string,
  env: { JWT_SECRET: string; EMAIL_SECRET: string }
): Promise<UserData | null> {
  const payload = await verifyJWT(token, env)
  if (!payload?.sub) return null
  const user = await getUserById(payload.sub)
  if (!user) return null
  if (payload.email !== user.email) return null
  return user
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<UserData | null> {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { roles: roles.join(',') },
    })
    return mapUser(updated)
  } catch (e: any) {
    if (e?.code === 'P2025') return null
    throw e
  }
}

export async function updateUserProfile(id: string, profileData: UserProfileData): Promise<UserData | null> {
  const data: Prisma.UserUpdateInput = {}
  if (profileData.name !== undefined) data.name = profileData.name
  if (profileData.picture !== undefined) data.picture = profileData.picture
  if (profileData.phone !== undefined) data.phone = profileData.phone
  if (profileData.portoArmi !== undefined) data.portoArmi = profileData.portoArmi
  if (profileData.scadenzaPortoArmi !== undefined) data.scadenzaPortoArmi = profileData.scadenzaPortoArmi
  if (profileData.isSocio !== undefined) data.isSocio = profileData.isSocio
  if (profileData.numeroTessera !== undefined) data.numeroTessera = profileData.numeroTessera
  if (profileData.quotaAnnuale !== undefined) data.quotaAnnuale = profileData.quotaAnnuale
  if (profileData.privacyConsent !== undefined) data.privacyConsent = profileData.privacyConsent
  if (profileData.roles !== undefined) {
    const finalRoles = profileData.roles.includes('ROLE_USER')
      ? profileData.roles
      : [...profileData.roles, 'ROLE_USER']
    data.roles = finalRoles.join(',')
  }

  try {
    const updated = await prisma.user.update({ where: { id }, data })
    return mapUser(updated)
  } catch (e: any) {
    if (e?.code === 'P2025') return null
    throw e
  }
}

export async function getAllUsers(
  options: GetUsersOptions = {}
): Promise<{ users: UserData[]; total: number; page: number; limit: number }> {
  const page = options.page ?? 1
  const limit = options.limit ?? 50
  const offset = (page - 1) * limit

  const where: Prisma.UserWhereInput = {}
  if (options.search) {
    where.OR = [
      { email: { contains: options.search, mode: 'insensitive' } },
      { name: { contains: options.search, mode: 'insensitive' } },
    ]
  }
  if (options.role) where.roles = { contains: options.role, mode: 'insensitive' }
  if (options.isVerified !== undefined) where.isVerified = options.isVerified
  if (options.isSocio !== undefined) where.isSocio = options.isSocio

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.user.count({ where }),
  ])

  return { users: users.map(mapUser), total, page, limit }
}

export async function getUserStats(): Promise<UserStats> {
  const [totalUsers, verifiedUsers, socioUsers, adminUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.user.count({ where: { isSocio: true } }),
    prisma.user.count({ where: { roles: { contains: 'ROLE_ADMIN' } } }),
  ])
  return { totalUsers, verifiedUsers, adminUsers, socioUsers }
}

export async function getLoginStats(period: 'today' | 'week' | 'month'): Promise<LoginData[]> {
  const today = new Date()
  const startDate = new Date()
  if (period === 'today') startDate.setHours(0, 0, 0, 0)
  else if (period === 'week') startDate.setDate(today.getDate() - 7)
  else startDate.setMonth(today.getMonth() - 1)

  const truncUnit = period === 'today' ? 'hour' : 'day'

  const results = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT DATE_TRUNC(${truncUnit}, "lastLogin") as date, COUNT(*) as count
    FROM "User"
    WHERE "lastLogin" IS NOT NULL
      AND "lastLogin" BETWEEN ${startDate} AND ${today}
    GROUP BY DATE_TRUNC(${truncUnit}, "lastLogin")
    ORDER BY date ASC
  `

  return results.map((r: { date: Date; count: bigint }) => ({
    date: period === 'today'
      ? new Date(r.date).getHours().toString().padStart(2, '0') + ':00'
      : new Date(r.date).toISOString().split('T')[0],
    count: Number(r.count),
  }))
}

export async function createOrUpdateUser(
  userData: Partial<UserData> & { email: string }
): Promise<UserData> {
  const existing = await prisma.user.findUnique({ where: { email: userData.email } })

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        isVerified: userData.isVerified ?? existing.isVerified,
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
        name: userData.name ?? existing.name,
        picture: userData.picture ?? existing.picture,
        googleId: userData.googleId ?? existing.googleId,
        facebookId: userData.facebookId ?? existing.facebookId,
        roles: userData.roles ? userData.roles.join(',') : existing.roles,
      },
    })
    return mapUser(updated)
  }

  const created = await prisma.user.create({
    data: {
      email: userData.email,
      isVerified: userData.isVerified ?? false,
      lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : new Date(),
      name: userData.name,
      picture: userData.picture,
      googleId: userData.googleId,
      facebookId: userData.facebookId,
      roles: userData.roles ? userData.roles.join(',') : 'ROLE_USER',
    },
  })
  return mapUser(created)
}
