import { NextResponse } from 'next/server'
import { deleteTask, updateTask } from '../store'

type RouteContext = { params: Promise<{ id: string }> }
type TaskUpdateBody = { title?: unknown; done?: unknown }

function parseTaskId(value: string) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

function debugLog(message: string, context?: unknown) {
  if (process.env.DEBUG_SAMPLE === 'true') console.debug(`[Next API] ${message}`, context ?? '')
}

/** Updates an existing task for PATCH /api/tasks/:id. */
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

/** Removes an existing task for DELETE /api/tasks/:id. */
export async function DELETE(_: Request, { params }: RouteContext) {
  const id = parseTaskId((await params).id)
  if (!id) return NextResponse.json({ message: 'id must be a positive integer' }, { status: 400 })

  const task = deleteTask(id)
  if (!task) return NextResponse.json({ message: 'task not found' }, { status: 404 })

  debugLog('DELETE /api/tasks/:id', task)
  return new NextResponse(null, { status: 204 })
}
