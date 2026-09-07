'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Task = { id: number; title: string; done: boolean }
type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

/**
 * Next.js Route Handler から取得した task を表示・更新します。
 *
 * Vue component と比較できるよう、hooks と browser event は意図的にこの
 * Client Component に置いています。
 */
export function TaskBoard() {
  // 'use client' を宣言したこのコンポーネントだけで、React hooks とイベントを使えます。
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks])

  useEffect(() => {
    /**
     * component が browser に mount された後、最初の task 一覧を取得します。
     *
     * Server Component は interactive state を持てないため、この client-side
     * request により Nuxt の top-level `useFetch` と比較する Next.js の境界を示します。
     */
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

  /**
   * controlled form input から task を作成します。
   *
   * POST response には作成済み task が含まれるため、React は一覧全体を再取得せず
   * 直接 append できます。
   *
   * @param event - default の page navigation を止める form submission event。
   */
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

  /**
   * partial-update API を通じて一つの task の完了状態を切り替えます。
   *
   * PATCH は authoritative な task を返します。一致する entry だけを置き換えることで、
   * React の immutable state update pattern を示します。
   *
   * @param task - クリックした完了切替 button が表示している task。
   */
  async function updateTask(task: Task) {
    setRequestStatus('loading')
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !task.done }),
      })
      if (!response.ok) throw new Error(`PATCH /api/tasks/${task.id} failed: ${response.status}`)
      const updatedTask: Task = await response.json()
      setTasks((current) => current.map((candidate) => candidate.id === updatedTask.id ? updatedTask : candidate))
      setRequestStatus('success')
    } catch (error) {
      console.error(error)
      setRequestStatus('error')
    }
  }

  /**
   * 一つの task を削除し、204 response の後で local React state から除去します。
   *
   * @param task - クリックした削除 button が表示している task。
   */
  async function deleteTask(task: Task) {
    setRequestStatus('loading')
    try {
      const response = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(`DELETE /api/tasks/${task.id} failed: ${response.status}`)
      setTasks((current) => current.filter((candidate) => candidate.id !== task.id))
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
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.done ? '✓' : '○'} {task.title}
            <button type="button" onClick={() => void updateTask(task)}>{task.done ? '未完了に戻す' : '完了にする'}</button>
            <button type="button" onClick={() => void deleteTask(task)}>削除</button>
          </li>
        ))}
      </ul>
      {debugMode && (
        <details className="debug-panel">
          <summary>Debug mode: client state</summary>
          <pre>{JSON.stringify({ requestStatus, tasks }, null, 2)}</pre>
        </details>
      )}
    </section>
  )
}
