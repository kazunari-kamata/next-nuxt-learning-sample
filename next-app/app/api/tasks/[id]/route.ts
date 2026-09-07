import { NextResponse } from 'next/server'
import { deleteTask, updateTask } from '../store'

type RouteContext = { params: Promise<{ id: string }> }
type TaskUpdateBody = { title?: unknown; done?: unknown }

/**
 * dynamic route segment を store が使う正の整数へ変換します。
 *
 * @param value - App Router が渡す `[id]` parameter。
 * @returns 検証済み ID。値が正の safe integer でなければ undefined。
 */
function parseTaskId(value: string) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

/**
 * 明示的な学習用 debug mode が有効な間、dynamic-route request の詳細を出力します。
 *
 * @param message - PATCH または DELETE operation を表す固定の説明。
 * @param context - server-side trace 用の任意の structured data。
 */
function debugLog(message: string, context?: unknown) {
  if (process.env.DEBUG_SAMPLE === 'true') console.debug(`[Next API] ${message}`, context ?? '')
}

/**
 * PATCH /api/tasks/:id を partial update として処理します。
 *
 * handler は store の呼び出し前に route parameter と指定 field を検証します。
 * これにより HTTP error を domain-state operation から分離します。
 *
 * @param request - title および/または done を含む JSON request。
 * @param context - dynamic ID を非同期に公開する App Router context。
 * @returns status 200 の JSON task、または status 400/404 の JSON error。
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
 * DELETE /api/tasks/:id を処理します。
 *
 * @param _ - 未使用の request object。この operation は route ID だけを使います。
 * @param context - dynamic ID を非同期に公開する App Router context。
 * @returns status 204 の空 response、または status 400/404 の JSON error。
 */
export async function DELETE(_: Request, { params }: RouteContext) {
  const id = parseTaskId((await params).id)
  if (!id) return NextResponse.json({ message: 'id must be a positive integer' }, { status: 400 })

  const task = deleteTask(id)
  if (!task) return NextResponse.json({ message: 'task not found' }, { status: 404 })

  debugLog('DELETE /api/tasks/:id', task)
  return new NextResponse(null, { status: 204 })
}
