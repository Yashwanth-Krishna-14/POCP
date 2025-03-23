"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Atom } from "lucide-react"
import { motion } from "framer-motion"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Submit", href: "/submit" },
  { name: "Leaderboard", href: "/leaderboard" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="text-primary"
            >
              <Atom className="h-6 w-6" />
            </motion.div>
            <span className="text-lg font-bold">
              DeSci<span className="text-primary">Rep</span>
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium leading-6 transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <ThemeToggle />
          <ConnectWalletButton />
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <motion.div
          className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Atom className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">
                DeSci<span className="text-primary">Rep</span>
              </span>
            </Link>
            <Button variant="ghost" className="-m-2.5 rounded-md p-2.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-1 py-6">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group -mx-3 flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium leading-7 ${
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                        />
                      )}
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

