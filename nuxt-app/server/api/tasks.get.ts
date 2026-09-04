import { listTasks } from '../utils/tasks'

/** Handles GET /api/tasks through Nuxt's file-based Nitro routing. */
export default defineEventHandler((event) => {
  const tasks = listTasks()
  if (String(useRuntimeConfig(event).public.debugMode) === 'true') {
    console.log('[Nuxt API] GET /api/tasks', { count: tasks.length })
  }
  return tasks
})
