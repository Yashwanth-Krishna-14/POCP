"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type WalletContextType = {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function ConnectWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Mock wallet connection
  const connect = async () => {
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a random wallet address
    const mockAddress = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`

    setAddress(mockAddress)
    setIsConnected(true)
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a ConnectWalletProvider")
  }
  return context
}

