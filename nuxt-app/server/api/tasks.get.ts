import { listTasks } from '../utils/tasks'

// Nitro はファイル名の .get を GET /api/tasks に対応付けます。
export default defineEventHandler((event) => {
  const tasks = listTasks()
  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] GET /api/tasks', { count: tasks.length })
  }
  return tasks
})
