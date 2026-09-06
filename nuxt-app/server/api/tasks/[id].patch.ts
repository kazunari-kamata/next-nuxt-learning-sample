import { updateTask } from '../../utils/tasks'

type TaskUpdateBody = { title?: unknown; done?: unknown }

function parseTaskId(value: string | undefined) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

/** Updates an existing task for PATCH /api/tasks/:id. */
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
