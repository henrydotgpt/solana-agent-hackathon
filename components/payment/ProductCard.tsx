"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProduct } from "@/lib/types";
import { QrCode, Package } from "lucide-react";

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
    <Card className="group hover:border-border/80 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Product image or accent gradient */}
      {product.image ? (
        <div className="relative h-40 overflow-hidden bg-muted/30">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        </div>
      ) : (
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)`,
          }}
        />
      )}

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Product name + badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold leading-tight">{product.name}</h3>
          <Badge
            variant="outline"
            className="text-[10px] flex-shrink-0 font-mono"
            style={{
              borderColor: `${accentColor}30`,
              color: accentColor,
            }}
          >
            {product.currency}
          </Badge>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight">
              {product.price}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {product.currency}
            </span>
          </div>
          {usdValue && (
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              ≈ ${usdValue} USD
            </p>
          )}
        </div>

        {/* Pay button */}
        <Button
          onClick={() => onSelect(product)}
          className="w-full gap-2 font-medium transition-all hover:shadow-lg"
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
