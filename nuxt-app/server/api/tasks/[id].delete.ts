import { deleteTask } from '../../utils/tasks'

function parseTaskId(value: string | undefined) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

/** Removes an existing task for DELETE /api/tasks/:id. */
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
