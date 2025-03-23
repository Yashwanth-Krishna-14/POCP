import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ConnectWalletProvider } from "@/components/connect-wallet-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "@/app/globals.css"

export const metadata = {
  title: "DeSci Reputation System",
  description: "Revolutionizing Scientific Reputation with Web3",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ConnectWalletProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </ConnectWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'