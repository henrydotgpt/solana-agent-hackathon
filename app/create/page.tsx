"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletButton } from "@/components/payment/WalletButton";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Store,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";

type Step = "describe" | "generating" | "preview";

interface BusinessInfo {
  description: string;
  name: string;
  walletAddress: string;
}

export default function CreatePage() {
  const [step, setStep] = useState<Step>("describe");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    description: "",
    name: "",
    walletAddress: "",
  });
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "agent"; content: string }>
  >([
    {
      role: "agent",
      content:
        "Hey! I'm Paygent — your AI payment agent. Tell me about your business — what do you do, what you sell, and how much you charge. I'll build you a payment storefront in minutes. 🚀",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsThinking(true);

    // Simulate AI processing (will be replaced with actual AI calls)
    setTimeout(() => {
      setIsThinking(false);

      if (!businessInfo.name) {
        // First response — extract business info
        setBusinessInfo((prev) => ({
          ...prev,
          description: userMessage,
          name: extractBusinessName(userMessage),
        }));
        setChatMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: `Got it! Sounds like a great business. I'm picturing a clean, professional storefront for you. Before I start building, what's your Solana wallet address? (This is where payments will go — I'll never have access to your funds.)`,
          },
        ]);
      } else if (!businessInfo.walletAddress) {
        // Second response — get wallet
        setBusinessInfo((prev) => ({
          ...prev,
          walletAddress: userMessage,
        }));
        setChatMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: `Perfect! I have everything I need. Let me build your storefront now... 🔨`,
          },
        ]);

        // Trigger generation
        setTimeout(() => setStep("generating"), 1500);
        setTimeout(() => setStep("preview"), 5000);
      }
    }, 1500);
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
                      {i + 1}
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
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                            <div
                              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                              style={{ animationDelay: "0.15s" }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                              style={{ animationDelay: "0.3s" }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
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
                        placeholder="Describe your business..."
                        className="flex-1"
                        disabled={isThinking}
                      />
                      <Button
                        type="submit"
                        variant="gradient"
                        size="icon"
                        disabled={!inputValue.trim() || isThinking}
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
              <p className="mt-2 text-muted-foreground">
                The AI is designing your page, setting up payments, and
                generating QR codes.
              </p>
              <div className="mt-8 space-y-3 w-full max-w-sm">
                {[
                  "Analyzing business type...",
                  "Designing layout & theme...",
                  "Setting up Solana Pay...",
                  "Generating QR codes...",
                ].map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-solana-purple" />
                    <span className="text-muted-foreground">{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-4xl"
            >
              <div className="text-center mb-8">
                <Badge variant="success" className="mb-4">
                  ✨ Storefront Generated
                </Badge>
                <h2 className="text-3xl font-bold mb-2">
                  Your storefront is ready!
                </h2>
                <p className="text-muted-foreground">
                  Here&apos;s a preview. You can customize it further or deploy
                  it right away.
                </p>
              </div>

              {/* Preview card */}
              <Card className="overflow-hidden glow-purple">
                <div className="p-8 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-solana-gradient mb-4">
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {businessInfo.name || "Your Business"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    {businessInfo.description ||
                      "A premium storefront powered by Solana Pay."}
                  </p>

                  {/* Example product cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                    {[
                      {
                        name: "Basic Package",
                        price: "0.5 SOL",
                        desc: "Essential service",
                      },
                      {
                        name: "Premium Package",
                        price: "2.0 SOL",
                        desc: "Full service",
                      },
                    ].map((product, i) => (
                      <Card
                        key={i}
                        className="hover:border-solana-purple/30 transition-colors"
                      >
                        <CardContent className="p-4 text-center">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {product.desc}
                          </p>
                          <p className="text-lg font-bold gradient-text">
                            {product.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button variant="gradient" size="lg" className="gap-2">
                      <Zap className="h-4 w-4" />
                      Deploy Storefront
                    </Button>
                    <Button variant="outline" size="lg">
                      Customize
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// Helper to extract a business name from description
function extractBusinessName(description: string): string {
  // Simple extraction — first few words capitalized
  const words = description.split(" ").slice(0, 3);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
