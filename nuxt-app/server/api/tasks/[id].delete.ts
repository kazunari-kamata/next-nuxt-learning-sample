import { deleteTask } from '../../utils/tasks'

/**
 * Converts a Nitro route parameter into the positive integer used by the store.
 *
 * @param value - The optional `[id]` parameter from the matched route.
 * @returns The validated ID, or undefined when the parameter is invalid.
 */
function parseTaskId(value: string | undefined) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

/**
 * Handles DELETE /api/tasks/:id in Nitro.
 *
 * @param event - Nitro's request context, including the dynamic ID and response status.
 * @returns Null with status 204, or throws a 400 validation error or 404 not-found error.
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
