/** サンプル API が返し、両方の学習用 UI が表示する task。 */
export type Task = { id: number; title: string; done: boolean }

/** PATCH request で個別に変更できる field。 */
export type TaskUpdate = { title?: string; done?: boolean }

const initialTasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]
let tasks = [...initialTasks]

/**
 * メモリ内の学習用 store に保持されている全 task を返します。
 * production application では、この function を database query へ置き換えます。
 *
 * @returns 実行中の server process における現在の task 一覧。
 */
export function listTasks() {
  return tasks
}

/**
 * HTTP と UI の関心事から独立して task を追加します。
 *
 * @param title - 検証済みで空ではない task title。
 * @returns 新しく作成した未完了 task。
 */
export function addTask(title: string): Task {
  const task = { id: Date.now(), title, done: false }
  tasks = [...tasks, task]
  return task
}

/**
 * task の指定された field だけを更新します。
 *
 * Undefined の field は意図的に変更せず、未指定の値を上書きしない PATCH の
 * partial-update semantics を実現します。
 *
 * @param id - 更新する task identifier。
 * @param update - 置き換える title および/または完了状態。
 * @returns 更新済み task。該当 ID の task がなければ undefined。
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
 * メモリ内一覧から task を削除します。
 *
 * @param id - 削除する task identifier。
 * @returns 削除した task。該当 ID の task がなければ undefined。
 */
export function deleteTask(id: number): Task | undefined {
  const task = tasks.find((candidate) => candidate.id === id)
  if (!task) return undefined

  tasks = tasks.filter((candidate) => candidate.id !== id)
  return task
}

/**
 * 独立した test の前に固定の初期 data を復元します。
 *
 * これは意図的に test 専用の infrastructure です。production store では
 * database または repository boundary で test data を分離します。
 */
export function resetTasksForTest() {
  tasks = [...initialTasks]
}
