import { addTask } from '../utils/tasks'

/** Handles POST /api/tasks through Nuxt's file-based Nitro routing. */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event)
  const title = body?.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  // Nuxt/Nitro でも HTTP 処理と状態操作を分けると、後者を単体テストできます。
  const task = addTask(title)
  // Next.js の Route Handler と同じ API 契約として、作成成功を 201 で返します。
  setResponseStatus(event, 201)
  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] POST /api/tasks', task)
  }
  return task
})
