import { getTasks } from './tasks.get'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event)
  const title = body?.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  const task = { id: Date.now(), title, done: false }
  getTasks().push(task)
  return task
})
