'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Task = { id: number; title: string; done: boolean }

export function TaskBoard() {
  // 'use client' を宣言したこのコンポーネントだけで、React hooks とイベントを使えます。
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks])

  useEffect(() => {
    // 初回マウント後に Route Handler からデータを取得します。
    fetch('/api/tasks').then((response) => response.json()).then(setTasks)
  }, [])

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return

    // フォームの状態を POST し、返却された task を React state に反映します。
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    const task: Task = await response.json()
    setTasks((current) => [...current, task])
    setTitle('')
  }

  return (
    <section className="card">
      <h2>Client Component: TaskBoard</h2>
      <form onSubmit={addTask}>
        <input aria-label="タスク名" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="例: ルーティングを比較する" />
        <button type="submit">追加</button>
      </form>
      <p>未完了: {remaining} 件</p>
      <ul>{tasks.map((task) => <li key={task.id}>{task.done ? '✓' : '○'} {task.title}</li>)}</ul>
    </section>
  )
}
