import { Hono } from 'hono'
import { isAuthenticated } from '../middleware/auth.js'
import {
  sendAuthenticationEmail,
  sendVerificationEmail,
} from '../services/email-service.js'
import {
  generateGoogleAuthUrl,
  handleGoogleCallback,
  saveOAuthState,
} from '../services/google-auth-service.js'
import { verifyJWT } from '../services/jwt-service.js'
import {
  createUser,
  generateAuthToken,
  generateNewVerificationToken,
  getUserByEmail,
  getUserById,
  updateUserLastLogin,
  updateUserProfile,
  verifyAuthToken,
  verifyUserEmail,
  type UserProfileData,
} from '../services/user-service.js'

const authRouter = new Hono()

function getEnv() {
  return {
    JWT_SECRET: process.env.JWT_SECRET!,
    EMAIL_SECRET: process.env.EMAIL_SECRET!,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY!,
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL!,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  }
}

async function verifyTurnstileToken(token: string, secretKey: string, ip: string): Promise<boolean> {
  const formData = new FormData()
  formData.append('secret', secretKey)
  formData.append('response', token)
  formData.append('remoteip', ip)
  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })
  const outcome = await result.json() as { success: boolean }
  return outcome.success
}

// POST /auth/register
authRouter.post('/auth/register', async (c) => {
  try {
    const data = await c.req.json() as {
      email: string; emailConfirmation: string; birthDate: string
      securityQuestion1: string; securityAnswer1: string
      securityQuestion2: string; securityAnswer2: string
      cfTurnstileResponse: string
    }
    const env = getEnv()
    const clientIP = c.req.header('CF-Connecting-IP') ?? c.req.header('X-Forwarded-For') ?? '0.0.0.0'

    const isTokenValid = await verifyTurnstileToken(data.cfTurnstileResponse, env.TURNSTILE_SECRET_KEY, clientIP)
    if (!isTokenValid) return c.json({ success: false, message: 'Verifica di sicurezza fallita' }, 400)

    if (!data.email || !data.emailConfirmation || !data.birthDate ||
        !data.securityQuestion1 || !data.securityAnswer1 ||
        !data.securityQuestion2 || !data.securityAnswer2) {
      return c.json({ success: false, message: 'Dati mancanti o non validi' }, 400)
    }
    if (data.email !== data.emailConfirmation) {
      return c.json({ success: false, message: 'Le email non corrispondono' }, 400)
    }

    const existing = await getUserByEmail(data.email)
    if (existing) return c.json({ success: false, message: 'Email già in uso' }, 409)

    const user = await createUser({
      email: data.email, birthDate: data.birthDate,
      securityQuestion1: data.securityQuestion1, securityAnswer1: data.securityAnswer1,
      securityQuestion2: data.securityQuestion2, securityAnswer2: data.securityAnswer2,
    })

    const frontendUrl = env.FRONTEND_URL || new URL(c.req.url).origin
    await sendVerificationEmail(user, frontendUrl, env)

    return c.json({
      success: true,
      message: 'Registrazione completata con successo. Controlla la tua email per verificare il tuo account.',
    }, 201)
  } catch (error) {
    console.error('Errore registrazione:', error)
    return c.json({ success: false, message: 'Errore durante la registrazione' }, 500)
  }
})

// POST /auth/verify-email
authRouter.post('/auth/verify-email', async (c) => {
  try {
    const { token } = await c.req.json() as { token: string }
    if (!token) return c.json({ success: false, message: 'Token mancante' }, 400)
    const user = await verifyUserEmail(token)
    if (!user) return c.json({ success: false, message: 'Token non valido o scaduto' }, 400)
    return c.json({ success: true, message: 'Email verificata con successo', user: { id: user.id, email: user.email, isVerified: user.isVerified } })
  } catch (error) {
    console.error('Errore verifica email:', error)
    return c.json({ success: false, message: 'Errore durante la verifica email' }, 500)
  }
})

