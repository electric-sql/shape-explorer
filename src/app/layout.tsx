import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Electric Shape Explorer',
  description: 'Query and explore your Electric database using Shape',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased min-h-full bg-gray-50`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Electric Shape Explorer</h1>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
