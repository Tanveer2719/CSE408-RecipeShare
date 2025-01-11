import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LeftBar from "@/components/LeftBar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Recipe Share',
  description: 'Make Everyday Cooking Fun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <LeftBar/>
        {children}
        </body>
    </html>
  )
}
