"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";
import { Wallet, LogOut, Copy, Check } from "lucide-react";

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = React.useState(false);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected || !publicKey) {
    return (
      <Button onClick={handleConnect} variant="gradient" size="sm" className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleCopy}
        variant="outline"
        size="sm"
        className="gap-2 font-mono text-xs"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-solana-green" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {truncateAddress(publicKey.toBase58(), 6)}
      </Button>
      <Button
        onClick={() => disconnect()}
        variant="ghost"
        size="icon"
        className="h-9 w-9"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
