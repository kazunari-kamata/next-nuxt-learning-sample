import './styles.css'

/** Next.js サンプルの document head へ共通で出力する metadata。 */
export const metadata = {
  title: 'Next.js Task Sample',
  description: 'A TypeScript comparison sample for Next.js and Nuxt',
}

/** すべての App Router page に HTML document shell を提供します。 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
