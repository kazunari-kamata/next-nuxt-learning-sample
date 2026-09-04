# Next.js / Nuxt 学習用・比較サンプル

同じ「タスク一覧」アプリを、**Next.js（React）** と **Nuxt（Vue）** で実装した比較用の最小モノレポです。両方とも TypeScript を使っています。

## 起動

```bash
cd next-nuxt-learning-sample
npm install
npm run dev
```

`npm run dev` は **一つのターミナル** で Next.js と Nuxt を同時に起動します。表示先は以下です。

| アプリ | URL | 個別にだけ起動するコマンド |
| --- | --- | --- |
| Next.js（React） | http://localhost:3000 | `npm run dev:next` |
| Nuxt（Vue） | http://localhost:3001 | `npm run dev:nuxt` |

終了する場合は、起動に使ったターミナルで `Ctrl+C` を一度押してください。`npm run dev` / `npm run dev:debug` なら両方、個別コマンドならそのコマンドが起動したアプリだけが停止します。確認コマンドは以下です。

```bash
npm run typecheck
npm run test
npm run build
```

## デバッグ学習モード

通常の開発サーバーのほかに、Node.js Inspector を有効にするコマンドを用意しています。Next.js は `9229`、Nuxt は `9230` を使うため、同時に起動できます。

```bash
# 一つのターミナルで両方を起動する
npm run dev:debug
```

Next.js は http://localhost:3000 と Inspector `9229`、Nuxt は http://localhost:3001 と Inspector `9230` で起動します。片方だけをデバッグしたい場合は、`DEBUG_SAMPLE=true NEXT_PUBLIC_DEBUG_MODE=true npm run dev:next:debug` または `NUXT_PUBLIC_DEBUG_MODE=true npm run dev:nuxt:debug` を使います。停止は、起動に使ったターミナルで `Ctrl+C` を一度押します。

`*_PUBLIC_DEBUG_MODE=true` は画面に API の取得状態と task state を表示します。Next.js 側の `DEBUG_SAMPLE=true` は Route Handler のログもターミナルに出します。Nuxt は `NUXT_PUBLIC_DEBUG_MODE=true` で Nitro handler のログも確認できます。詳しい breakpoint の置き方は [デバッグガイド](docs/debugging-guide.md) を参照してください。

## GitHub の Languages 表示について

GitHub の Languages は**プログラミング言語**をファイル拡張子から集計する表示で、フレームワークの一覧ではありません。そのため `.vue` を持つ Nuxt は `Vue` と表示されますが、React を使う `.tsx` は `TypeScript` として集計され、`React` という項目は表示されません。

このリポジトリの Next.js 側は React を使用しています。証拠となる箇所は、`next-app/package.json` の `react` / `react-dom` 依存関係と、`next-app/app/task-board.tsx` の React hooks（`useState` / `useEffect`）です。GitHub の Languages に React がないことは、Next.js が React を使っていないことを意味しません。

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
