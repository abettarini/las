import { Hono } from 'hono'
import { isAdmin } from '../middleware/auth.js'
import {
  ContentData,
  getAllContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} from '../services/content-service.js'

const contentRouter = new Hono()

contentRouter.get('/contents', async (c) => {
  try {
    const contents = await getAllContents()
    return c.json({ success: true, data: contents })
  } catch (error) {
    console.error('Errore GET /contents:', error)
    return c.json({ success: false, message: 'Errore durante il recupero dei contenuti' }, 500)
  }
})

contentRouter.get('/contents/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id') ?? '', 10)
    if (isNaN(id)) return c.json({ success: false, message: 'ID non valido' }, 400)
    const content = await getContentById(id)
    if (!content) return c.json({ success: false, message: 'Contenuto non trovato' }, 404)
    return c.json({ success: true, data: content })
  } catch (error) {
    console.error('Errore GET /contents/:id:', error)
    return c.json({ success: false, message: 'Errore durante il recupero del contenuto' }, 500)
  }
})

contentRouter.post('/contents', isAdmin, async (c) => {
  try {
    const contentData = await c.req.json()
    if (!contentData.type || !contentData.date || !contentData.title || !contentData.abstract || !contentData.fullContent) {
      return c.json({ success: false, message: 'Dati mancanti: type, date, title, abstract e fullContent sono obbligatori' }, 400)
    }
    const newContent = await createContent(contentData as Omit<ContentData, 'id' | 'createdAt' | 'updatedAt'>)
    return c.json({ success: true, data: newContent }, 201)
  } catch (error) {
    console.error('Errore POST /contents:', error)
    return c.json({ success: false, message: 'Errore durante la creazione del contenuto' }, 500)
  }
})

contentRouter.put('/contents/:id', isAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id') ?? '', 10)
    if (isNaN(id)) return c.json({ success: false, message: 'ID non valido' }, 400)
    const contentData = await c.req.json()
    const updatedContent = await updateContent(id, contentData as Partial<Omit<ContentData, 'id' | 'createdAt' | 'updatedAt'>>)
    if (!updatedContent) return c.json({ success: false, message: 'Contenuto non trovato' }, 404)
    return c.json({ success: true, data: updatedContent })
  } catch (error) {
    console.error('Errore PUT /contents/:id:', error)
    return c.json({ success: false, message: "Errore durante l'aggiornamento del contenuto" }, 500)
  }
})

contentRouter.delete('/contents/:id', isAdmin, async (c) => {
  try {
    const id = parseInt(c.req.param('id') ?? '', 10)
    if (isNaN(id)) return c.json({ success: false, message: 'ID non valido' }, 400)
    const success = await deleteContent(id)
    if (!success) return c.json({ success: false, message: 'Contenuto non trovato' }, 404)
    return c.json({ success: true, message: 'Contenuto eliminato con successo' })
  } catch (error) {
    console.error('Errore DELETE /contents/:id:', error)
    return c.json({ success: false, message: "Errore durante l'eliminazione del contenuto" }, 500)
  }
})

export default contentRouter
