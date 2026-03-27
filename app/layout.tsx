import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Lighting Inventory',
  description: 'Stock management system for lighting consultancy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", manrope.variable)}>
      <body className={`${manrope.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
