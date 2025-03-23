"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Web3 from "web3";
import { abi } from "../app/abi";
import { contractAddress } from "../app/contractAddress";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export function ConnectWalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(abi, contractAddress);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        
        if (accounts.length === 0) {
          throw new Error("No accounts found.");
        }
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask.");
    }
    setLoading(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return account ? (
    <Button variant="outline" onClick={disconnectWallet} className="group">
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        className="font-mono text-xs mr-2 overflow-hidden"
      >
        {account?.slice(0, 6)}...{account?.slice(-4)}
      </motion.span>
      <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  ) : (
    <Button onClick={connectWallet} className="group relative overflow-hidden" disabled={loading}>
      <motion.div
        className="absolute inset-0 bg-primary/20"
        initial={{ x: "-100%" }}
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "linear" }}
      />
      <Wallet className="mr-2 h-4 w-4" />
      <span className="relative z-10">{loading ? "Connecting..." : "Connect Wallet"}</span>
    </Button>
  );
}
