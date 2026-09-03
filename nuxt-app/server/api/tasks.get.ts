import { listTasks } from '../utils/tasks'

// Nitro はファイル名の .get を GET /api/tasks に対応付けます。
export default defineEventHandler(() => listTasks())
