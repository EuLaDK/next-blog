import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Header } from "@/components/header/Header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EuLa Blog",
  description: "A magazine-style frontend prototype for a personal Next.js blog.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(135,196,177,0.26),transparent_34%),linear-gradient(180deg,#f7f2e8_0%,#fbfaf7_42%,#f4f0e7_100%)]">
          <Header />
          <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
