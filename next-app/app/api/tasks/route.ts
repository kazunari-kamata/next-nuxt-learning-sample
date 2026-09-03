import { NextResponse } from 'next/server'

type Task = { id: number; title: string; done: boolean }

let tasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]

export function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const body: { title?: string } = await request.json()
  const title = body.title?.trim()
  if (!title) return NextResponse.json({ message: 'title is required' }, { status: 400 })

  const task = { id: Date.now(), title, done: false }
  tasks = [...tasks, task]
  return NextResponse.json(task, { status: 201 })
}
