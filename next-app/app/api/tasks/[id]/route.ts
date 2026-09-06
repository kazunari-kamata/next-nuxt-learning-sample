import { NextResponse } from 'next/server'
import { deleteTask, updateTask } from '../store'

type RouteContext = { params: Promise<{ id: string }> }
type TaskUpdateBody = { title?: unknown; done?: unknown }

/**
 * Converts a dynamic route segment into the positive integer used by the store.
 *
 * @param value - The `[id]` parameter supplied by the App Router.
 * @returns The validated ID, or undefined when the value is not a positive safe integer.
 */
function parseTaskId(value: string) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

/**
 * Emits dynamic-route request details while the explicit learning debug mode is enabled.
 *
 * @param message - A stable description of the PATCH or DELETE operation.
 * @param context - Optional structured data for the server-side trace.
 */
function debugLog(message: string, context?: unknown) {
  if (process.env.DEBUG_SAMPLE === 'true') console.debug(`[Next API] ${message}`, context ?? '')
}

/**
 * Handles PATCH /api/tasks/:id as a partial update.
 *
 * The handler validates the route parameter and supplied fields before calling
 * the store, so HTTP errors remain separate from domain-state operations.
 *
 * @param request - The JSON request containing title and/or done.
 * @param context - App Router context that asynchronously exposes the dynamic ID.
 * @returns A 200 JSON task, or a 400/404 JSON error.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  const id = parseTaskId((await params).id)
  if (!id) return NextResponse.json({ message: 'id must be a positive integer' }, { status: 400 })

  const body: TaskUpdateBody = await request.json()
  const rawTitle = typeof body.title === 'string' ? body.title : undefined
  const rawDone = typeof body.done === 'boolean' ? body.done : undefined
  const hasTitle = rawTitle !== undefined
  const hasDone = rawDone !== undefined
  if ((body.title !== undefined && !hasTitle) || (body.done !== undefined && !hasDone) || (!hasTitle && !hasDone)) {
    return NextResponse.json({ message: 'title or done is required' }, { status: 400 })
  }

  const title = rawTitle?.trim()
  if (hasTitle && !title) return NextResponse.json({ message: 'title is required' }, { status: 400 })

  const task = updateTask(id, { title, done: rawDone })
  if (!task) return NextResponse.json({ message: 'task not found' }, { status: 404 })

  debugLog('PATCH /api/tasks/:id', task)
  return NextResponse.json(task)
}

/**
 * Handles DELETE /api/tasks/:id.
 *
 * @param _ - The unused request object; the operation needs only the route ID.
 * @param context - App Router context that asynchronously exposes the dynamic ID.
 * @returns A 204 empty response, or a 400/404 JSON error.
 */
export async function DELETE(_: Request, { params }: RouteContext) {
  const id = parseTaskId((await params).id)
  if (!id) return NextResponse.json({ message: 'id must be a positive integer' }, { status: 400 })

  const task = deleteTask(id)
  if (!task) return NextResponse.json({ message: 'task not found' }, { status: 404 })

  debugLog('DELETE /api/tasks/:id', task)
  return new NextResponse(null, { status: 204 })
}
