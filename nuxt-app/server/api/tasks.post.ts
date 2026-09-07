import { addTask } from '../utils/tasks'

/**
 * Nuxt の file-based Nitro routing で POST /api/tasks を処理します。
 *
 * @param event - JSON の読み取りと status 設定に使う Nitro の request/response context。
 * @returns status 201 の作成済み task。title が空白なら 400 error を throw します。
 */
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
