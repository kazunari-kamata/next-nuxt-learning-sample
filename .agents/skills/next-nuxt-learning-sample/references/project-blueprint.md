# Next.js / Nuxt 学習サンプル blueprint

この blueprint は「学習者が同じ機能を Next.js と Nuxt で比較できる最小プロジェクト」を再現するための仕様です。バージョン番号は生成時点の互換な安定版を選びますが、二つのアプリと Node.js の互換性を確認してください。

## 成果物

```text
.
├── next-app/                 # Next.js + React + TypeScript
│   └── app/
│       ├── page.tsx
│       ├── task-board.tsx
│       └── api/tasks/{route.ts,store.ts,[id]/route.ts}
├── nuxt-app/                 # Nuxt + Vue + TypeScript
│   ├── app/pages/index.vue
│   └── server/{api,utils}/ # API includes tasks.get/post and [id].patch/delete
├── docs/
│   ├── comparison-guide.md
│   ├── debugging-guide.md
│   ├── project-lifecycle-guide.md
│   └── security-checks-guide.md
├── e2e/task-flow.spec.ts
├── scripts/check-no-credentials.mjs # tracked files の credential pattern scan（ESM）
├── playwright.config.ts
├── typedoc.json
└── .github/workflows/ci.yml
```

root `package.json` は workspaces を使い、`dev`、`dev:next`、`dev:nuxt`、`dev:debug`、`dev:next:debug`、`dev:nuxt:debug`、`typecheck`、`test`、`test:e2e`、`docs:api`、`build` を提供します。`dev` は `concurrently --kill-others-on-fail` などで二つのサーバーを同時起動し、Next.js は 3000、Nuxt は 3001 を使います。

## 機能と API 契約

学習対象はタスクの CRUD です。メモリ内の初期データを置き、サーバー再起動時に初期化されることを README に明記します。

| HTTP | path | request | success | validation failure |
| --- | --- | --- | --- | --- |
| GET | `/api/tasks` | なし | `200`, `Task[]` | なし |
| POST | `/api/tasks` | `{ "title": string }` | `201`, `Task` | 空または空白のみなら `400` |
| PATCH | `/api/tasks/:id` | `{ "title"?: string, "done"?: boolean }` | `200`, `Task` | 不正入力は `400`、未知の ID は `404` |
| DELETE | `/api/tasks/:id` | なし | `204` | 不正 ID は `400`、未知の ID は `404` |

```ts
/** A task returned by the sample API. */
export type Task = { id: number; title: string; done: boolean }
```

Next.js は `app/api/tasks/route.ts` の `GET` / `POST` と `app/api/tasks/[id]/route.ts` の `PATCH` / `DELETE` named export で API を示す。Nuxt は `server/api/tasks.get.ts`、`tasks.post.ts`、`[id].patch.ts`、`[id].delete.ts` の Nitro handler で API を示す。どちらも HTTP 層をメモリ内 store の `listTasks` / `addTask` / `updateTask` / `deleteTask` から分離する。

## 比較する実装上の違い

| 観点 | Next.js | Nuxt |
| --- | --- | --- |
| 画面 | `app/page.tsx` | `app/pages/index.vue` |
| 操作 UI | `'use client'` を持つ `TaskBoard` | `<script setup lang="ts">` 内の状態と template |
| 初期データ取得 | Client Component の `useEffect` と `fetch` | top-level `await useFetch` |
| 更新表示 | POST / PATCH response を React state に反映し、DELETE で除去 | 変更後に `refresh()` で一覧を取得 |
| API routing | `route.ts` の HTTP method export | `.get.ts` / `.post.ts` の file name と `defineEventHandler` |

Next.js の `page.tsx` では Server Component と Client Component の分離を分かるようにする。Nuxt の `index.vue` は SSR HTML の表示後に Vue hydration が完了するため、E2E 用に `onMounted` で操作可能状態を示す属性を持たせてもよい。

## デバッグ・資料

- `dev:debug` は両アプリを一つのターミナルで起動し、Node Inspector port は Next.js 9229、Nuxt 9230 とする。
- `NEXT_PUBLIC_DEBUG_MODE` と `NUXT_PUBLIC_DEBUG_MODE` で client state inspector を表示する。Next API のログは `DEBUG_SAMPLE=true`、Nuxt API のログは Nuxt の public debug mode で表示する。
- README には起動・停止、個別起動、GitHub Languages が React を独立表示しない理由を説明する。
- 比較、デバッグ、要件定義から運用までの project flow を `docs/` に置く。複数コンポーネントをまたぐ API・デバッグ・開発フローには Mermaid 図を付ける。

## 品質ゲート

Vitest では Next.js の Route Handler（GET、POST、PATCH、DELETE、validation、404）と Nuxt の store（初期値、追加、更新、削除）を検証する。Playwright は Next.js と Nuxt の両方を実際に起動し、表示、作成、完了状態の更新、削除と各 HTTP status を確認する。

TypeDoc は両 store を entry point とし、未文書化 API の validation warning を error とする。公開 export に加えて、UI 操作、API handler、validation / debug helper などの名前付き関数には、責務、必要な引数・戻り値、比較のために重要なフレームワーク固有の判断を日本語の JSDoc で記載する。コード識別子、HTTP method、framework 名などの固有用語は必要に応じて残す。自明な短い callback の逐語的な説明は不要とする。生成先の `docs/api/` は `.gitignore` に入れる。

GitHub Actions は pull request と `main` への push で次を実行する。

1. `npm ci --no-audit --no-fund`
2. typecheck と Vitest
3. TypeDoc 生成
4. Playwright Chromium の導入と E2E
5. production build
6. credential pattern scan
7. `npm audit --omit=dev --audit-level=high`。registry timeout は少数回リトライし、監査不能のまま成功扱いにしない。

Dependabot で npm と GitHub Actions を定期監視する。生成物、資格情報、実際の secret をコミットしない。

プロジェクト計画とサービス運用まで扱う場合の価値・変更・改善の考え方は、[PMBOK / ITIL の実践ガイド](governance-and-service-management.md) を参照する。

## 検証

```bash
npm run typecheck
npm run test
npm run docs:api
npm run test:e2e
npm run build
node scripts/check-no-credentials.mjs
npm audit --omit=dev --audit-level=high --offline
```

CI では online audit を使う。ローカルの Playwright Chromium が未導入なら `npx playwright install chromium` を先に実行する。macOS 12 では Playwright の Chromium 配布物が使えないため、ローカル Google Chrome channel を使い、CI は pinned Chromium を使う。
