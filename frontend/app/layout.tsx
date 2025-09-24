import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Humanize Pro',
  description: 'A professional humanization platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
