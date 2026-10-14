import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Diagram Nexus | Visual Architecture & Technical Notes',
  description:
    'Estudio de diseño y documentación arquitectónica que une diagramas interactivos y notas técnicas Markdown.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
