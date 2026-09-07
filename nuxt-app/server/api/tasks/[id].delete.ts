import { deleteTask } from '../../utils/tasks'

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
 * Nitro で DELETE /api/tasks/:id を処理します。
 *
 * @param event - dynamic ID と response status を含む Nitro の request context。
 * @returns status 204 の null。検証失敗なら 400、見つからなければ 404 error を throw します。
 */
export default defineEventHandler((event) => {
  const id = parseTaskId(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id must be a positive integer' })

  const task = deleteTask(id)
  if (!task) throw createError({ statusCode: 404, statusMessage: 'task not found' })

  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] DELETE /api/tasks/:id', task)
  }
  setResponseStatus(event, 204)
  return null
})
