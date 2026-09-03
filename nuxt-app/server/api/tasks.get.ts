type Task = { id: number; title: string; done: boolean }

const tasks: Task[] = [{ id: 1, title: 'Next.js と Nuxt の対応を比べる', done: false }]

export function getTasks() {
  return tasks
}

export default defineEventHandler(() => getTasks())
