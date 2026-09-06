/** A task returned by the sample API. */
export type Task = { id: number; title: string; done: boolean }

/** Fields that can be changed on an existing task. */
export type TaskUpdate = { title?: string; done?: boolean }

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

/** Updates the supplied fields of a task, or returns undefined when it does not exist. */
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

/** Removes a task and returns it, or returns undefined when it does not exist. */
export function deleteTask(id: number): Task | undefined {
  const task = tasks.find((candidate) => candidate.id === id)
  if (!task) return undefined

  tasks = tasks.filter((candidate) => candidate.id !== id)
  return task
}

/** Resets the in-memory store for isolated tests in this learning sample. */
export function resetTasksForTest() {
  tasks = [...initialTasks]
}
