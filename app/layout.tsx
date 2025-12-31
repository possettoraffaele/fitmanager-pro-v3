import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitManager Pro v3.0',
  description: 'Gestione clienti PT con bioimpedenziometria e AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  )
}
