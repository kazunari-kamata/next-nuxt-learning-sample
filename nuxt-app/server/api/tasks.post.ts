import { addTask } from '../utils/tasks'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event)
  const title = body?.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  // Nuxt/Nitro でも HTTP 処理と状態操作を分けると、後者を単体テストできます。
  const task = addTask(title)
  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] POST /api/tasks', task)
  }
  return task
})
