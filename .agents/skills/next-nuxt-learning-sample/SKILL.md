---
name: next-nuxt-learning-sample
description: Build or evolve a TypeScript learning monorepo that compares the same task application in Next.js and Nuxt, including documentation, tests, debug mode, and CI.
metadata:
  short-description: Build the Next/Nuxt learning sample
---

# Next.js / Nuxt 学習サンプル構築

この skill は、同じタスク一覧を Next.js と Nuxt で比較できる学習リポジトリを新規構築・再構築する場合に使います。既存リポジトリを編集する場合は、その設計を尊重し、二実装の機能的な対応を崩さないでください。

## 開始時

1. 対象リポジトリの `AGENTS.md`、`README.md`、既存の CI と package scripts を読む。
2. 新規構築または大きな再構築では [project blueprint](references/project-blueprint.md) を読む。
3. ユーザーが別の機能を指定しない限り、blueprint の範囲を超えて認証、DB、デプロイ、UI ライブラリを導入しない。

## 実装方針

- 二つのアプリで HTTP 契約、初期データ、入力 validation、UI 操作をそろえる。フレームワーク固有の書き方は意図的に残し、抽象化して一つにまとめない。
- Next.js では Server Component と Client Component の境界、Nuxt では `<script setup lang="ts">`、`useFetch`、Nitro の境界を教材として明示する。
- 公開 TypeScript API には JSDoc を書き、TypeDoc の validation で抜けを検出する。
- E2E は画面内容だけでなく、タスク追加の POST が期待どおり成功することを確認する。SSR 画面は hydration が済んだ状態を待ってからフォームを操作する。
- コメント・比較資料・Mermaid 図は「なぜその差が生じるか」を説明し、コードの逐語的な繰り返しにしない。

## 完了条件

blueprint の検証コマンドを実行し、変更に対応した documentation、unit test、E2E、CI を更新する。GitHub 操作はリポジトリの指示とユーザーの承認範囲に従う。
