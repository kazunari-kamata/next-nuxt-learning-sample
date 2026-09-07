// `.mjs` は package.json の `type` 設定に依存せず、このファイルを Node.js の
// ECMAScript Module として扱わせます。Node 標準 API を static import でき、
// `node scripts/check-no-credentials.mjs` でローカルと CI の実行方法を一致させます。
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

// `git ls-files -z` は Git が管理するファイルだけを NUL 区切りで返します。
// 未追跡ファイル、Git 履歴、外部サービスの secret は対象外です。空白を含む
// ファイル名を安全に扱うため、改行ではなく NUL で分割します。
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

// これは代表的な credential の混入を早期に検知する軽量な pattern scan です。
// 高エントロピー文字列の検出、すべてのサービス形式、エンコード済みの値までは
// 判定しないため、専用の secret 管理やレビューを置き換えるものではありません。
const patterns = [
  { name: 'GitHub personal access token', expression: /gh[pousr]_[A-Za-z0-9_]{20,}/g },
  { name: 'AWS access key ID', expression: /AKIA[0-9A-Z]{16}/g },
  { name: 'private key', expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'generic secret assignment', expression: /(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/gi },
]

// 検出結果を全件ためてから出力すると、一度の CI 実行で修正箇所をまとめて確認できます。
const findings = []

for (const file of files) {
  // 各正規表現の lastIndex をリセットし、global フラグによる前回ファイルの状態を
  // 次のファイルへ持ち込まないようにします。
  const contents = readFileSync(file, 'utf8')
  for (const { name, expression } of patterns) {
    expression.lastIndex = 0
    if (expression.test(contents)) findings.push(`${file}: ${name}`)
  }
}

if (findings.length > 0) {
  // exit code 1 により、PR と main の GitHub Actions を失敗させます。
  // 実在する credential を検出した場合は、削除だけでなく失効・再発行が必要です。
  console.error('Potential credentials were found:\n' + findings.join('\n'))
  process.exit(1)
}

// 成功時も対象ファイル数を表示し、ローカル実行と CI の証跡にします。
console.log(`Checked ${files.length} tracked files: no credential patterns found.`)
