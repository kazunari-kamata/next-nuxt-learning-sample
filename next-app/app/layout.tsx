import './styles.css'

/** Shared metadata rendered in the document head for the Next.js sample. */
export const metadata = {
  title: 'Next.js Task Sample',
  description: 'A TypeScript comparison sample for Next.js and Nuxt',
}

/** Provides the HTML document shell for every App Router page. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
