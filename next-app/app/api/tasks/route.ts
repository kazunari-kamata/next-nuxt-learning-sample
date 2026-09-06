import { NextResponse } from 'next/server'
import { addTask, listTasks } from './store'

/**
 * Emits server-side request details only during the explicit learning debug mode.
 *
 * Keeping this behind `DEBUG_SAMPLE` avoids logging normal requests while still
 * giving an Inspector or terminal user a trace of the Route Handler boundary.
 *
 * @param message - A stable description of the HTTP operation.
 * @param context - Optional structured data that explains the operation result.
 */
function debugLog(message: string, context?: unknown) {
  if (process.env.DEBUG_SAMPLE === 'true') console.debug(`[Next API] ${message}`, context ?? '')
}

/**
 * Handles GET /api/tasks in the Next.js App Router.
 *
 * @returns A 200 JSON response containing the current in-memory task list.
 */
export function GET() {
  // App Router の Route Handler は HTTP メソッド名を export して API を定義します。
  const tasks = listTasks()
  debugLog('GET /api/tasks', { count: tasks.length })
  return NextResponse.json(tasks)
}

/**
 * Handles POST /api/tasks and validates the title before creating a task.
 *
 * @param request - The HTTP request whose JSON body may contain a title.
 * @returns A 201 JSON task, or a 400 JSON error when the title is blank.
 */
export async function POST(request: Request) {
  const body: { title?: string } = await request.json()
  const title = body.title?.trim()
  if (!title) return NextResponse.json({ message: 'title is required' }, { status: 400 })

  // HTTP 層は request/response に集中させ、状態操作はテストしやすい store に分離します。
  const task = addTask(title)
  debugLog('POST /api/tasks', task)
  return NextResponse.json(task, { status: 201 })
}
