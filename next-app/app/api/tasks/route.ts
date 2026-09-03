import { NextResponse } from 'next/server'
import { addTask, listTasks } from './store'

export function GET() {
  // App Router の Route Handler は HTTP メソッド名を export して API を定義します。
  return NextResponse.json(listTasks())
}

export async function POST(request: Request) {
  const body: { title?: string } = await request.json()
  const title = body.title?.trim()
  if (!title) return NextResponse.json({ message: 'title is required' }, { status: 400 })

  // HTTP 層は request/response に集中させ、状態操作はテストしやすい store に分離します。
  const task = addTask(title)
  return NextResponse.json(task, { status: 201 })
}
