import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { prisma } from '../lib/prisma.js'

export interface ContentData {
  id: number
  type: 'target' | 'event' | 'article' | 'video' | 'book'
  date: string
  title: string
  abstract: string
  fullContent: string
  createdAt?: string
  updatedAt?: string
}

function toContentData(c: {
  id: number
  type: string
  date: string
  title: string
  abstract: string
  fullContent: string
  createdAt: Date
  updatedAt: Date
}): ContentData {
  return {
    id: c.id,
    type: c.type as ContentData['type'],
    date: c.date,
    title: c.title,
    abstract: c.abstract,
    fullContent: c.fullContent,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }
}

export async function getAllContents(): Promise<ContentData[]> {
  const results = await prisma.content.findMany({ orderBy: { date: 'desc' } })
  return results.map(toContentData)
}

export async function getContentById(id: number): Promise<ContentData | null> {
  const result = await prisma.content.findUnique({ where: { id } })
  return result ? toContentData(result) : null
}

export async function createContent(
  contentData: Omit<ContentData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ContentData> {
  const result = await prisma.content.create({ data: contentData })
  return toContentData(result)
}

export async function updateContent(
  id: number,
  contentData: Partial<Omit<ContentData, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ContentData | null> {
  try {
    const result = await prisma.content.update({ where: { id }, data: contentData })
    return toContentData(result)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return null
    }
    throw error
  }
}

export async function deleteContent(id: number): Promise<boolean> {
  try {
    await prisma.content.delete({ where: { id } })
    return true
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return false
    }
    throw error
  }
}
