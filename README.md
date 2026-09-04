# Next.js / Nuxt 学習用・比較サンプル

同じ「タスク一覧」アプリを、**Next.js（React）** と **Nuxt（Vue）** で実装した比較用の最小モノレポです。両方とも TypeScript を使っています。

## 起動

```bash
cd next-nuxt-learning-sample
npm install
npm run dev:next  # http://localhost:3000
npm run dev:nuxt  # http://localhost:3001
```

別々のターミナルで起動してください。確認コマンドは以下です。

```bash
npm run typecheck
npm run test
npm run build
```

## デバッグ学習モード

通常の開発サーバーのほかに、Node.js Inspector を有効にするコマンドを用意しています。Next.js は `9229`、Nuxt は `9230` を使うため、同時に起動できます。

```bash
# ターミナル 1: http://localhost:3000 / Chrome DevTools または VS Code で localhost:9229 に attach
DEBUG_SAMPLE=true NEXT_PUBLIC_DEBUG_MODE=true npm run dev:next:debug

# ターミナル 2: http://localhost:3001 / Chrome DevTools または VS Code で localhost:9230 に attach
NUXT_PUBLIC_DEBUG_MODE=true npm run dev:nuxt:debug
```

`*_PUBLIC_DEBUG_MODE=true` は画面に API の取得状態と task state を表示します。Next.js 側の `DEBUG_SAMPLE=true` は Route Handler のログもターミナルに出します。Nuxt は `NUXT_PUBLIC_DEBUG_MODE=true` で Nitro handler のログも確認できます。詳しい breakpoint の置き方は [デバッグガイド](docs/debugging-guide.md) を参照してください。

## 同じ機能、異なる書き方

| 観点 | Next.js | Nuxt |
| --- | --- | --- |
| UI の置き場所 | `next-app/app/page.tsx` | `nuxt-app/app/pages/index.vue` |
| ルーティング | `app/` ディレクトリ | `pages/` ディレクトリ |
| クライアント UI | `'use client'` を付けた React component | `<script setup lang="ts">` の Vue SFC |
| API | `app/api/tasks/route.ts` の Route Handler | `server/api/tasks.*.ts` の Nitro handler |
| データ取得 | `fetch('/api/tasks')` | `useFetch('/api/tasks')` |
| 画面の再描画 | React の `useState` | Vue の `ref` / `computed` |

## 学ぶ順番

1. 両方の `page` を開き、テンプレート（JSX / Vue template）と状態の宣言を比較します。
2. タスクを追加して、クライアントから API を呼ぶ箇所を比較します。
3. `route.ts` と `tasks.get.ts` / `tasks.post.ts` を比較し、バックエンド処理の置き場所を確認します。
4. それぞれに詳細ページを追加して、動的ルート（Next: `[id]`、Nuxt: `[id].vue`）を試してください。

> データは各開発サーバーのメモリ内にだけ保存されます。サーバーを再起動すると初期化されます。学習に集中するため、DB や認証は含めていません。

詳細な読み方、ライフサイクルの違い、テストの対応は [比較ガイド](docs/comparison-guide.md) を参照してください。
