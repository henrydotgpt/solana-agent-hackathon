"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProduct } from "@/lib/types";
import { QrCode } from "lucide-react";

interface ProductCardProps {
  product: StorefrontProduct;
  accentColor: string;
  solPrice: number | null;
  onSelect: (product: StorefrontProduct) => void;
}

export function ProductCard({
  product,
  accentColor,
  solPrice,
  onSelect,
}: ProductCardProps) {
  const usdValue =
    product.currency === "SOL" && solPrice
      ? (product.price * solPrice).toFixed(2)
      : product.currency === "USDC"
      ? product.price.toFixed(2)
      : null;

  return (
    <Card className="group hover:border-border hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}66)`,
        }}
      />

      <CardContent className="p-6 flex flex-col flex-1">
        {/* Product name */}
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {product.price}
            </span>
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              {product.currency}
            </Badge>
          </div>
          {usdValue && (
            <p className="text-xs text-muted-foreground mt-1">
              ≈ ${usdValue} USD
            </p>
          )}
        </div>

        {/* Pay button */}
        <Button
          onClick={() => onSelect(product)}
          className="w-full gap-2 group-hover:shadow-md transition-all"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          }}
        >
          <QrCode className="h-4 w-4" />
          Pay Now
        </Button>
      </CardContent>
    </Card>
  );
}
