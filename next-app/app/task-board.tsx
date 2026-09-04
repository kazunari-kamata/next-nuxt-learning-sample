'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Task = { id: number; title: string; done: boolean }
type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

export function TaskBoard() {
  // 'use client' を宣言したこのコンポーネントだけで、React hooks とイベントを使えます。
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks])

  useEffect(() => {
    // 初回マウント後に Route Handler からデータを取得します。
    async function loadTasks() {
      setRequestStatus('loading')
      try {
        const response = await fetch('/api/tasks')
        if (!response.ok) throw new Error(`GET /api/tasks failed: ${response.status}`)
        setTasks(await response.json())
        setRequestStatus('success')
      } catch (error) {
        console.error(error)
        setRequestStatus('error')
      }
    }

    void loadTasks()
  }, [])

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return

    // フォームの状態を POST し、返却された task を React state に反映します。
    setRequestStatus('loading')
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!response.ok) throw new Error(`POST /api/tasks failed: ${response.status}`)
      const task: Task = await response.json()
      setTasks((current) => [...current, task])
      setTitle('')
      setRequestStatus('success')
    } catch (error) {
      console.error(error)
      setRequestStatus('error')
    }
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
      {debugMode && (
        <details className="debug-panel">
          <summary>Debug mode: client state</summary>
          <pre>{JSON.stringify({ requestStatus, tasks }, null, 2)}</pre>
        </details>
      )}
    </section>
  )
}
