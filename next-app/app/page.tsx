import { TaskBoard } from './task-board'

export default function Page() {
  return (
    <main>
      <p className="eyebrow">React + App Router</p>
      <h1>Next.js のタスク一覧</h1>
      <p>この画面は Server Component。操作部分だけを Client Component にしています。</p>
      <TaskBoard />
    </main>
  )
}
