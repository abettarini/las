import { SignJWT, jwtVerify } from 'jose'

export interface JWTPayload {
  sub: string
  email: string
  name?: string
  picture?: string
  encryptedData: string
  roles?: string[]
  iat: number
  exp: number
}

function getSecret(jwtSecret: string): Uint8Array {
  return new TextEncoder().encode(jwtSecret)
}

async function normalizeKey(key: string): Promise<Uint8Array> {
  const raw = new TextEncoder().encode(key)
  const normalized = new Uint8Array(32)
  for (let i = 0; i < 32; i++) normalized[i] = raw[i % raw.length]
  return normalized
}

async function encryptData(data: unknown, key: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const keyData = await normalizeKey(key)
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  )
  const dataBuffer = new TextEncoder().encode(JSON.stringify(data))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, dataBuffer)
  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv, 0)
  result.set(new Uint8Array(encrypted), iv.length)
  return btoa(String.fromCharCode(...result))
}

async function decryptData(encryptedData: string, key: string): Promise<unknown> {
  const buf = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
  const iv = buf.slice(0, 12)
  const data = buf.slice(12)
  const keyData = await normalizeKey(key)
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
  )
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data)
  return JSON.parse(new TextDecoder().decode(decrypted))
}

async function emailHash(email: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email))
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function generateJWT(
  user: { id: string; email: string; name?: string | null; picture?: string | null; roles?: string[] },
  env: { JWT_SECRET: string; EMAIL_SECRET: string }
): Promise<string> {
  const encryptedData = await encryptData({ emailHash: await emailHash(user.email) }, env.EMAIL_SECRET)
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name ?? undefined,
    picture: user.picture ?? undefined,
    encryptedData,
    roles: user.roles ?? ['ROLE_USER'],
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret(env.JWT_SECRET))
}

export async function verifyJWT(
  token: string,
  env: { JWT_SECRET: string; EMAIL_SECRET: string }
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(env.JWT_SECRET))
    const p = payload as unknown as JWTPayload

    if (!p.encryptedData || !p.email) return null
    const decrypted = await decryptData(p.encryptedData, env.EMAIL_SECRET) as { emailHash: string }
    if ((await emailHash(p.email)) !== decrypted.emailHash) return null
    return p
  } catch {
    return null
  }
}
