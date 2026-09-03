import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const patterns = [
  { name: 'GitHub personal access token', expression: /gh[pousr]_[A-Za-z0-9_]{20,}/g },
  { name: 'AWS access key ID', expression: /AKIA[0-9A-Z]{16}/g },
  { name: 'private key', expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'generic secret assignment', expression: /(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/gi },
]

const findings = []

for (const file of files) {
  const contents = readFileSync(file, 'utf8')
  for (const { name, expression } of patterns) {
    expression.lastIndex = 0
    if (expression.test(contents)) findings.push(`${file}: ${name}`)
  }
}

if (findings.length > 0) {
  console.error('Potential credentials were found:\n' + findings.join('\n'))
  process.exit(1)
}

console.log(`Checked ${files.length} tracked files: no credential patterns found.`)
