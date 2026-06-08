import { prisma } from '../lib/prisma.js'

export async function isSubscribed(email: string): Promise<boolean> {
  const row = await prisma.newsletterSubscription.findUnique({
    where: { email },
    select: { unsubscribedAt: true },
  })
  return row !== null && row.unsubscribedAt === null
}

export async function subscribe(email: string): Promise<'subscribed' | 'already_subscribed'> {
  const existing = await prisma.newsletterSubscription.findUnique({ where: { email } })

  if (existing) {
    if (existing.unsubscribedAt === null) return 'already_subscribed'
    await prisma.newsletterSubscription.update({
      where: { email },
      data: { unsubscribedAt: null, subscribedAt: new Date() },
    })
    return 'subscribed'
  }

  await prisma.newsletterSubscription.create({ data: { email } })
  return 'subscribed'
}

export async function unsubscribe(email: string): Promise<'unsubscribed' | 'not_found'> {
  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email },
    select: { unsubscribedAt: true },
  })

  if (!existing || existing.unsubscribedAt !== null) return 'not_found'

  await prisma.newsletterSubscription.update({
    where: { email },
    data: { unsubscribedAt: new Date() },
  })
  return 'unsubscribed'
}
