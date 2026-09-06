/** A task returned by the sample API and rendered by both learning UIs. */
export type Task = { id: number; title: string; done: boolean }

/** Fields that can be changed independently by a PATCH request. */
export type TaskUpdate = { title?: string; done?: boolean }

const initialTasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]
let tasks = [...initialTasks]

/**
 * Returns all tasks held by the in-memory learning store.
 * Replace this function with a database query in a production application.
 *
 * @returns The current task list for the running server process.
 */
export function listTasks() {
  return tasks
}

/**
 * Adds a task independently from HTTP and UI concerns.
 *
 * @param title - The already validated, non-empty task title.
 * @returns The newly created incomplete task.
 */
export function addTask(title: string): Task {
  const task = { id: Date.now(), title, done: false }
  tasks = [...tasks, task]
  return task
}

/**
 * Updates only the supplied fields of a task.
 *
 * Undefined fields are deliberately left unchanged, which gives PATCH its
 * partial-update semantics rather than overwriting an omitted value.
 *
 * @param id - The task identifier to update.
 * @param update - The title and/or completion state to replace.
 * @returns The updated task, or undefined when no task has the ID.
 */
export function updateTask(id: number, update: TaskUpdate): Task | undefined {
  let updatedTask: Task | undefined

  tasks = tasks.map((task) => {
    if (task.id !== id) return task

    updatedTask = {
      ...task,
      ...(update.title === undefined ? {} : { title: update.title }),
      ...(update.done === undefined ? {} : { done: update.done }),
    }
    return updatedTask
  })

  return updatedTask
}

/**
 * Removes a task from the in-memory list.
 *
 * @param id - The task identifier to remove.
 * @returns The removed task, or undefined when no task has the ID.
 */
export function deleteTask(id: number): Task | undefined {
  const task = tasks.find((candidate) => candidate.id === id)
  if (!task) return undefined

  tasks = tasks.filter((candidate) => candidate.id !== id)
  return task
}

/**
 * Restores the fixed initial data before an isolated test.
 *
 * This is intentionally test-only infrastructure: a production store would
 * instead isolate test data at its database or repository boundary.
 */
export function resetTasksForTest() {
  tasks = [...initialTasks]
}
