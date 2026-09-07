import { updateTask } from '../../utils/tasks'

type TaskUpdateBody = { title?: unknown; done?: unknown }

/**
 * Nitro の route parameter を store が使う正の整数へ変換します。
 *
 * @param value - 一致した route から得る任意の `[id]` parameter。
 * @returns 検証済みの ID。parameter が不正なら undefined。
 */
function parseTaskId(value: string | undefined) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

/**
 * Nitro で PATCH /api/tasks/:id の部分更新を処理します。
 *
 * @param event - dynamic ID と JSON body を含む Nitro の request context。
 * @returns 更新済み task。検証失敗なら 400、見つからなければ 404 error を throw します。
 */
export default defineEventHandler(async (event) => {
  const id = parseTaskId(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id must be a positive integer' })

  const body = await readBody<TaskUpdateBody>(event)
  const rawTitle = typeof body?.title === 'string' ? body.title : undefined
  const rawDone = typeof body?.done === 'boolean' ? body.done : undefined
  const hasTitle = rawTitle !== undefined
  const hasDone = rawDone !== undefined
  if ((body?.title !== undefined && !hasTitle) || (body?.done !== undefined && !hasDone) || (!hasTitle && !hasDone)) {
    throw createError({ statusCode: 400, statusMessage: 'title or done is required' })
  }

  const title = rawTitle?.trim()
  if (hasTitle && !title) throw createError({ statusCode: 400, statusMessage: 'title is required' })

  const task = updateTask(id, { title, done: rawDone })
  if (!task) throw createError({ statusCode: 404, statusMessage: 'task not found' })

  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] PATCH /api/tasks/:id', task)
  }
  return task
})
