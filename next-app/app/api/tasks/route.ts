import { NextResponse } from 'next/server'
import { addTask, listTasks } from './store'

function debugLog(message: string, context?: unknown) {
  if (process.env.DEBUG_SAMPLE === 'true') console.debug(`[Next API] ${message}`, context ?? '')
}

/** Handles GET requests for the Next.js task API. */
export function GET() {
  // App Router の Route Handler は HTTP メソッド名を export して API を定義します。
  const tasks = listTasks()
  debugLog('GET /api/tasks', { count: tasks.length })
  return NextResponse.json(tasks)
}

/** Creates a task from the JSON request body for POST /api/tasks. */
export async function POST(request: Request) {
  const body: { title?: string } = await request.json()
  const title = body.title?.trim()
  if (!title) return NextResponse.json({ message: 'title is required' }, { status: 400 })

  // HTTP 層は request/response に集中させ、状態操作はテストしやすい store に分離します。
  const task = addTask(title)
  debugLog('POST /api/tasks', task)
  return NextResponse.json(task, { status: 201 })
}
