# AI エージェント向けリポジトリ指示

## 目的

このリポジトリは、同じタスク一覧 API と UI を Next.js（React）および Nuxt（Vue）で比較する TypeScript 学習用モノレポです。機能を追加・再構築するときは、片方だけを先行させず、比較可能な API 契約と学習資料を保ってください。

新規にこのプロジェクトを構築する AI は、[再構築スキル](.agents/skills/next-nuxt-learning-sample/SKILL.md) を読み、必要に応じてその [blueprint](.agents/skills/next-nuxt-learning-sample/references/project-blueprint.md) を参照してください。

## 守ること

- root の npm workspaces に `next-app` と `nuxt-app` を置く。両方とも TypeScript を使う。
- Next.js は App Router、Nuxt は file-based pages と Nitro API を使う。
- `GET /api/tasks` と `POST /api/tasks` の JSON 契約・検証・成功ステータスを両実装で一致させる。タスクは学習用のメモリ内 store に限定し、認証や DB を追加しない。
- 公開する TypeScript の型・関数には JSDoc を付ける。TypeDoc の対象 store で未文書化 export があれば失敗にする。
- `npm run dev` は一つのターミナルで Next.js（3000）と Nuxt（3001）を同時起動し、`Ctrl+C` で両方を停止できる状態を維持する。
- `npm run dev:debug` は Inspector port を競合させず両アプリを起動する。ブラウザ公開用の環境変数へ秘密情報を入れない。
- 機能の対応、デバッグ、プロジェクトフローの資料を更新し、関係が分かりにくい処理には Mermaid 図を使う。
- unit test は Vitest、利用者操作は Playwright で両アプリを検証する。SSR を使う画面の E2E は hydration 完了後に操作する。
- CI は型検査、Vitest、TypeDoc、Playwright、production build、credential scan、production dependency audit を維持する。

## 作業と検証

通常の変更では、影響範囲に応じて次を実行します。

```bash
npm run typecheck
npm run test
npm run docs:api
npm run test:e2e
npm run build
node scripts/check-no-credentials.mjs
npm audit --omit=dev --audit-level=high --offline
```

Playwright の Chromium が未導入の環境では `npx playwright install chromium` を実行します。macOS 12 のローカル実行は、設定済みの Google Chrome を使用します。

default branch の `main` へ直接 push しません。作業ブランチで変更し、検証結果を含む Pull Request を作成します。外部への push、PR 作成、merge は依頼または明示的な承認がある場合だけ行います。

生成物の `docs/api/`、`.next/`、`.nuxt/`、`.output/`、`playwright-report/`、`test-results/` はコミットしません。
