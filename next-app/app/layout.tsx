import './styles.css'

export const metadata = {
  title: 'Next.js Task Sample',
  description: 'A TypeScript comparison sample for Next.js and Nuxt',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
