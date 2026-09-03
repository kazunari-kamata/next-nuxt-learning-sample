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
