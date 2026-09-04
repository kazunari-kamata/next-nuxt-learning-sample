/** A task returned by the sample API. */
export type Task = { id: number; title: string; done: boolean }

const initialTasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]
let tasks = [...initialTasks]

/**
 * Returns all tasks held by the in-memory learning store.
 * Replace this function with a database query in a production application.
 */
export function listTasks() {
  return tasks
}

/** Adds a task independently from HTTP and UI concerns. */
export function addTask(title: string): Task {
  const task = { id: Date.now(), title, done: false }
  tasks = [...tasks, task]
  return task
}

/** Resets the in-memory store for isolated tests in this learning sample. */
export function resetTasksForTest() {
  tasks = [...initialTasks]
}
