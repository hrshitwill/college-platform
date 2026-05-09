import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CollegeFinder - Find Your Dream College',
  description: 'Discover colleges, compare features, and find the perfect fit for your education',
  keywords: 'colleges, university, search, compare, india',
  viewport: 'width=device-width, initial-scale=1',
  authors: [{ name: 'Harshit Gupta' }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}