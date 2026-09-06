'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Task = { id: number; title: string; done: boolean }
type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

/**
 * Displays and updates tasks from the Next.js Route Handler.
 *
 * This Client Component deliberately contains hooks and browser events so that
 * they can be compared with the Vue component in the Nuxt sample.
 */
export function TaskBoard() {
  // 'use client' を宣言したこのコンポーネントだけで、React hooks とイベントを使えます。
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const remaining = useMemo(() => tasks.filter((task) => !task.done).length, [tasks])

  useEffect(() => {
    /**
     * Fetches the first task list after the component is mounted in the browser.
     *
     * A Server Component cannot own interactive state, so this client-side
     * request makes the Next.js boundary visible for comparison with Nuxt's
     * top-level `useFetch`.
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
   * Creates a task from the controlled form input.
   *
   * The POST response already contains the created task, so React can append
   * it directly instead of fetching the complete list again.
   *
   * @param event - The form submission event whose default page navigation is prevented.
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
   * Toggles one task's completion state through the partial-update API.
   *
   * PATCH returns the authoritative task. Replacing only the matching entry
   * demonstrates React's immutable state update pattern.
   *
   * @param task - The task displayed by the clicked completion button.
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
   * Deletes one task and removes it from the local React state after a 204 response.
   *
   * @param task - The task displayed by the clicked delete button.
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