// POST /auth/login
authRouter.post('/auth/login', async (c) => {
  try {
    const { email } = await c.req.json() as { email: string }
    if (!email) return c.json({ success: false, message: 'Email mancante' }, 400)

    const user = await getUserByEmail(email)
    if (!user) return c.json({ success: false, message: 'Utente non trovato' }, 404)

    const env = getEnv()

    if (!user.isVerified) {
      const updatedUser = await generateNewVerificationToken(email)
      const frontendUrl = env.FRONTEND_URL || new URL(c.req.url).origin
      if (updatedUser) await sendVerificationEmail(updatedUser, frontendUrl, env)
      return c.json({
        success: false,
        message: 'Email non verificata. Ti abbiamo inviato una nuova email di verifica.',
        requiresVerification: true,
      }, 403)
    }

    const token = await generateAuthToken(user, env)
    const frontendUrl = env.FRONTEND_URL || new URL(c.req.url).origin
    await sendAuthenticationEmail(user, token, frontendUrl, env)

    return c.json({ success: true, message: "Ti abbiamo inviato un'email con un link per accedere al tuo account" })
  } catch (error) {
    console.error('Errore login:', error)
    return c.json({ success: false, message: "Errore durante l'autenticazione" }, 500)
  }
})

// POST /auth/verify-token
authRouter.post('/auth/verify-token', async (c) => {
  try {
    const { token } = await c.req.json() as { token: string }
    if (!token) return c.json({ success: false, message: 'Token mancante' }, 400)
    const user = await verifyAuthToken(token, getEnv())
    if (!user) return c.json({ success: false, message: 'Token non valido o scaduto' }, 401)
    await updateUserLastLogin(user.id)
    return c.json({ success: true, message: 'Token valido', user: { id: user.id, email: user.email, isVerified: user.isVerified }, token })
  } catch (error) {
    console.error('Errore verifica token:', error)
    return c.json({ success: false, message: 'Errore durante la verifica del token' }, 500)
  }
})

// GET /auth/verify
authRouter.get('/auth/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return c.json({ success: false, message: 'Token mancante o non valido' }, 401)
    const token = authHeader.substring(7)
    const payload = await verifyJWT(token, getEnv())
    if (!payload?.sub) return c.json({ success: false, message: 'Token non valido' }, 401)
    const user = await getUserById(payload.sub)
    if (!user) return c.json({ success: false, message: 'Utente non trovato' }, 404)
    return c.json({
      success: true, message: 'Token valido',
      user: {
        id: user.id, email: user.email, isVerified: user.isVerified,
        name: user.name, picture: user.picture, phone: user.phone,
        portoArmi: user.portoArmi, scadenzaPortoArmi: user.scadenzaPortoArmi,
        isSocio: user.isSocio, numeroTessera: user.numeroTessera,
        quotaAnnuale: user.quotaAnnuale, privacyConsent: user.privacyConsent,
        roles: user.roles ?? ['ROLE_USER'],
      },
    })
  } catch (error) {
    console.error('Errore verifica token:', error)
    return c.json({ success: false, message: 'Errore durante la verifica del token' }, 500)
  }
})

// GET /auth/google/login
authRouter.get('/auth/google/login', async (c) => {
  try {
    const env = getEnv()
    const state = crypto.randomUUID()
    const redirectUri = c.req.query('redirect_uri') ?? env.FRONTEND_URL
    await saveOAuthState(state, redirectUri)
    const authUrl = generateGoogleAuthUrl(env, state, `${new URL(redirectUri).origin}/auth/google/callback`)
    return c.json({ success: true, authUrl, state })
  } catch (error) {
    console.error('Errore Google login init:', error)
    return c.json({ success: false, message: "Errore durante l'inizializzazione del login Google" }, 500)
  }
})

