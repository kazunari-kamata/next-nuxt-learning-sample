import { NextResponse } from 'next/server'
import { addTask, listTasks } from './store'

/**
 * 明示的な学習用 debug mode のときだけ server-side request の詳細を出力します。
 *
 * `DEBUG_SAMPLE` の配下に置くことで通常 request の log を避けつつ、Inspector または
 * terminal の利用者へ Route Handler boundary の trace を提供します。
 *
 * @param message - HTTP operation を表す固定の説明。
 * @param context - operation result を説明する任意の structured data。
 */
function debugLog(message: string, context?: unknown) {
  if (process.env.DEBUG_SAMPLE === 'true') console.debug(`[Next API] ${message}`, context ?? '')
}

/**
 * Next.js App Router で GET /api/tasks を処理します。
 *
 * @returns 現在のメモリ内 task 一覧を含む status 200 の JSON response。
 */
export function GET() {
  // App Router の Route Handler は HTTP メソッド名を export して API を定義します。
  const tasks = listTasks()
  debugLog('GET /api/tasks', { count: tasks.length })
  return NextResponse.json(tasks)
}

/**
 * POST /api/tasks を処理し、task 作成前に title を検証します。
 *
 * @param request - title を含む可能性がある JSON body を持つ HTTP request。
 * @returns status 201 の JSON task。title が空白なら status 400 の JSON error。
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
