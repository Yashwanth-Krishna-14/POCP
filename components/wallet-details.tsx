import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Network, Coins, ExternalLink } from "lucide-react"
import { useAccount, useBalance, useChainId } from "wagmi"

export function WalletDetails() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address,
  })
  const chainId = useChainId()

  if (!isConnected || !address) {
    return null
  }

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet"
      case 5:
        return "Goerli Testnet"
      case 11155111:
        return "Sepolia Testnet"
      case 137:
        return "Polygon Mainnet"
      case 80001:
        return "Mumbai Testnet"
      default:
        return "Unknown Network"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Address</div>
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm">{address}</code>
            <a
              href={`https://etherscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm">
              {balance?.formatted} {balance?.symbol}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Network</div>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <Badge variant="outline">{getNetworkName(chainId)}</Badge>
            <span className="text-xs text-muted-foreground">(Chain ID: {chainId})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 