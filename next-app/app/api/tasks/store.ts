export type Task = { id: number; title: string; done: boolean }

const initialTasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]
let tasks = [...initialTasks]

// Route Handler から呼ぶ読み取り操作。実アプリではここを DB の query に置き換えます。
export function listTasks() {
  return tasks
}

// 更新操作を UI/HTTP の詳細から分離すると、同じ規則を単体テストで検証できます。
export function addTask(title: string): Task {
  const task = { id: Date.now(), title, done: false }
  tasks = [...tasks, task]
  return task
}

// メモリ内データを使う学習サンプル専用のテスト補助です。本番 API では公開しません。
export function resetTasksForTest() {
  tasks = [...initialTasks]
}
