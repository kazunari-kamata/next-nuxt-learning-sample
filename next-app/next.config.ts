import type { NextConfig } from 'next'

// Next.js 16 は dev server 起動時に AI agent instruction file を生成できます。
// この学習 repository は独自の documentation を管理するため、生成 file を抑止します。
const nextConfig: NextConfig = {
  agentRules: false,
}

/** 学習サンプルで使用する Next.js 設定。 */
export default nextConfig
