import { prisma } from '../lib/prisma.js'
import { generateJWT } from './jwt-service.js'
import { createOrUpdateUser } from './user-service.js'

interface GoogleAuthEnv {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  FRONTEND_URL: string
  JWT_SECRET: string
  EMAIL_SECRET: string
}

interface GoogleTokens {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}

interface GoogleProfile {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
}

export function generateGoogleAuthUrl(env: GoogleAuthEnv, state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    state,
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

async function exchangeCodeForTokens(code: string, redirectUri: string, env: GoogleAuthEnv): Promise<GoogleTokens> {
  const params = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) {
    const err = await res.json() as { error_description?: string; error?: string }
    throw new Error(`Errore scambio codice: ${err.error_description ?? err.error}`)
  }
  return res.json() as Promise<GoogleTokens>
}

async function getGoogleProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const err = await res.json() as { error_description?: string; error?: string }
    throw new Error(`Errore profilo Google: ${err.error_description ?? err.error}`)
  }
  return res.json() as Promise<GoogleProfile>
}

export async function saveOAuthState(state: string, redirectUri: string): Promise<void> {
  await prisma.oAuthState.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  await prisma.oAuthState.create({
    data: { state, redirectUri, expiresAt: new Date(Date.now() + 30 * 60 * 1000) },
  })
}

export async function handleGoogleCallback(
  code: string,
  state: string,
  env: GoogleAuthEnv
): Promise<{ user: Awaited<ReturnType<typeof createOrUpdateUser>>; token: string; googleTokens: GoogleTokens }> {
  const oauthState = await prisma.oAuthState.findUnique({ where: { state } })
  if (!oauthState) throw new Error('Stato non valido o scaduto. Prova a effettuare nuovamente il login.')
  if (oauthState.expiresAt < new Date()) {
    await prisma.oAuthState.delete({ where: { state } })
    throw new Error('Stato scaduto. Prova a effettuare nuovamente il login.')
  }
  await prisma.oAuthState.delete({ where: { state } })

  const redirectUri = `${new URL(oauthState.redirectUri).origin}/auth/google/callback`
  const googleTokens = await exchangeCodeForTokens(code, redirectUri, env)
  const profile = await getGoogleProfile(googleTokens.access_token)

  const user = await createOrUpdateUser({
    email: profile.email,
    isVerified: profile.email_verified,
    name: profile.name,
    picture: profile.picture,
    googleId: profile.sub,
    lastLogin: new Date().toISOString(),
  })

  const token = await generateJWT(
    { id: user.id, email: user.email, name: user.name, picture: user.picture, roles: user.roles },
    env
  )

  return { user, token, googleTokens }
}
