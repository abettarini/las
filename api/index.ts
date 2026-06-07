import type { IncomingMessage, ServerResponse } from 'node:http'
import app from './app.js'

export const config = { runtime: 'nodejs', api: { bodyParser: false } }

type VercelReq = IncomingMessage & { body?: Buffer | string | Record<string, unknown> }

export default async function handler(req: VercelReq, res: ServerResponse) {
  let body: Buffer | undefined

  if (req.body !== undefined) {
    // vercel dev pre-reads the body even with bodyParser: false
    body = Buffer.isBuffer(req.body) ? req.body
      : typeof req.body === 'string' ? Buffer.from(req.body)
      : Buffer.from(JSON.stringify(req.body))
  } else {
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    if (chunks.length > 0) body = Buffer.concat(chunks)
  }

  const host = req.headers.host ?? 'localhost:3000'
  const url = new URL(req.url ?? '/', `http://${host}`)
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue
    Array.isArray(v) ? v.forEach(val => headers.append(k, val)) : headers.set(k, v)
  }

  const fetchReq = new Request(url, {
    method: req.method ?? 'GET',
    headers,
    body: body?.length ? body : undefined,
  })

  const response = await app.fetch(fetchReq)

  res.statusCode = response.status
  response.headers.forEach((v, k) => res.setHeader(k, v))
  res.end(Buffer.from(await response.arrayBuffer()))
}
