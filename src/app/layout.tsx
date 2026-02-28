import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | JV Vogler',
    default: 'JV Vogler — Frontend Developer',
  },
  description:
    'Portfolio of JV Vogler, a frontend developer specializing in modern web technologies.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