// GET /auth/google/callback
authRouter.get('/auth/google/callback', async (c) => {
  try {
    const code = c.req.query('code')
    const state = c.req.query('state')
    if (!code || !state) return c.json({ success: false, message: 'Parametri mancanti nella risposta di Google' }, 400)
    const { user, token, googleTokens } = await handleGoogleCallback(code, state, getEnv())
    return c.json({
      success: true, message: 'Autenticazione completata con successo',
      user: { id: user.id, email: user.email, isVerified: user.isVerified, name: user.name, picture: user.picture, roles: user.roles ?? ['ROLE_USER'] },
      token, accessToken: googleTokens.access_token, idToken: googleTokens.id_token, refreshToken: googleTokens.refresh_token,
    })
  } catch (error) {
    console.error('Errore Google callback:', error)
    return c.json({ success: false, message: "Errore durante l'autenticazione con Google" }, 500)
  }
})

// GET /me/bookings
authRouter.get('/me/bookings', isAuthenticated, async (c) => {
  try {
    // Stub — booking-service sarà aggiunto in Fase 3
    return c.json({ success: true, bookings: [] })
  } catch (error) {
    console.error('Errore me/bookings:', error)
    return c.json({ success: false, message: 'Errore durante il recupero delle prenotazioni' }, 500)
  }
})

// PUT /me/profile
authRouter.put('/me/profile', isAuthenticated, async (c) => {
  try {
    const authHeader = c.req.header('Authorization')!
    const token = authHeader.substring(7)
    const payload = await verifyJWT(token, getEnv())
    if (!payload?.sub) return c.json({ success: false, message: 'Token non valido' }, 401)
    const profileData = await c.req.json() as UserProfileData
    const updatedUser = await updateUserProfile(payload.sub, profileData)
    if (!updatedUser) return c.json({ success: false, message: 'Utente non trovato' }, 404)
    return c.json({
      success: true, message: 'Profilo aggiornato con successo',
      user: {
        id: updatedUser.id, email: updatedUser.email, isVerified: updatedUser.isVerified,
        name: updatedUser.name, picture: updatedUser.picture, phone: updatedUser.phone,
        portoArmi: updatedUser.portoArmi, scadenzaPortoArmi: updatedUser.scadenzaPortoArmi,
        isSocio: updatedUser.isSocio, numeroTessera: updatedUser.numeroTessera,
        quotaAnnuale: updatedUser.quotaAnnuale, privacyConsent: updatedUser.privacyConsent,
      },
    })
  } catch (error) {
    console.error('Errore me/profile:', error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento del profilo" }, 500)
  }
})

// PUT /user/settings
authRouter.put('/user/settings', isAuthenticated, async (c) => {
  try {
    const authHeader = c.req.header('Authorization')!
    const token = authHeader.substring(7)
    const payload = await verifyJWT(token, getEnv())
    if (!payload?.sub) return c.json({ success: false, message: 'Token non valido' }, 401)
    const { privacyConsent } = await c.req.json() as { privacyConsent?: boolean }
    const settingsData: UserProfileData = {}
    if (privacyConsent !== undefined) settingsData.privacyConsent = privacyConsent
    const updatedUser = await updateUserProfile(payload.sub, settingsData)
    if (!updatedUser) return c.json({ success: false, message: 'Utente non trovato' }, 404)
    return c.json({
      success: true, message: 'Impostazioni aggiornate con successo',
      user: {
        id: updatedUser.id, email: updatedUser.email, isVerified: updatedUser.isVerified,
        name: updatedUser.name, picture: updatedUser.picture, phone: updatedUser.phone,
        portoArmi: updatedUser.portoArmi, scadenzaPortoArmi: updatedUser.scadenzaPortoArmi,
        isSocio: updatedUser.isSocio, numeroTessera: updatedUser.numeroTessera,
        quotaAnnuale: updatedUser.quotaAnnuale, privacyConsent: updatedUser.privacyConsent,
      },
    })
  } catch (error) {
    console.error('Errore user/settings:', error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento delle impostazioni" }, 500)
  }
})

export default authRouter
