import { TaskBoard } from './task-board'

/** Next.js の task page における Server Component 部分を描画します。 */
export default function Page() {
  return (
    <main>
      {/* page.tsx は既定で Server Component。ブラウザ専用の状態は TaskBoard に切り出します。 */}
      <p className="eyebrow">React + App Router</p>
      <h1>Next.js のタスク一覧</h1>
      <p>この画面は Server Component。操作部分だけを Client Component にしています。</p>
      <TaskBoard />
    </main>
  )
}
