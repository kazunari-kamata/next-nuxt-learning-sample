export type Task = { id: number; title: string; done: boolean }

const initialTasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]
let tasks = [...initialTasks]

// Nitro handler が使う読み取り操作。DB 導入時はこの関数を repository 呼び出しに替えます。
export function listTasks() {
  return tasks
}

// Vue UI や HTTP のコードに依存しないため、Vitest で素早く検証できます。
export function addTask(title: string): Task {
  const task = { id: Date.now(), title, done: false }
  tasks = [...tasks, task]
  return task
}

// 学習サンプルのテスト間でメモリ内データを初期化するための関数です。
export function resetTasksForTest() {
  tasks = [...initialTasks]
}
