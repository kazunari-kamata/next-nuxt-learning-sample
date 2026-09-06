import { updateTask } from '../../utils/tasks'

type TaskUpdateBody = { title?: unknown; done?: unknown }

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
 * Handles PATCH /api/tasks/:id as a partial update in Nitro.
 *
 * @param event - Nitro's request context, including the dynamic ID and JSON body.
 * @returns The updated task, or throws a 400 validation error or 404 not-found error.
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
