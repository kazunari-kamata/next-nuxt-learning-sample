import { listTasks } from '../utils/tasks'

/**
 * Nuxt の file-based Nitro routing で GET /api/tasks を処理します。
 *
 * @returns Nitro が 200 の JSON response として直列化する、現在のメモリ内 task 一覧。
 */
export default defineEventHandler((event) => {
  const tasks = listTasks()
  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] GET /api/tasks', { count: tasks.length })
  }
  return tasks
})
