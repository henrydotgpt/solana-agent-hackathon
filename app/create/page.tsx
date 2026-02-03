"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletButton } from "@/components/payment/WalletButton";
import { isValidSolanaAddress } from "@/lib/utils";
import type { Storefront } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Store,
  Loader2,
  Send,
  Check,
  Rocket,
  BarChart3,
} from "lucide-react";

type Step = "describe" | "generating" | "preview";

interface ChatMessage {
  role: "user" | "agent";
  content: string;
}

type AgentState =
  | "greeting"
  | "awaiting_description"
  | "awaiting_products"
  | "awaiting_wallet"
  | "ready_to_build";

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("describe");
  const [agentState, setAgentState] = useState<AgentState>("greeting");
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Collected data
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [products, setProducts] = useState<
    Array<{ name: string; description: string; price: number; currency: "SOL" | "USDC" }>
  >([]);

  // Generated storefront
  const [generatedStorefront, setGeneratedStorefront] =
    useState<Storefront | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "agent",
      content:
        "Hey! I'm Paygent — your AI payment agent. 🚀\n\nTell me about your business in a sentence or two. What do you do, and what do you sell or offer?",
    },
  ]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isThinking]);

  const addAgentMessage = (content: string) => {
    setChatMessages((prev) => [...prev, { role: "agent", content }]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMessage = inputValue.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsThinking(true);

    // Small delay for natural feel
    await new Promise((r) => setTimeout(r, 800));

    switch (agentState) {
      case "greeting":
      case "awaiting_description": {
        // Parse business description
        const name = extractBusinessName(userMessage);
        setBusinessName(name);
        setBusinessDescription(userMessage);
        setAgentState("awaiting_products");
        addAgentMessage(
          `Got it — "${name}" sounds great! Now let's set up what you're selling.\n\nList your products or services with prices. Format like:\n• Consultation - 0.5 SOL\n• Premium Package - 2 SOL\n• Quick Review - 10 USDC\n\nYou can use SOL or USDC for each item.`
        );
        break;
      }

      case "awaiting_products": {
        // Parse products from message
        const parsed = parseProducts(userMessage);
        if (parsed.length === 0) {
          addAgentMessage(
            "I couldn't parse any products from that. Try formatting like:\n• Service Name - 0.5 SOL\n• Another Service - 10 USDC\n\nEach line should have a name, dash, then price with currency."
          );
        } else {
          setProducts(parsed);
          setAgentState("awaiting_wallet");
          const productList = parsed
            .map((p) => `  • ${p.name} — ${p.price} ${p.currency}`)
            .join("\n");
          addAgentMessage(
            `Perfect, I've got ${parsed.length} item${parsed.length > 1 ? "s" : ""}:\n${productList}\n\nLast thing — what's your Solana wallet address? (This is where all payments go directly. I never hold your funds.)`
          );
        }
        break;
      }

      case "awaiting_wallet": {
        // Validate wallet address
        const address = userMessage.trim();
        if (!isValidSolanaAddress(address)) {
          addAgentMessage(
            "That doesn't look like a valid Solana address. It should be a 32-44 character base58 string. You can copy it from Phantom or Solflare.\n\nPaste your wallet address here:"
          );
        } else {
          setWalletAddress(address);
          setAgentState("ready_to_build");
          addAgentMessage(
            `Wallet confirmed! ✅\n\nI have everything I need:\n• Business: ${businessName}\n• Products: ${products.length} items\n• Wallet: ${address.slice(0, 6)}...${address.slice(-4)}\n\nBuilding your storefront now... 🔨`
          );

          // Trigger actual storefront creation
          setTimeout(() => {
            setStep("generating");
            createStorefront(address);
          }, 1500);
        }
        break;
      }

      default:
        break;
    }

    setIsThinking(false);
  };

  const createStorefront = async (wallet: string) => {
    try {
      setGenerateError(null);

      const res = await fetch("/api/storefront", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessDescription: businessDescription,
          walletAddress: wallet,
          products: products.map((p) => ({
            ...p,
            description: p.description || `${p.name} from ${businessName}`,
          })),
          autoConvertToUSDC: true,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create storefront");
      }

      setGeneratedStorefront(data.data);
      // Show generating animation for at least 3 seconds
      setTimeout(() => setStep("preview"), 3000);
    } catch (error: any) {
      setGenerateError(error.message);
      setStep("describe");
      addAgentMessage(
        `Something went wrong: ${error.message}\n\nLet's try again. What's your wallet address?`
      );
      setAgentState("awaiting_wallet");
    }
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-solana-gradient">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">Create Storefront</span>
          </div>
          <WalletButton />
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-b border-border/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {["Describe", "Generate", "Preview"].map((label, i) => {
              const stepMap: Step[] = ["describe", "generating", "preview"];
              const isActive = stepMap.indexOf(step) >= i;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-solana-gradient text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {stepMap.indexOf(step) > i ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`h-px flex-1 transition-colors ${
                        stepMap.indexOf(step) > i
                          ? "bg-solana-purple"
                          : "bg-border/50"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Chat with Agent */}
          {step === "describe" && (
            <motion.div
              key="describe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl"
            >
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-card/80">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solana-gradient">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Paygent</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        The AI payment agent
                      </p>
                    </div>
                    <Badge variant="success" className="ml-auto text-xs">
                      Online
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Chat messages */}
                  <div className="h-[420px] overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className={`flex ${
                          msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                            msg.role === "user"
                              ? "bg-solana-purple text-white rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}

                    {/* Thinking indicator */}
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                            <div
                              className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                              style={{ animationDelay: "0.15s" }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                              style={{ animationDelay: "0.3s" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-border/50 p-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          agentState === "awaiting_products"
                            ? "List your products with prices..."
                            : agentState === "awaiting_wallet"
                            ? "Paste your Solana wallet address..."
                            : "Describe your business..."
                        }
                        className="flex-1"
                        disabled={isThinking || agentState === "ready_to_build"}
                      />
                      <Button
                        type="submit"
                        variant="gradient"
                        size="icon"
                        disabled={
                          !inputValue.trim() ||
                          isThinking ||
                          agentState === "ready_to_build"
                        }
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Generating */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-24 w-24 rounded-full border-2 border-transparent border-t-solana-purple border-r-solana-green"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Store className="h-8 w-8 text-solana-purple" />
                </div>
              </div>
              <h2 className="mt-8 text-2xl font-bold">
                Building your storefront...
              </h2>
              <p className="mt-2 text-muted-foreground text-center max-w-sm">
                Setting up <strong>{businessName}</strong> with {products.length}{" "}
                product{products.length !== 1 ? "s" : ""} and Solana Pay
                integration.
              </p>
              <div className="mt-8 space-y-3 w-full max-w-sm">
                {[
                  "Analyzing business type...",
                  "Generating payment requests...",
                  "Creating Solana Pay QR codes...",
                  "Deploying storefront...",
                ].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.7 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin text-solana-purple" />
                    </motion.div>
                    <span className="text-muted-foreground">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === "preview" && generatedStorefront && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <Badge variant="success" className="mb-4 text-sm px-4 py-1">
                    ✨ Storefront Live
                  </Badge>
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">
                  {generatedStorefront.businessName} is ready!
                </h2>
                <p className="text-muted-foreground">
                  Your storefront is live with real Solana Pay QR codes. Share
                  the link to start accepting payments.
                </p>
              </div>

              {/* Preview card */}
              <Card className="overflow-hidden glow-purple mb-8">
                <div className="p-8 text-center">
                  <div
                    className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${generatedStorefront.theme.accentColor}, ${generatedStorefront.theme.accentColor}88)`,
                    }}
                  >
                    <span className="text-2xl font-bold text-white">
                      {generatedStorefront.businessName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {generatedStorefront.businessName}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    {generatedStorefront.businessDescription}
                  </p>

                  {/* Product cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                    {generatedStorefront.products.map((product) => (
                      <Card
                        key={product.id}
                        className="hover:border-solana-purple/30 transition-colors"
                      >
                        <CardContent className="p-4 text-center">
                          <p className="font-semibold text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {product.description}
                          </p>
                          <p className="text-lg font-bold gradient-text">
                            {product.price} {product.currency}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* URL display */}
                  <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border/50 max-w-md mx-auto">
                    <p className="text-xs text-muted-foreground mb-1">
                      Your storefront URL:
                    </p>
                    <p className="font-mono text-sm text-solana-purple-light break-all">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/pay/${generatedStorefront.slug}`
                        : `/pay/${generatedStorefront.slug}`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="gap-2"
                      onClick={() =>
                        router.push(`/pay/${generatedStorefront.slug}`)
                      }
                    >
                      <Rocket className="h-4 w-4" />
                      View Live Storefront
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      onClick={() =>
                        router.push(
                          `/dashboard/${generatedStorefront.slug}`
                        )
                      }
                    >
                      <BarChart3 className="h-4 w-4" />
                      Open Dashboard
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Share your storefront link to start accepting payments
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/**
 * Extract a business name from a description
 */
function extractBusinessName(description: string): string {
  // Check for patterns like "I run X" or "My business is X" or "I'm a X"
  const patterns = [
    /(?:called|named)\s+["']?([^"'\n,]+)/i,
    /(?:I run|I own|We are|I'm|We're|I am)\s+(?:a\s+)?["']?([^"'\n,]+)/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1].trim().slice(0, 60);
    }
  }

  // Fallback: first few meaningful words
  const words = description
    .replace(/^(I|We|My|Our|The)\s+/i, "")
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

  return words.join(" ").replace(/[.,!?]$/, "");
}

/**
 * Parse products from user message
 * Supports formats:
 * - "Product Name - 0.5 SOL"
 * - "Product Name: 10 USDC"
 * - "Product Name 2.5 SOL"
 */
function parseProducts(
  message: string
): Array<{
  name: string;
  description: string;
  price: number;
  currency: "SOL" | "USDC";
}> {
  const lines = message.split("\n").filter((l) => l.trim());
  const products: Array<{
    name: string;
    description: string;
    price: number;
    currency: "SOL" | "USDC";
  }> = [];

  for (const line of lines) {
    // Clean the line (remove bullet points, numbers, etc.)
    const cleaned = line.replace(/^[\s•\-\*\d.)\]]+/, "").trim();
    if (!cleaned) continue;

    // Match: "name - price currency" or "name: price currency" or "name price currency"
    const match = cleaned.match(
      /^(.+?)[\s]*[-:–—]\s*(\d+\.?\d*)\s*(SOL|USDC|sol|usdc)\s*$/i
    );

    if (match) {
      const name = match[1].trim();
      const price = parseFloat(match[2]);
      const currency = match[3].toUpperCase() as "SOL" | "USDC";

      if (name && !isNaN(price) && price > 0) {
        products.push({
          name,
          description: "",
          price,
          currency,
        });
      }
      continue;
    }

    // Looser match: "name 0.5 SOL"
    const looseMatch = cleaned.match(
      /^(.+?)\s+(\d+\.?\d*)\s*(SOL|USDC|sol|usdc)\s*$/i
    );

    if (looseMatch) {
      const name = looseMatch[1].trim();
      const price = parseFloat(looseMatch[2]);
      const currency = looseMatch[3].toUpperCase() as "SOL" | "USDC";

      if (name && !isNaN(price) && price > 0) {
        products.push({
          name,
          description: "",
          price,
          currency,
        });
      }
    }
  }

  return products;
}
