import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import BottomNav from './components/BottomNav'
import AppShell from './components/AppShell'



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Home Tracker",
  description: "Shared household management",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#000000",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppShell>
          {children}
        </AppShell>
        <BottomNav />
      </body>
    </html>

  )
}
